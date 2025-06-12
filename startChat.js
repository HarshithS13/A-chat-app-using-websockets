// Simple script to start the chat app
import { exec } from 'child_process';

console.log("Starting Chat Application...");

// Define ports
const BACKEND_PORT = 4000;
const FRONTEND_PORT = 6000;

// Start backend server
console.log(`Starting backend server on port ${BACKEND_PORT}...`);
// Use PowerShell syntax for command chaining
const backend = exec(`cd backend; bun run dev`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backend Error: ${error}`);
    return;
  }
});

backend.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backend.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});

// Wait a moment for backend to start
setTimeout(() => {
  // Start frontend server
  console.log(`Starting frontend on port ${FRONTEND_PORT}...`);
  // Use PowerShell syntax for command chaining
  const frontend = exec(`cd frontend; bun run dev --port ${FRONTEND_PORT} --host`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Frontend Error: ${error}`);
      return;
    }
  });

  frontend.stdout.on('data', (data) => {
    console.log(`Frontend: ${data}`);
  });

  frontend.stderr.on('data', (data) => {
    console.error(`Frontend Error: ${data}`);
  });

  // Create public URL using localtunnel
  setTimeout(() => {
    console.log("Creating public URL...");
    const tunnel = exec(`npx localtunnel --port ${FRONTEND_PORT}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Tunnel Error: ${error}`);
        return;
      }
    });

    tunnel.stdout.on('data', (data) => {
      if (data.includes('your url is:')) {
        const url = data.trim().split('your url is: ')[1];
        console.log("\n========================================");
        console.log(`🎉 SHARE THIS URL WITH YOUR FRIENDS: ${url}`);
        console.log("========================================\n");
      } else {
        console.log(`Tunnel: ${data}`);
      }
    });

    tunnel.stderr.on('data', (data) => {
      console.error(`Tunnel Error: ${data}`);
    });
  }, 3000);
}, 2000); 