# Production Deployment Guide

## Vercel Deployment

This application is fully configured for deployment on Vercel.

### Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Vercel Account** - Sign up at https://vercel.com
3. **Environment Variables** - Set up required secrets

### Step 1: Connect to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the project root directory
4. Click "Deploy"

### Step 2: Configure Environment Variables

In Vercel dashboard, go to Settings → Environment Variables and add:

**Required:**
- `DATABASE_URL` - Your MySQL/TiDB connection string
- `JWT_SECRET` - Session signing secret (generate with: `openssl rand -base64 32`)

**Optional:**
- `VITE_APP_TITLE` - Application title
- `AWS_ACCESS_KEY_ID` - For S3 file storage
- `AWS_SECRET_ACCESS_KEY` - For S3 file storage
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_S3_BUCKET` - S3 bucket name

### Step 3: Database Setup

1. Create a MySQL database
2. Run migrations: `pnpm run db:push`
3. Add connection string to Vercel environment variables

### Step 4: Deploy

Vercel will automatically deploy on every push to main branch.

## Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
pnpm run db:push

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start
```

## Production Checklist

- [ ] Database configured and migrated
- [ ] Environment variables set in Vercel
- [ ] Build completes successfully
- [ ] All tests pass: `pnpm run test`
- [ ] No TypeScript errors: `pnpm run check`
- [ ] Application loads without console errors
- [ ] All pages and features work correctly
- [ ] Mobile responsive design verified
- [ ] Performance acceptable

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Run `pnpm run check` locally to find TypeScript errors
4. Run `pnpm run build` locally to test build

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check database credentials
3. Ensure database server is running
4. Test connection locally first

### Runtime Errors

1. Check Vercel function logs
2. Look for errors in browser console
3. Verify all required environment variables are set
4. Check application logs in Vercel dashboard

## Monitoring

- Monitor application performance in Vercel Analytics
- Set up error tracking (optional)
- Monitor database performance
- Set up uptime monitoring

## Support

For issues or questions, refer to:
- Vercel Documentation: https://vercel.com/docs
- Application README: ./README.md
