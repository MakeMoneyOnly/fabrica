# CI/CD Setup Guide

This guide will help you set up the CI/CD pipelines for the Fabrica platform.

## 🎯 Quick Start

### 1. Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

#### Vercel Secrets

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**How to get Vercel credentials:**

1. **Get VERCEL_TOKEN:**
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token (you won't see it again!)

2. **Get VERCEL_ORG_ID and VERCEL_PROJECT_ID:**
   - Option A: From Vercel Dashboard
     - Go to your project → Settings → General
     - `VERCEL_ORG_ID` = Team ID (or your user ID if personal account)
     - `VERCEL_PROJECT_ID` = Project ID
   - Option B: Using Vercel CLI
     ```bash
     npm i -g vercel
     vercel login
     vercel link  # in your project directory
     cat .vercel/project.json  # Check for orgId and projectId
     ```

3. **Add secrets to GitHub:**
   - Go to your repository → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add each secret:
     - Name: `VERCEL_TOKEN`, Value: (your token from step 1)
     - Name: `VERCEL_ORG_ID`, Value: (your org/team ID)
     - Name: `VERCEL_PROJECT_ID`, Value: (your project ID)

#### Supabase Secrets

```bash
SUPABASE_ACCESS_TOKEN=your_supabase_token
SUPABASE_PROJECT_REF=your_production_project_ref
SUPABASE_STAGING_PROJECT_REF=your_staging_project_ref
```

**How to get Supabase credentials:**

1. Go to https://supabase.com/dashboard/account/tokens
2. Create a new access token
3. Get project ref from your Supabase project URL: `https://supabase.com/dashboard/project/[PROJECT_REF]`

#### Optional Secrets

```bash
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
CODECOV_TOKEN=your_codecov_token
```

### 2. Configure Vercel Environment Variables

Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add all environment variables for:

- **Production** environment
- **Preview** environment
- **Development** environment (optional)

See `docs/7. Deployment & DevOps.md` for the complete list of required environment variables.

### 3. Configure GitHub Environments (Optional but Recommended)

Go to **Settings** → **Environments** → **New environment**

Create environments:

- **production** - Protect with required reviewers
- **staging** - Protect with required reviewers (optional)

This adds an extra layer of protection for production deployments.

### 4. Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Ensure "Allow all actions and reusable workflows" is selected
3. Save changes

### 5. Test the Pipelines

#### Test CI Pipeline

```bash
# Create a test branch
git checkout -b test/ci-pipeline

# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "Test CI pipeline"
git push origin test/ci-pipeline

# Open a PR to trigger CI
```

#### Test Preview Deployment

```bash
# Create a feature branch
git checkout -b feature/test-preview

# Make changes
# ... your changes ...

git add .
git commit -m "Test preview deployment"
git push origin feature/test-preview

# Open PR - preview deployment will trigger automatically
```

#### Test Production Deployment

```bash
# Merge to main (after PR approval)
git checkout main
git merge feature/test-preview
git push origin main

# Production deployment will trigger automatically
```

## 🔧 Configuration Details

### Workflow Permissions

All workflows use default GitHub Actions permissions. If you need custom permissions, add to workflow files:

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

### Concurrency Settings

Workflows use concurrency groups to prevent:

- Multiple deployments running simultaneously
- Conflicting database migrations
- Resource conflicts

### Timeout Settings

Each job has a timeout to prevent hanging:

- CI jobs: 10-15 minutes
- Deployment jobs: 15-20 minutes
- Security scans: 10-30 minutes

## 📋 Checklist

Before going live, ensure:

- [ ] All GitHub secrets configured
- [ ] Vercel environment variables set
- [ ] Supabase projects linked
- [ ] CI pipeline passes on test branch
- [ ] Preview deployments work on PRs
- [ ] Staging deployment works
- [ ] Production deployment works
- [ ] Health checks pass
- [ ] Database migrations tested on staging
- [ ] Security scans configured
- [ ] Performance tests configured
- [ ] Slack notifications working (if using)
- [ ] Team members have access

## 🐛 Troubleshooting

### CI Pipeline Fails

**Issue:** Linting errors

```bash
# Fix locally
npm run lint:fix
npm run format
```

**Issue:** Type errors

```bash
# Check types locally
npm run type-check
```

**Issue:** Test failures

```bash
# Run tests locally
npm test
```

### Deployment Fails

**Issue:** Vercel authentication error

- Verify `VERCEL_TOKEN` is correct
- Check token hasn't expired
- Regenerate token if needed

**Issue:** Build fails in CI but works locally

- Check environment variables are set in Vercel
- Verify Node.js version matches (20.x)
- Check for missing dependencies

**Issue:** Health check fails

- Verify `/api/health` endpoint exists
- Check deployment URL is correct
- Wait a few minutes for DNS propagation

### Database Migration Fails

**Issue:** Supabase connection error

- Verify `SUPABASE_ACCESS_TOKEN` is valid
- Check project ref is correct
- Ensure token has proper permissions

**Issue:** Migration SQL errors

- Test migration locally first:
  ```bash
  npx supabase db reset
  ```
- Check SQL syntax
- Verify no conflicting migrations

### Security Scan Fails

**Issue:** npm audit finds vulnerabilities

- Review vulnerabilities: `npm audit`
- Fix critical/high issues: `npm audit fix`
- Update dependencies if needed

**Issue:** Secret scanning finds false positives

- Review findings in workflow logs
- If false positive, add to `.trufflehogignore`
- Never ignore real secrets

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

## 🆘 Getting Help

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Review this setup guide
3. Check the main CI/CD documentation: `.github/workflows/README.md`
4. Review deployment docs: `docs/7. Deployment & DevOps.md`
5. Contact the DevOps team

---

**Last Updated:** January 2025  
**Maintained by:** Fabrica DevOps Team
