"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeSlash, Lock1 } from "iconsax-reactjs";
import { useLogin } from "@/hooks/useAuth";
import { useUser } from "@/context/useUserContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync: loginUser, isPending } = useLogin();
  const { loginUser: setUserContext, fetchUserProfile } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", loginResponse); // Debug log

      if (
        loginResponse?.statusCode === 200 &&
        loginResponse?.data?.accessToken
      ) {
        const token = loginResponse.data.accessToken;
        const role = loginResponse.data.user.role.toLowerCase();
        const userProfile = JSON.stringify(loginResponse);

        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userProfile", userProfile);

        setUserContext(loginResponse.data.user, token);

        try {
          await fetchUserProfile();
        } catch (err) {
          console.log("fetchUserProfile error (non-critical):", err);
        }

        toast.success(loginResponse?.message || "Login successful!");

        const redirectPath = `/${role}`;
        navigate(redirectPath);
      } else {
        toast.error("Login failed: Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

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
            className="p-8 relative overflow-hidden"
          >
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
                <p className="text-neutral-200 text-sm">
                  Sign in to access the BenGo admin dashboard
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs text-neutral-200 uppercase tracking-wide"
                  >
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isPending}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#41C651]"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs text-neutral-200 uppercase tracking-wide"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="border-0 border-b-2 border-gray-200 rounded-none px-0 pr-10 focus-visible:ring-0 focus-visible:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlash size="20" color="currentColor" />
                      ) : (
                        <Eye size="20" color="currentColor" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-start">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                </div>

                {/* Login Button */}
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <div className="text-xs flex items-center justify-center gap-2 text-neutral-200">
                    <Lock1 size="16" color="#7F8788" />
                    <span>
                      Secure admin access only · Contact support if you need
                      assistance
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
