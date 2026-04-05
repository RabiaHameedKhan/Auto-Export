# Auto Export Vehicle Website — Full-Stack Development Prompt
## Next.js 14 (App Router) + PostgreSQL + Tailwind CSS

---

## 🎯 Project Overview

Build a **professional used vehicle export business website** — a B2B/B2C platform for an auto export company that sources vehicles (used and brand-new) and ships them internationally. The platform includes a **public-facing storefront** with advanced vehicle search, detailed listing pages, and buyer-flow pages, plus a **secure admin panel** for full inventory and content management.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#0c47a5` (deep blue) |
| Secondary | `#e6d53c` (golden yellow) |
| White | `#ffffff` |
| Black | `#0a0a0a` |
| Light Gray | `#f5f5f5` |
| Border | `#e0e0e0` |
| Text Muted | `#6b7280` |

**Design Philosophy:** Clean, minimal, and professional. Think automotive industry confidence — generous whitespace, sharp typography (Inter or Geist font), subtle card shadows, no clutter. The primary blue anchors trust; the yellow accent signals CTAs and highlights.

---

## 🗂️ Tech Stack

- **Framework:** Next.js 14 with App Router and Server Components
- **Database:** PostgreSQL (via `pg` or `Drizzle ORM` / `Prisma`)
- **Auth:** NextAuth.js (admin-only, credentials provider)
- **Styling:** Tailwind CSS with custom theme tokens
- **Image Storage:** Local filesystem or Cloudinary (multi-image upload per vehicle)
- **State:** React Server Components + `useState`/`useReducer` for client filters
- **Forms:** React Hook Form + Zod validation
- **Deployment-ready:** Environment variables for DB, auth secret, image host

---

## 🗄️ PostgreSQL Database Schema

```sql
-- Makes (brands)
CREATE TABLE makes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Models
CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  make_id INT REFERENCES makes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Body Types
CREATE TABLE body_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Vehicles (core inventory table)
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  stock_number VARCHAR(50) UNIQUE,
  make_id INT REFERENCES makes(id),
  model_id INT REFERENCES models(id),
  body_type_id INT REFERENCES body_types(id),
  title VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  month INT,
  price NUMERIC(12,2) NOT NULL,
  mileage INT,
  fuel_type VARCHAR(50),       -- Diesel, Petrol, Electric, LPG, CNG
  transmission VARCHAR(50),    -- Automatic, Manual, Automanual
  steering VARCHAR(20),        -- Left, Right
  engine_cc INT,
  color VARCHAR(50),
  drive_type VARCHAR(10),      -- 2WD, 4WD
  condition VARCHAR(20) DEFAULT 'used',  -- used | brand_new
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_clearance BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Images
CREATE TABLE vehicle_images (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

-- Vehicle Features / Options (checkboxes)
CREATE TABLE vehicle_features (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
  feature VARCHAR(100) NOT NULL  -- e.g. "Sunroof", "ABS", "Airbag"
);

-- Quote / Lead Inquiries
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  country VARCHAR(100),
  destination_port VARCHAR(100),
  message TEXT,
  status VARCHAR(30) DEFAULT 'new',  -- new | read | replied | closed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Announcements / Banners
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(100),
  role VARCHAR(30) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📁 Project Structure

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  ← Homepage
│   │   ├── search/page.tsx           ← Used Cars search listing
│   │   ├── brand-new/page.tsx        ← Brand New listing
│   │   ├── car/[id]/page.tsx         ← Vehicle detail page
│   │   ├── brand/[slug]/page.tsx     ← Browse by make
│   │   ├── model/[slug]/page.tsx     ← Browse by model
│   │   ├── car-type/[slug]/page.tsx  ← Browse by body type
│   │   ├── by-price/[min]/[max]/page.tsx
│   │   ├── price-under/[max]/page.tsx
│   │   ├── price-over/[min]/page.tsx
│   │   ├── all-new-arrival/page.tsx
│   │   ├── all-clearance/page.tsx
│   │   ├── how-to-buy/page.tsx
│   │   ├── why-choose-us/page.tsx
│   │   ├── bank-details/page.tsx
│   │   └── contact/page.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx              ← Dashboard
│   │   │   ├── vehicles/
│   │   │   │   ├── page.tsx          ← All vehicles list
│   │   │   │   ├── new/page.tsx      ← Add vehicle
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── inquiries/page.tsx
│   │   │   ├── makes/page.tsx
│   │   │   ├── models/page.tsx
│   │   │   ├── body-types/page.tsx
│   │   │   ├── announcements/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── login/page.tsx
│   └── api/
│       ├── vehicles/route.ts
│       ├── vehicles/[id]/route.ts
│       ├── inquiries/route.ts
│       ├── makes/route.ts
│       └── admin/[...nextauth]/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── TopBar.tsx               ← Live car count + clock
│   │   └── MobileMenu.tsx
│   ├── vehicle/
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleGrid.tsx
│   │   ├── VehicleImageGallery.tsx
│   │   ├── VehicleSpecTable.tsx
│   │   └── VehicleFeatureBadges.tsx
│   ├── search/
│   │   ├── SearchBar.tsx            ← Hero search (quick filters)
│   │   ├── AdvancedFilters.tsx      ← Full expanded filter panel
│   │   ├── FilterSidebar.tsx        ← Left sidebar on listing pages
│   │   └── SortDropdown.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── NewArrivalsSection.tsx
│   │   ├── ShopByMake.tsx
│   │   ├── ShopByModel.tsx
│   │   ├── ShopByPrice.tsx
│   │   ├── ShopByType.tsx
│   │   ├── AnnouncementBanner.tsx
│   │   └── PromoBanners.tsx
│   ├── forms/
│   │   ├── QuoteForm.tsx
│   │   └── ContactForm.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── StatsCard.tsx
│       ├── VehicleForm.tsx
│       ├── ImageUploader.tsx
│       └── DataTable.tsx
├── lib/
│   ├── db.ts                        ← PostgreSQL connection pool
│   ├── queries/
│   │   ├── vehicles.ts
│   │   ├── makes.ts
│   │   └── inquiries.ts
│   └── utils.ts
└── types/
    └── index.ts
```

