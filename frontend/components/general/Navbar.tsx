"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import {
  LogOut,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  User,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <header className="w-full border-b border-border bg-background">
      {" "}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {" "}
        {/* Brand */}{" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {" "}
            <Sparkles className="h-4 w-4" />{" "}
          </div>{" "}
          <div className="flex flex-col">
            {" "}
            <h1 className="text-xl font-black leading-none tracking-tighter text-foreground">
              {" "}
              HURRY{" "}
            </h1>{" "}
            <span className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              {" "}
              Booked your time{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right */}{" "}
        <div className="flex items-center gap-3">
          {" "}
          {/* Theme Toggle */}{" "}
          <button
            type="button"
            aria-label="Toggle theme"
            className="cursor-pointer rounded-xl p-2 transition hover:bg-muted"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {" "}
            {theme === "dark" ? <Sun /> : <Moon />}{" "}
          </button>{" "}
          {/* Profile */}{" "}
          <DropdownMenu>
            {" "}
            <DropdownMenuTrigger className="outline-none">
              {" "}
              <div className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-1.5 pl-3 transition hover:bg-muted">
                {" "}
                <div className="mr-1 hidden flex-col items-end md:flex">
                  {" "}
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <span className="text-sm font-black text-foreground">
                      {" "}
                      {user?.name}{" "}
                    </span>{" "}
                    <Badge className="h-4 border-none bg-primary/10 px-1.5 text-[9px] font-black uppercase tracking-tighter text-primary">
                      {" "}
                      Active{" "}
                    </Badge>{" "}
                  </div>{" "}
                  <span className="max-w-30 truncate text-[10px] font-bold text-muted-foreground">
                    {" "}
                    {user?.email}{" "}
                  </span>{" "}
                </div>{" "}
                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  {" "}
                  <AvatarFallback className="bg-primary text-[10px] font-black text-primary-foreground">
                    {" "}
                    <User />{" "}
                  </AvatarFallback>{" "}
                </Avatar>{" "}
                <ChevronDown className="mr-1 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />{" "}
              </div>{" "}
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-64 rounded-[1.8rem] border border-border p-2 shadow-lg"
            >
              {" "}
              <div className="mb-2 rounded-[1.4rem] bg-muted px-4 py-4">
                {" "}
                <p className="mb-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {" "}
                  <ShieldCheck className="h-3 w-3" /> Account Verified{" "}
                </p>{" "}
                <p className="truncate text-sm font-black text-foreground">
                  {" "}
                  {user?.name}{" "}
                </p>{" "}
                <p className="truncate text-xs text-muted-foreground">
                  {" "}
                  {user?.email}{" "}
                </p>{" "}
              </div>{" "}
              <DropdownMenuItem
                onClick={() => dispatch(logout())}
                className="group cursor-pointer rounded-xl py-3 text-destructive transition focus:bg-destructive/10"
              >
                {" "}
                <LogOut className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100" />{" "}
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                  {" "}
                  Logout{" "}
                </span>{" "}
              </DropdownMenuItem>{" "}
            </DropdownMenuContent>{" "}
          </DropdownMenu>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
};
export default Navbar;
