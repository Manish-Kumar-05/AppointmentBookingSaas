import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createServiceController,
  deleteServiceController,
  getOrganizationServiceController,
  getServiceController,
  updateServiceController,
} from "./service.controller.js";

const router = express.Router();

router.route("/").post(authMiddleware, createServiceController);

router
  .route("/organization/:organizationId")
  .get(authMiddleware, getOrganizationServiceController);

router.route("/:serviceId").get(authMiddleware, getServiceController);

router.route("/:serviceId").patch(authMiddleware, updateServiceController);

router.route("/:serviceId").delete(authMiddleware, deleteServiceController);

export default router;
