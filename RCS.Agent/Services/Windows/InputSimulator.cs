using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;

public static class RemoteControlService
{
    // 1. Import thư viện hệ thống Windows (User32.dll)
    [DllImport("user32.dll")]
    static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

    [DllImport("user32.dll")]
    static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);

    // Các hằng số quy định hành động
    private const uint MOUSEEVENTF_MOVE = 0x0001;
    private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    private const uint MOUSEEVENTF_LEFTUP = 0x0004;
    private const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
    private const uint MOUSEEVENTF_RIGHTUP = 0x0010;
    private const uint MOUSEEVENTF_ABSOLUTE = 0x8000;
    
    private const uint KEYEVENTF_KEYUP = 0x0002;

    // --- XỬ LÝ CHUỘT ---
    public static void SimulateMouse(double xRatio, double yRatio, string action)
    {
        // Quy đổi tỉ lệ từ Web (0.0 - 1.0) sang tọa độ tuyệt đối của màn hình (0 - 65535)
        // Tại sao là 65535? Đây là chuẩn tọa độ Absolute của Windows API.
        uint absX = (uint)(xRatio * 65535);
        uint absY = (uint)(yRatio * 65535);

        switch (action)
        {
            case "move":
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE, absX, absY, 0, 0);
                break;
            case "left_click":
                // Di chuyển tới đó trước rồi mới click cho chắc ăn
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE, absX, absY, 0, 0);
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_LEFTDOWN, absX, absY, 0, 0);
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_LEFTUP, absX, absY, 0, 0);
                break;
            case "right_click":
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE, absX, absY, 0, 0);
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_RIGHTDOWN, absX, absY, 0, 0);
                mouse_event(MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_RIGHTUP, absX, absY, 0, 0);
                break;
        }
    }

    // --- XỬ LÝ BÀN PHÍM ---
    public static void SimulateKey(int keyCode, bool isKeyDown)
    {
        // keyCode nhận từ JS là mã ASCII, map khá tương đồng với Virtual Key của Windows
        byte vk = (byte)keyCode;
        if (isKeyDown)
        {
            keybd_event(vk, 0, 0, 0); // Nhấn xuống
        }
        else
        {
            keybd_event(vk, 0, KEYEVENTF_KEYUP, 0); // Nhả ra
        }
    }
}