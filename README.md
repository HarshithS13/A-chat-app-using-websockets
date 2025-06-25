# WebSockets Chat Application

A real-time chat application with a React frontend and a Bun-powered TypeScript backend using MongoDB for persistent storage. Communication between clients and server is handled via WebSockets.

---

## Features

- Real-time chat with WebSockets (Socket.io)
- User login and user list
- Message persistence with MongoDB
- Modern React frontend (with context, hooks, and Tailwind CSS)
- Bun as the backend runtime (instead of Node.js)
- Hot reload for development

---

## Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Bun, TypeScript, Socket.io
- **Database:** MongoDB
- **Other:** Bun for scripts and server, no Node.js or npm

---

## Prerequisites

- [Bun](https://bun.sh/) installed globally
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on `localhost:27017`
- (Optional) [Git](https://git-scm.com/) for version control

---

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd WEBSOCKETS
```

### 2. Start MongoDB

Make sure MongoDB is running locally. By default, the backend connects to `mongodb://localhost:27017/chat_app`.

### 3. Install dependencies

#### Backend

```sh
cd backend
bun install
```

#### Frontend

```sh
cd ../frontend
bun install
```

### 4. Run the backend server

From the `backend` directory:

```sh
bun index.ts
```

- The server will start on `http://localhost:3000` by default.
- You should see `MongoDB connected successfully` in the terminal.

### 5. Run the frontend

From the `frontend` directory:

```sh
bun dev
```

- The frontend will be available at `http://localhost:5173` (or the port specified by Bun/Vite).

---

## Project Structure

```
WEBSOCKETS/
  backend/
    backend/
      db/
        models/
        services/
    db/
      connection.ts
      models/
      services/
    index.ts
    package.json
    ...
  frontend/
    src/
      components/
      context/
      App.tsx
      ...
    public/
    index.html
    package.json
    ...
```

---

## Customization

- **MongoDB URL:** Change the connection string in `backend/db/connection.ts` if needed.
- **Port:** Change the backend port by passing `--port <number>` when running `bun index.ts`.

---

## Development Notes

- **Bun is used for all scripts and server running.** Do not use Node.js, npm, or pnpm.
- **Hot reload:** Use `bun --hot index.ts` for backend hot reload.
- **Frontend uses Vite for development, but run with Bun (`bun dev`).**

---

## License

© 2024 Chat App. All rights reserved.

---

## Credits

- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://react.dev/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/) 