import { spawn } from 'child_process';
import ngrok from 'ngrok';
import fs from 'fs';
import path from 'path';

// Configuration
const BACKEND_PORT = 3001;
const FRONTEND_PORT = 5175;
const HTML_FILE_PATH = './frontend/index.html';

// Start backend server with modified port
console.log('Starting backend server...');
const backendProcess = spawn('bun', ['run', '--hot', 'index.ts', '--port', BACKEND_PORT.toString()], { 
  cwd: './backend', 
  shell: true,
  stdio: 'inherit'
});

// Start frontend server with modified port
console.log('Starting frontend server...');
const frontendProcess = spawn('bun', ['run', 'vite', '--port', FRONTEND_PORT.toString(), '--host'], { 
  cwd: './frontend', 
  shell: true,
  stdio: 'inherit'
});

// Function to update HTML with backend URL
const updateHtmlWithBackendUrl = (backendUrl) => {
  try {
    const htmlPath = path.resolve(HTML_FILE_PATH);
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace the backend URL meta tag
    htmlContent = htmlContent.replace(
      /<meta name="backend-url" content=".*?">/,
      `<meta name="backend-url" content="${backendUrl}">`
    );
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('Updated frontend HTML with backend URL');
  } catch (error) {
    console.error('Error updating HTML file:', error);
  }
};

// Wait for servers to start
setTimeout(async () => {
  try {
    console.log('Starting ngrok tunnels...');
    
    // Create tunnel for backend
    const backendUrl = await ngrok.connect({
      addr: BACKEND_PORT,
      proto: 'http'
    });
    
    // Update HTML file with backend URL
    updateHtmlWithBackendUrl(backendUrl);
    
    // Create tunnel for frontend
    const frontendUrl = await ngrok.connect({
      addr: FRONTEND_PORT,
      proto: 'http'
    });

    console.log('\n--- CHAT APP URLS ---');
    console.log(`✅ SHARE THIS URL WITH YOUR FRIENDS: ${frontendUrl}`);
    console.log(`🔌 Backend API URL: ${backendUrl}`);
    console.log('These URLs will work from any network!');
    console.log('------------------------\n');
  } catch (error) {
    console.error('Error setting up ngrok tunnels:', error);
  }
}, 10000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backendProcess.kill();
  frontendProcess.kill();
  ngrok.kill();

  // Restore original HTML file
  updateHtmlWithBackendUrl('');
  
  process.exit();
}); 