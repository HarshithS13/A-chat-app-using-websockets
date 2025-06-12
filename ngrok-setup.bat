@echo off
echo Setting up ngrok for public access to your chat app...

:: Download ngrok if it doesn't exist
if not exist ngrok.exe (
    echo Downloading ngrok...
    powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip -OutFile ngrok.zip"
    powershell -ExecutionPolicy Bypass -Command "Expand-Archive -Path ngrok.zip -DestinationPath ."
    del ngrok.zip
)

:: Run ngrok without auth - this provides temporary access
echo Starting ngrok tunnel on port 8080...
start ngrok http 8080 --log=stdout

:: Let user know what's happening
echo.
echo The ngrok interface will open in a new window.
echo.
echo INSTRUCTIONS:
echo 1. Look for a URL like "https://xxxx-xx-xx-xxx-xx.ngrok-free.app"
echo 2. Copy this URL and share it with your friends
echo 3. This URL will work on mobile phones
echo 4. No password will be required
echo.
echo Keep this window open while you want the tunnel to stay active.
echo Press any key to exit when you're done...

pause 