# Real-Time Chat Application

A real-time chat application built with Socket.io, React, TypeScript, and Bun.

## Features

- Real-time messaging with Socket.io
- User presence (join/leave notifications)
- Typing indicators
- Online users list
- Responsive design with Tailwind CSS
- Works across different networks with ngrok

## Project Structure

The project is organized into two main directories:

- `backend`: Node.js server with Socket.io
- `frontend`: React client with Vite

## Prerequisites

- [Bun](https://bun.sh/) (Required for both frontend and backend)

## Getting Started

### Local Development

```bash
# Install dependencies in backend and frontend
cd backend && bun install
cd ../frontend && bun install
```

### Running for Local Testing

```bash
# Run backend
cd backend
bun run dev

# In another terminal, run frontend
cd frontend
bun run dev
```

### Sharing with Friends (Across Any Network)

To share the chat app with friends who are on different networks:

```bash
# From the project root
bun install
bun start
```

This will:
1. Start both the backend and frontend servers
2. Create ngrok tunnels to expose both servers to the internet
3. Display a public URL you can share with friends

Simply share the frontend URL with your friends, and they'll be able to join your chat room from anywhere!

## How to Use

1. Open the frontend application in your browser (local or shared URL)
2. Enter a username to join the chat
3. Start chatting with other online users
4. You will see typing indicators when others are typing
5. User join/leave notifications are displayed in the chat 