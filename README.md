# PitchBase

**PitchBase** is a platform for startup enthusiasts to pitch ideas, connect with fellow entrepreneurs, submit startup concepts, and gain visibility through virtual competitions.

**Live Demo**: [https://pitch-base.vercel.app/](https://pitch-base.vercel.app/)

## Features

- Pitch your startup idea
- Browse and discover other pitches
- Sign in with GitHub, build your profile, and share your startup
- Connect with like-minded entrepreneurs

## Tech Stack

This project is built with the following technologies:

- **React 19**
- **Next.js 15**
- **TypeScript**
- **Tailwind CSS 4.1**
- **ShadCN UI**
- **Sanity (Headless CMS)**
- **Sentry** for error tracking and monitoring

## Getting Started

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/Shubham-567/pitch-base.git
   cd pitch-base
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add the following:

   ```bash
   AUTH_SECRET=""
   AUTH_GITHUB_ID=""
   AUTH_GITHUB_SECRET=""
   NEXT_PUBLIC_SANITY_PROJECT_ID=""
   NEXT_PUBLIC_SANITY_DATASET=""
   SANITY_WRITE_TOKEN=""
   ```

   Replace the empty values with your actual credentials and configuration values.

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Acknowledgments

This project was built as part of a learning experience to explore Next.js 15 and full-stack development. It was guided by the YouTube course by JavaScript Mastery.

## License

MIT © Shubham Patil
