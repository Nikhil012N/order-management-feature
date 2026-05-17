# FoodFlow - Order Management System

A modern, real-time order management platform built with Next.js 16, featuring a customer portal for menu browsing and order placement, plus an admin dashboard for live order tracking and store operations management.

## Features

### Customer Portal
- **Visual Menu Browser** - Browse menu items with category filtering
- **Interactive Shopping Cart** - Add/remove items with quantity controls
- **Real-time Order Tracking** - Track order status with live updates
- **Mobile-Optimized Experience** - Responsive design with mobile basket drawer
- **Secure Checkout** - Form validation with React Hook Form and Zod

### Admin Dashboard
- **Live Order Feed** - Real-time polling for order updates (every 5 seconds)
- **Order Status Management** - Update order statuses through the workflow
- **Analytics Dashboard** - Track total orders, active queue, in-progress orders, and revenue
- **Order Filtering** - Filter orders by status (pending, confirmed, preparing, ready, delivered)
- **Executive Metrics** - Visual stats cards with hover effects

## Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI (Dropdown Menu, Toast, Slot)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Theme**: next-themes (dark mode support)
- **Testing**: Vitest + React Testing Library
- **Language**: TypeScript 5

## Installation

### Prerequisites
- Node.js 20+ 
- Bun, npm, yarn, or pnpm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Nikhil012N/order-management-feature
cd order-management-system
```

2. Install dependencies:
```bash
bun install
# or
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
bun run dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Customer Portal
1. Navigate to `/customer` to browse the menu
2. Add items to your basket using the +/- buttons
3. Click "Proceed to Checkout" to place your order
4. Fill in delivery details and submit
5. Track your order at `/customer/orders`

### Admin Dashboard
1. Navigate to `/admin` to access the management hub
2. View real-time order statistics
3. Filter orders by status using the tabs
4. Update order statuses using the dropdown on each order card
5. Monitor the live feed indicator for real-time updates

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard page
│   ├── api/             # API routes
│   │   ├── customers/   # Customer management endpoints
│   │   ├── menu/        # Menu item endpoints
│   │   └── orders/      # Order CRUD endpoints
│   ├── customer/        # Customer portal pages
│   │   ├── orders/      # Order tracking page
│   │   └── page.tsx     # Menu browsing page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/
│   ├── admin-order-card.tsx  # Admin order management card
│   ├── menu-browser.tsx      # Menu browsing component
│   ├── order-card.tsx        # Customer order display card
│   ├── order-form.tsx        # Checkout form component
│   └── ui/                   # Reusable UI components
├── hooks/
│   └── use-api.ts            # Custom API hook with polling
└── lib/
    ├── data-store.ts         # In-memory data store
    ├── types.ts              # TypeScript type definitions
    └── utils.ts              # Utility functions
```

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all menu items

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `PATCH /api/orders/:id` - Update order status
- `GET /api/orders/:id` - Get specific order details

### Customers
- `GET /api/customers` - Get all customers

## Testing

Run the test suite:
```bash
bun run test
# or
npm test
```

The project includes:
- Component tests (`__tests__/components.test.tsx`)
- API route tests (`__tests__/api-routes.test.ts`)
- Data store tests (`__tests__/data-store.test.ts`)

## Build & Deployment

### Build for production:
```bash
bun run build
# or
npm run build
```

### Start production server:
```bash
bun run start
# or
npm start
```

### Deploy on Vercel
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Order Status Workflow

Orders progress through these stages:
1. **Pending** - Order received from customer
2. **Confirmed** - Order confirmed by restaurant
3. **Preparing** - Order is being prepared
4. **Ready** - Order is out for delivery
5. **Delivered** - Order successfully delivered
6. **Cancelled** - Order cancelled (if needed)

## Key Features

### Real-time Updates
- Admin dashboard polls for order updates every 5 seconds
- Live feed indicator shows connection status
- Automatic order refresh on status changes

### Responsive Design
- Mobile-optimized basket with slide-up drawer
- Responsive grid layouts for all screen sizes
- Touch-friendly controls for mobile devices

### Data Persistence
- In-memory data store (can be replaced with database)
- Type-safe data structures with TypeScript
- Comprehensive error handling

## Development

### Linting
```bash
bun run lint
# or
npm run lint
```

### Code Style
- ESLint with Next.js config
- TypeScript strict mode
- Prettier recommended for formatting

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication
- Payment gateway integration
- Email/SMS notifications
- Advanced analytics dashboard
- Multi-restaurant support
- Real-time WebSocket updates

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
