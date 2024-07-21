import send from "../config/MailConfig";
import moment from "moment";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jsonwebtoken from "jsonwebtoken";
import config from "@/config";

import {
  checkCode,
  generateToken,
  checkRedisAccountCode,
  getTempName,
} from "@/common/Utils";
import { getValue, setValue } from "@/config/RedisConfig";

import User from "@/model/User";
import SignRecord from "../model/SignRecord";

export const addSign = async (user, fields = []) => {
  const userObj = user.toJSON();
  const arr = ["password", "username", ...fields];
  arr.map((item) => {
    return delete userObj[item];
  });
  // 加入isSign属性
  const signRecord = await SignRecord.findByUid(userObj._id);
  const signLists =
    (await SignRecord.findLastestByUid({ uid: userObj._id })) || [];
  if (signRecord !== null) {
    if (
      moment(signRecord.created).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
    ) {
      userObj.isSign = true;
    } else {
      userObj.isSign = false;
    }
    userObj.lastSign = signRecord.created;
  } else {
    // 用户无签到记录
    userObj.isSign = false;
  }
  userObj.signRecord =
    signLists.length > 0
      ? signLists.map((item) => moment(item.created).format("YYYY-MM-DD"))
      : [];
  // 检查 vip 状态
  await checkUserVipStatus(user);
  return userObj;
};
const checkUserVipStatus = async (user) => {
  let flag = true;
  if (moment(user.expire).isBefore(moment())) {
    flag = false;
    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          isVip: "0",
        },
      }
    );
  }
  return flag;
};
class LoginController {
  // 忘记密码，发送邮件
  async forget(ctx) {
    const { body } = ctx.request;
    console.log(body, "body-body");
    const user = await User.findOne({ username: body.username });
    if (!user) {
      ctx.body = {
        code: 404,
        msg: "请检查账号！",
      };
      return;
    }
    console.log(user, "user-user");
    try {
      const key = uuidv4();
      setValue(
        key,
        jsonwebtoken.sign({ _id: user._id }, config.JWT_SECRET, {
          expiresIn: "30m",
        }),
        30 * 60
      );
      // body.username -> database -> email
      const result = await send({
        type: "reset",
        data: {
          key: key,
          username: body.username,
        },
        expire: moment().add(30, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        email: body.username,
        user: user.name ? user.name : body.username,
      });
      ctx.body = {
        code: 200,
        data: result,
        msg: "邮件发送成功",
      };
    } catch (e) {
      console.log(e);
    }
  }

  // 用户登录
  async login(ctx) {
    // 接收用户的数据
    // 返回token
    const { body } = ctx.request;
    const sid = body.sid;
    const code = body.code;
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code);
    console.log(result, "result");
    if (result) {
      // 验证用户账号密码是否正确
      let checkUserPasswd = false;
      console.log(body.username, "body.username-body.username");
      const user = await User.findOne({ username: body.username });
      console.log(user, "user-user");
      if (user === null) {
        ctx.body = {
          code: 404,
          msg: "用户名或者密码错误",
        };
        return;
      }
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPasswd = true;
      }
      // mongoDB查库
      if (checkUserPasswd) {
        // 验证通过，返回Token数据
        const userObj = await addSign(user);
        let admins = JSON.parse(await getValue("admin"));
        if (admins && admins.includes(userObj._id.toString())) {
          !userObj.roles.includes("super_admin") &&
            userObj.roles.push("super_admin");
        }
        // await checkUserVipStatus(user)
        ctx.body = {
          code: 200,
          data: userObj,
          token: generateToken({ _id: user._id }, "60m"),
          refreshToken: generateToken({ _id: user._id }, "7d"),
        };
      } else {
        // 用户名 密码验证失败，返回提示
        ctx.body = {
          code: 404,
          msg: "用户名或者密码错误",
        };
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: "图片验证码不正确,请检查！",
      };
    }
  }

  // refreshToken
  async refresh(ctx) {
    ctx.body = {
      code: 200,
      token: generateToken({ _id: ctx._id }, "60m"),
      msg: "获取token成功",
    };
  }
  // 注册接口
  async reg(ctx) {
    // 接收客户端的数据
    const { body } = ctx.request;
    // 校验验证码的内容（时效性、有效性）
    const sid = body.sid;
    const code = body.code;
    let msg = {};
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code);
    let check = true;
    if (result) {
      // 查库，看username是否被注册
      const user1 = await User.findOne({ username: body.username });
      if (user1 !== null && typeof user1.username !== "undefined") {
        msg.username = "此邮箱已经注册，可以通过邮箱找回密码";
        check = false;
      }
      const user2 = await User.findOne({ name: body.name });
      // 查库，看name是否被注册
      if (user2 !== null && typeof user2.name !== "undefined") {
        msg.name = "此昵称已经被注册，请修改";
        check = false;
      }
      // 写入数据到数据库
      if (check) {
        body.password = await bcrypt.hash(body.password, 5);
        const user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          // created: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        const result = await user.save();
        ctx.body = {
          code: 200,
          data: result,
          msg: "注册成功",
        };
        return;
      }
    } else {
      // veevalidate 显示的错误
      msg.code = "验证码已经失效，请重新获取！";
    }
    ctx.body = {
      code: 500,
      msg: msg,
    };
  }
  // 密码重置
  async reset(ctx) {
    const { body } = ctx.request;
    const sid = body.sid;
    const code = body.code;
    let msg = {};
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code);
    if (!body.key) {
      ctx.body = {
        code: 500,
        msg: "请求参数异常，请重新获取链接",
      };
      return;
    }
    if (!result) {
      msg.code = ["验证码已经失效，请重新获取！"];
      ctx.body = {
        code: 500,
        msg: msg,
      };
      return;
    }
    const token = await getValue(body.key);
    if (token) {
      body.password = await bcrypt.hash(body.password, 5);
      await User.updateOne(
        { _id: ctx._id },
        {
          password: body.password,
        }
      );
      ctx.body = {
        code: 200,
        msg: "更新用户密码成功！",
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "链接已经失效",
      };
    }
  }
}

export default new LoginController();
