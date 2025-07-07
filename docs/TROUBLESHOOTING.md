# Learn Hub Next.js - Troubleshooting Guide

This guide helps you resolve common issues encountered while working with the Learn Hub Next.js project.

## Table of Contents
1. [Development Issues](#development-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [API Issues](#api-issues)
5. [Build & Deployment Issues](#build--deployment-issues)
6. [Performance Issues](#performance-issues)
7. [Environment Issues](#environment-issues)
8. [Getting Help](#getting-help)

## Development Issues

### Node.js Version Problems

**Problem**: "Node.js version not supported" or build failures

**Solutions**:
```bash
# Check current Node.js version
node --version

# If version is < 18, update Node.js
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
# https://nodejs.org/en/download/
```

### Dependency Issues

**Problem**: `npm install` fails or packages not found

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, try with yarn
npm install -g yarn
yarn install
```

### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solutions**:
```bash
# Check TypeScript errors
npm run type-check

# Fix auto-fixable issues
npm run lint -- --fix

# Check specific file
npx tsc --noEmit --skipLibCheck
```

### Next.js Cache Issues

**Problem**: Changes not reflecting or build errors

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev

# If using production build
npm run build
npm start
```

## Database Issues

### Supabase Connection Problems

**Problem**: "Cannot connect to Supabase" or database errors

**Solutions**:
```bash
# Check Supabase status
supabase status

# Verify project link
supabase projects list

# Re-link project
supabase link --project-ref your-project-ref

# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Database Migration Issues

**Problem**: Migration failures or schema conflicts

**Solutions**:
```bash
# Reset local database
supabase db reset

# Check migration status
supabase migration list

# Apply specific migration
supabase db push

# View database diff
supabase db diff
```

### RLS Policy Issues

**Problem**: "Row Level Security policy violation" errors

**Solutions**:
```bash
# Check RLS policies
supabase db diff

# Reset RLS policies
supabase db reset

# Verify user authentication
# Check if user is properly authenticated
```

### Table Not Found Errors

**Problem**: "Table does not exist" errors

**Solutions**:
```bash
# Check if tables exist
supabase db diff

# Create missing tables
supabase db push

# Verify schema
supabase db dump --schema-only
```

## Authentication Issues

### NextAuth Configuration Problems

**Problem**: Authentication not working or redirect loops

**Solutions**:
```bash
# Check environment variables
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL

# Verify Supabase auth configuration
# Check Supabase dashboard > Authentication > Settings

# Clear browser cookies and local storage
# Try incognito/private browsing
```

### JWT Token Issues

**Problem**: "Invalid JWT token" or authorization failures

**Solutions**:
```bash
# Check token expiration
# Verify NEXTAUTH_SECRET is set correctly

# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Check Supabase JWT settings
# Verify JWT secret in Supabase dashboard
```

### User Session Problems

**Problem**: User sessions not persisting or unexpected logouts

**Solutions**:
```bash
# Check session configuration
# Verify NEXTAUTH_URL matches your domain

# Check browser storage
# Clear localStorage and sessionStorage

# Verify Supabase auth settings
# Check session timeout settings
```

## API Issues

### API Route Errors

**Problem**: 404, 500, or other API errors

**Solutions**:
```bash
# Check API route structure
# Verify file exists in app/api/ directory

# Check environment variables
echo $DATABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test API endpoint
curl -X GET http://localhost:3000/api/v1/course

# Check server logs
npm run dev
# Look for error messages in console
```

### CORS Issues

**Problem**: "CORS policy violation" errors

**Solutions**:
```bash
# Check Next.js CORS configuration
# Verify allowed origins in next.config.js

# Test with Postman/Insomnia
# Check if issue is browser-specific

# Add CORS headers if needed
# Configure in API route or middleware
```

### Rate Limiting Issues

**Problem**: "Too many requests" errors

**Solutions**:
```bash
# Check API usage limits
# Verify Google API quotas

# Implement rate limiting
# Add delays between requests

# Check Supabase rate limits
# Monitor usage in Supabase dashboard
```

## Build & Deployment Issues

### Build Failures

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear build cache
rm -rf .next

# Check environment variables
# Ensure all required vars are set

# Try building with verbose output
npm run build --verbose
```

### Vercel Deployment Issues

**Problem**: Deployment fails on Vercel

**Solutions**:
```bash
# Check build logs in Vercel dashboard
# Look for specific error messages

# Verify environment variables in Vercel
# Set all required environment variables

# Check Node.js version in Vercel
# Ensure it matches local version

# Test build locally first
npm run build
```

### Environment Variable Issues

**Problem**: Environment variables not available in production

**Solutions**:
```bash
# Check Vercel environment variables
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME

# Redeploy after adding variables
vercel --prod
```

## Performance Issues

### Slow Page Loads

**Problem**: Pages take too long to load

**Solutions**:
```bash
# Check bundle size
npm run build
# Review bundle analyzer output

# Optimize images
# Use Next.js Image component
# Implement proper sizing

# Check database queries
# Add indexes where needed
# Optimize query performance
```

### Memory Leaks

**Problem**: Application memory usage increases over time

**Solutions**:
```bash
# Check for memory leaks
# Monitor memory usage in development

# Review useEffect cleanup
# Ensure proper cleanup in components

# Check for infinite loops
# Verify dependency arrays in useEffect
```

### Database Performance

**Problem**: Slow database queries

**Solutions**:
```bash
# Check query performance
# Use EXPLAIN ANALYZE in Supabase

# Add database indexes
# Optimize table structure

# Monitor connection pool
# Check for connection leaks
```

## Environment Issues

### Environment Variable Problems

**Problem**: Environment variables not loading

**Solutions**:
```bash
# Check .env.local file exists
ls -la .env.local

# Verify variable names
# Check for typos in variable names

# Restart development server
npm run dev

# Check variable loading
console.log(process.env.VARIABLE_NAME)
```

### Port Conflicts

**Problem**: "Port 3000 is already in use"

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### File Permission Issues

**Problem**: "Permission denied" errors

**Solutions**:
```bash
# Check file permissions
ls -la

# Fix permissions
chmod 644 filename
chmod 755 directory

# On Windows, run as administrator
# Or check file ownership
```

## Getting Help

### Before Asking for Help

1. **Check this guide** for your specific issue
2. **Search existing issues** in the project repository
3. **Check the documentation** in the `docs/` directory
4. **Try the solutions** listed above

### When to Ask for Help

- You've been stuck for more than 30 minutes
- The issue is not covered in this guide
- You're getting unexpected behavior
- You need clarification on requirements

### How to Ask for Help

When asking for help, include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Error messages** (if any)
4. **Environment details**:
   - Node.js version
   - Operating system
   - Browser (if relevant)
5. **What you've tried** already
6. **Relevant code** snippets

### Where to Ask for Help

- **Team Chat**: For quick questions
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Update docs if you find missing information
- **Code Review**: Ask questions during PR reviews

### Useful Commands for Debugging

```bash
# Check system information
node --version
npm --version
git --version

# Check project status
git status
npm list --depth=0

# Check environment
echo $NODE_ENV
echo $DATABASE_URL

# Check processes
ps aux | grep node
lsof -i :3000

# Check logs
npm run dev
# Look for error messages in console
```

---

**Last Updated**: December 2024  
**Maintained By**: Learn Hub Development Team 