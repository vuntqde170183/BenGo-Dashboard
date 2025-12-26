import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import RootLayout from '@/layouts/RootLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AdminLayout from '@/layouts/AdminLayout'
import StudentLayout from '@/layouts/StudentLayout'
import CoordinatorLayout from '@/layouts/CoordinatorLayout'

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
const AdminTopics = lazy(() => import('@/app/admin/topics/page').then(m => ({ default: m.default })))
const AdminDepartments = lazy(() => import('@/app/admin/departments/page').then(m => ({ default: m.default })))
const AdminEvents = lazy(() => import('@/app/admin/events/page').then(m => ({ default: m.default })))
const AdminScholarships = lazy(() => import('@/app/admin/scholarships/page').then(m => ({ default: m.default })))
const AdminDataset = lazy(() => import('@/app/admin/dataset/page').then(m => ({ default: m.default })))
const AdminChat = lazy(() => import('@/app/admin/chat/page').then(m => ({ default: m.default })))
const AdminMessages = lazy(() => import('@/app/admin/messages/page').then(m => ({ default: m.default })))
const AdminNotifications = lazy(() => import('@/app/admin/notifications/page').then(m => ({ default: m.default })))

// Student pages
const StudentDashboard = lazy(() => import('@/app/student/page').then(m => ({ default: m.default })))
const StudentEvents = lazy(() => import('@/app/student/events/page').then(m => ({ default: m.default })))
const StudentScholarships = lazy(() => import('@/app/student/scholarships/page').then(m => ({ default: m.default })))
const StudentChat = lazy(() => import('@/app/student/chat/page').then(m => ({ default: m.default })))
const StudentNotifications = lazy(() => import('@/app/student/notifications/page').then(m => ({ default: m.default })))

// Coordinator pages
const CoordinatorDepartment = lazy(() => import('@/app/coordinator/[department]/page').then(m => ({ default: m.default })))

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
          {
            path: 'topics',
            element: <SuspenseWrapper><AdminTopics /></SuspenseWrapper>,
          },
          {
            path: 'departments',
            element: <SuspenseWrapper><AdminDepartments /></SuspenseWrapper>,
          },
          {
            path: 'events',
            element: <SuspenseWrapper><AdminEvents /></SuspenseWrapper>,
          },
          {
            path: 'scholarships',
            element: <SuspenseWrapper><AdminScholarships /></SuspenseWrapper>,
          },
          {
            path: 'dataset',
            element: <SuspenseWrapper><AdminDataset /></SuspenseWrapper>,
          },
          {
            path: 'chat',
            element: <SuspenseWrapper><AdminChat /></SuspenseWrapper>,
          },
          {
            path: 'messages',
            element: <SuspenseWrapper><AdminMessages /></SuspenseWrapper>,
          },
          {
            path: 'notifications',
            element: <SuspenseWrapper><AdminNotifications /></SuspenseWrapper>,
          },
        ],
      },
      {
        path: 'student',
        element: <StudentLayout />,
        children: [
          {
            index: true,
            element: <SuspenseWrapper><StudentDashboard /></SuspenseWrapper>,
          },
          {
            path: 'events',
            element: <SuspenseWrapper><StudentEvents /></SuspenseWrapper>,
          },
          {
            path: 'scholarships',
            element: <SuspenseWrapper><StudentScholarships /></SuspenseWrapper>,
          },
          {
            path: 'chat',
            element: <SuspenseWrapper><StudentChat /></SuspenseWrapper>,
          },
          {
            path: 'notifications',
            element: <SuspenseWrapper><StudentNotifications /></SuspenseWrapper>,
          },
        ],
      },
      {
        path: 'coordinator',
        element: <CoordinatorLayout />,
        children: [
          {
            path: ':department',
            element: <SuspenseWrapper><CoordinatorDepartment /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },
])






