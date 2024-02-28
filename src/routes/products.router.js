import {Router} from 'express'
import { __dirname } from "../utils/utils.js"
import { findProductById, findAllProduct, createOneProduc, deleteOneProdAll, updateProducts } from '../controllers/products.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();

router.get("/", findAllProduct)
router.get("/:pid", findProductById)
router.post("/", passport.authenticate("current", {session:false}), authMiddleware(["admin", "premium"]), createOneProduc)
router.delete("/:pid", passport.authenticate("current", {session:false}), authMiddleware(["admin", "premium"]), deleteOneProdAll)
router.put("/:pid", passport.authenticate("current", {session:false}), authMiddleware(["admin", "premium"]), updateProducts)

export default router