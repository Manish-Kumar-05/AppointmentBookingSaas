import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createServiceSchema } from "./service.schema.js";
import {
  createService,
  getOrganizationServices,
  getServiceById,
} from "./service.service.js";

export const createServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const data = createServiceSchema.parse(req.body);
    const userId = req.userId as string;
    const service = await createService(data, userId);

    return res.status(201).json({
      success: true,
      data: service,
    });
  }
);

export const getOrganizationServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.userId as string;

    const services = await getOrganizationServices(organizationId, userId);

    return res.status(200).json({
      success: true,
      data: services,
    });
  }
);

export const getServiceController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const serviceId = req.params.serviceId as string;

    const service = await getServiceById(serviceId, userId);

    return res.status(200).json({
      success: true,
      data: service,
    });
  }
);
