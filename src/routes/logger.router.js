import { Router } from "express";
import { logger } from "../utils/logger.js"

const router = Router();


router.get("/", (req, res) => {
    logger.fatal("fatal"),
    logger.error("error"),
    logger.warning("warning"),
    logger.info("info"),
    logger.http("http"),
    logger.debug("debug")
});

export default router;