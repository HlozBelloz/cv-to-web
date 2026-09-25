# CVtoWeb — Automated Executive CV-to-Website Platform

**CVtoWeb** is a high-converting, executive-grade portfolio generation SaaS that converts uploaded PDF CVs into customized, modern portfolio websites with dynamic subpaths (`/cv/username`), custom domain support, tiered pricing in Egyptian Pounds (EGP), Egyptian payment gateway integration (Paymob), and isolated role-based admin controls.

---

## 🚀 Key Features

- **Automated AI CV Extraction**: Converts PDF resumes into structured executive portfolio websites.
- **Candidate Executive Portfolio**: Demonstrates quantified achievements, technical milestones, skill taxonomy, and 1-click PDF download (e.g. `/cv/mazen`).
- **Dynamic EGP Monetization**: Base pricing set to 100 EGP, dynamically modifiable on-the-fly in the Admin Portal.
- **Paymob Egyptian Payment Rails**: Supports Vodafone Cash, InstaPay, Meeza, and Card payments (running in test/mock mode for verification).
- **Strict Role-Based Access Control**:
  - SuperAdmin Gateway: `/admin/login` & `/admin`
  - Candidate Dashboard: `/login` & `/dashboard`
- **100% Free Cloud Edge Hosting**: Engineered for Cloudflare Pages with edge CDN caching and free automated SSL.

---

## ☁️ Deployment on Cloudflare Pages

1. Navigate to **Cloudflare Dashboard** → **Compute (Workers & Pages)** → **Pages** → **Connect to Git**.
2. Select repository: `HlozBelloz/cv-to-web`.
3. Set Build Settings:
   - **Framework preset**: `None` (or `Next.js`)
   - **Build command**: `npx @opennextjs/cloudflare build`
   - **Build output directory**: `.open-next/assets`
   - **Root directory**: `/`
4. Under **Environment variables (advanced)**, add:
   - `NODE_VERSION` = `20`
5. Click **Save and Deploy**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the live site.
