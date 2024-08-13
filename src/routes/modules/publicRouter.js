import Router from "koa-router";
import PublicController from "../../api/PublicController";
import contentController from "@/api/ContentController";
import CandyController from "@/api/CandyController";
const router = new Router();
router.get("/api/getCaptcha", PublicController.getCaptcha);

// 获取文章列表

router.get("/api/public/list", contentController.getPostList);

// 获取糖果列表
router.get("/api/public/candylist", CandyController.getCandyList);

module.exports = router;
