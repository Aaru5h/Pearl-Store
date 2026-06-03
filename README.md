# Pearl Store (Haath Ki Dukaan)

A complete, production-grade frontend for a warm, inviting Indian general store website. The aesthetic is designed to feel warm, earthy, and handcrafted—like a well-loved neighbourhood shop that happens to be beautifully designed.

## Features

- **Full E-Commerce Flow**: Home, Product Grid, Category Pages, Product Details, Cart, and Checkout.
- **Customer Accounts**: Address book, order history, reviews, notifications, and profile settings.
- **Admin Dashboard**: Comprehensive management interface for products, orders, customers, and settings.
- **Modern UI/UX**: Built with shadcn/ui and custom Tailwind CSS themes featuring a warm, organic color palette (bark, cedar, grain, linen, cream).
- **Responsive Design**: Works perfectly across all devices, from mobile phones to large desktops.
- **Optimized Performance**: Next.js App Router, React Suspense, and highly optimized image loading.
- **State Management**: Uses Zustand for persistent local state (cart, auth) and TanStack React Query for server state.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Custom CSS Variables
- **UI Components**: shadcn/ui (heavily customized base)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Server State / Data Fetching**: TanStack Query v5 + Axios
- **Form Validation**: React Hook Form + Zod

## Getting Started

### 1. Installation

Navigate to the `frontend` directory and install the dependencies:

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `frontend` directory based on the `.env` settings. For example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_USE_MOCKS=false
```

*(Note: Set `NEXT_PUBLIC_USE_MOCKS=true` to run the frontend independently using structured mock data).*

### 3. Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

## Backend Integration

The frontend is designed to seamlessly integrate with the backend API. When `NEXT_PUBLIC_USE_MOCKS=false`, all data fetching (handled by TanStack Query) will route through the Axios instance configured in `/lib/api.ts`, which includes automatic token refreshing and error handling.
