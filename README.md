# Groupify AI 🎯

**Groupify AI** adalah aplikasi web modern yang dirancang untuk membantu pembagian kelompok secara otomatis dan cerdas menggunakan AI (Google Gemini).

## ✨ Fitur Utama

- **Pembagian Kelompok Otomatis**: Buat kelompok secara acak atau berdasarkan kriteria tertentu
- **Smart Balance**: AI akan membagi kelompok secara seimbang berdasarkan skill, gender, atau karakteristik lain
- **Pemilihan Ketua Otomatis**: Pilih ketua kelompok secara acak atau manual
- **Nama Kelompok Kreatif**: Generate nama kelompok unik dengan AI
- **Ice Breaker Generator**: Saran kegiatan ice breaker untuk kelompok
- **Export Multi-Format**: Export hasil ke PDF, TXT, atau CSV
- **Drag & Drop**: Edit kelompok dengan mudah menggunakan drag and drop
- **Responsive Design**: Tampilan optimal di desktop maupun mobile

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.5 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui + Radix UI
- **AI**: Google Gemini 2.0 Flash / OpenAI GPT (configurable)
- **Database**: Prisma ORM + PostgreSQL (Supabase)
- **Real-time**: Socket.IO untuk collaborative features
- **PDF Generation**: html2pdf.js
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js (opsional)
- **TypeScript**: Full type safety
- **Build Tool**: Vite (untuk development custom server)
- **Linting**: ESLint
- **Testing**: Jest + React Testing Library (opsional)

## 📦 Instalasi

