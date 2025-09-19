

# AI Research Agent 🧠

A full-stack **AI-powered research assistant** built with **Next.js 15**, **tRPC**, **Prisma**, **Postgres**, **Redis**, and **BullMQ**.  
This project automates research tasks, queues jobs for background workers, and persists results in a database for structured retrieval.

---

## ✨ Features

- 🔍 **AI Research** – Generate and analyze insights using AI models.
- ⚡ **tRPC API** – End-to-end type safety between client & server.
- 📊 **Postgres + Prisma** – Database ORM with migrations.
- 📨 **BullMQ + Redis** – Job queue for background workers.
- 🖥️ **Next.js 15 (App Router)** – Modern fullstack React framework.
- 🎨 **Tailwind CSS** – Utility-first styling.

---

## 📂 Project Structure

```

├── app/                 # Next.js app router pages & API routes
│   ├── api/trpc         # tRPC route handler
│   └── research/\[id]    # Research detail page
├── components/          # UI components
├── prisma/              # Prisma schema & migrations
├── server/              # Backend logic (AI, routers, workers)
│   ├── ai.ts
│   ├── routers/research.ts
│   └── workers/research.worker.ts
├── utils/               # tRPC client & helpers
├── docker-compose.yml   # Multi-container setup
├── Dockerfile           # Next.js container build
└── .env.example         # Example env vars

````

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS  
- **Backend**: tRPC, Prisma, BullMQ  
- **Database**: PostgreSQL 15  
- **Cache / Queue**: Redis 7  
- **AI**: Google Gemini API & OpenAI SDK  

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Nikuunj/ai-research-agent.git
cd ai-research-agent
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment

Copy `.env.example` → `.env` and set values:

```bash
cp .env.example .env
```

Example:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/mydb?schema=public"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"

# AI Key
GEMINI_API_KEY="your_api_key"

# Environment
NODE_ENV="production"

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_password_here
```

### 4️⃣ Run with Docker

```bash
docker-compose up --build
```

This will start:

* **Postgres** → `localhost:5432`
* **Redis** → `localhost:6379`
* **Next.js App** → `http://localhost:3000`

The **Next.js service** will automatically:

1. Generate Prisma client
2. Apply migrations (`prisma migrate deploy`)
3. Start the app

---

## 🛠️ Development

Run locally without Docker:

```bash
npm run dev
```

After editing `prisma/schema.prisma`, regenerate client:

```bash
npx prisma generate
```

Run migrations in local dev:

```bash
npx prisma migrate dev
```

---

## 📜 Scripts

* `npm run dev` – Start Next.js in development mode
* `npm run build` – Build production bundle
* `npm start` – Run production server
* `npm run lint` – Run ESLint

---

## 🧩 How It Works

1. User submits a research topic
2. Request sent via **tRPC API**
3. Job queued with **BullMQ** (Redis)
4. **Worker** processes the job, fetches data, calls AI APIs
5. Results stored in **Postgres (via Prisma)**
6. UI auto-updates with live status
