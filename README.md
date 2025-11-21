# Fabrica - Creator Economy Platform

Monetize your audience with your own storefront in Ethiopia.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MakeMoneyOnly/fabrica.git
cd fabrica
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

#### Clerk Authentication

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

Get your Clerk keys from [Clerk Dashboard](https://dashboard.clerk.com/)

#### Supabase Database

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get your Supabase keys from [Supabase Dashboard](https://supabase.com/dashboard)

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

The application requires the following environment variables to be set:

| Variable                            | Description               | Required |
| ----------------------------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key     | Yes      |
| `CLERK_SECRET_KEY`                  | Clerk secret key          | Yes      |
| `CLERK_WEBHOOK_SECRET`              | Clerk webhook secret      | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL      | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase anonymous key    | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`         | Supabase service role key | Yes      |

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **Database:** Supabase
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + Storybook

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── stores/             # Zustand state stores
└── types/              # TypeScript type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run storybook` - Start Storybook

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

ISC
