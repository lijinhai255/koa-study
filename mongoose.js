const mongoose = require("mongoose");
// const DB_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${DB_NAME}`;

mongoose.connect("mongodb://localhost:27017/initdb");

const User = mongoose.model("usersList", {
  name: String,
  age: Number,
  email: String,
});

const imooc = new User({
  name: "imooc-test",
  age: 30,
  email: "1@qq.com",
});

imooc.save().then(() => {
  console.log("save ok");
});
