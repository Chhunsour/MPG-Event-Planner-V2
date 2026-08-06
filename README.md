<p align="center">
  <a href="https://github.com/Chhunsour/MPG-Event-Planner-V2" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="320" alt="MPG Event Planner Logo">
  </a>
</p>

<h1 align="center">🎪 MPG Event Planner V2</h1>

<p align="center">
  <strong>Next-Generation Enterprise Event Production & Management Web Platform</strong>
</p>

<p align="center">
  <a href="https://github.com/Chhunsour/MPG-Event-Planner-V2/actions"><img src="https://img.shields.io/badge/Tests-33%20Passed-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white" alt="Test Status"></a>
  <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12"></a>
  <a href="https://inertiajs.com"><img src="https://img.shields.io/badge/Inertia.js-React_19-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js React 19"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4"></a>
  <a href="https://www.php.net"><img src="https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.2+"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License"></a>
</p>

---

## 📌 Executive Summary

**MPG Event Planner V2 (`mpg-event-webapp`)** is a state-of-the-art enterprise web application engineered for **MPG Event Planner**, a premier event planning and turnkey production company based in **Phnom Penh, Cambodia**. 

Built upon a robust decoupled monolith stack—**Laravel 12**, **Inertia.js**, **React 19**, **TypeScript**, and **Tailwind CSS v4**—the application provides a high-converting public landing page, interactive quotation booking engine, and a feature-complete Admin Content Management System (CMS).

---

## 🚀 Core Features & Capabilities

### 🌐 Trilingual Localization Engine & Google Sans Typography
- **Instant Multilingual Switching**: Native support for **Khmer (`km`)**, **English (`en`)**, and **Chinese (`zh`)** with dynamic dictionary loading.
- **Embedded Google Sans Typography**: Local `@font-face` WOFF font system enforcing official Google Sans font rules across English (`--font-en`) and Khmer (`--font-km`) to guarantee zero font rendering errors or awkward line wraps.

### 🎨 Premium Design System & Responsive Mobile Grids
- **Hero Keyword Marquee Ticker**: Slow, continuous 90s infinite sliding ticker rail (`animate-marquee-smooth`) with dark glassmorphism backdrop (`bg-black/40 backdrop-blur-md`).
- **Mobile Grid Architecture**: Reconstructed 2-column mobile grids (`grid-cols-2 gap-3.5`) across all major components (**Company Overview**, **Flagship Capabilities**, **Selected Work Portfolio**, **Working Process**, and **Service Index**), eliminating excessive vertical scrolling on small screens.
- **Iconography System**: Clean Lucide icon integration replacing legacy `01`, `02`, `03` numeric badges across all section headers and service lists.

### 📨 Quotation Request & Instant Booking Engine
- **Inertia/API Hybrid Submission**: REST API endpoint (`POST /api/quotation-requests`) handling raw JSON and Inertia requests.
- **Reference Tracking Code**: Automatic generation of unique quotation reference codes (e.g. `MPG-000042`).
- **Redesigned Toast Notification**: Dark floating pill notifications with micro-animations notifying users upon successful submission.

### 🛡️ Enterprise Admin CMS Dashboard
- **Top Header Navigation**: Sleek top navigation bar replacing sidebars, featuring a "View Website ▾" landing page preview menu.
- **Content Management**: Complete CRUD controls for Services, Portfolio Projects, Blog Posts, and Site Settings.
- **Multipart Form Upload Spoofing**: Native support for Inertia PUT/POST file uploads via `_method: "put"`.
- **Media Link Pipeline**: Automatic storage symlinking (`storage:link`) serving 4K realistic event photography across production and staging.

---

## 🛠️ Complete Tech Stack

