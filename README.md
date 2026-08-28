# Club Tracker

A personal full-stack web app for tracking my Baruch College and Macaulay Honors College extracurricular involvement.

**Live App:** https://club-tracker.vercel.app

Club Tracker gives me one place to manage clubs I am interested in, application progress, deadlines, events, notes, and calendar information across both Baruch and Macaulay.

---

## Features

### Clubs

Track organizations throughout the entire application and membership process.

Supported statuses:

- Interested
- Applying
- Applied
- Active
- Inactive

Each club can store:

- Name
- Baruch or Macaulay affiliation
- Category
- Current status
- Role
- Instagram
- Website
- Description
- Personal notes

Clubs can be:

- Added
- Edited
- Deleted
- Searched
- Filtered by organization
- Filtered by status

All club data is persisted in Supabase.

---

### Tasks & Deadlines

Track application deadlines and club responsibilities.

Each task supports:

- Title
- Associated club
- Deadline
- Priority
- Notes
- Completion status

Tasks can be filtered between:

- Open
- Completed
- All

Tasks are stored persistently in the database.

---

### Events

Track club-related events such as:

- General interest meetings
- Interviews
- Workshops
- Networking events
- Club meetings
- Social events

Each event supports:

- Associated club
- Start time
- End time
- Location
- Notes

Events can be:

- Added
- Edited
- Deleted
- Viewed as upcoming or past events

Events also include an **Add to Google Calendar** action that opens a pre-filled Google Calendar event.

---

### Calendar

A unified monthly calendar combines:

- Club events
- Task deadlines

The calendar supports:

- Current month view
- Previous and next month navigation
- Today shortcut
- Event indicators
- Task deadline indicators
- Direct navigation to Events and Tasks

---

### Dashboard

The dashboard summarizes the most important information across the app.

It displays:

- Total tracked clubs
- Active clubs
- Applications in progress
- Open tasks
- Upcoming events
- Upcoming deadlines
- Club application pipeline

All dashboard information is generated from live Supabase data.

---

### Authentication

Club Tracker is a private personal workspace.

Authentication is handled through Supabase Auth with:

- Email/password authentication
- Persistent sessions
- Protected routes
- Sign out
- Server-side authentication validation

Unauthenticated users are automatically redirected to the login page.

---

### Progressive Web App

Club Tracker can be installed on a phone's home screen and used similarly to a native application.

The PWA includes:

- Custom app icon
- Standalone display mode
- Mobile navigation
- Responsive layout
- Home-screen installation support

---

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- [Supabase](https://supabase.com/)
- PostgreSQL
- Supabase Auth
- Row Level Security

### Deployment

- [Vercel](https://vercel.com/)
- GitHub

---

## Architecture

```text
                 ┌──────────────────────┐
                 │       Vercel         │
                 │   Next.js Web App    │
                 └──────────┬───────────┘
                            │
                            │
                 ┌──────────▼───────────┐
                 │      Supabase        │
                 │                      │
                 │  PostgreSQL Database │
                 │  Authentication      │
                 │  Row Level Security  │
                 └──────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
        ┌─────▼─────┐               ┌─────▼─────┐
        │  Desktop  │               │   Phone   │
        │  Browser  │               │    PWA    │
        └───────────┘               └───────────┘
```

GitHub acts as the source of truth for the application.

```text
Local Development
        ↓
      Git
        ↓
     GitHub
        ↓
      Vercel
        ↓
 Production App
```

Database schema changes are tracked through Supabase migrations.

---

## Database

The application currently uses three main tables:

```text
clubs
tasks
events
```

Each row belongs to an authenticated user through a `user_id`.

### Security

All application tables use PostgreSQL **Row Level Security (RLS)**.

Policies ensure authenticated users can only:

- Read their own data
- Insert their own data
- Update their own data
- Delete their own data

Database schema changes are stored under:

```text
supabase/migrations/
```

---

## Project Structure

```text
club-tracker/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   │
│   ├── (dashboard)/
│   │   ├── calendar/
│   │   ├── clubs/
│   │   ├── events/
│   │   └── tasks/
│   │
│   ├── layout.tsx
│   └── manifest.ts
│
├── components/
│   ├── add-club-modal.tsx
│   ├── add-event-modal.tsx
│   ├── add-task-modal.tsx
│   ├── app-shell.tsx
│   ├── calendar-view.tsx
│   ├── club-card.tsx
│   ├── clubs-view.tsx
│   ├── edit-club-modal.tsx
│   ├── edit-event-modal.tsx
│   ├── event-card.tsx
│   ├── events-view.tsx
│   ├── task-card.tsx
│   └── tasks-view.tsx
│
├── lib/
│   └── supabase/
│       ├── client.ts
│       ├── proxy.ts
│       └── server.ts
│
├── public/
│   ├── icon.png
│   └── sw.js
│
├── supabase/
│   ├── config.toml
│   └── migrations/
│
├── types/
│   ├── club.ts
│   ├── event.ts
│   └── task.ts
│
├── proxy.ts
├── package.json
└── README.md
```

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd club-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never commit `.env.local` or private Supabase credentials.

### 4. Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Validation

Before committing changes:

```bash
npm run lint
npm run build
```

Both should complete successfully.

---

## Supabase Development

The Supabase CLI is used for database schema management.

Create a migration:

```bash
npx supabase migration new migration_name
```

Preview database changes:

```bash
npx supabase db push --dry-run
```

Apply migrations:

```bash
npx supabase db push
```

Database changes should be made through migrations rather than manually modifying the production schema whenever possible.

---

## Deployment

Production deployment is handled automatically by Vercel.

```text
Push to main
     ↓
GitHub
     ↓
Vercel build
     ↓
Automatic production deployment
```

The following environment variables must be configured in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Production URL:

https://club-tracker.vercel.app

---

## Current Version

### V1

Club Tracker V1 includes:

- Persistent club tracking
- Application pipeline
- Club CRUD
- Search and filtering
- Tasks and deadlines
- Event management
- Google Calendar export
- Unified calendar
- Live dashboard
- Authentication
- Row Level Security
- Responsive mobile interface
- PWA installation
- Vercel deployment

The project is now usable as my primary extracurricular tracking system.

---

## Future Ideas

Possible future improvements include:

- Recurring events
- More detailed club contacts
- Custom communication links
- Push notifications
- Deadline reminders
- Calendar synchronization
- Improved mobile UX
- Custom dashboard widgets
- Application analytics
- Additional PWA functionality
- Offline support
- Automated maintenance and feature development with coding agents

These are intentionally outside the initial V1 scope.

---

## Development Philosophy

The goal of Club Tracker is to remain simple enough to use every day while being flexible enough to grow as my involvement at Baruch and Macaulay changes.

The application started as a personal club application tracker and can evolve into a broader extracurricular management workspace over time.

---

## License

This project is currently intended for personal use.