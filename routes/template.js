import express from "express";
import {
  AllTemplates,
  Fetch,
  FetchOtherDetails,
  create,
  deletetemplate,
  SingleTemplate,
} from "../controllers/Template";
import { requireSigin } from "../middleware";
const router = express.Router();

router.post("/fetchTemplate", requireSigin, Fetch, FetchOtherDetails);
router.post("/template/create", requireSigin, create);
router.delete("/template/delete/:_id", requireSigin, deletetemplate);
router.get("/template/AllTemplates", AllTemplates);
router.get("/template/SingleTemplate/:_id", SingleTemplate);

module.exports = router;
