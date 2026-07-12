import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createOrganization = async (
  userId: string,
  name: string,
  slug: string,
  timezone: string
) => {
  const existing = await prisma.organization.findUnique({
    where: {
      slug,
    },
  });

  if (existing) {
    throw new ApiError(400, "Slug already taken");
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      timezone,
      ownerId: userId,
    },
  });

  return organization;
};
