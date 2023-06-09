import express from "express"
import { SiteSettings, createandupdate} from "../controllers/settings";
import {  requireSigin } from "../middleware";
const router=express.Router();

router.put("/updateSettings/:_id",requireSigin,createandupdate);
router.get("/siteSettings",SiteSettings);

module.exports=router;