import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createAvailabilitySchema } from "./availability.schema.js";
import {
  createAvailabilityRule,
  deleteAvailabilityRule,
  getAvailabilityRules,
} from "./availability.service.js";
import { success } from "zod";

export const createAvailabilityRuleController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const data = createAvailabilitySchema.parse(req.body);

    const rule = await createAvailabilityRule(data, userId);

    return res.status(201).json({
      success: true,
      data: rule,
    });
  }
);

export const getAvailabilityRulesController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const organizationId = req.params.organizationId as string;

    const rules = await getAvailabilityRules(organizationId, userId);

    return res.status(200).json({
      success: true,
      data: rules,
    });
  }
);

export const deleteAvailabilityRuleController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const ruleId = req.params.ruleId as string;

    const result = await deleteAvailabilityRule(ruleId, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);
