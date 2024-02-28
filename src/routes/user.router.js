import { Router } from "express";
import upload from "../middlewares/multer.middlware.js";
import {  findUserById, findUserByEmail, createUser, updateUserNow, updatePerfil } from "../controllers/users.controller.js";
const router = Router();

router.get(
  "/:uid", findUserById
);
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "dni", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "bank", maxCount: 1 },
  ]), 
  updatePerfil
);
router.put(
  "/premium/:uid", updateUserNow
);


export default router;