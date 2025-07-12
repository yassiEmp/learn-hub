# Learn Hub Next.js - Deployment Guide

This guide covers the deployment process for the Learn Hub Next.js application across different environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Database Deployment](#database-deployment)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Node.js 18+ 
- npm or yarn
- Git
- Supabase CLI (for database management)
- Docker (optional, for containerized deployment)

### Required Accounts
- Supabase account
- Vercel account (for hosting)
- Google Cloud account (for AI services)

## Environment Setup

### Environment Variables

Create `.env.local` for local development:

```env
# Database
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# External APIs
GOOGLE_API_KEY=your_google_api_key

# Environment
NODE_ENV=development
```

### Production Environment Variables

Set these in your deployment platform:

```env
# Database
DATABASE_URL=your_production_supabase_url
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Authentication
NEXTAUTH_SECRET=your_secure_production_secret
NEXTAUTH_URL=https://your-domain.com

# External APIs
GOOGLE_API_KEY=your_production_google_api_key

# Environment
NODE_ENV=production
```

## Local Development

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/learn-hub-next.git
   cd learn-hub-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Set up database**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your Supabase project
   supabase link --project-ref your-project-ref
   
   # Run database migrations
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Local Development Commands

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
```

## Staging Deployment

### Vercel Staging Deployment

1. **Create staging project in Vercel**
   - Connect your GitHub repository
   - Set branch to `staging`
   - Configure environment variables

2. **Set up staging environment**
   ```bash
   # Create staging branch
   git checkout -b staging
   
   # Push to staging
   git push origin staging
   ```

3. **Configure staging environment variables**
   - Use staging Supabase project
   - Use staging API keys
   - Set `NODE_ENV=staging`

### Staging Database Setup

```bash
# Create staging database
supabase projects create learn-hub-staging

# Link staging project
supabase link --project-ref staging-project-ref

# Run migrations
supabase db push
```

## Production Deployment

### Vercel Production Deployment

1. **Deploy to production**
   ```bash
   # Ensure you're on main branch
   git checkout main
   
   # Build and deploy
   vercel --prod
   ```

2. **Configure production settings**
   - Set up custom domain
   - Configure SSL certificates
   - Set up CDN

3. **Environment variables**
   - Use production Supabase project
   - Use production API keys
   - Set `NODE_ENV=production`

### Production Database Setup

```bash
# Create production database
supabase projects create learn-hub-production

# Link production project
supabase link --project-ref production-project-ref

# Run migrations
supabase db push

# Set up RLS policies
supabase db reset
```

## Database Deployment

### Migration Process

1. **Create migration**
   ```bash
   supabase migration new migration_name
   ```

2. **Write migration SQL**
   ```sql
   -- Example migration
   CREATE TABLE IF NOT EXISTS courses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT,
     owner_id UUID REFERENCES auth.users(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Apply migration**
   ```bash
   # Local development
   supabase db reset
   
   # Staging
   supabase db push --project-ref staging-ref
   
   # Production
   supabase db push --project-ref production-ref
   ```

### Database Backup

```bash
# Create backup
supabase db dump --project-ref your-project-ref

# Restore from backup
supabase db restore --project-ref your-project-ref backup.sql
```

## Monitoring & Logging

### Vercel Analytics

1. **Enable Vercel Analytics**
   - Go to project settings
   - Enable Web Analytics
   - Configure tracking

2. **Monitor performance**
   - Check Core Web Vitals
   - Monitor API response times
   - Track error rates

### Error Monitoring

1. **Set up error tracking**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```javascript
   // next.config.js
   const { withSentryConfig } = require('@sentry/nextjs');

   module.exports = withSentryConfig({
     // your existing config
   });
   ```

### Logging

1. **Application logs**
   - Use Vercel function logs
   - Implement structured logging
   - Log important events

2. **Database logs**
   - Monitor Supabase logs
   - Track slow queries
   - Monitor connection usage

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
rm -rf .next
npm run build

# Check TypeScript errors
npm run type-check
```

#### Database Connection Issues
```bash
# Check connection
supabase status

# Reset local database
supabase db reset
```

#### Environment Variable Issues
```bash
# Verify environment variables
echo $DATABASE_URL
echo $SUPABASE_URL

# Check Vercel environment variables
vercel env ls
```

### Performance Issues

1. **Check bundle size**
   ```bash
   npm run build
   # Review bundle analyzer output
   ```

2. **Optimize images**
   - Use Next.js Image component
   - Implement proper sizing
   - Use WebP format

3. **Database optimization**
   - Add proper indexes
   - Optimize queries
   - Monitor connection pool

### Security Issues

1. **Check for vulnerabilities**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Verify environment variables**
   - Ensure secrets are not exposed
   - Use proper key rotation
   - Monitor access logs

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Performance testing completed

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify functionality
- [ ] Monitor error rates

### Post-Deployment
- [ ] Monitor application health
- [ ] Check performance metrics
- [ ] Verify database connections
- [ ] Test critical user flows
- [ ] Update documentation

## Rollback Procedure

### Quick Rollback
```bash
# Revert to previous deployment
vercel rollback

# Or deploy specific commit
vercel --prod --force
```

### Database Rollback
```bash
# Revert last migration
supabase migration down

# Or restore from backup
supabase db restore backup.sql
```

---

**Last Updated**: December 2024  
**Maintained By**: Learn Hub Development Team 