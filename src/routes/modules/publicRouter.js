import Router from "koa-router";
import PublicController from "../../api/PublicController";

const router = new Router();
router.get("/api/getCaptcha", PublicController.getCaptcha);

module.exports = router;
