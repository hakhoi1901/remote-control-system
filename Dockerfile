# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy NuGet config to bypass broken sources
COPY ["NuGet.Config", "./"]

# Copy project files and restore
COPY ["RCS.Server/RCS.Server.csproj", "RCS.Server/"]
COPY ["RCS.Common/RCS.Common.csproj", "RCS.Common/"]
RUN dotnet restore "RCS.Server/RCS.Server.csproj" --configfile NuGet.Config

# Copy everything else
COPY . .

# Integrate Web Client into Server's wwwroot
RUN mkdir -p RCS.Server/wwwroot
RUN cp -r RCS.Client/Public/* RCS.Server/wwwroot/

WORKDIR "/src/RCS.Server"
RUN dotnet publish "RCS.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# --- Stage 2: Run ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render defaults
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "RCS.Server.dll"]