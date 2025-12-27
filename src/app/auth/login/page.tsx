"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeSlash, Lock1 } from 'iconsax-reactjs';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("roseannepark@gmail.com")
  const [password, setPassword] = useState("password123")

  return (
    <div className="min-h-screen flex items-center overflow-y-hidden justify-center bg-[#001110] p-4 relative overflow-hidden w-full">
      {/* Background decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600 rounded-full blur-3xl opacity-40" />

      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="grid lg:grid-cols-2">
          {/* Left Panel - Welcome Section */}
          <div 
          style={{
            backgroundImage: "url('/images/login-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="p-8 relative overflow-hidden">
            <div className="absolute top-20 right-0 w-64 h-64 bg-teal-400 rounded-full opacity-40 blur-2xl" />
          </div>

          {/* Right Form */}
          <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
            <div className="max-w-md mx-auto w-full space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent uppercase">
                  Admin Portal
                </h2>
                <p className="text-gray-500 text-sm">
                  Sign in to access the BenGo admin dashboard
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-gray-500 uppercase tracking-wide">
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#41C651]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs text-gray-500 uppercase tracking-wide">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-0 border-b-2 border-gray-200 rounded-none px-0 pr-10 focus-visible:ring-0 focus-visible:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlash size="20" color="currentColor" /> : <Eye size="20" color="currentColor" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-secondary transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full"
                >
                  Sign In to Dashboard
                </Button>

                {/* Security Notice */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <div className="text-xs flex items-center gap-2">
                    <Lock1 size="16" color="#7F8788"/>
                    <span>Secure admin access only · Contact support if you need assistance</span> 
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
