# fabrica

A multi-tenant creator monetization platform (link-in-bio storefront + 1-tap checkout) adapted for Ethiopian creators.

- Frontend: Next.js (React, Tailwind, TypeScript)
- Backend: NestJS (Node.js) + Prisma + PostgreSQL, Redis (future sessions/cache)
- Mobile: Expo (React Native)
- Infrastructure: Docker, Kubernetes manifests, AWS-ready
- Payments: WeBirr (wallets/banks), Telebirr, Chapa (cards/foreign). ETB-first.

## Quickstart (Local Dev)

1) Requirements: Node 20+, npm 10+, Docker Desktop

2) Start DB with Docker Compose:

```bash
# Windows PowerShell
docker compose -f infra/docker-compose.yml up -d
```

3) Install and run apps (first time may take a while):

```bash
npm install
npm run db:push
npm run seed
npm run dev
```

- Backend API: http://localhost:4000/api
- Web app: http://localhost:3000

Default seed user: email `demo@fabrica.store`, password `secret123`

## Environment

Copy `ENV.example` files and fill values, then rename the copy to `.env` (or `.env.local` for Next.js):

- Root: `./ENV.example` (optional shared defaults)
- Backend: `apps/backend/ENV.example` -> rename to `.env`
- Web: `apps/web/ENV.example` -> rename to `.env.local`

## Monorepo Structure

```
apps/
  backend/        # NestJS API (Prisma, Auth, Stores, Products, Checkout, Payments)
  web/            # Next.js web (storefront + dashboard)
  mobile/         # Expo React Native (creator app)
infra/
  docker-compose.yml   # Postgres, Adminer
packages/
  shared/         # Shared TypeScript types/utils (future)
```

## Payments

- Implemented provider interfaces with stubs for WeBirr, Telebirr, Chapa. Replace with live keys.
- Webhooks endpoints included per provider.

## Scripts

- `npm run dev` - run backend and web concurrently
- `npm run build` - build backend and web
- `npm run db:push` - Prisma push schema
- `npm run seed` - seed DB with demo data
- `npm run docker:up` - start infra compose

## Production

- Use Kubernetes manifests under `infra/k8s/` (to be expanded)
- Recommended: AWS RDS (Postgres), S3, CloudFront, EKS or ECS Fargate
- Set strong JWT secrets and payment API keys

## License

Proprietary - For evaluation and internal use only (customize as needed).
