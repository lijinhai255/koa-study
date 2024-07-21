import Router from "koa-router";
// const  = require("../../api/LoginController");
import LoginController from "../../api/LoginController";
console.log(LoginController);
const router = new Router();
router.get("/forget", LoginController.forget);
// 登录接口
router.post("/api/login", LoginController.login);

// 注册用户
router.post("/api/login/reg", LoginController.reg);

// 忘记密码
router.post("/api/login/forget", LoginController.forget);

// 密码重置
router.post("/api/login/reset", LoginController.reset);

export default router;
