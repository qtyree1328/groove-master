# Crabwalk Setup Notes

## Status: ✅ Running (pm2 managed)

Crabwalk is installed and running at:
- **Local:** http://localhost:3000/
- **Network:** http://192.168.1.165:3000/

Managed by pm2 - will restart automatically if it crashes.

## Configuration

Environment file: `.env.local`
```
CLAWDBOT_API_TOKEN=<gateway-token>
CLAWDBOT_URL=ws://localhost:18789
```

## Managing Crabwalk

```bash
pm2 status              # Check if running
pm2 logs crabwalk       # View logs
pm2 restart crabwalk    # Restart
pm2 stop crabwalk       # Stop
pm2 start crabwalk      # Start (after stop)
```

To reinstall after reboot:
```bash
pm2 resurrect           # Restore saved processes
```

## Access from Other Devices

### Same Network (LAN)
Any device on the local network (192.168.1.x) can access:
**http://192.168.1.165:3000/monitor**

### Remote Access Options
1. **Tailscale Funnel** - Secure, requires Tailscale running on this machine and target device
2. **Cloudflare Tunnel** - Free, secure, no port forwarding needed
3. **ngrok** - Quick temporary URLs for testing

## Notes

- Crabwalk connects to Clawdbot gateway via WebSocket
- Shows real-time activity graph, tool calls, thinking states
- Works across all messaging platforms (Telegram, WhatsApp, Discord, Slack)
- Monitor page: `/monitor`