---

## 🌐 PUBLIC PAGES — Detailed Requirements

### 1. Homepage (`/`)

**Top Bar (above navbar):**
- Live counter: "Total Cars: [X]" | "Cars Added Today: [X]" | Real-time clock (HH:MM:SS am/pm)
- Fetched via API route, refreshed every minute on client

**Navbar:**
- Logo (left)
- Used Cars (with mega-dropdown: Search by Make, Search by Type, Search by Price)
- Brand New
- Why Choose Us
- How to Buy
- Bank Details
- Phone numbers (WhatsApp links)
- Language selector (visual only, or integrate Google Translate widget)
- Mobile: hamburger menu with slide-in drawer

**Announcement Banner:**
- Full-width dismissible banner (fetched from DB) for important notices (e.g., currency fluctuations, shipping updates)
- Styled with yellow (`#e6d53c`) background, dark text

**Hero Section:**
- Full-width image/banner (uploadable from admin)
- Overlaid search form with these quick fields:
  - Make (dropdown)
  - Model (dynamic dropdown, filtered by make)
  - Transmission
  - Fuel Type
  - Body Type
  - Year From / Year To (with month selectors)
  - Min/Max Price (range slider or dropdowns: $1k – $50k)
  - Min/Max Mileage
  - "Show More Options" toggle revealing: Wheel Drive (2WD/4WD), Sort By, Steering, Color checkboxes, Feature checkboxes (Sunroof, ABS, Airbag, Leather Seat, Navigation, Back Camera, etc.)
  - Large "Search" button in primary blue

**New Arrivals Section:**
- Horizontal scrollable or grid of latest 6–12 vehicle cards
- "See All" link → `/all-new-arrival`

**Body Type Sections:**
- Separate sections for: Standard Cab, Double Cab, Smart Cab, Brand New
- Each shows 4–6 vehicle cards + "See All" link

