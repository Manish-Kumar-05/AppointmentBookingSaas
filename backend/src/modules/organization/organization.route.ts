import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrg, getMyOrgs } from "./organization.controller.js";

const router = express.Router();

router.route("/registerOrg").post(authMiddleware, createOrg);
router.route("/myOrgs").get(authMiddleware, getMyOrgs);

export default router;
