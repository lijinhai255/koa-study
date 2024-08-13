import svgCaprcha from "svg-captcha";
import { setValue } from "../config/RedisConfig";

class PublicController {
  constructor() {}
  async getCaptcha(ctx) {
    const body = ctx.query;
    const newCaptcha = svgCaprcha.create({
      size: 4,
      ignoreChars: "0oli",
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 50,
    });
    if (typeof body.sid === "undefined") {
      ctx.body = {
        code: 500,
        msg: "参数不全！",
      };
      return;
    }
    // 保存图片验证码数据，设置超时时间，单位: s
    // 设置图片验证码超时10分钟
    setValue(body.sid, newCaptcha.text, 10 * 60);
    ctx.body = {
      code: 200,
      data: newCaptcha.data,
    };
  }
}

export default new PublicController();
