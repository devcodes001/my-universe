# 🌌 Our Universe — Couple Journal

A private, beautiful web application for couples to capture memories, write letters to their future selves, and celebrate their love story.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwindcss)

## ✨ Features

- **🔐 Authentication** — Secure login & registration with NextAuth
- **💫 Memory Timeline** — Capture moments with photos, moods, and categories
- **💌 Letters to Future** — Write sealed letters that open on a specific date
- **👫 Couple Pairing** — Link accounts via partner email
- **📷 Image Uploads** — Upload photos via Cloudinary
- **🎨 Cosmic UI** — Beautiful dark theme with animations (Framer Motion)
- **📱 Responsive** — Works perfectly on mobile and desktop

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- [Cloudinary](https://cloudinary.com/) account (free tier works)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd universe
npm install
```

### 2. Set Up Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/our-universe
NEXTAUTH_SECRET=generate-a-random-secret-string
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> **Tip:** Generate a secret with `openssl rand -base64 32`

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add your environment variables in Vercel's dashboard
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g., `https://our-universe.vercel.app`)
5. Deploy!

## 📁 Project Structure

```
universe/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js   # NextAuth config
│   │   ├── register/route.js             # Registration
│   │   ├── memories/route.js             # Memory CRUD
│   │   ├── letters/route.js              # Letters CRUD
│   │   └── upload/route.js               # Image uploads
│   ├── auth/
│   │   ├── login/page.js                 # Login page
│   │   └── register/page.js              # Register page
│   ├── dashboard/page.js                 # Dashboard
│   ├── memories/page.js                  # Memory timeline
│   ├── letters/page.js                   # Letters page
│   ├── layout.js                         # Root layout
│   ├── page.js                           # Landing page
│   └── globals.css                       # Global styles
├── components/
│   ├── AuthProvider.js
│   ├── Navbar.js
│   ├── StarField.js
│   ├── LandingPage.js
│   ├── MemoryCard.js
│   ├── AddMemoryForm.js
│   ├── LetterCard.js
│   └── LetterForm.js
├── lib/
│   └── db.js                             # MongoDB connection
├── models/
│   ├── User.js
│   ├── Memory.js
│   └── Letter.js
├── middleware.js                          # Auth middleware
└── .env.example                          # Environment template
```

## 🛠 Tech Stack

| Technology     | Purpose              |
|---------------|----------------------|
| Next.js 15    | Full-stack framework |
| TailwindCSS 4 | Styling              |
| Framer Motion | Animations           |
| NextAuth      | Authentication       |
| MongoDB       | Database             |
| Mongoose      | ODM                  |
| Cloudinary    | Image storage        |

## ❤️ Made with love for couples everywhere
# my-universe
