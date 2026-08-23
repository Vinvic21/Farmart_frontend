# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Farmart — Frontend

The buyer/farmer marketplace frontend for Farmart, an app that lets farmers sell animals directly to buyers with no middlemen. Built with React, Redux Toolkit, and Tailwind CSS.

## Tech stack

- **React** (Vite)
- **Redux Toolkit** — state management, organized as feature slices (`auth`, `animals`, `cart`, `orders`)
- **Tailwind CSS v4** — utility-first styling, design tokens defined in `src/index.css` via `@theme`
- **Vitest** — testing
- **ESLint + Prettier** — linting and formatting

## Getting started

### Prerequisites
- Node.js 18+ and npm

### Setup

```bash
git clone https://github.com/Vinvic21/Farmart_frontend.git
cd Farmart_frontend
npm install
```

### Environment variables

Create a `.env` file at the root with:


*VITE_API_BASE_URL=http://localhost:5000/api*


### Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts the local dev server with hot reload |
| `npm run build` | Builds a production bundle into `dist/` |
| `npm run preview` | Serves the production build locally, to sanity-check it before deploying |
| `npm run lint` | Runs ESLint across the project |
| `npm run format` | Runs Prettier and rewrites files to match the style config |
| `npm run format:check` | Checks formatting without changing any files (used in CI) |
| `npm test` | Runs the Vitest test suite |

## Project structure


| src/ |
├── app/ Redux store setup
├── features/ Redux slices, one folder per domain (auth, animals, cart, orders)
├── components/ Reusable UI pieces (Navbar, Footer, AnimalCard, etc.)
├── pages/ Route-level pages, split by role (auth, buyer, farmer)
├── services/ apiClient.js — the single place API calls go through
├── utils/ Formatting/validation helpers
├── App.jsx
├── main.jsx
└── index.css Tailwind import + design tokens (@theme block)


