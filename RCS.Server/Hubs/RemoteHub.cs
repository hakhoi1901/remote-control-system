using Microsoft.AspNetCore.SignalR;
using RCS.Common.Models;
using RCS.Common.Protocols;
using RCS.Server.Services;
using System;
using System.Threading.Tasks;

public class RemoteHub : Hub
{
    // Admin gửi tọa độ xuống -> Server chuyển cho Agent
    public async Task SendMouseAction(string agentConnectionId, double xRatio, double yRatio, string action)
    {
        await Clients.Client(agentConnectionId).SendAsync("ReceiveMouseCommand", xRatio, yRatio, action);
    }

    // Admin gửi phím bấm xuống -> Server chuyển cho Agent
    public async Task SendKeyAction(string agentConnectionId, int keyCode, bool isDown)
    {
        await Clients.Client(agentConnectionId).SendAsync("ReceiveKeyCommand", keyCode, isDown);
    }
}