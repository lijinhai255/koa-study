import { ObjectId } from "mongodb";
import Users from "@/model/User";

const users = [
  {
    favs: 1,
    gender: "",
    roles: ["user"],
    pic: "http://admin.dev.toimc.com:22000/img/header.jpg",
    mobile: "15895932504",
    status: "0",
    regmark: "用户很懒，什么都没有留下~",
    location: "",
    isVip: "0",
    count: 1,
    name: "toimc_admin",
    username: "toimc_admin@toimc.com",
    password: "",
    openid: "",
    unionid: "",
    score: 0,
  },
  {
    favs: 1,
    gender: "",
    roles: ["admin", "user"],
    pic: "/img/header.jpg",
    mobile: "13412341234",
    status: "0",
    regmark: "用户很懒，什么都没有留下~",
    location: "",
    isVip: "0",
    count: 0,
    score: 0,
    openid: "",
    unionid: "",
    name: "测试管理员用户",
    username: "test@toimc.com",
    password: "$2b$05$0uYY9bSKrWYhwVGBvt.LG.hrndIKX5ZFHEr5YraE8ncQ9u3VNHr.y",
  },
];

export default async () => {
  try {
    users.forEach(async (item) => {
      await Users.updateOne({ _id: item._id }, { $set: { ...item } });
    });
  } catch (error) {
    console.log("Users数据写入失败", error);
  }
};
