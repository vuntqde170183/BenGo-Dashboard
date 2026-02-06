## 6. Admin Dashboard Design (React + Vite)

### 6.1. Sidebar Navigation

**Position:** Fixed left sidebar (Width: 260px, Collapsible to 80px on mobile/toggle)

**Structure:**

```
┌─────────────────────────────┐
│ 🚚 BenGo Admin             │  ← Logo + Title (Clickable -> Dashboard)
├─────────────────────────────┤
│ 📊 Dashboard               │  ← Active state: Blue bg, White text
│ 👥 Quản lý người dùng         │
│ 🚗 Quản lý tài xế       │
│   ├─ Pending Approval      │  ← Sub-menu (indented)
│   └─ All Drivers           │
│ 📦 Orders                  │
│   ├─ All Orders            │
│   ├─ Pending               │
│   ├─ Active                │
│   └─ Completed             │
│ 💰 Financial               │
│   ├─ Pricing Config        │
│   └─ Revenue Reports       │
│ 🎁 Promotions              │
│ 🎫 Support Tickets         │
│ ⚙️ Settings                │
└─────────────────────────────┘
```

**Menu Items:**

1. **Dashboard** (Icon: 📊 Chart-Bar)

   - Route: `/dashboard`
   - Description: Overview & key metrics

2. **Quản lý người dùng** (Icon: 👥 Users)

   - Route: `/users`
   - Description: View all users with filters
   - **Page Features:**
     - Filter/Tab: `All` | `Customers` | `Drivers` | `Admin` | `Blocked`
     - Search by name, phone, email
     - Actions: View, Edit, Block/Unblock, Delete

3. **Quản lý tài xế** (Icon: 🚗 Car)

   - **Pending Approval** → `/drivers/pending` (Badge with count)
     - Quick approve/reject actions
   - **All Drivers** → `/drivers`
     - **Page Features:**
       - Filter/Tab: `Active` | `Offline` | `Blocked`
       - Real-time online status indicators
       - Search, sort by rating

4. **Orders** (Icon: 📦 Box)

   - **All Orders** → `/orders`
     - Filter/Tab: `All` | `Pending` | `Active` | `Completed` | `Cancelled`
   - **Pending** → `/orders/pending` (Badge, quick access)
   - **Active** → `/orders/active` (Real-time tracking)
   - **Completed** → `/orders/completed`

5. **Financial** (Icon: 💰 Dollar-Sign)

   - **Pricing Config** → `/pricing` (CRUD for vehicle pricing)
   - **Revenue Reports** → `/reports` (Charts & export)

6. **Promotions** (Icon: 🎁 Gift)

   - Route: `/promotions`
   - Description: Create/Edit discount codes
   - Filter: Active promotions vs Expired

7. **Support Tickets** (Icon: 🎫 Ticket)

   - Route: `/tickets`
   - **Page Features:**
     - Filter/Tab: `Open` | `In Progress` | `Resolved` | `Closed`
     - Filter by Priority: High, Medium, Low
     - Search by ticket ID or customer name

8. **Settings** (Icon: ⚙️ Gear)
   - **Profile** → `/settings/profile`
   - **System Config** → `/settings/system`

**Sidebar Footer:**

- `Admin Avatar` + Name (Small)
- `Logout Button` (Red text, Icon: Exit)

---

### 6.2. Header (Top Bar)

**Position:** Fixed top bar (Height: 64px, Shadow)

**Layout (Left to Right):**

```
┌──────────────────────────────────────────────────────────────┐
│ [☰ Menu Toggle]  BenGo Admin  [🔍 Search] [🔔 Notifications] [👤 Profile] │
└──────────────────────────────────────────────────────────────┘
```

**Components:**

1. **Menu Toggle Button** (Left-most, Icon: Hamburger ☰)

   - Function: Collapse/Expand Sidebar (Mobile/Desktop)
   - Style: Ghost button, hover effect

