# Contractor Sourcing App

This repository contains a full‑stack web application for sourcing and managing contractor outreach.  The goal of the project is to locate potential contractors via the Google Places API, de‑duplicate entries, and then manage the outreach process across a simple three‑pane workflow: **Importer**, **Responsive**, and **Member Sourcing**.

## Features

* **Importer** – Search Google Places by keyword/category and location/radius, preview the results, and import selected contractors into the database.  Duplicate detection is built in so the same business is never created twice.
* **Responsive** – Shows every contractor who has been marked as **RESPONSIVE**.  From here you can adjust status, assign contractors to specific team members, or export the current view to CSV.
* **Member Sourcing** – Each team member has their own tab which lists the contractors currently assigned to them.  Admins can see all tabs at once.  Individual team members only see their own tab after logging in.
* **Activity Log** – Every important action (imports, status changes, assignment changes, notes edits, exports) is recorded in an `ActivityLog` table.  Admins can view recent actions to trace who did what and when.

## Stack

* **Framework** – [Next.js 14](https://nextjs.org/) using the App Router and React 18.
* **Database** – PostgreSQL via [Supabase](https://supabase.com/) and [Prisma](https://www.prisma.io/).  Prisma handles schema migrations and access to the database.
* **UI** – Tailwind CSS for styling with minimal components.  Feel free to layer shadcn/ui or your own component library on top.
* **Backend** – Server actions and API route handlers live inside the `app/api` directory.  Calls to the Google Places API are proxied through `/api/google-places` so that the API key is never exposed to the browser.
* **Auth Gate** – There is no account system; instead a single password gate protects the application.  After the password is entered you must choose an identity (one of five team members or **Admin**).  Admins must also supply an admin passcode.  Identities are stored in httpOnly cookies.

## Quick Start

The following steps will get you up and running locally.  See the **Deployment** section for instructions on pushing to Vercel.

1. **Create a Supabase project.**  Inside your project settings, copy the **database connection string** into a new `.env.local` file at the root of this repo.  It should look like:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
   APP_PASSWORD="your-app-password"
   ADMIN_PASSCODE="your-admin-passcode"
   NEXT_PUBLIC_APP_NAME="Contractor Sourcing"
   ```

   Make sure the **GOOGLE_MAPS_API_KEY** has the **Places API** enabled (and optionally Geocoding if you wish to support city/ZIP lookups).  Restrict the key to your server’s IP/domain where possible.

2. **Install dependencies.**  Use [`pnpm`](https://pnpm.io/), `npm`, or `yarn` as you prefer.  The examples below use `pnpm`:

   ```bash
   pnpm install
   ```

3. **Run the database migrations.**  Prisma will create all tables defined in `prisma/schema.prisma`:

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database.**  A seed script is provided in `scripts/seed.ts` which populates the five default members.  Run it with ts‑node:

   ```bash
   pnpm run seed
   ```

5. **Start the development server.**

   ```bash
   pnpm dev
   ```

   Navigate to `http://localhost:3000/gate` to enter the password and choose your identity.  The three main interfaces live at `/importer`, `/responsive`, and `/sourcing`.

## Deployment

Deploying to [Vercel](https://vercel.com/) is simple once your application is configured locally:

1. **Push to a Git repository.**  Commit this codebase to GitHub, GitLab, or another Git provider.

2. **Create a new project on Vercel.**  Connect your repo and choose the root of this project.  Vercel will detect the Next.js app automatically.

3. **Add the environment variables on Vercel.**  In your project’s settings on Vercel, add the following environment variables:

   * `DATABASE_URL` – your Supabase connection string
   * `GOOGLE_MAPS_API_KEY` – your Google Maps API key
   * `APP_PASSWORD` – the shared password protecting the app
   * `ADMIN_PASSCODE` – secret code required when choosing the **Admin** identity
   * `NEXT_PUBLIC_APP_NAME` – name shown in the UI

4. **Deploy!**  Once the first build finishes, Vercel will give you a URL.  Visit `https://<your‑deployment>/gate` to log in.

## Development Notes

* **Prisma & Migrations** – Any changes to `prisma/schema.prisma` require a new migration.  Use `npx prisma migrate dev --name <your-migration>` during development and `pnpm run migrate` on production to apply migrations.
* **Server Routes** – All sensitive operations (imports, updates, exports) are executed on the server.  Never expose the Google API key to the client.  All calls to Google are proxied through `/api/google-places`.
* **Auth Implementation** – The auth gate uses httpOnly cookies for both the session indicator and the selected identity.  Helpers in `lib/authGate.ts` simplify access to these values on the server.  If no valid session is found, the user is redirected to `/gate`.

## Screenshots

For a smooth development experience, sample screenshots or GIFs of the interfaces can be captured once the app is running.  Open the importer, responsive, and sourcing pages to verify that the tables render correctly and that actions such as importing, updating status, and exporting to CSV work as expected.

## Acknowledgements

This project makes use of the following open‑source software:

* [Next.js](https://nextjs.org/) – React framework for building hybrid web applications.
* [Prisma](https://www.prisma.io/) – Type‑safe ORM for Node.js & TypeScript.
* [Supabase](https://supabase.com/) – Hosted PostgreSQL with a generous free tier.
* [Tailwind CSS](https://tailwindcss.com/) – Utility‑first CSS framework.
* [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) – Data source for contractor search.

Enjoy sourcing!