**Shop By Make:**
- Grid of brand logo cards with vehicle count badges
- Clicking navigates to `/brand/[slug]`

**Shop By Model:**
- List/grid with model name + count, linking to `/model/[slug]`

**Shop By Price:**
- Clickable price range tiles (Under $8k, $8k–$12k, etc.)

**Shop By Type:**
- Body type tiles with icons and counts

**Other Categories:**
- Quick links: Petrol, Diesel, Electric, LHD, RHD, Manual, Automatic

**Promotional Banners:**
- Static or admin-configurable image banners (Ford Pickups, Hiace, Fortuner, etc.) linked to relevant searches

**Footer:**
- Logo + company address + phone numbers + email
- Columns: By Make, By Price, By Type
- Social media icons (Facebook, YouTube, Instagram)
- Copyright notice

---

### 2. Search / Listing Pages

**Routes:**
- `/search` — All used cars
- `/brand-new` — Brand new vehicles
- `/brand/[slug]` — By make
- `/model/[slug]` — By model
- `/car-type/[slug]` — By body type
- `/by-price/[min]/[max]` — Price range
- `/price-under/[max]` — Under max price
- `/price-over/[min]` — Over min price
- `/all-new-arrival` — Latest additions
- `/all-clearance` — Clearance stock

**URL Query Parameters for filtering (all combinable):**
`?make_id=&model_id=&body_type=&fuel=&steering=&transmission=&min_price=&max_price=&min_mileage=&max_mileage=&min_year=&max_year=&color=&drive=&features=&sort=&page=`

**Layout:**
- Left sidebar with filter panel (collapsible on mobile)
- Main area: vehicle cards grid (2–3 columns desktop, 1–2 mobile)
- Breadcrumb navigation
- Page heading: e.g., "Toyota Vehicles (121 found)"
- Sort dropdown: Price Low–High, Price High–Low, Year Old–New, Year New–Old, Mileage Low–High, Mileage High–Low
- Pagination (server-side, 20 per page)

**Vehicle Card:**
- Primary thumbnail image
- Title: "YEAR MAKE MODEL TRIM"
- Price in USD (bold, primary blue)
- Key specs pills: Body Type | Transmission | Mileage | Year | Fuel
- "Get Quote" button (opens modal or links to detail page quote section)
- Hover: subtle card lift shadow

---

### 3. Vehicle Detail Page (`/car/[id]`)

**Image Gallery:**
- Main large image with thumbnail strip below
- Click thumbnail → swap main image
- Keyboard navigable
- Total image count badge

**Vehicle Header:**
- Full title
- Stock number
- Price (large, prominent)
- Condition badge (Used / Brand New)

**Specification Table:**
Two-column table with all specs:
- Make / Model / Year / Month
- Body Type / Drive Type
- Transmission / Steering
- Fuel Type / Engine CC / Color
- Mileage / Stock No.

**Features Section:**
- Grid of feature badges (checkmarks): ABS, Airbag, Sunroof, Navigation, Back Camera, etc.

**Description:**
- Rich text / paragraph description

**Get Quote / Buy Now Form:**
- Prominent CTA panel (sticky sidebar on desktop):
  - Name, Email, Phone, Country, Destination Port, Message
  - "Send Inquiry" button
  - WhatsApp quick contact button
- On submit: saves to `inquiries` table + optional email notification

**How to Buy Summary:**
- 5-step process shown below the form (mini version)

**Related Vehicles:**
- 4–6 cards of same make/type

---

### 4. How to Buy (`/how-to-buy`)

Step-by-step visual guide with images and text:
1. **Order** — Choose vehicle, use search engine
2. **Buy Now** — Set destination country and port, click Buy Now
3. **Make Payment** — Bank Wire Transfer (TT) or PayPal
4. **Shipment** — Track your shipment
5. **Customs Clearance** — Complete customs process at destination port

---

### 5. Why Choose Us (`/why-choose-us`)

Static content page with admin-editable rich text:
- Experienced in exporting to global markets
- High-quality inspected vehicles
- Transparent pricing and fast delivery
- Friendly multilingual support
- Trusted by dealers and private buyers worldwide

