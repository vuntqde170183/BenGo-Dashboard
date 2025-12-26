import React from 'react'
import './globals.css'
import './font.css'
import { ToastProvider } from '@/provider/ToastProvider'
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider'
import { UserProvider } from '@/context/useUserContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-mainBackgroundV1 min-h-screen">
        <ReactQueryClientProvider>
          <UserProvider>
            <ToastProvider />
            {children}
          </UserProvider>
        </ReactQueryClientProvider>
    </div>
  )
}






