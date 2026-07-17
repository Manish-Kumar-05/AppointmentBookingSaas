import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createServiceController,
  getOrganizationServiceController,
  getServiceController,
} from "./service.controller.js";

const router = express.Router();

router.route("/").post(authMiddleware, createServiceController);
router
  .route("/organization/:organizationId")
  .get(authMiddleware, getOrganizationServiceController);
router.route("/:serviceId").get(authMiddleware, getServiceController);

export default router;
