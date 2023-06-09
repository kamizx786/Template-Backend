import express from "express";
import { requireSigin } from "../middleware";
import { login, Register, UpdateProfile } from "../controllers/user";
const router = express.Router();
router.post("/register", Register);
router.post("/login", login);
router.put("/profile-update", requireSigin, UpdateProfile);
module.exports = router;
