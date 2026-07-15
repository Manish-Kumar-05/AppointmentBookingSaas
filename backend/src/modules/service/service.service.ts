import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { createServiceData } from "./service.schema.js";

export const createService = async (
  data: createServiceData,
  userId: string
) => {
  const organiztion = await prisma.organization.findUnique({
    where: {
      id: data.organizationId,
    },
  });

  if (!organiztion) {
    throw new ApiError(404, "Organization not found");
  }

  const service = await prisma.service.create({
    data: {
      organizationId: data.organizationId,
      title: data.title,
      description: data.description,
      serviceType: data.serviceType,
      durationInMinutes: data.durationInMinutes,
      price: data.price,
      currency: data.currency,
      locationAddress: data.locationAddress,
    },
  });

  return service;
};
