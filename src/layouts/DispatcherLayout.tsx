import { Outlet } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DispatcherLayout() {
    return (
        <div>
            <ProtectedRoute allowedRoles={['DISPATCHER']}>
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </ProtectedRoute>
        </div>
    )
}
