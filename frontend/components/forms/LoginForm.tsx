"use client";

import { useState } from "react";
import { loginSchema, LoginUserFormData } from "@/lib/validators/auth";
import { useAppDispatch } from "@/redux/hooks";
import { loginUserThunk } from "@/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

import Link from "next/link";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      await dispatch(loginUserThunk(data)).unwrap();

      toast.success("Welcome back!");

      router.push("/dashboard");
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Invalid credentials";

      toast.error("Login Failed");

      setError("email", {
        message,
      });

      setError("password", {
        message,
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background Decorative Elements */}

      <div className="absolute top-[-10%] left-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border-border bg-card shadow-2xl">
        {/* Top Accent */}

        <div className="absolute left-0 top-0 h-1.5 w-full bg-linear-to-r from-primary/20 via-primary to-primary/20" />

        <CardHeader className="space-y-2 pt-10 text-center">
          <CardTitle className="text-3xl font-black tracking-tight">
            Welcome Back
          </CardTitle>

          <CardDescription className="font-medium">
            Enter your details to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Email */}

            <div className="relative space-y-1.5">
              <Label
                htmlFor="email"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
              >
                Email Address
              </Label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={`h-12 rounded-xl border-none bg-muted pl-11 placeholder:text-muted-foreground/50 ${
                    errors.email
                      ? "ring-2 ring-destructive/20"
                      : "focus-visible:ring-2 focus-visible:ring-primary/20"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] font-bold uppercase text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}

            <div className="relative space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  Password
                </Label>

                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-black uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-12 rounded-xl border-none bg-muted pl-11 pr-11 placeholder:text-muted-foreground/50 ${
                    errors.password
                      ? "ring-2 ring-destructive/20"
                      : "focus-visible:ring-2 focus-visible:ring-primary/20"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] font-bold uppercase text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-14 w-full cursor-pointer rounded-2xl text-base font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </form>

          {/* Divider */}

          <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-border" />

            <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              New Here?
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Register */}

          <Button
            variant="link"
            className="h-auto w-full cursor-pointer p-0 font-bold hover:no-underline"
            onClick={() => router.push("/auth/register")}
          >
            Create your business account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
