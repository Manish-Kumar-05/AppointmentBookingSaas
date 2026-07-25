import { Worker } from "bullmq";
import { prisma } from "../lib/prisma.js";
import { resend } from "../lib/email.js";
import { bookingConfirmationTemplate } from "../modules/email/email.templates.js";
import { redisConnection } from "../lib/redis.js";

new Worker(
  "email_queue",
  async (job) => {
    const { bookingId } = job.data;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        service: true,
      },
    });

    if (!booking) {
      return;
    }

    if (job.name === "booking-confirmation") {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: booking.customerEmail,
        subject: "Booking confirmed",
        html: bookingConfirmationTemplate(
          booking.customerName,
          booking.service.title,
          booking.startTime
        ),
      });
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);
