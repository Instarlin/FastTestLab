# 🚀 **FastTestLab**

A modern, full-stack web application for **rapid test creation, management, and execution**.

Built with:
- ⚛️ **React**
- 🛡 **TypeScript**
- 🎨 **TailwindCSS**
- 🗄 **Prisma**
- 🐳 **Docker**

---

## ✨ Features

- 📝 **Rich text editor** for test creation
- 🧩 **Modular component architecture**
- ⚡️ **Hot Module Replacement (HMR)** for fast development
- 🎨 **TailwindCSS** for rapid UI development
- 🗄 **Prisma ORM** for database management
- 🐳 **Docker** support for easy deployment

---

## 🗂️ Project Structure

```text
FastTestLab2025/
├── app/                # Frontend application (React, components, hooks, routes)
│   ├── components/     # UI and editor components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   ├── mock/           # Mock data for development/testing
│   ├── routes/         # Application routes
│   ├── schemas/        # Validation schemas
│   ├── store/          # State management
│   └── styles/         # Global and component styles
├── prisma/             # Prisma schema and migrations
│   ├── migrations/     # Database migrations
│   └── prisma/         # Prisma schema file
├── public/             # Static assets
├── .env                # Environment variables
├── Dockerfile          # Docker build instructions
├── docker-compose.yaml # Docker Compose setup
├── package.json        # Project metadata and scripts
├── README.md           # Project documentation
└── ...
```

---

## 🏁 Getting Started

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred database, if not using Docker)

### 2️⃣ Installation

```bash
git clone https://github.com/yourusername/FastTestLab2025.git
cd FastTestLab2025
npm install
```

- Copy `.env.example` to `.env` and fill in the required values.
- Set up the database:

```bash
npx prisma migrate dev
```

### 3️⃣ Development

Start the development server with hot reloading:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

### 4️⃣ Building for Production

```bash
npm run build
```

---

## 🐳 Running with Docker

**Build the Docker image:**
```bash
docker build -t fasttestlab2025 .
```

**Run the container:**
```bash
docker run -p 3000:3000 fasttestlab2025
```

Or use Docker Compose for multi-service setup:
```bash
docker-compose up --build
```

---

## 🗄️ Database Management

- **Prisma** is used for database schema and migrations.
- To apply migrations:
  ```bash
  npx prisma migrate deploy
  ```
- To open Prisma Studio:
  ```bash
  npx prisma studio
  ```

---

## 🎨 Styling

- **TailwindCSS** is pre-configured for rapid UI development.
- Customize styles in `app/styles/` and `tailwind.config.ts`.

---

## 📄 License

This project is licensed under the **MIT License**.

---

Built with ❤️ by the Chimin