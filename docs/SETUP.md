# Learn Hub Next.js - Setup Guide

This guide will help you set up the Learn Hub Next.js project on your local machine for development.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Development Workflow](#development-workflow)
6. [Common Issues](#common-issues)
7. [Next Steps](#next-steps)

## Prerequisites

### Required Software
- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Recommended Software
- **VS Code** (with recommended extensions)
- **Supabase CLI** (for database management)
- **Postman** or **Insomnia** (for API testing)

### Required Accounts
- **Supabase Account** - [supabase.com](https://supabase.com)
- **Google Cloud Account** - [cloud.google.com](https://cloud.google.com)
- **GitHub Account** - [github.com](https://github.com)

## Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/learn-hub-next.git

# Navigate to the project directory
cd learn-hub-next

# Check the current branch
git branch
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Install Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version
```

## Environment Configuration

### 1. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local

# Open the file in your editor
code .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your values:

```env
# Database Configuration
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# External APIs
GOOGLE_API_KEY=your_google_api_key

# Environment
NODE_ENV=development
```

### 3. Get Supabase Credentials

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Get API Keys**
   - Go to Project Settings > API
   - Copy the following:
     - Project URL
     - Anon public key
     - Service role key (keep this secret)

3. **Get Database URL**
   - Go to Project Settings > Database
   - Copy the connection string

### 4. Get Google API Key

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing

2. **Enable Gemini API**
   - Go to APIs & Services > Library
   - Search for "Gemini API"
   - Enable the API

3. **Create API Key**
   - Go to APIs & Services > Credentials
   - Create API Key
   - Copy the key

### 5. Generate NextAuth Secret

```bash
# Generate a secure secret
openssl rand -base64 32

# Or use an online generator
# https://generate-secret.vercel.app/32
```

## Database Setup

### 1. Link to Supabase Project

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Verify connection
supabase status
```

### 2. Set Up Database Schema

```bash
# Run database migrations
supabase db push

# Verify tables are created
supabase db diff
```

### 3. Set Up Row Level Security (RLS)

```bash
# Enable RLS on tables
supabase db reset

# Verify RLS policies
supabase db diff
```

### 4. Create Test Data (Optional)

```bash
# Insert test data
supabase db seed

# Or manually insert data through Supabase dashboard
```

## Development Workflow

### 1. Start Development Server

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### 2. Verify Setup

1. **Check Homepage**
   - Visit http://localhost:3000
   - Should see the Learn Hub homepage

2. **Test Authentication**
   - Go to http://localhost:3000/login
   - Try logging in with test credentials

3. **Test Course Creation**
   - Go to http://localhost:3000/test-auth
   - Try creating a course

### 3. Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### 4. Database Commands

```bash
# View database status
supabase status

# Reset local database
supabase db reset

# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# View database in browser
supabase db diff
```

## Common Issues

### Node.js Version Issues

```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Use nvm to manage Node.js versions
nvm install 18
nvm use 18
```

### Dependency Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

```bash
# Check Supabase connection
supabase status

# Reset local database
supabase db reset

# Check environment variables
echo $DATABASE_URL
echo $SUPABASE_URL
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Check TypeScript errors
npm run type-check
```

### Environment Variable Issues

```bash
# Verify .env.local exists
ls -la .env.local

# Check if variables are loaded
npm run dev
# Look for environment variable errors in console
```

## Next Steps

### 1. Explore the Codebase

- **Read the Documentation**
  - Start with [docs/README.md](./README.md)
  - Review [SYSTEM_OVERVIEW.md](./architecture/SYSTEM_OVERVIEW.md)
  - Check [CODING_STANDARDS.md](./guidelines/CODING_STANDARDS.md)

- **Understand the Structure**
  - Explore `app/` directory (Next.js App Router)
  - Check `components/` for reusable components
  - Review `types/` for TypeScript definitions

### 2. Set Up Your Development Environment

- **VS Code Extensions**
  - Install recommended extensions
  - Configure Prettier and ESLint
  - Set up TypeScript support

- **Git Configuration**
  ```bash
  # Set up your Git identity
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
  
  # Create a feature branch
  git checkout -b feature/your-feature-name
  ```

### 3. Start Contributing

- **Pick a Task**
  - Check the [MVP_Feature_Checklist.md](./planning/MVP_Feature_Checklist.md)
  - Look for issues labeled "good first issue"
  - Ask the team for guidance

- **Follow the Workflow**
  - Create feature branches
  - Write tests for new features
  - Follow coding standards
  - Submit pull requests

### 4. Testing Your Setup

1. **Create a Test Course**
   - Go to http://localhost:3000/test-auth
   - Create a course with some content
   - Verify AI title generation works

2. **Test Authentication**
   - Try logging in/out
   - Test protected routes
   - Verify user data persistence

3. **Test API Endpoints**
   - Use Postman or Insomnia
   - Test course creation API
   - Verify authorization works

## Getting Help

### Internal Resources
- **Documentation**: Check the `docs/` directory
- **Code Comments**: Read inline documentation
- **Team Chat**: Ask questions in your team's communication channel

### External Resources
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **TypeScript Documentation**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)

### When to Ask for Help
- You've been stuck for more than 30 minutes
- You're getting unexpected errors
- You need clarification on requirements
- You want to discuss architecture decisions

---

**Last Updated**: December 2024  
**Maintained By**: Learn Hub Development Team 