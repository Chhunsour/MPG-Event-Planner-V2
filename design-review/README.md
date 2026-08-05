# MPG Event Planner Website & Laravel REST API

A production-ready, highly optimized, multilingual company website for **MPG Event Planner**, featuring a **Next.js 16 (App Router)** frontend and a **Laravel 11+ REST API** with **MySQL** database backend.

---

## 🏛️ Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Internationalization (`/en/`, `/km/`, `/zh/`).
- **Backend**: Laravel 11+ REST API (`/backend`), MySQL Database, Laravel Mailer, Rate Limiting, Form Request Validation, Honeypot Anti-Spam protection.
- **Communication**: Next.js communicates with Laravel REST API over secure HTTP requests via `NEXT_PUBLIC_API_URL`.

---

## 📁 Folder Structure

```text
├── frontend/                     # Next.js 16 (App Router) frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/         # Multilingual pages (/en/, /km/, /zh/)
│   │   │   ├── actions/
│   │   │   │   └── submit-quotation.ts # Next.js server action invoking Laravel REST API
│   │   │   ├── sitemap.ts        # Dynamic sitemap with alternate hreflangs
│   │   │   └── robots.ts         # Crawler guidelines
│   │   ├── components/
│   │   │   ├── ProjectGallery.tsx # Filterable project portfolio & lightbox
│   │   │   └── QuotationForm.tsx  # Client-side quotation request form
│   │   └── locales/              # en.json, km.json, zh.json translation dictionaries
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── backend/                      # Decoupled Laravel 11+ REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/QuotationRequestController.php # API Controller
│   │   │   └── Requests/StoreQuotationRequest.php             # Form Request Validation
│   │   ├── Mail/QuotationSubmittedMail.php                     # Mailable Notification
│   │   └── Models/QuotationRequest.php                         # Eloquent Model
│   ├── database/
│   │   └── migrations/xxxx_create_quotation_requests_table.php # MySQL Schema
│   ├── config/cors.php                                        # Dynamic CORS configuration
│   ├── routes/api.php                                         # API endpoints
│   └── tests/Feature/QuotationRequestTest.php                 # PHPUnit/Pest API tests
```

---

## 💻 Prerequisites

- **PHP**: 8.2 or higher (PHP 8.5 supported)
- **Composer**: 2.x
- **Node.js**: 18.x or higher
- **MySQL**: 8.0 or MariaDB 10.4+

---

## 🛠️ Installation & Setup

### 1. Laravel Backend Setup (`/backend`)

Navigate to the backend directory and install dependencies:
```bash
cd backend
composer install
```

Copy the `.env.example` template:
```bash
cp .env.example .env
php artisan key:generate
```

Configure your MySQL database in `backend/.env`:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mpg_event_planner
DB_USERNAME=root
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000
MPG_NOTIFICATION_EMAIL=info@mpgeventplanner.com
```

Run database migrations:
```bash
php artisan migrate
```

Run backend feature tests:
```bash
php artisan test
```

Start the Laravel API server:
```bash
php artisan serve --port=8000
```
The API will run at `http://localhost:8000/api/quotation-requests`.

---

### 2. Next.js Frontend Setup (`/frontend`)

Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Configure `.env`:
```ini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Protection Features

1. **Input Validation & Sanitization**: Laravel `StoreQuotationRequest` validates name, email, dates, and consent while stripping malicious payloads.
2. **Honeypot Anti-Spam**: Invisible honeypot field (`website_url`) rejects automated spam bots.
3. **Duplicate Submission Shield**: Prevents identical email/event submissions within 60 seconds.
4. **Rate Limiting**: Throttles submission attempts (`throttle:10,1`).
5. **Private Quotation Records**: Customer quotations are only accessible through secure backend database queries or protected internal admin routes. No public GET endpoint exists.
6. **Decoupled Architecture**: No database credentials or mailer keys are exposed to the browser client.

---

## 🚀 Production Deployment

### Backend Deployment (Laravel)
1. Deploy `/backend` to your PHP web server (Nginx/Apache or Forge/Vapor).
2. Set `APP_ENV=production` and `APP_DEBUG=false` in `/backend/.env`.
3. Set `FRONTEND_URL` to your production frontend domain (e.g. `https://mpgeventplanner.com`) for CORS.
4. Run `php artisan config:cache` and `php artisan route:cache`.

### Frontend Deployment (Next.js / Vercel)
1. Deploy the `/frontend` directory to Vercel or Node host.
2. Set `NEXT_PUBLIC_API_URL=https://api.mpgeventplanner.com` pointing to your Laravel API domain.
3. Set `NEXT_PUBLIC_SITE_URL=https://mpgeventplanner.com`.
