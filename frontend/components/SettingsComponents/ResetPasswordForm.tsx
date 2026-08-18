"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/validators/auth";
import { authApi } from "@/lib/api/auth";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

const ResetPasswordForm = () => {
  const userId = useAppSelector((s) => s.auth.user?.id);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!userId) return;
      await authApi.changePassword(data);
      toast.success("Password updated successfully");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
      <div className="relative space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          Current Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showOld ? "text" : "password"}
            placeholder="••••••••"
            {...register("oldPassword")}
            className={`pl-11 pr-11 h-12 rounded-xl bg-background border-border transition-all focus-visible:ring-primary/20 ${errors.oldPassword ? "border-destructive ring-1 ring-destructive/10" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showOld ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.oldPassword && (
          <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-destructive uppercase flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3" /> {errors.oldPassword.message}
          </p>
        )}
      </div>

      <div className="relative space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            {...register("newPassword")}
            className={`pl-11 pr-11 h-12 rounded-xl bg-background border-border transition-all focus-visible:ring-primary/20 ${errors.newPassword ? "border-destructive ring-1 ring-destructive/10" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showNew ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-destructive uppercase flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3" /> {errors.newPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
