import express from "express";
import {
  cancelBookingController,
  createBookingController,
  getBookingController,
  getOrganizationBookingsController,
} from "./booking.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(createBookingController);
router.route("/:bookingId").patch(cancelBookingController);
router
  .route("/organization/:orgId")
  .get(authMiddleware, getOrganizationBookingsController);

router.route("/:bookingId").get(getBookingController);

export default router;