2. **Page Title/Breadcrumb** (Left, after toggle)

   - Dynamic text showing current page (e.g., "Dashboard", "Quản lý người dùng > All Users")
   - Style: Font bold, 18px

3. **Global Search Bar** (Center)

   - Input: "Search users, orders, tickets..." (Width: 400px)
   - Icon: 🔍 Magnifying glass (Inside input, left)
   - Function: Opens modal with quick search results (Users, Orders, Drivers)
   - Shortcut: Press `/` to focus

4. **Notifications Button** (Right side, Icon: 🔔 Bell)

   - Red Badge: Count of unread notifications
   - Dropdown: Recent notifications (max 5)
     - "Driver #123 needs approval"
     - "New order #4567"
     - "Support ticket #89 escalated"
   - Link: "View All Notifications" at bottom

5. **Profile Dropdown** (Right-most, Avatar + Name)
   - Avatar: Circle image (40x40)
   - Name: "Admin Nguyen" (Small text below avatar on desktop)
   - Dropdown Menu:
     - `View Profile` (Icon: User)
     - `Settings` (Icon: Gear)
     - Divider
     - `Logout` (Icon: Exit, Red text)

---

### 6.3. Dashboard Home Page (Statistics Overview)

**Route:** `/dashboard`

**Layout:** Grid-based responsive layout (Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`)

---

#### Section 1: **Key Metrics Cards** (Top Row)

**Grid:** 4 columns on desktop, stack on mobile

**Card Components:**

1. **Total Users Card**

   - **Icon:** 👥 (Blue circle background)
   - **Number:** Large text (e.g., "2,547")
   - **Label:** "Total Users"
   - **Sub-text:** "+12% from last month" (Green, up arrow ↑)
   - **Route:** Click → `/users`

2. **Active Orders Card**

   - **Icon:** 📦 (Orange background)
   - **Number:** "132"
   - **Label:** "Active Orders"
   - **Sub-text:** "15 pending assignment" (Yellow dot)
   - **Route:** Click → `/orders/active`

3. **Active Drivers Card**

   - **Icon:** 🚗 (Green background)
   - **Number:** "89"
   - **Label:** "Drivers Online"
   - **Sub-text:** "Out of 245 total" (Grey text)
   - **Route:** Click → `/drivers/active`

4. **Revenue Today Card**
   - **Icon:** 💰 (Purple background)
   - **Number:** "18,540,000đ"
   - **Label:** "Revenue Today"
   - **Sub-text:** "Target: 20M" (Progress bar 90%)
   - **Route:** Click → `/reports`

---

#### Section 2: **Charts Row** (Middle)

**Grid:** 2 columns (8 cols + 4 cols on desktop)

1. **Revenue Chart (Left, wider - 8 cols)**

   - **Title:** "Revenue Overview" + Dropdown filter (Today | This Week | This Month | Custom)
   - **Chart Type:** Line Chart or Area Chart
   - **X-Axis:** Date/Time
   - **Y-Axis:** Revenue (VND)
   - **Lines:**
     - Total Revenue (Blue line)
     - Cash Payments (Green dashed)
     - Wallet Payments (Orange dashed)
   - **Library:** Recharts `<LineChart>` or `<AreaChart>`

2. **Order Status Distribution (Right, 4 cols)**
   - **Title:** "Orders by Status"
   - **Chart Type:** Donut/Pie Chart
   - **Segments:**
     - Pending (Yellow, 15%)
     - Active (Blue, 25%)
     - Completed (Green, 55%)
     - Cancelled (Red, 5%)
   - **Center:** Total count "1,245"
   - **Library:** Recharts `<PieChart>`

---

#### Section 3: **Tables Row** (Bottom)

**Grid:** 2 columns (6 cols + 6 cols)

1. **Recent Orders Table (Left)**

   - **Title:** "Recent Orders" + "View All" link
   - **Columns:**
     - Order ID (Link, blue)
     - Customer Name
     - Driver Name
     - Status (Badge: color-coded)
     - Price (VND format)
     - Time (Relative: "5 min ago")
   - **Rows:** Last 5 orders
   - **Actions:** Click row → `/orders/:id` (Order detail modal/page)
   - **Empty State:** "No recent orders" with icon

2. **Pending Driver Approvals (Right)**
   - **Title:** "Driver Approvals Needed" + Badge count
   - **Columns:**
     - Driver Name + Avatar
     - Vehicle Type (Icon + Text)
     - Applied Date
     - Actions: [✅ Approve] [❌ Reject] buttons
   - **Rows:** Top 5 pending
   - **Empty State:** "All drivers approved! 🎉"

---

#### Section 4: **Support Tickets Widget** (Bottom, Full Width)

**Grid:** Full width (12 cols)

- **Title:** "Open Support Tickets" + Badge count
- **Layout:** Horizontal scrollable cards (Mobile) or Table (Desktop)
- **Card/Row Content:**
  - Ticket ID (Link)
  - Customer Name + Avatar
  - Subject (First 50 chars...)
  - Priority Badge (High: Red, Medium: Orange, Low: Grey)
  - Status (Open, In Progress)
  - Assigned To (Dispatcher name or "Unassigned")
  - Action Buttons: [Assign] [View Details]
- **Rows:** Max 5
- **"View All" Button:** → `/tickets`

---

### 6.4. Design Principles

**Colors:**

- **Primary:** Blue (#3B82F6) - For action buttons, active states
- **Success:** Green (#10B981) - Completed, Approved
- **Warning:** Yellow/Orange (#F59E0B) - Pending, Warnings
- **Danger:** Red (#EF4444) - Cancelled, Rejected, Delete
- **Grey Scale:** Neutral backgrounds, borders, text

**Typography:**

- **Headings:** Inter or Roboto, Bold
- **Body:** Inter or Roboto, Regular
- **Numbers:** Tabular Nums for alignment

**Spacing:**

- Use consistent Tailwind spacing scale (4px base: p-4, gap-4, etc.)

**Shadows:**

- Cards: `shadow-sm` (subtle)
- Dropdowns: `shadow-lg` (prominent)

**Animations:**

- Hover states: Smooth transition (200ms)
- Loading states: Skeleton loaders or spinners
- Page transitions: Fade in (300ms)

**Responsive:**

- Mobile: Stack all cards, collapsible sidebar (drawer)
- Tablet: 2-column grid
- Desktop: Full 4-column grid with sidebar

---

### 6.5. Additional Pages (Quick Reference)

1. **Quản lý người dùng Page** (`/users`)

   - Data Table with filters (Role, Status, Search)
   - Actions: View, Block, Delete
   - Modal: Chi tiết người dùng (Edit form)

2. **Driver Approval Page** (`/drivers/pending`)

   - Card-based layout showing driver info + documents
   - Image viewer for license photos
   - Approve/Reject actions with reason input

3. **Order Details Modal/Page** (`/orders/:id`)

   - Map showing route
   - Timeline of order status updates
   - Customer & Driver info cards
   - Action: Force Cancel (Admin override)

4. **Pricing Config Page** (`/pricing`)

   - Form with inputs for each vehicle type (BIKE, VAN, TRUCK)
   - Base Price, Per KM, Peak Hour Multiplier
   - Save button → API call

5. **Promotions Page** (`/promotions`)

   - Table with filters (Active, Expired)
   - Create/Edit modal with form:
     - Code, Title, Description
     - Discount Type (Percentage/Fixed)
     - Start/End dates
     - Usage limit

6. **Support Tickets Page** (`/tickets`)
   - Kanban board view or Table
   - Filters: Status, Priority
   - Assign to dispatcher dropdown
   - Update status (Open → In Progress → Resolved)

---
