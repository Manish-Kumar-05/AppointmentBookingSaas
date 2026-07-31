"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginUserFormData } from "@/lib/validators/auth";

import { useAppDispatch } from "@/redux/hooks";
import { loginUserThunk } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      setLoading(true);
      setServerError("");

      await dispatch(loginUserThunk(data)).unwrap();

      router.push("/dashboard");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || error?.message || "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>

            <input
              type="password"
              {...register("password")}
              placeholder="******"
              className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-center text-red-500 text-sm">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/auth/register")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}
