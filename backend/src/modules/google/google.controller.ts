import { Request, Response } from "express";
import { google } from "googleapis";

import { catchAsync } from "../../utils/catchAsync.js";
import { ApiError } from "../../utils/ApiError.js";
import { oauth2Client, SCOPES } from "../../lib/google.js";
import { prisma } from "../../lib/prisma.js";

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: req.userId,
    },
    select: {
      id: true,
    },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state: organization.id,
  });

  return res.redirect(url);
});

export const googleCallback = catchAsync(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const organizationId = req.query.state as string;

    if (!code) {
      throw new ApiError(400, "Authorization code is missing.");
    }

    if (!organizationId) {
      throw new ApiError(400, "Organization id is missing.");
    }

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();

    await prisma.googleIntegration.upsert({
      where: {
        organizationId,
      },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: new Date(tokens.expiry_date!),
      },
      create: {
        organizationId,
        googleEmail: userInfo.data.email!,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        expiryDate: new Date(tokens.expiry_date!),
      },
    });

    return res.status(200).json({
      success: true,
      data: "Google connected successfully.",
    });
  }
);
