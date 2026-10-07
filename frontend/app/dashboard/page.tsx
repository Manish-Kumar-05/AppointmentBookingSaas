"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  Rocket,
  Users,
  BriefcaseBusiness,
  Building2,
  AlertCircle,
} from "lucide-react";
import { format, formatDistanceToNow, isFuture, isToday } from "date-fns";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBookings } from "@/redux/slices/bookingSlice";
import { fetchServices } from "@/redux/slices/serviceSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    organizations,
    currentOrgId,
    isLoading: organizationsLoading,
  } = useAppSelector((state) => state.org);
  const { bookings } = useAppSelector((state) => state.booking);
  const { services } = useAppSelector((state) => state.service);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  /* * ------------------------------------------------------------ * Current organization * ------------------------------------------------------------ */ const currentOrganization =
    useMemo(() => {
      return organizations.find((org) => org.id === currentOrgId);
    }, [organizations, currentOrgId]);
  /* * ------------------------------------------------------------ * Fetch dashboard data * ------------------------------------------------------------ */ useEffect(() => {
    if (!currentOrgId) return;
    let mounted = true;
    const loadDashboard = async () => {
      try {
        if (mounted) {
          setIsLoadingDashboard(true);
        }
        await Promise.all([
          dispatch(fetchServices(currentOrgId)).unwrap(),
          dispatch(fetchBookings(currentOrgId)).unwrap(),
        ]);
      } catch (error) {
        console.error("Dashboard loading error:", error);
        toast.error("Could not load dashboard data");
      } finally {
        if (mounted) {
          setIsLoadingDashboard(false);
        }
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [currentOrgId, dispatch]);
  /* * ------------------------------------------------------------ * Dashboard calculations * ------------------------------------------------------------ */ const activeServices =
    useMemo(() => {
      return services.filter((service) => service.isActive);
    }, [services]);
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        if (booking.status === "CANCELLED") return false;
        return isFuture(new Date(booking.startTime));
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }, [bookings]);
  const todayBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (booking.status === "CANCELLED") return false;
      return isToday(new Date(booking.startTime));
    });
  }, [bookings]);
  /* * Your current booking type supports: * PENDING | CONFIRMED | CANCELLED * * There is no COMPLETED status in the current frontend type, * so completedBookings has been removed. */ const confirmedBookings =
    useMemo(() => {
      return bookings.filter((booking) => booking.status === "CONFIRMED");
    }, [bookings]);
  /* * Your current booking type does not contain createdAt. * Therefore recent activity is ordered using startTime. */ const recentBookings =
    useMemo(() => {
      return [...bookings]
        .sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        )
        .slice(0, 5);
    }, [bookings]);
  /* * ------------------------------------------------------------ * Booking link * ------------------------------------------------------------ */ const bookingUrl =
    useMemo(() => {
      if (!currentOrganization) return "";
      if (typeof window === "undefined") return "";
      return `${window.location.origin}/booking/${currentOrganization.slug}`;
    }, [currentOrganization]);
  const copyBookingLink = async () => {
    if (!bookingUrl) return;
    try {
      await navigator.clipboard.writeText(bookingUrl);
      toast.success("Booking link copied");
    } catch {
      toast.error("Could not copy booking link");
    }
  };
  /* * ------------------------------------------------------------ * Loading * ------------------------------------------------------------ */ if (
    organizationsLoading ||
    isLoadingDashboard
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        {" "}
        <div className="flex flex-col items-center gap-4">
          {" "}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            {" "}
            <Loader2 className="h-6 w-6 animate-spin text-primary" />{" "}
          </div>{" "}
          <div className="text-center">
            {" "}
            <p className="font-semibold text-foreground">
              {" "}
              Loading your dashboard{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-muted-foreground">
              {" "}
              Syncing your organizations, services and bookings...{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
  /* * ------------------------------------------------------------ * No organization * ------------------------------------------------------------ */ if (
    !currentOrgId ||
    !currentOrganization
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        {" "}
        <Card className="w-full max-w-xl rounded-[2rem] border-border bg-card shadow-none">
          {" "}
          <CardContent className="flex flex-col items-center px-8 py-12 text-center">
            {" "}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              {" "}
              <Building2 className="h-7 w-7 text-primary" />{" "}
            </div>{" "}
            <h1 className="text-2xl font-black tracking-tight">
              {" "}
              Create your first organization{" "}
            </h1>{" "}
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {" "}
              You need an organization before you can create services and
              receive appointments.{" "}
            </p>{" "}
            <Link
              href="/dashboard/organizations"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {" "}
              <Plus className="mr-2 h-4 w-4" /> Create Organization{" "}
            </Link>{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>
    );
  }
  /* * ------------------------------------------------------------ * Main dashboard * ------------------------------------------------------------ */ return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {" "}
      {/* ====================================================== WELCOME ======================================================= */}{" "}
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/[0.13] via-card to-card p-7 md:p-8">
        {" "}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />{" "}
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {" "}
          <div className="max-w-2xl">
            {" "}
            <div className="mb-3 flex items-center gap-2">
              {" "}
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
              >
                {" "}
                {currentOrganization.plan} PLAN{" "}
              </Badge>{" "}
              {currentOrganization.subscriptionStatus === "ACTIVE" && (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-500"
                >
                  {" "}
                  Active{" "}
                </Badge>
              )}{" "}
            </div>{" "}
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              {" "}
              Welcome back, {user?.name?.split(" ")[0] || "there"}.{" "}
            </h1>{" "}
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
              {" "}
              Manage{" "}
              <span className="font-semibold text-foreground">
                {" "}
                {currentOrganization.name}{" "}
              </span>{" "}
              , keep track of appointments and make it easy for customers to
              book your services.{" "}
            </p>{" "}
            <div className="mt-6 flex flex-wrap gap-3">
              {" "}
              <Link
                href="/dashboard/bookings"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {" "}
                <CalendarCheck className="mr-2 h-4 w-4" /> View Bookings{" "}
              </Link>{" "}
              <Button
                variant="outline"
                className="rounded-xl font-bold"
                onClick={copyBookingLink}
              >
                {" "}
                <Copy className="mr-2 h-4 w-4" /> Copy Booking Link{" "}
              </Button>{" "}
            </div>{" "}
          </div>{" "}
          {/* Calendar visual */}{" "}
          <div className="hidden shrink-0 lg:block">
            {" "}
            <div className="relative h-36 w-44">
              {" "}
              <div className="absolute left-2 top-2 h-28 w-36 rounded-2xl border border-primary/20 bg-background shadow-xl">
                {" "}
                <div className="flex h-8 items-center gap-2 rounded-t-2xl bg-primary/10 px-4">
                  {" "}
                  <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                  <span className="h-2 w-2 rounded-full bg-primary/50" />{" "}
                  <span className="h-2 w-2 rounded-full bg-primary/30" />{" "}
                </div>{" "}
                <div className="grid grid-cols-4 gap-2 p-4">
                  {" "}
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2.5 rounded-sm ${index === 5 || index === 9 ? "bg-primary" : "bg-muted"}`}
                    />
                  ))}{" "}
                </div>{" "}
              </div>{" "}
              <div className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-card bg-primary text-primary-foreground shadow-xl">
                {" "}
                <Clock3 className="h-6 w-6" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====================================================== STATS ======================================================= */}{" "}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {" "}
        <StatCard
          title="Organizations"
          value={organizations.length}
          description={
            organizations.length === 1
              ? "1 organization"
              : `${organizations.length} organizations`
          }
          icon={Building2}
        />{" "}
        <StatCard
          title="Active Services"
          value={activeServices.length}
          description={`${services.length} total services`}
          icon={BriefcaseBusiness}
        />{" "}
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          description={`${confirmedBookings.length} confirmed`}
          icon={CalendarCheck}
        />{" "}
        <StatCard
          title="Upcoming"
          value={upcomingBookings.length}
          description={`${todayBookings.length} scheduled today`}
          icon={Clock3}
        />{" "}
      </div>{" "}
      {/* ====================================================== MAIN CONTENT ======================================================= */}{" "}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        {" "}
        {/* LEFT */}{" "}
        <div className="space-y-6">
          {" "}
          {/* Today's schedule */}{" "}
          <Card className="rounded-[2rem] border-border bg-card shadow-none">
            {" "}
            <CardContent className="p-6 md:p-7">
              {" "}
              <div className="mb-6 flex items-start justify-between gap-4">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <h2 className="text-xl font-black tracking-tight">
                      {" "}
                      Today&apos;s Schedule{" "}
                    </h2>{" "}
                    {todayBookings.length > 0 && (
                      <Badge className="rounded-full px-2.5">
                        {" "}
                        {todayBookings.length}{" "}
                      </Badge>
                    )}{" "}
                  </div>{" "}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {" "}
                    Your appointments for today.{" "}
                  </p>{" "}
                </div>{" "}
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-bold transition-colors hover:bg-muted"
                >
                  {" "}
                  View all <ArrowRight className="ml-1 h-4 w-4" />{" "}
                </Link>{" "}
              </div>{" "}
              {todayBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Nothing scheduled today"
                  description="Your calendar is clear for today."
                />
              ) : (
                <div className="space-y-3">
                  {" "}
                  {todayBookings.slice(0, 5).map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))}{" "}
                </div>
              )}{" "}
            </CardContent>{" "}
          </Card>{" "}
          {/* Upcoming */}{" "}
          <Card className="rounded-[2rem] border-border bg-card shadow-none">
            {" "}
            <CardContent className="p-6 md:p-7">
              {" "}
              <div className="mb-6 flex items-start justify-between gap-4">
                {" "}
                <div>
                  {" "}
                  <h2 className="text-xl font-black tracking-tight">
                    {" "}
                    Upcoming Appointments{" "}
                  </h2>{" "}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {" "}
                    The next appointments on your calendar.{" "}
                  </p>{" "}
                </div>{" "}
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-bold transition-colors hover:bg-muted"
                >
                  {" "}
                  All bookings <ArrowRight className="ml-1 h-4 w-4" />{" "}
                </Link>{" "}
              </div>{" "}
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No upcoming appointments"
                  description="Share your booking link to start receiving appointments."
                  action={
                    <Button
                      variant="outline"
                      className="mt-5 rounded-xl"
                      onClick={copyBookingLink}
                    >
                      {" "}
                      <Copy className="mr-2 h-4 w-4" /> Copy Booking Link{" "}
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {" "}
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))}{" "}
                </div>
              )}{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
        {/* RIGHT */}{" "}
        <div className="space-y-6">
          {" "}
          {/* Quick actions */}{" "}
          <Card className="rounded-[2rem] border-border bg-card shadow-none">
            {" "}
            <CardContent className="p-6">
              {" "}
              <h2 className="text-xl font-black tracking-tight">
                {" "}
                Quick Actions{" "}
              </h2>{" "}
              <p className="mt-1 text-sm text-muted-foreground">
                {" "}
                Common tasks for your workspace.{" "}
              </p>{" "}
              <div className="mt-5 space-y-2">
                {" "}
                <QuickAction
                  href="/dashboard/organizations"
                  icon={Building2}
                  title="Manage Organizations"
                  description="View or create organizations"
                />{" "}
                <QuickAction
                  href="/dashboard/services"
                  icon={BriefcaseBusiness}
                  title="Manage Services"
                  description="Create and update services"
                />{" "}
                <QuickAction
                  href="/dashboard/availability"
                  icon={Calendar}
                  title="Set Availability"
                  description="Configure your working hours"
                />{" "}
                <QuickAction
                  href="/dashboard/integrations"
                  icon={Link2}
                  title="Integrations"
                  description="Connect Google Calendar"
                />{" "}
                <QuickAction
                  href="/dashboard/bookings"
                  icon={CalendarCheck}
                  title="View Bookings"
                  description="Manage your appointments"
                />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
          {/* Booking link */}{" "}
          <Card className="overflow-hidden rounded-[2rem] border-primary/20 bg-gradient-to-br from-primary/[0.12] to-card shadow-none">
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                {" "}
                <Link2 className="h-5 w-5" />{" "}
              </div>{" "}
              <h2 className="mt-5 text-xl font-black tracking-tight">
                {" "}
                Your Booking Page{" "}
              </h2>{" "}
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {" "}
                Customers can use this link to view your services and book an
                available time slot.{" "}
              </p>{" "}
              <div className="mt-5 rounded-xl border border-border bg-background/70 p-3">
                {" "}
                <p className="break-all text-xs font-medium text-muted-foreground">
                  {" "}
                  {bookingUrl}{" "}
                </p>{" "}
              </div>{" "}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {" "}
                <Button
                  className="rounded-xl font-bold"
                  onClick={copyBookingLink}
                >
                  {" "}
                  <Copy className="mr-2 h-4 w-4" /> Copy{" "}
                </Button>{" "}
                <Link
                  href={`/booking/${currentOrganization.slug}`}
                  target="_blank"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-bold transition-colors hover:bg-muted"
                >
                  {" "}
                  <ExternalLink className="mr-2 h-4 w-4" /> Open{" "}
                </Link>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
          {/* Account overview */}{" "}
          <Card className="rounded-[2rem] border-border bg-card shadow-none">
            {" "}
            <CardContent className="p-6">
              {" "}
              <h2 className="text-xl font-black tracking-tight">
                {" "}
                Overview{" "}
              </h2>{" "}
              <div className="mt-5 space-y-4">
                {" "}
                <OverviewRow
                  label="Total bookings"
                  value={bookings.length}
                  icon={CalendarCheck}
                />{" "}
                <OverviewRow
                  label="Confirmed bookings"
                  value={confirmedBookings.length}
                  icon={CalendarCheck}
                />{" "}
                <OverviewRow
                  label="Active services"
                  value={activeServices.length}
                  icon={BriefcaseBusiness}
                />{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </div>{" "}
      {/* ====================================================== RECENT ACTIVITY ======================================================= */}{" "}
      <Card className="rounded-[2rem] border-border bg-card shadow-none">
        {" "}
        <CardContent className="p-6 md:p-7">
          {" "}
          <div className="mb-6 flex items-start justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="text-xl font-black tracking-tight">
                {" "}
                Recent Activity{" "}
              </h2>{" "}
              <p className="mt-1 text-sm text-muted-foreground">
                {" "}
                Latest bookings received by your organization.{" "}
              </p>{" "}
            </div>{" "}
            <Link
              href="/dashboard/bookings"
              className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-bold transition-colors hover:bg-muted"
            >
              {" "}
              View bookings <ArrowRight className="ml-1 h-4 w-4" />{" "}
            </Link>{" "}
          </div>{" "}
          {recentBookings.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No activity yet"
              description="Your recent booking activity will appear here."
            />
          ) : (
            <div className="divide-y divide-border">
              {" "}
              {recentBookings.map((booking) => (
                <RecentActivity key={booking.id} booking={booking} />
              ))}{" "}
            </div>
          )}{" "}
        </CardContent>{" "}
      </Card>{" "}
      {/* ====================================================== SETUP MESSAGE ======================================================= */}{" "}
      {services.length === 0 && (
        <Card className="rounded-[2rem] border-yellow-500/20 bg-yellow-500/[0.04] shadow-none">
          {" "}
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            {" "}
            <div className="flex gap-4">
              {" "}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
                {" "}
                <AlertCircle className="h-5 w-5" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="font-bold">
                  {" "}
                  Your organization has no services{" "}
                </h3>{" "}
                <p className="mt-1 text-sm text-muted-foreground">
                  {" "}
                  Create at least one service before sharing your booking
                  page.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <Link
              href="/dashboard/services"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {" "}
              Create Service <ArrowRight className="ml-2 h-4 w-4" />{" "}
            </Link>{" "}
          </CardContent>{" "}
        </Card>
      )}{" "}
      {/* Footer */}{" "}
      <div className="flex items-center justify-center gap-2 pb-3 text-xs text-muted-foreground">
        {" "}
        <Rocket className="h-3.5 w-3.5" />{" "}
        <span>Hurry · {currentOrganization.name}</span>{" "}
      </div>{" "}
    </div>
  );
};
/* * ============================================================ * STAT CARD * ============================================================ */ interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}
const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => {
  return (
    <Card className="rounded-[1.5rem] border-border bg-card shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
      {" "}
      <CardContent className="p-5">
        {" "}
        <div className="flex items-start justify-between gap-4">
          {" "}
          <div>
            {" "}
            <p className="text-sm font-medium text-muted-foreground">
              {" "}
              {title}{" "}
            </p>{" "}
            <p className="mt-2 text-3xl font-black tracking-tight">
              {" "}
              {value}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {" "}
            <Icon className="h-5 w-5" />{" "}
          </div>{" "}
        </div>{" "}
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          {" "}
          {description}{" "}
        </p>{" "}
      </CardContent>{" "}
    </Card>
  );
};
/* * ============================================================ * BOOKING ROW * ============================================================ */ const BookingRow =
  ({
    booking,
  }: {
    booking: {
      id: string;
      customerName: string;
      customerEmail: string;
      startTime: string;
      status: string;
      service?: { id: string; title: string };
    };
  }) => {
    const date = new Date(booking.startTime);
    const initials = booking.customerName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const isCancelled = booking.status === "CANCELLED";
    return (
      <div className="group flex items-center gap-4 rounded-2xl border border-border bg-background/30 p-4 transition hover:border-primary/20 hover:bg-muted/30">
        {" "}
        {/* Avatar */}{" "}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
          {" "}
          {initials || "?"}{" "}
        </div>{" "}
        {/* Main */}{" "}
        <div className="min-w-0 flex-1">
          {" "}
          <div className="flex flex-wrap items-center gap-2">
            {" "}
            <p className="truncate text-sm font-bold">
              {" "}
              {booking.customerName}{" "}
            </p>{" "}
            <Badge
              variant="secondary"
              className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${isCancelled ? "bg-red-500/10 text-red-500" : booking.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}
            >
              {" "}
              {booking.status}{" "}
            </Badge>{" "}
          </div>{" "}
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {" "}
            {booking.service?.title || "Appointment"}{" "}
          </p>{" "}
        </div>{" "}
        {/* Date */}{" "}
        <div className="hidden shrink-0 text-right sm:block">
          {" "}
          <p className="text-sm font-bold">{format(date, "dd MMM")}</p>{" "}
          <p className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
            {" "}
            <Clock3 className="h-3 w-3" /> {format(date, "p")}{" "}
          </p>{" "}
        </div>{" "}
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />{" "}
      </div>
    );
  };
/* * ============================================================ * QUICK ACTION * ============================================================ */ const QuickAction =
  ({
    href,
    icon: Icon,
    title,
    description,
  }: {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
  }) => {
    return (
      <Link
        href={href}
        className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition hover:border-border hover:bg-muted/50"
      >
        {" "}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          {" "}
          <Icon className="h-4 w-4" />{" "}
        </div>{" "}
        <div className="min-w-0 flex-1">
          {" "}
          <p className="text-sm font-bold">{title}</p>{" "}
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {" "}
            {description}{" "}
          </p>{" "}
        </div>{" "}
        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />{" "}
      </Link>
    );
  };
/* * ============================================================ * OVERVIEW ROW * ============================================================ */ const OverviewRow =
  ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: number;
    icon: React.ElementType;
  }) => {
    return (
      <div className="flex items-center gap-3">
        {" "}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {" "}
          <Icon className="h-4 w-4" />{" "}
        </div>{" "}
        <p className="flex-1 text-sm font-medium">{label}</p>{" "}
        <span className="text-sm font-black">{value}</span>{" "}
      </div>
    );
  };
/* * ============================================================ * EMPTY STATE * ============================================================ */ const EmptyState =
  ({
    icon: Icon,
    title,
    description,
    action,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: React.ReactNode;
  }) => {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
        {" "}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          {" "}
          <Icon className="h-5 w-5 text-muted-foreground" />{" "}
        </div>{" "}
        <h3 className="mt-4 font-bold">{title}</h3>{" "}
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {" "}
          {description}{" "}
        </p>{" "}
        {action}{" "}
      </div>
    );
  };
/* * ============================================================ * RECENT ACTIVITY * ============================================================ */ const RecentActivity =
  ({
    booking,
  }: {
    booking: {
      id: string;
      customerName: string;
      customerEmail: string;
      startTime: string;
      service?: { id: string; title: string };
    };
  }) => {
    const createdAt = new Date(booking.startTime);
    const initials = booking.customerName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
        {" "}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
          {" "}
          {initials || "?"}{" "}
        </div>{" "}
        <div className="min-w-0 flex-1">
          {" "}
          <p className="text-sm font-bold">
            {" "}
            Booking from {booking.customerName}{" "}
          </p>{" "}
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {" "}
            {booking.service?.title || "Appointment"} ·{" "}
            {booking.customerEmail}{" "}
          </p>{" "}
        </div>{" "}
        <div className="hidden shrink-0 text-right sm:block">
          {" "}
          <p className="text-xs font-medium text-muted-foreground">
            {" "}
            {formatDistanceToNow(createdAt, { addSuffix: true })}{" "}
          </p>{" "}
        </div>{" "}
      </div>
    );
  };
export default DashboardPage;