---

### 6. Bank Details (`/bank-details`)

Admin-managed page displaying:
- Bank name, account name, account number, SWIFT/BIC, branch
- PayPal option note
- Security warning about email hackers / fake websites

---

## 🛠️ ADMIN PANEL — Detailed Requirements

**Access:** `/admin` — protected by NextAuth session (credentials: email + password)

---

### Admin Dashboard (`/admin`)

**Stats Cards (real-time from DB):**
- Total Vehicles in Stock
- Vehicles Added Today
- Total Inquiries (unread count badge)
- New Arrivals This Week
- Brand New vs. Used counts

**Quick Actions:**
- Add New Vehicle button
- View Unread Inquiries button

**Recent Activity:**
- Last 5 vehicles added (with thumbnail)
- Last 5 inquiries received

---

### Vehicle Management (`/admin/vehicles`)

**List View:**
- Searchable, filterable data table
- Columns: Thumbnail | Stock # | Title | Year | Price | Condition | Status | Actions
- Filters: Make, Body Type, Condition, Active/Inactive
- Bulk actions: Activate, Deactivate, Delete
- Sort by any column
- Pagination (50 per page)

**Add / Edit Vehicle Form (`/admin/vehicles/new` and `/admin/vehicles/[id]/edit`):**

Section 1 — Basic Info:
- Stock Number (auto-generated or manual)
- Condition: Used / Brand New toggle
- Make (dropdown, from makes table)
- Model (dynamic dropdown, filtered by make)
- Body Type (dropdown)
- Year (dropdown: 1950–current+1)
- Month (1–12)
- Title (auto-generated from make/model/year or manual override)

Section 2 — Pricing & Specs:
- Price (USD)
- Mileage (km)
- Fuel Type (multi-select: Diesel, Petrol, Electric, LPG, CNG)
- Transmission (Automatic, Manual, Automanual)
- Steering (Left, Right)
- Engine CC (dropdown: 700cc – 4000cc+)
- Color (dropdown: White, Silver, Grey, Black, Red, Blue, Dark Grey, Orange, Other)
- Drive Type (2WD, 4WD)

Section 3 — Features (checkbox grid):
- CD Player, Sunroof, Leather Seat, Alloy Wheels, Power Steering, Power Window, A/C, ABS, Airbag, AM/FM Radio, DVD, TV, Navigation, Power Seat, Back Camera, Push Start, Keyless Entry, Turbo, Fog Lights, Central Locking, Side Airbag, Non-Smoker, Body Kit, Spare Tire, Grill Guard, and more

Section 4 — Images:
- Multi-image upload (drag-and-drop)
- Image reordering (drag to sort)
- Set primary/thumbnail image
- Delete individual images
- Preview grid

Section 5 — Description:
- Rich text editor (e.g., `react-quill` or `tiptap`)

Section 6 — Visibility:
- Is Active (toggle)
- Is Featured (toggle)
- Is Clearance (toggle)

**Save as Draft / Publish buttons**

---

### Inquiry Management (`/admin/inquiries`)

- Data table: Name | Vehicle | Country | Phone | Email | Date | Status
- Status filter: New, Read, Replied, Closed
- Click row → expand details inline or modal
- Mark as read, update status, delete
- Export to CSV

---

### Makes Management (`/admin/makes`)

- CRUD table: Add/Edit/Delete brands
- Fields: Name, Slug, Logo upload, Active toggle
- Logo preview in table

---

### Models Management (`/admin/models`)

- CRUD table: Add/Edit/Delete models
- Fields: Make (dropdown), Name, Slug, Active toggle
- Filter models by make

---

### Body Types Management (`/admin/body-types`)

- CRUD table: Add/Edit/Delete body types
- Fields: Name, Slug

---

### Announcements (`/admin/announcements`)

- Add/edit/delete site-wide announcements
- Fields: Title, Content (rich text), Active toggle, Scheduled from/until dates
- Preview of how it appears on frontend

---

### Site Settings (`/admin/settings`)

