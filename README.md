# WiDigitale Admin Panel

An administrative portal and content management dashboard for managing **WiDigitale** services, courses, portfolio, applications, and site content. Built with **Vite**, **React 18**, **TypeScript**, **Tailwind CSS**, **dnd-kit**, **React Quill**, and **Radix UI**.

---

## 📌 Features

- **Dashboard & Analytics**: Overview of service applications, leads, course enrollments, and content metrics.
- **Drag-and-Drop Management**: Built-in drag-and-drop sorting for carousels, services, and portfolio items using **dnd-kit**.
- **WYSIWYG Rich Text Editor**: Integrated **React Quill** for editing blog posts, course descriptions, and update articles.
- **Service Applications Manager**: Review, filter, and track status of client service inquiries.
- **Media & Carousel Control**: Upload and organize hero banners, promotional videos, and partner logos.
- **Courses & Resources CMS**: Add and manage educational courses, downloadable assets, and pricing plans.

---

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Frontend Framework**: React 18, TypeScript
- **Drag-and-Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Rich Text Editing**: React Quill
- **Styling & Components**: Tailwind CSS, Radix UI Primitives, Lucide React
- **Form Validation**: React Hook Form, Zod
- **Data Fetching**: TanStack React Query v5
- **Charts**: Recharts

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x or higher)
- **npm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DipaGitHub/widigitale-admin-panel.git
   cd widigitale-admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   Create `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Development Server:
   ```bash
   npm run dev
   ```

5. Production Build:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy

This repository contains private administrative controls for WiDigitale.
