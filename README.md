# 🚀 **FastTestLab**

A modern, full-stack web application for **rapid test creation, management, and execution** with advanced rich text editing capabilities.

## 🛠 **Tech Stack**

- ⚛️ **React 19** with **React Router 7**
- </> **TypeScript** for type safety
- 🎨 **TailwindCSS 4** + **Radix UI** components
- 📝 **TipTap** - advanced rich text editor
- ⚙️ **Prisma ORM** + **PostgreSQL** database
- 🔐 **Remix Auth** for authentication
- 🐳 **Docker** + **Docker Compose** for deployment
- 📊 **MinIO** for file storage
- 🧪 **Vitest** for testing
- 🎭 **Motion** for animations

---

## ✨ Features

### 🎯 **Test Creation System**
- 📝 **Rich text editor** for test creation
- 🎨 **Interactive elements** with drag & drop
- 🔧 **Slash commands** for quick element insertion

### 🔐 **Authentication & Security**
- 👤 **User registration and login**
- 🎫 **Session management**
- 🔄 **Protected routes**

### 🛠 **Developer Tools**
- 🧪 **Comprehensive testing** with Vitest
- 📦 **Docker containerization**
- ⚙️ **Prisma Studio** for database management

---

## 🗂️ **Project Structure**

```
FastTestLab/
├── app/                         # Main application
│   ├── components/              # UI components
│   │   ├── editor/              # Editor
│   │   │   ├── extensions/      # Editor extensions
│   │   │   ├── hooks/           # Editor hooks
│   │   │   └── ui/              # Editor UI components
│   │   ├── ui/                  # Base UI components
│   │   └── widgets/             # Complex widgets
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and API
│   ├── modules/                 # Server modules
│   │   ├── auth.server.ts       # Authentication
│   │   ├── db.server.ts         # Database
│   │   ├── minio.server.ts      # File storage
│   │   └── session.server.ts    # Session management
│   ├── routes/                  # Application routes
│   │   ├── auth.tsx             # Authentication
│   │   ├── chat.tsx             # Chat interface
│   │   ├── home.tsx             # Home page
│   │   └── tests.tsx            # Test editor
│   ├── schemas/                 # Validation schemas
│   ├── store/                   # State management (Zustand)
│   └── styles/                  # Global styles
├── prisma/                      # Database schema
├── public/                      # Static assets
├── docker-compose-*.yaml        # Docker configurations
└── ...
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- [Docker](https://www.docker.com/) (optional, if db is local)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred database, if not using Docker)

### **Installation**

```bash
git clone https://github.com/yourusername/FastTestLab.git
cd FastTestLab
npm i
```

### **Environment Setup**

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://prisma:prisma@localhost:5432/appdb"

# Authentication
SESSION_SECRET="your-session-secret"

# MinIO (File Storage)
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin"
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_BUCKET_NAME="fasttestlab"

# Application
BASE_URL="http://localhost:3000"
PORT="3000"
```

### **Database Setup**

```bash
# Generate Prisma client
npx prisma generate
# Apply migrations
npx prisma migrate dev
```

### **Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🐳 **Docker Deployment**

### **Development Environment**

```bash
# Start all services (app + DB + MinIO)
npm run docker:dev

# Or manually
docker compose -f docker-compose-dev.yaml up -d --build
```

### **Production Environment**

```bash
# Build and run production version
npm run docker:prod

# Or manually
docker compose -f docker-compose-prod.yaml up -d --build
```

### **Available Services**
- **Application**: http://localhost:3000
- **MinIO Console**: http://localhost:9001 (admin/minioadmin)
---

## 🎯 **Usage Guide**

### **Creating Tests**
1. **Login** via `/auth`
2. **Navigate to editor** at `/tests`
3. **Use slash commands** to add elements:
   - `/single` - single choice question
   - `/multiple` - multiple choice question
   - `/h1`, `/h2`, `/h3` - headings
   - `/table` - tables
   - `/code` - code blocks
   - `/quote` - blockquotes
   - `/list` - bullet lists
---

## 🗄 **Database Management**

### **Prisma Commands**
```bash
# Apply migrations
npx prisma migrate dev

# View data
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

### **Database Schema**
- **User** - system users
- **Card** - content cards
- **Session** - user sessions (auto-managed)

---

## 🧪 **Testing**

```bash
# Run tests
npm test

# Development testing
npm run test:dev

# Code coverage
npm run test:coverage

# Test UI
npm run test:ui
```

---

## 🛠 **Development**

### **Available Scripts**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run typecheck    # TypeScript check
npm run test         # Run tests
```

### **Editor Extensions Structure**
- **Bubble Menu** - context formatting menu
- **Slash Commands** - quick access commands
- **Test Extensions** - test creation elements
- **Custom Nodes** - custom editor nodes

---

## 🔧 **Configuration**

### **TipTap Editor**
Extensions in `app/components/editor/extensions/`:
- Basic elements (headings, lists, tables)
- Test elements (single/multiple choice)
- Formatting (bold, italic, links)
- Media content (images, videos)

---

## 📄 **License**

This project is licensed under the **MIT License**.

---

Built with ❤️ by the Chimin