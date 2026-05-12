# --- Giai đoạn 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy file project và restore thư viện trước (để tận dụng cache)
# SỬA TÊN THƯ MỤC NẾU CẦN: "Tên_Thư_Mục_Server/Tên_File.csproj"
COPY ["RCS.Server/RCS.Server.csproj", "RCS.Server/"]
RUN dotnet restore "RCS.Server/RCS.Server.csproj"

# Copy toàn bộ source code còn lại
COPY . .
WORKDIR "/src/RCS.Server"

# Build ra bản Release
RUN dotnet publish "RCS.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# --- Giai đoạn 2: Run (Dùng ảnh nhẹ hơn để chạy) ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Cấu hình Port cho Render (Render thường dùng port 8080 hoặc biến môi trường PORT)
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["dotnet", "RCS.Server.dll"]