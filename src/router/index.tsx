import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import RootLayout from '@/layouts/RootLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AdminLayout from '@/layouts/AdminLayout'

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

// Lazy load pages - wrapping imports to re-export default
const HomePage = lazy(() => import('@/app/page').then(m => ({ default: m.default })))
const NotFoundPage = lazy(() => import('@/app/not-found').then(m => ({ default: m.default })))

// Auth pages
const LoginPage = lazy(() => import('@/app/auth/login/page').then(m => ({ default: m.default })))
const RegisterPage = lazy(() => import('@/app/auth/register/page').then(m => ({ default: m.default })))
const ForgotPasswordPage = lazy(() => import('@/app/auth/forgot-password/page').then(m => ({ default: m.default })))
const ResetPasswordPage = lazy(() => import('@/app/auth/reset-password/page').then(m => ({ default: m.default })))

// Admin pages
const AdminDashboard = lazy(() => import('@/app/admin/page').then(m => ({ default: m.default })))
const AdminUsers = lazy(() => import('@/app/admin/users/page').then(m => ({ default: m.default })))

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
          },
          {
            path: 'register',
            element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
          },
          {
            path: 'forgot-password',
            element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
          },
          {
            path: 'reset-password',
            element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>,
          },
          {
            path: 'users',
            element: <SuspenseWrapper><AdminUsers /></SuspenseWrapper>,
          },
         
        ],
      },
    ],
  },
])