- Company Name
- Phone Numbers (multiple)
- WhatsApp Numbers (multiple)
- Email Address
- Physical Address
- Social Media Links (Facebook, YouTube, Instagram)
- Hero Banner image upload
- Promotional banner images (with link targets)
- "Cars per page" setting
- Bank Details content (rich text)
- Why Choose Us content (rich text)
- SEO: Meta title, meta description templates
- Security Notice text

---

## 🔍 Advanced Search Engine Logic

**Query builder in PostgreSQL:**
```sql
SELECT v.*, m.name as make_name, mo.name as model_name, bt.name as body_type_name,
  (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as thumbnail
FROM vehicles v
JOIN makes m ON v.make_id = m.id
JOIN models mo ON v.model_id = mo.id  
LEFT JOIN body_types bt ON v.body_type_id = bt.id
WHERE v.is_active = true
  AND ($1::int IS NULL OR v.make_id = $1)
  AND ($2::int IS NULL OR v.model_id = $2)
  AND ($3::int IS NULL OR v.body_type_id = $3)
  AND ($4::varchar IS NULL OR v.fuel_type = $4)
  AND ($5::varchar IS NULL OR v.steering = $5)
  AND ($6::varchar IS NULL OR v.transmission = $6)
  AND ($7::numeric IS NULL OR v.price >= $7)
  AND ($8::numeric IS NULL OR v.price <= $8)
  AND ($9::int IS NULL OR v.year >= $9)
  AND ($10::int IS NULL OR v.year <= $10)
  AND ($11::int IS NULL OR v.mileage >= $11)
  AND ($12::int IS NULL OR v.mileage <= $12)
  AND ($13::varchar IS NULL OR v.color = $13)
  AND ($14::varchar IS NULL OR v.drive_type = $14)
  AND ($15::varchar IS NULL OR v.condition = $15)
ORDER BY [dynamic sort]
LIMIT 20 OFFSET [page * 20];
```

**Feature filtering:** Uses a subquery checking `vehicle_features` table for each requested feature.

**Live count in navbar/topbar:** `SELECT COUNT(*) FROM vehicles WHERE is_active = true` and `SELECT COUNT(*) FROM vehicles WHERE created_at::date = CURRENT_DATE`

---

## 🎨 UI Component Specifications

### Color Application Rules
- **Primary blue `#0c47a5`:** Navbar background, primary CTA buttons, active filter tags, links on hover, admin sidebar
- **Secondary yellow `#e6d53c`:** Announcement banners, "New" / "Featured" badges, price highlight accents, hover states on secondary buttons, CTA button accents
- **White:** Page backgrounds, card backgrounds, input fields
- **Black/Near-black:** Body text, headings
- **Light gray `#f5f5f5`:** Sidebar backgrounds, table rows alternating, input backgrounds

### Typography
- Font: `Inter` (Google Fonts) or `Geist` (Next.js default)
- Headings: 600–700 weight
- Body: 400 weight, 16px base
- Car titles: uppercase, tracking-wide

### Spacing
- Consistent 8px grid
- Cards: 16–24px padding
- Sections: 48–80px vertical padding

### Buttons
- Primary: `bg-[#0c47a5] text-white hover:bg-[#0a3d91]` with subtle shadow
- Secondary: `border-2 border-[#0c47a5] text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white`
- CTA / Accent: `bg-[#e6d53c] text-black hover:bg-[#d4c235]`
- Rounded: `rounded-lg` (8px)

### Cards
- `bg-white rounded-xl shadow-sm border border-[#e0e0e0] hover:shadow-md transition-shadow`
- Image at top (aspect-ratio: 16/9 or 4/3, `object-cover`)
- Content padding: 12–16px

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile < 768px | Single column, hamburger nav, stacked filters |
| Tablet 768–1024px | 2-column grid, collapsible sidebar |
| Desktop > 1024px | 3-column grid, persistent sidebar, full navbar |

---

## 🔒 Security & Auth

