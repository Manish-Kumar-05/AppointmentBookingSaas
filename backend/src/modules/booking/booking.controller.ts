import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createBookingSchema } from "./booking.schema.js";
import {
  cancelBooking,
  createBooking,
  getBooking,
  getOrganizationBookings,
} from "./booking.service.js";
import { success } from "zod";

export const createBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const data = createBookingSchema.parse(req.body);

    const booking = await createBooking(data);

    return res.status(201).json({
      success: true,
      data: booking,
    });
  }
);

export const getBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId as string;

    const booking = await getBooking(bookingId);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  }
);

export const cancelBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId as string;

    const cancelledBooking = await cancelBooking(bookingId);

    return res.status(200).json({
      success: true,
      data: cancelledBooking,
    });
  }
);

export const getOrganizationBookingsController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.orgId as string;

    const bookings = await getOrganizationBookings(organizationId);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  }
);