| Domain | Technology / Library | Version / Details |
| :--- | :--- | :--- |
| **Backend Core** | [Laravel Framework](https://laravel.com/) | `12.x` (PHP 8.2+) |
| **Frontend Adapter** | [Inertia.js](https://inertiajs.com/) | `React 19` Integration |
| **Type Safety** | [TypeScript](https://www.typescriptlang.org/) | `5.x` Strict Mode |
| **Styling Engine** | [Tailwind CSS](https://tailwindcss.com/) | `v4.x` with `@theme` token definitions |
| **Icons** | [Lucide React](https://lucide.dev/) | Enterprise SVG icon library |
| **Database** | SQLite (Default Dev) / MySQL / PostgreSQL | Database migration & seeder pipelines |
| **Build System** | [Vite](https://vitejs.dev/) | Lightning-fast asset bundling & HMR |
| **Typography** | Google Sans / Google Sans Khmer | Bundled local `.woff` font files |

---

## ⚙️ System Requirements & Prerequisites

Ensure your host environment meets the following requirements:

- **PHP**: `>= 8.2`
  - Required Extensions: `bcmath`, `ctype`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`
- **Composer**: `>= 2.5`
- **Node.js**: `>= 20.x`
- **npm**: `>= 10.x`

---

## 🛠️ Step-by-Step Installation Guide

### 1. Repository Setup
```bash
git clone https://github.com/Chhunsour/MPG-Event-Planner-V2.git
cd MPG-Event-Planner-V2
```

### 2. Install Dependencies
```bash
# Install PHP Composer packages
composer install

# Install Node.js packages
npm install
```

### 3. Environment Configuration
```bash
# Copy template environment file
cp .env.example .env

# Generate application encryption key
php artisan key:generate
```

### 4. Database Setup & Seeding
```bash
# Run database migrations and seed realistic 4K photography data
php artisan migrate --seed
```

### 5. Storage Symlink Setup
```bash
# Link public storage directory to app storage
php artisan storage:link
```

### 6. Build Frontend Assets
```bash
# Build production bundle with Vite
npm run build
```

### 7. Run Local Application
```bash
# Start Laravel development server
php artisan serve
```
Access the application at `http://127.0.0.1:8000`.

---

## 🧪 Testing & Quality Assurance

The codebase includes full automated test coverage using PHPUnit and Laravel Artisan Test Runner.

```bash
# Execute automated test suite
php artisan test
```

### Verification Matrix
- **Test Suite Status**: `PASSED`
- **Total Tests**: `33`
- **Total Assertions**: `193`
- **Asset Compilation**: `0 Errors` (Vite build verified)

---

## 📂 Project Directory Structure

```
MPG-Event-Planner-V2/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/                # Dashboard CMS Controllers
│   │   │   └── Api/                  # REST API Controllers (Quotation, Projects, etc.)
│   │   └── Middleware/               # Inertia & Locale Middleware
│   └── Models/                       # Eloquent Models (Service, Project, Post, etc.)
├── database/
│   ├── factories/                    # Eloquent Model Factories
│   ├── migrations/                   # Schema Migrations
│   └── seeders/                      # Seeders populating 4K media records
├── public/
│   ├── fonts/google-sans/           # Bundled Google Sans WOFF font files
│   └── storage/ -> storage/app/public# Media storage symlink
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── forms/                # Quotation & Contact Forms
│   │   │   ├── home/                 # Hero, About, Flagship, Services, Work, Process Blocks
│   │   │   ├── layout/               # HeaderNav, Footer, BrandMark, LanguageSwitch
│   │   │   ├── sections/             # ServiceIndex, WorkGrid
│   │   │   └── ui/                   # Toast, ScrollReveal, Buttons
│   │   ├── css/app.css               # Design system tokens & font-family CSS
│   │   ├── Layouts/                  # AppLayout.tsx & AdminLayout.tsx
│   │   ├── locales/                  # Multilingual Dictionaries (km.json, en.json, zh.json)
│   │   └── Pages/                    # Inertia Page Routes (Home, About, Admin, etc.)
│   └── views/
│       └── app.blade.php             # HTML entry point with dynamic locale font binding
├── routes/
│   ├── web.php                       # Web & Admin Inertia routes
│   └── api.php                       # Quotation & Content REST API routes
├── storage/
│   └── app/public/                   # Uploaded images & generated photography assets
├── README.md                         # Project documentation
└── vite.config.ts                    # Vite build configuration
```

---

## 🛰️ REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/services` | Retrieve list of active services |
| `GET` | `/api/projects` | Retrieve portfolio projects with service relations |
| `GET` | `/api/blog-posts` | Retrieve published news & articles |
| `POST` | `/api/quotation-requests` | Submit new quotation request (Returns `{ success: true, reference: "MPG-XXXXXX" }`) |

---

## 📜 License & Copyright

Copyright © 2026 **MPG Event Planner** (Phnom Penh, Cambodia).

This project is open-sourced software licensed under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with precision for <strong>MPG Event Planner</strong> — Phnom Penh, Cambodia 🇰🇭
</p>
