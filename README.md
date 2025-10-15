<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/priyanshubh/HandiDraw">
    <img src="apps/client/public/ai-logo.svg" alt="HandiDraw Logo" width="80" height="80">
  </a>

  <h3 align="center">HandiDraw</h3>

  <p align="center">
    <strong>A Professional Real-Time Collaborative Whiteboard with AI-Powered Intelligence</strong>
    <br />
    <a href="https://handidraw.vercel.app"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/priyanshubh/HandiDraw">View Code</a>
    ·
    <a href="https://github.com/priyanshubh/HandiDraw/issues">Report Bug</a>
    ·
    <a href="https://github.com/priyanshubh/HandiDraw/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSocket" />
</div>

<br />

<details>
<summary>Table of Contents</summary>
<ol>
<li><a href="#-about-the-project">About The Project</a></li>
<li><a href="#-key-features">Key Features</a></li>
<li><a href="#-tech-stack">Tech Stack</a></li>
<li><a href="#-folder-structure">Folder Structure</a></li>
<li><a href="#-getting-started">Getting Started</a></li>
<li><a href="#-contributing">Contributing</a></li>
</ol>
</details>

---

## 🤖 About The Project

**HandiDraw** is a premium, real-time collaborative drawing platform designed for teams and creators who need a high-performance digital workspace. By combining **WebSocket-driven synchronization**, an **Infinite Canvas Engine**, and **AI-Assisted Generation**, HandiDraw redefines how ideas are visualized and shared.

Built with a **Turborepo Monorepo** architecture, it ensures seamless integration between its hardware-accelerated frontend and robust distributed backend services.

---

## 🔥 Key Features

* **⚡ Real-Time Collaboration**
High-performance WebSocket synchronization allows multiple users to draw, move, and edit shapes concurrently with near-zero latency.
* **🌌 Infinite Canvas Engine**
A fully responsive, hardware-accelerated canvas supporting smooth panning, zooming, and a modular "Hand Tool" for effortless navigation.
* **🧠 AI-Powered Drawing**
Integrated with **Groq SDK**, users can generate complex diagrams, flowcharts, and objects directly from natural language prompts.
* **🎯 Precision Multi-Selection**
Advanced interaction logic allowing users to hold **Shift** to select and manipulate multiple shapes simultaneously.
* **💎 Versatile Toolset**
Includes specialized rendering for Rectangles (with rounded corners), Diamonds, Circles, Arrows, and a custom-font Text engine.
* **🔒 Secure Authentication Suite**
Complete security flow including Email/Password auth, Google OAuth integration, and a robust Password Reset system.

---

## ⚙️ Tech Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Framework** | **Next.js 15** | Modern App Router architecture optimized for speed and SEO. |
| **Backend** | **Node.js / Express** | Scalable distributed services for REST APIs and Real-time sync. |
| **Database** | **Prisma & PostgreSQL** | Type-safe ORM with Neon serverless database integration. |
| **Real-Time** | **WebSockets (ws)** | Raw WebSocket implementation for high-frequency data broadcast. |
| **Styling** | **Tailwind CSS** | Utility-first styling for a consistent, professional "Zinc & Violet" aesthetic. |
| **Animations** | **Framer Motion** | GPU-accelerated UI interactions and modal transitions. |

---

## 📂 Folder Structure

```text
HandiDraw/
├── apps/
│   ├── client/           # Next.js Frontend Application
│   ├── http-server/      # REST API Service (Auth, Rooms, Shapes)
│   └── ws-server/        # WebSocket Synchronization Service
├── packages/
│   ├── db/               # Shared Prisma Schema & Client
│   ├── common/           # Shared Zod Schemas & Constants
│   ├── backend-common/   # Shared Backend Utilities & Config
│   └── typescript-config/# Centralized TS configurations
├── ROADMAP.md            # Future features and improvements
└── .env                  # Project-wide environment variables
```

---

## 🧰 Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **pnpm** (v9 recommended)
* **PostgreSQL** database (e.g., Neon.tech)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/priyanshubh/HandiDraw.git
cd HandiDraw
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Setup**
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secret"
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
GROQ_API_KEY="your_groq_key"
```

4. **Initialize Database**
```bash
pnpm --filter @repo/db run db:generate
pnpm --filter @repo/db run db:migrate
```

5. **Run Development Server**
```bash
pnpm run dev
```

---

## 🔧 Contributing

Contributions are welcome! If you have ideas for professional features or performance improvements:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Open a Pull Request

---

## 🚀 Follow Me

<div align="center">
  <a href="https://github.com/priyanshubh">
    <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/priyanshu-bharti">
    <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://priyanshubharti.vercel.app">
    <img src="https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
</div>

<br />
<p align="center">Built with ❤️ by <a href="https://github.com/priyanshubh">Priyanshu Bharti</a></p>
