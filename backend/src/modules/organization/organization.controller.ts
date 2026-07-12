import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createOrganizationSchema } from "./organization.schema.js";
import { createOrganization } from "./organization.service.js";

export const createOrg = catchAsync(async (req: Request, res: Response) => {
  const data = createOrganizationSchema.parse(req.body);
  const userId = req.userId as string;

  const org = await createOrganization(
    userId,
    data.name,
    data.slug,
    data.timezone
  );

  res.status(201).json({
    success: true,
    data: org,
  });
});
