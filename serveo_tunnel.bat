@echo off
echo Starting tunnel to serveo.net...
echo Your chat app will be available at a public URL
echo Press Ctrl+C to stop the tunnel when you're done

ssh -R 80:localhost:8080 serveo.net

echo Tunnel closed
pause 