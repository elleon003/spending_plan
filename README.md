# Spending Plan

A modern personal finance application focused on pay period-based budgeting built with Vue 3 and Supabase. This application helps users manage their finances by aligning budgets with their pay schedule instead of traditional monthly budgeting.

## Features

- 🔐 Secure authentication with Supabase
- 🏦 Bank integration via Plaid API
- 💰 Custom pay period definition (weekly, bi-weekly, semi-monthly, monthly)
- 📊 Visual reports and analytics
- 🔄 Automatic transaction syncing
- 📱 Responsive design with Tailwind CSS
- 🔔 Budget limit notifications
- 🔄 Recurring transaction management

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Supabase (Database & Authentication)
- Plaid API (Banking Integration)
- Pinia (State Management)
- Vue Router
- Tailwind CSS
- Vite

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Plaid developer account

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd spending-plan
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the environment variables in `.env`:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_PLAID_CLIENT_ID=your-plaid-client-id
VITE_PLAID_SECRET=your-plaid-secret
VITE_PLAID_ENV=sandbox
```

5. Run database migrations:
```bash
npx supabase migration up
```

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
spending_plan/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # Vue components
│   ├── layouts/       # Layout components
│   ├── lib/          # Library configurations
│   ├── router/       # Vue Router configuration
│   ├── stores/       # Pinia stores
│   ├── types/        # TypeScript type definitions
│   └── views/        # Vue views/pages
├── supabase/
│   └── migrations/   # Database migrations
└── public/          # Public static files
```

## Security Features

- Row Level Security (RLS) policies in Supabase
- Secure token storage
- Multi-factor authentication support
- Input validation
- Error handling
- Session management

## Development

### Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding New Features

1. Create new components in `src/components`
2. Add routes in `src/router/index.ts`
3. Create stores in `src/stores`
4. Add database migrations in `supabase/migrations`

## Database Migrations

Run migrations:
```bash
npx supabase migration up
```

Create new migration:
```bash
npx supabase migration new [migration-name]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here]
