"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteAvailabilityThunk,
  fetchAvailability,
  createAvailabilityThunk,
} from "@/redux/slices/availabilitySlice";
import AddSlotDialog from "@/components/AvailabilityComponents/AddSlotDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Trash2, CalendarDays, Copy, Loader2 } from "lucide-react";

const AvailabilityPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);
  const { slots, isLoading } = useAppSelector((s) => s.availability);

  useEffect(() => {
    if (currentOrgId) dispatch(fetchAvailability(currentOrgId));
  }, [currentOrgId, dispatch]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const handleCopyMondayToWeekdays = async () => {
    const mondaySlots = slots.filter((s) => s.dayofWeek === 0);

    if (mondaySlots.length === 0) {
      return toast.error("Add slots to Monday first");
    }

    const targetDays = [1, 2, 3, 4]; // Tue–Sat

    try {
      toast.loading("Syncing schedule...", { id: "copy" });

      const existing = slots.filter((s) => targetDays.includes(s.dayofWeek));

      // delete old
      await Promise.all(
        existing.map((slot) =>
          dispatch(deleteAvailabilityThunk(slot.id)).unwrap(),
        ),
      );

      // create new
      await Promise.all(
        targetDays.flatMap((day) =>
          mondaySlots.map((slot) =>
            dispatch(
              createAvailabilityThunk({
                organizationId: currentOrgId!,
                dayofWeek: day,
                startTime: slot.startTime,
                endTime: slot.endTime,
              }),
            ).unwrap(),
          ),
        ),
      );

      toast.success("Schedule synced", { id: "copy" });
    } catch {
      toast.error("Sync failed", { id: "copy" });
    }
  };

  if (!currentOrgId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed rounded-3xl">
        <CalendarDays className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">
          Select an organization to manage availability
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">Availability</h1>
          <p className="text-muted-foreground mt-1">
            Set your weekly working hours
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleCopyMondayToWeekdays}
          className="rounded-full gap-2 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          Copy Monday
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading...
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {days.map((day, index) => {
          const daySlots = slots
            .filter((s) => s.dayofWeek === index)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day} className="bg-card border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">{day}</h2>
                <AddSlotDialog day={index} />
              </div>

              {daySlots.length === 0 ? (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-50" />
                  No slots added
                </div>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center bg-muted p-3 rounded-xl"
                    >
                      <span className="font-medium">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </span>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={async () => {
                          try {
                            await dispatch(
                              deleteAvailabilityThunk(slot.id),
                            ).unwrap();
                            toast.success("Deleted");
                          } catch {
                            toast.error("Error");
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityPage;
