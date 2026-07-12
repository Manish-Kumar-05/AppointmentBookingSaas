import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrg } from "./organization.controller.js";

const router = express.Router();

router.route("/").post(authMiddleware, createOrg);

export default router;
