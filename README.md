# 🌌 UNIVAE — The Cosmic AI Platform

![UNIVAE Banner](https://image.pollinations.ai/prompt/a%20futuristic%20cosmic%20ai%20platform%20banner%20with%20violet%20and%20magenta%20neon%20lights%20and%20galactic%20particles?width=1280&height=400&nologo=true)

UNIVAE (formerly Garud AI) is a production-ready, ultra-premium AI chatbot platform built for speed, privacy, and aesthetic excellence. It features an offline-first architecture using a local SQLite database, robust credentials-based authentication, and state-of-the-art AI generation tools.

## 🚀 Key Features

- **🛡️ Local-First Architecture**: 100% self-contained data storage using SQLite and Prisma ORM. Your conversations never leave your machine.
- **🔐 Secure Authentication**: Built-in Credentials provider via NextAuth.js with salted password hashing using `bcryptjs`.
- **💬 Intelligent Chat**: Multi-modal streaming chat interface powered by the Vercel AI SDK and Google Gemini.
- **🖼️ AI Image Generator**: Dynamic on-demand image generation using Pollinations AI (no API key required).
- **🎥 AI Video Generator**: Cinematic simulated video generation with Ken Burns effects and stock fallback.
- **🎨 Cosmic UI**: A stunning, high-performance interface with glassmorphism, fluid animations (Framer Motion), and a curated "Midnight Galactic" color palette.
- **📱 Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile experiences.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Database**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) & [Google Generative AI](https://ai.google.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aadarsh-x54/univae.git
   cd univae
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── prisma/               # Database schema and migrations
├── src/
│   ├── app/              # Next.js App Router (Pages & API)
│   ├── components/       # UI Components (Chat, Auth, Settings)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Core logic, store, and Prisma client
│   └── types/            # TypeScript definitions
├── public/               # Static assets
└── next.config.ts        # Next.js configuration
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Acknowledgments

- Built with ❤️ by the UNIVAE Team.
- Inspired by the beauty of the cosmos.