- Admin routes protected via NextAuth middleware (`matcher: ['/admin/:path*']`)
- Passwords hashed with `bcrypt`
- CSRF protection via NextAuth
- Image uploads: validate mime type, size limit (10MB per image)
- Rate limiting on inquiry form (e.g., 5 requests/IP/hour)
- Input sanitization on all user-facing forms

---

## 🚀 Performance Optimizations

- Next.js Image component for all vehicle images (`next/image`)
- Server Components for listing pages (no client JS for initial render)
- ISR (Incremental Static Regeneration) on vehicle detail pages (`revalidate: 300`)
- PostgreSQL connection pooling
- Lazy load images below fold
- Skeleton loaders on filter interactions

---

## 📧 Inquiry / Quote Flow

1. User clicks "Get Quote" on any vehicle card or detail page
2. Modal or inline form appears with fields: Name, Email, Phone, Country, Destination Port, Message
3. On submit: `POST /api/inquiries` — saves to DB, returns success
4. Admin sees unread count badge in admin panel
5. Admin can reply via email (link opens email client) or mark status

---

## 🌍 Multi-language Support (Optional Enhancement)

- Integrate Google Translate widget in navbar (as existing site does)
- Or implement `next-intl` for proper i18n with language switcher

---

## 📋 Static Content Pages

### How to Buy — 5 Steps
Render as a visually rich step-by-step page with numbered steps, icons/images, and descriptions. Content managed from admin settings.

### Why Choose Us
Marketing content with icon+text feature blocks. Admin-editable.

### Bank Details
Payment instructions — Bank Wire Transfer (Telegraphic Transfer) and PayPal option. Admin-editable. Include security warning about impersonation.

---

## ✅ Feature Checklist Summary

### Public Frontend
- [x] Top bar with live car counter and clock
- [x] Multi-level navigation with mega dropdown
- [x] Announcement/notice banner (dismissible)
- [x] Hero search with quick and advanced filters
- [x] Browse by Make / Model / Body Type / Price Range
- [x] New Arrivals section
- [x] Clearance section
- [x] Brand New vehicle section
- [x] Vehicle grid listing with pagination and sort
- [x] Advanced URL-based filter system (bookmarkable)
- [x] Vehicle detail page with image gallery
- [x] Specification table
- [x] Feature badges
- [x] Get Quote / Inquiry form (per vehicle)
- [x] How to Buy page (5-step guide)
- [x] Why Choose Us page
- [x] Bank Details page
- [x] Footer with full navigation + social links
- [x] WhatsApp click-to-chat links
- [x] Mobile-responsive design

### Admin Panel
- [x] Secure login (NextAuth credentials)
- [x] Dashboard with stats and activity feed
- [x] Full vehicle CRUD with multi-image upload
- [x] Image reordering and primary image selection
- [x] Feature checkbox management per vehicle
- [x] Rich text description editor
- [x] Makes management (with logo upload)
- [x] Models management (linked to makes)
- [x] Body types management
- [x] Inquiry inbox with status management
- [x] Announcement management
- [x] Site settings (phones, addresses, social links)
- [x] Banner image management
- [x] Bulk vehicle actions (activate/deactivate/delete)
- [x] Export inquiries to CSV
- [x] Searchable/filterable data tables

---

## 🏁 Development Phases

**Phase 1 — Foundation**
Database schema, Next.js setup, Tailwind config, PostgreSQL connection, NextAuth admin login, layout components (Navbar, Footer, TopBar)

**Phase 2 — Core Public Pages**
Homepage, Search listing with filters, Vehicle detail page, URL-based filter system

**Phase 3 — Admin Panel**
Dashboard, Vehicle CRUD with image upload, Makes/Models/Body Types CRUD

**Phase 4 — Inquiry System**
Quote forms, Inquiry inbox, Email notifications

**Phase 5 — Static Pages & Polish**
How to Buy, Why Choose Us, Bank Details, Announcements, SEO meta, Performance optimization, Mobile polish

**Phase 6 — Admin Settings & Content Management**
Site Settings panel, Banner management, Rich text pages, Final QA

---

*This prompt covers all functionality observed on horizonvehiclesthailand.com plus enhanced admin capabilities. Build it clean, fast, and professional.*