### Prasyarat Sistem

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** versi 18.0 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** atau **yarn** package manager
- **Git** untuk cloning repository
- **PostgreSQL** database (untuk production, gunakan Supabase)
- **Google Gemini API Key** ([Dapatkan di sini](https://makersuite.google.com/app/apikey))

### 1. Clone Repository

```bash
git clone <repository-url>
cd Spinner
```

### 2. Install Dependencies

```bash
npm install
```

Atau jika menggunakan yarn:

```bash
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root directory project dan isi dengan konfigurasi berikut:

```env
# Google Gemini AI (Required)
GOOGLE_GEMINI_API_KEY="your-gemini-api-key-here"

# Database (Optional - untuk penyimpanan data)
DATABASE_URL="postgresql://postgres:your-password@your-project.supabase.co:5432/postgres"

# Supabase (Optional - untuk authentication dan real-time features)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"

# NextAuth (Optional - untuk authentication)
NEXTAUTH_SECRET="generate-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Catatan**: Untuk development lokal, Anda bisa menggunakan SQLite dengan mengubah `DATABASE_URL` ke:

```
DATABASE_URL="file:./dev.db"
```

Dan update `prisma/schema.prisma` datasource ke:

```
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 4. Setup Database

#### Menggunakan Supabase (Recommended untuk Production)

1. Kunjungi [Supabase](https://supabase.com) dan buat project baru
2. Copy Database URL dari Settings > Database
3. Copy Supabase URL dan Anon Key dari Settings > API
4. Paste ke `.env.local`

#### Menggunakan Local PostgreSQL

```bash
# Install PostgreSQL jika belum ada
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS dengan Homebrew:
brew install postgresql
brew services start postgresql

# Windows: Download dari postgresql.org

# Buat database baru
createdb groupify_ai

# Update DATABASE_URL di .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/groupify_ai"
```

#### Setup Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database
npm run db:push

# (Opsional) Jalankan migration
npm run db:migrate
```

### 5. Jalankan Development Server

#### Mode Standard (Next.js Built-in)

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

#### Mode Custom Server (dengan Socket.IO)

Untuk fitur real-time seperti collaborative editing:

```bash
npm run dev:custom
```

Server akan berjalan di [http://localhost:3000](http://localhost:3000) dengan Socket.IO di `ws://localhost:3000/api/socketio`

### 6. Verifikasi Instalasi

1. Buka browser dan akses [http://localhost:3000](http://localhost:3000)
2. Coba buat kelompok baru
3. Test fitur AI (generate nama kelompok, ice breakers)
4. Test export PDF

Jika ada error, lihat bagian [Troubleshooting](#-troubleshooting) di bawah.

## 🏗️ Build untuk Production

```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

## 📁 Struktur Folder

```
Spinner/
├── prisma/
│   ├── schema.prisma          # Database schema dan model
│   └── custom.db              # SQLite database (development)
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
├── scripts/                   # Utility scripts
│   └── translate-list.ts      # Translation utilities
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── generate-icebreakers/
│   │   │   ├── generate-team-names/
│   │   │   ├── health/
│   │   │   └── smart-balance/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Homepage
│   ├── components/           # React Components
│   │   ├── app/             # App-specific components
│   │   │   ├── AIToolsTab.tsx
│   │   │   ├── CreateGroupsTab.tsx
│   │   │   ├── ResultsTab.tsx
│   │   │   └── ...
│   │   ├── ui/              # Shadcn UI components
│   │   └── Spinner.tsx      # Main spinner component
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── lib/                 # Utility functions
│       ├── db.ts            # Database utilities
│       ├── gemini.ts        # Gemini AI integration
│       ├── socket.ts        # Socket.IO setup
│       ├── translations.ts  # Translation utilities
│       └── utils.ts         # General utilities
├── examples/                 # Example implementations
│   └── websocket/
│       └── page.tsx
├── server.ts                 # Custom server with Socket.IO
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies dan scripts
└── README.md
```

## 🌐 API Routes

Aplikasi ini menyediakan beberapa API endpoints untuk integrasi AI dan fungsionalitas utama:

### AI-Powered Endpoints

- `POST /api/generate-team-names` - Generate nama kelompok kreatif menggunakan Gemini AI
- `POST /api/generate-icebreakers` - Generate saran ice breaker activities
- `POST /api/smart-balance` - AI-powered group balancing berdasarkan kriteria

### Utility Endpoints

- `GET /api/health` - Health check endpoint untuk monitoring

### Real-time Features

- `WebSocket /api/socketio` - Socket.IO endpoint untuk collaborative editing dan real-time updates

### Contoh Penggunaan API

```javascript
// Generate nama kelompok
const response = await fetch("/api/generate-team-names", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ theme: "tech", count: 5 }),
});

// Smart balance groups
const balanceResponse = await fetch("/api/smart-balance", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    members: ["Alice", "Bob", "Charlie"],
    criteria: ["skill", "gender"],
  }),
});
```

## 📝 Cara Penggunaan

````

## 🔧 Available Scripts

- `npm run dev` - Jalankan development server (Next.js built-in)
- `npm run dev:custom` - Jalankan custom server dengan Socket.IO untuk real-time features
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Jalankan production server (Next.js built-in)
- `npm run start:custom` - Jalankan custom production server dengan Socket.IO
- `npm run lint` - Jalankan ESLint untuk code quality check
- `npm run db:generate` - Generate Prisma Client dari schema
- `npm run db:push` - Push database schema ke database (tanpa migration)
- `npm run db:migrate` - Jalankan database migration
- `npm run db:reset` - Reset database dan jalankan semua migration dari awal

## 🌐 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Manual Deployment

1. Build aplikasi: `npm run build`
2. Upload folder `.next`, `public`, `node_modules`, dan `package.json`
3. Set environment variables
4. Jalankan: `npm start`

## 🔑 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_PROVIDER` | AI provider to use: "gemini" or "openai" | `gemini` |
| `GOOGLE_GEMINI_API_KEY` | API key untuk Google Gemini AI | `AIzaSy...` |
| `OPENAI_API_KEY` | API key untuk OpenAI (opsional) | `sk-...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string untuk database | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `NEXTAUTH_SECRET` | Secret key untuk NextAuth.js | `random-string-32-chars` |
| `NEXTAUTH_URL` | Base URL aplikasi | `http://localhost:3000` |

