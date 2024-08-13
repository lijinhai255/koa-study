const User = require("./test");

// 增
const user = {
  username: "lijinhai@qq.com",
  age: 30,
  email: "1@qq.com",
};

const add = async () => {
  const reset = new User(user);
  const result = await reset.save();
  console.log(result, "result");
};
add();
// 删
const deleteOne = async () => {
  const result = await User.deleteOne({ name: "brian" });
  console.log(result, "result");
};
// 改
const updateOne = async () => {
  const result = await User.updateOne({ name: "brian" }, { email: "2@q.com" });
  console.log(result, "result");
};
// 查
const find = async () => {
  const result = await User.find();
  console.log(result, "result");
};
deleteOne();
updateOne();
find();
