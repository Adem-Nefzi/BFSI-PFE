# Smart-Admin Copilot Dashboard

A production-ready, modern dashboard built with Next.js 15, TypeScript, shadcn/ui, and Tailwind CSS. Features a responsive design that works seamlessly across desktop, tablet, and mobile devices.

## Features

### Design System
- **Color Scheme**: Blue (#2563EB / #3B82F6) primary, Teal (#14B8A6) accent
- **Dark Mode Support**: Full light/dark mode with next-themes
- **Animation**: Smooth transitions and entrance animations using Tailwind CSS
- **Glassmorphism**: Modern glass-effect cards with backdrop blur
- **Gradient Effects**: Mesh gradients and animated background elements

### Layout Structure

#### Top Navigation Bar (Sticky)
- Logo with gradient text
- Search functionality with keyboard shortcut hint
- Notification bell with animated badge
- Theme toggle (Sun/Moon)
- User avatar with dropdown menu (Profile, Settings, Logout)
- Responsive: Full on desktop, icons-only on mobile

#### Sidebar Navigation
- Collapsible design (280px expanded, 80px collapsed)
- Navigation items with icons:
  - Dashboard
  - My Contracts
  - AI Assistant
  - Claims
  - Blockchain
  - Settings
- Active state highlighting
- Help & Support link
- Gradient "Upgrade Pro" button
- Tooltips on collapsed state
- Hidden on mobile (slides in as drawer)

#### Mobile Navigation
- Fixed bottom navigation bar
- 5 main items: Dashboard, Contracts, Chat, Claims, More
- Active item highlighting
- Touch-friendly targets

### Dashboard Page

#### Stats Cards Grid
4 responsive cards displaying:
1. **Total Contracts** - Number with monthly trend
2. **Active Policies** - With percentage badge
3. **Total Coverage** - In EUR currency
4. **Verified** - With 100% completion badge

Features:
- Hover effects with shadow elevation
- Gradient backgrounds
- Icon indicators
- Staggered animations on load
- Responsive: 4 columns (desktop), 2 (tablet), 1 (mobile)

#### Recent Contracts Table
- Columns: Name, Type, Date, Status, Actions
- 5 sample contracts with realistic data
- Status badges with color coding:
  - Active (Emerald)
  - Pending Review (Amber)
  - Expiring Soon (Red)
- Action dropdown menus
- Striped rows with hover effects
- Scrollable on small screens

#### Action Panel
- Alert-style card highlighting expiring contracts
- Call-to-action button for reviews
- Uses info colors for visibility

## Component Structure

```
components/
├── dashboard/
│   ├── TopNav.tsx      - Navigation bar with search & user menu
│   ├── Sidebar.tsx     - Collapsible sidebar navigation
│   └── MobileNav.tsx   - Mobile bottom navigation
└── ui/                 - shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── dropdown-menu.tsx
    ├── avatar.tsx
    ├── table.tsx
    ├── tooltip.tsx
    ├── input.tsx
    └── ... (40+ components)

app/
├── dashboard/
│   ├── layout.tsx      - Main dashboard layout
│   └── page.tsx        - Dashboard page with stats & table
└── globals.css         - Tailwind config & animations
```

## Responsive Design

### Desktop (≥ 1024px)
- Full sidebar visible
- 4-column stats grid
- All features enabled
- Full search bar

### Tablet (768px - 1023px)
- Sidebar as drawer
- 2-column stats grid
- Adjusted spacing and padding

### Mobile (< 768px)
- Hidden sidebar
- Bottom navigation bar
- 1-column layout
- Icon-only UI elements
- Larger touch targets

## Styling

### Colors
- **Primary**: Blue (#2563EB)
- **Secondary**: Teal (#14B8A6)
- **Accent**: Violet (#8B5CF6)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Destructive**: Red (#EF4444)
- **Background**: White/Slate-50 (light), Slate-950 (dark)

### Animations
- Fade-in on page load
- Staggered card animations
- Smooth hover transitions
- Pulse effects on background elements
- Slide-up entrance for content

### Typography
- **Headers**: Bold, gradient text
- **Body**: Regular weight, 14px base
- **Accent**: Semibold for emphasis
- **Muted**: Lighter color for secondary text

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Components**: shadcn/ui (45+ components)
- **Theme**: next-themes
- **Icons**: lucide-react
- **Form**: React Hook Form (ready to use)
- **Tables**: React-based table component
- **Animations**: Tailwind CSS + CSS keyframes

## Features Ready to Extend

1. **Dashboard Page** - Core analytics and recent items
2. **Contracts Management** - Full CRUD for contracts
3. **AI Assistant** - Chat interface for AI-powered insights
4. **Claims Management** - Claims tracking and processing
5. **Blockchain Verification** - Smart contract integration
6. **Settings** - User preferences and app configuration

## Usage

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000/dashboard` to see the dashboard.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Server-side rendering where possible
- Optimized component splitting
- CSS-in-JS through Tailwind (zero-runtime)
- Image optimization ready
- Font loading optimized

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Dark Mode

Theme toggle in top navigation automatically switches:
- Background colors
- Text colors
- Card styles
- Border colors
- Icon colors
- Badge styles

---

Built with ❤️ for Smart-Admin Copilot