### Mendapatkan API Keys

#### Google Gemini API Key

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy API key dan paste ke environment variables

#### Supabase Setup

1. Kunjungi [Supabase](https://supabase.com)
2. Buat project baru
3. Copy Database URL dari Settings > Database
4. Copy Supabase URL dan Anon Key dari Settings > API
5. Paste ke environment variables

## 🌐 API Routes

Aplikasi ini menyediakan beberapa API endpoints untuk integrasi AI dan fungsionalitas utama:

### AI-Powered Endpoints

- `POST /api/generate-team-names` - Generate nama kelompok kreatif menggunakan Gemini AI
- `POST /api/generate-icebreakers` - Generate saran ice breaker activities
- `POST /api/smart-balance` - AI-powered group balancing berdasarkan kriteria

### Utility Endpoints

- `GET /api/health` - Health check endpoint untuk monitoring

### Real-time Features

- `WebSocket /api/socketio` - Socket.IO endpoint untuk collaborative editing dan real-time updates

### Contoh Penggunaan API

```javascript
// Generate nama kelompok
const response = await fetch('/api/generate-team-names', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ theme: 'tech', count: 5 })
});

// Smart balance groups
const balanceResponse = await fetch('/api/smart-balance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    members: ['Alice', 'Bob', 'Charlie'],
    criteria: ['skill', 'gender']
  })
});
````

## 🧪 Testing AI Connection

### Test Gemini AI

```bash
# Test koneksi Gemini (default)
curl http://localhost:3000/api/test-ai

# Atau dengan browser: http://localhost:3000/api/test-ai
```

### Test OpenAI

1. **Setup environment variables** untuk OpenAI:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key-here
```

2. **Test koneksi OpenAI**:

```bash
curl "http://localhost:3000/api/test-ai?provider=openai"
```

### Test dengan Custom Prompt

```bash
curl -X POST http://localhost:3000/api/test-ai \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai", "prompt": "Say hello in Indonesian"}'
```

### Expected Response

**Success**:

```json
{
  "success": true,
  "message": "✅ OPENAI API connected successfully",
  "provider": "openai"
}
```

**Error**:

```json
{
  "success": false,
  "message": "❌ OPENAI API connection failed: API key missing",
  "provider": "openai"
}
```

### Build Errors

#### "Unable to find element in cloned iframe"

**Penyebab**: CSS menggunakan format warna yang tidak didukung oleh html2pdf.js

**Solusi**: Pastikan semua CSS menggunakan warna hex (bukan oklch atau format lain)

```css
/* ❌ Salah */
color: oklch(0.5 0.2 240);

/* ✅ Benar */
color: #3b82f6;
```

#### TypeScript Errors

**Solusi**:

```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix common issues
npm run lint
```

### Runtime Errors

#### "Gemini API Error"

**Penyebab**: API key invalid, quota habis, atau koneksi bermasalah

**Solusi**:

- Pastikan `GOOGLE_GEMINI_API_KEY` valid dan aktif
- Check quota API di [Google AI Studio](https://makersuite.google.com/app/apikey)
- Pastikan koneksi internet stabil
- Coba regenerate API key jika diperlukan

#### "Prisma Client not generated"

**Solusi**:

```bash
npm run db:generate
```

#### Socket.IO Connection Failed

**Penyebab**: Custom server tidak berjalan atau port conflict

**Solusi**:

- Gunakan `npm run dev:custom` untuk development
- Pastikan port 3000 tidak digunakan aplikasi lain
- Check firewall settings untuk WebSocket connections

### Database Issues

#### "Database connection error"

**Solusi**:

- Verify `DATABASE_URL` di `.env.local`
- Pastikan Supabase project aktif
- Untuk local PostgreSQL, pastikan service running
- Jalankan `npm run db:push` untuk sync schema

#### "Migration failed"

**Solusi**:

```bash
# Reset database
npm run db:reset

# Atau push schema tanpa migration
npm run db:push
```

### Development Issues

#### Hot Reload tidak bekerja

**Penyebab**: Custom server configuration

**Solusi**: Gunakan `npm run dev:custom` untuk development dengan Socket.IO, atau `npm run dev` untuk standard Next.js development

#### Port already in use

**Solusi**:

```bash
# Kill process on port 3000
npx kill-port 3000

# Atau gunakan port lain
PORT=3001 npm run dev
```

### Performance Issues

#### Slow PDF Generation

**Solusi**: Optimalkan CSS dan reduce image sizes dalam PDF template

#### High Memory Usage

**Solusi**: Monitor dengan Chrome DevTools, optimize React components dengan React.memo

### Deployment Issues

#### Vercel Build Failed

**Solusi**:

- Pastikan semua dependencies ter-install
- Check build logs di Vercel dashboard
- Pastikan environment variables diset dengan benar
- Untuk custom server, gunakan build script yang sesuai

#### Environment Variables not working

**Solusi**: Pastikan variables diset di Vercel dashboard, bukan di `.env.local` untuk production

### Common Development Tips

- Selalu jalankan `npm run lint` sebelum commit
- Test PDF export di berbagai browser
- Monitor API quota usage
- Backup database sebelum major changes
- Use `npm run dev:custom` untuk full feature testing

## 📄 License

MIT License - Feel free to use for any purpose

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. **Code Style**: Ikuti ESLint configuration yang sudah ada
2. **TypeScript**: Gunakan strict typing untuk semua components
3. **Testing**: Tambahkan tests untuk fitur baru
4. **Documentation**: Update README untuk perubahan signifikan
5. **Commits**: Gunakan conventional commits

### Branch Strategy

- `main` - Production ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Pull Request Process

1. Fork repository
2. Create feature branch dari `develop`
3. Commit changes dengan conventional commits
4. Push ke branch Anda
5. Create Pull Request ke `develop`
6. Wait for review dan approval

### Code Quality

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Format code (jika menggunakan Prettier)
npx prettier --write .
```

## 📊 Performance

### Bundle Size

- **Main Bundle**: ~150KB (gzipped)
- **Vendor Bundle**: ~200KB (gzipped)
- **Total**: ~350KB (gzipped)

### Lighthouse Scores (Target)

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

## 🔒 Security

- API keys disimpan di environment variables
- Input validation menggunakan Zod
- Rate limiting untuk AI API calls
- HTTPS enforced di production
- CSP headers untuk security

## 📈 Roadmap

### Version 1.1.0

- [ ] User authentication dengan NextAuth.js
- [ ] Save groups ke database
- [ ] Collaborative group editing
- [ ] Advanced AI features

### Version 1.2.0

- [ ] Mobile app dengan React Native
- [ ] Integration dengan Google Classroom
- [ ] Advanced analytics dashboard

### Future Features

- [ ] Multi-language support
- [ ] Plugin system untuk custom AI models
- [ ] Integration dengan LMS platforms

## 📋 Changelog

### Version 1.0.0 (Current)

- ✅ Pembagian kelompok otomatis dan manual
- ✅ Smart balance dengan AI
- ✅ Generate nama kelompok kreatif
- ✅ Ice breaker suggestions
- ✅ Drag & drop group editing
- ✅ Export ke PDF, TXT, CSV
- ✅ Responsive design
- ✅ Real-time collaboration dengan Socket.IO
- ✅ Custom server setup

### Version 0.9.0 (Beta)

- ✅ Basic group creation
- ✅ PDF export functionality
- ✅ Google Gemini AI integration
- ✅ Basic UI dengan Tailwind CSS

## 📧 Support

Untuk pertanyaan atau dukungan, silakan buat issue di GitHub repository.

### Community

- **GitHub Issues**: Laporkan bugs dan request features
- **GitHub Discussions**: Diskusi umum dan Q&A
- **Email**: Contact maintainer untuk support premium

---

**Dibuat dengan ❤️ menggunakan Next.js dan Google Gemini AI**
