import express from "express"
import { create,update,deletecategory,
    AllCategories,SingleCategory } from "../controllers/Category";
import { requireSigin } from "../middleware";
const router=express.Router();

router.post("/category/create",requireSigin,create);
router.put("/category/update/:slug",requireSigin,update);
router.delete("/category/delete/:slug",requireSigin,deletecategory);
router.get("/category/AllCategories",AllCategories);
router.get("/category/SingleCategory/:slug",SingleCategory);
module.exports=router;