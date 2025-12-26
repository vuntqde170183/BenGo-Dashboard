import { Outlet, useLocation } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function AdminLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/admin/auth/login'

  return (
    <div>
      {isLoginPage ? (
        <Outlet />
      ) : (
        <ProtectedRoute>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </ProtectedRoute>
      )}
    </div>
  )
}






