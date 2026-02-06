import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import DispatcherLayout from "@/layouts/DispatcherLayout";

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages
const HomePage = lazy(() =>
  import("@/app/page").then((m) => ({ default: m.default })),
);
const NotFoundPage = lazy(() =>
  import("@/app/not-found").then((m) => ({ default: m.default })),
);

// Auth pages
const LoginPage = lazy(() =>
  import("@/app/admin/login/page").then((m) => ({ default: m.default })),
);

// Admin pages
const AdminDashboard = lazy(() =>
  import("@/app/admin/page").then((m) => ({ default: m.default })),
);
const AdminUsers = lazy(() =>
  import("@/app/admin/users/page").then((m) => ({ default: m.default })),
);
const AdminDrivers = lazy(() =>
  import("@/app/admin/drivers/page").then((m) => ({ default: m.default })),
);
const AdminOrders = lazy(() =>
  import("@/app/admin/orders/page").then((m) => ({ default: m.default })),
);
const AdminPricing = lazy(() =>
  import("@/app/admin/pricing/page").then((m) => ({ default: m.default })),
);
const AdminPromotions = lazy(() =>
  import("@/app/admin/promotions/page").then((m) => ({ default: m.default })),
);
const AdminTickets = lazy(() =>
  import("@/app/admin/tickets/page").then((m) => ({ default: m.default })),
);

// Dispatcher pages
const DispatcherDashboard = lazy(() =>
  import("@/app/dispatcher/page").then((m) => ({ default: m.default })),
);
const DispatcherOrders = lazy(() =>
  import("@/app/dispatcher/orders/page").then((m) => ({ default: m.default })),
);
const DispatcherDrivers = lazy(() =>
  import("@/app/dispatcher/drivers/page").then((m) => ({ default: m.default })),
);
const DispatcherAssignment = lazy(() =>
  import("@/app/dispatcher/assignment/page").then((m) => ({ default: m.default })),
);
const DispatcherSupport = lazy(() =>
  import("@/app/dispatcher/support/page").then((m) => ({ default: m.default })),
);
const DispatcherReports = lazy(() =>
  import("@/app/dispatcher/reports/page").then((m) => ({ default: m.default })),
);

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <SuspenseWrapper>
                <LoginPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "users",
            element: (
              <SuspenseWrapper>
                <AdminUsers />
              </SuspenseWrapper>
            ),
          },
          {
            path: "drivers",
            element: (
              <SuspenseWrapper>
                <AdminDrivers />
              </SuspenseWrapper>
            ),
          },
          {
            path: "orders",
            element: (
              <SuspenseWrapper>
                <AdminOrders />
              </SuspenseWrapper>
            ),
          },
          {
            path: "pricing",
            element: (
              <SuspenseWrapper>
                <AdminPricing />
              </SuspenseWrapper>
            ),
          },
          {
            path: "promotions",
            element: (
              <SuspenseWrapper>
                <AdminPromotions />
              </SuspenseWrapper>
            ),
          },
          {
            path: "tickets",
            element: (
              <SuspenseWrapper>
                <AdminTickets />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: "dispatcher",
        element: <DispatcherLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <DispatcherDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "orders",
            element: (
              <SuspenseWrapper>
                <DispatcherOrders />
              </SuspenseWrapper>
            ),
          },
          {
            path: "drivers",
            element: (
              <SuspenseWrapper>
                <DispatcherDrivers />
              </SuspenseWrapper>
            ),
          },
          {
            path: "assignment",
            element: (
              <SuspenseWrapper>
                <DispatcherAssignment />
              </SuspenseWrapper>
            ),
          },
          {
            path: "support",
            element: (
              <SuspenseWrapper>
                <DispatcherSupport />
              </SuspenseWrapper>
            ),
          },
          {
            path: "reports",
            element: (
              <SuspenseWrapper>
                <DispatcherReports />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);
