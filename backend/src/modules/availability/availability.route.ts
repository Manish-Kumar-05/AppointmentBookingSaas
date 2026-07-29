import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createAvailabilityRuleController,
  deleteAvailabilityRuleController,
  getAvailabilityRulesController,
} from "./availability.controller.js";

const router = express.Router();

router.route("/").post(authMiddleware, createAvailabilityRuleController);

router
  .route("/:organizationId")
  .get(authMiddleware, getAvailabilityRulesController);

router
  .route("/:ruleId")
  .delete(authMiddleware, deleteAvailabilityRuleController);

export default router;
