"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterUserFormData } from "@/lib/validators/auth";
import { useAppDispatch } from "@/redux/hooks";
import { registerUserThunk } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterUserFormData) => {
    try {
      setLoading(true);
      setServerError("");

      await dispatch(registerUserThunk(data)).unwrap();

      router.push("/");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>

            <input
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
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
            <p className="text-center text-sm text-red-500">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}
