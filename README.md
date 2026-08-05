# FlashMind - AI-Powered Learning Platform

Transform any content into comprehensive learning experiences with our AI-powered platform. Stop wasting hours creating practice questions and start learning smarter.

## 🚀 What is FlashMind?

FlashMind is an intelligent learning platform that automatically converts your study materials into interactive quizzes, flashcards, and practice exams. Whether you're a student preparing for exams or a professional looking to master new skills, FlashMind helps you learn faster and more effectively.

## ✨ Key Features

### 📚 **Automatic Exam Generation**
Stop wasting hours creating practice questions. Our proprietary system instantly transforms any text, PDF, or YouTube video into quizzes, flashcards, and exams tailored to your material.

### 🔄 **Multiple Format Support**
Whether it's lecture notes, textbooks, or videos, our platform handles them all. No conversions, no manual input — just upload and learn.

### 🎯 **Multiple Question Types**
MCQs, fill-in-the-blank, true/false questions, and flashcards — all automatically generated to test your knowledge from every angle.

### 📊 **Detailed Feedback & Knowledge Insights**
After each exam, get a breakdown of your strengths and weaknesses, along with actionable recommendations to focus your study time effectively.

### 📈 **Progress Tracking & Analytics**
Track your learning journey over time. See your improvements, identify persistent gaps, and measure your mastery across topics.

## 🛠️ How It Works

1. **Upload Your Material** - Paste notes, upload PDFs, or drop a YouTube link
2. **Generate Your Exam** - Our AI creates MCQs, fill-in-the-blank, and true/false questions
3. **Take the Exam & Get Feedback** - Complete your exam and receive detailed insights
4. **Track Your Progress** - Monitor improvements and focus on challenging topics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/flashmind.git
cd flashmind
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

This project uses a **feature-based architecture** with strict separation between features and a shared UI/component library.

### Key Principles
- **Feature Isolation:** Each feature is self-contained and independent
- **Shared Components Are Pure:** No business logic in shared components
- **HOCs for Feature Logic:** Use Higher-Order Components to add feature-specific behavior

### Folder Structure
```
features/
  ├── courses/          # Course management feature
  ├── admin/            # Admin panel feature
  └── auth/             # Authentication feature
shared/
  ├── components/       # Reusable UI components
  ├── hooks/           # Shared custom hooks
  └── utils/           # Utility functions
```

### Retrieval (RAG)

Exam and flashcard generation is grounded in the user's own uploaded document.

- **Chunking:** `RecursiveCharacterTextSplitter`, size 1000, overlap 200.
- **Embeddings:** Gemini `text-embedding-004`, 768 dimensions.
- **Vector store:** Supabase `pgvector`, table `documents`, function `match_documents`.
- **Retrieval:** top `k = 10` chunks, filtered by `documentId`, cosine similarity.

Ingestion runs at course creation (`lib/rag/ingest.ts`). Retrieval runs before
generation (`lib/rag/retrieve.ts`) and passes only the retrieved chunks to Gemini.

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **Non-Commercial Open Source License**.

### What this means:
- ✅ **You can view and study the source code**
- ✅ **You can use the software for personal, educational, and non-commercial purposes**
- ✅ **You can contribute to the project**
- ✅ **You can create forks and modifications for personal use**

### What you cannot do:
- ❌ **Use this software for commercial purposes without explicit permission**
- ❌ **Sell or distribute commercial versions of this software**
- ❌ **Use this software in a commercial product or service**

For commercial licensing inquiries, please contact us at [contact@flashmind.com](mailto:contact@flashmind.com).

## 🆘 Support

- 📧 Email: [support@flashmind.com](mailto:support@flashmind.com)
- 📖 Documentation: [docs.flashmind.com](https://docs.flashmind.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/flashmind/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components powered by [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide React](https://lucide.dev)

---

**FlashMind** - Learn smarter, not harder. 🧠✨