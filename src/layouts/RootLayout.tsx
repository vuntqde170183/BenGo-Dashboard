import { Outlet } from 'react-router-dom'
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider'
import { UserProvider } from '@/context/useUserContext'
import { ToastProvider } from '@/provider/ToastProvider'

export default function RootLayout() {
  return (
    <div className="bg-mainBackgroundV1 min-h-screen">
      <ReactQueryClientProvider>
        <UserProvider>
          <ToastProvider />
          <Outlet />
        </UserProvider>
      </ReactQueryClientProvider>
    </div>
  )
}






