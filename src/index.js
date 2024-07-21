// const koa = require("koa");
// const path = require("path");
// const helmet = require("koa-helmet");
// const statics = require("koa-static");
import koa from "koa";
import path from "path";
import helmet from "koa-helmet";
import statics from "koa-static";
import koaBody from "koa-body";
import jsonUtils from "koa-json";
import cors from "@koa/cors";
import compose from "koa-compose";
import compress from "koa-compress";
import router from "./routes/routes";
import errorHandle from "./middleware/ErrorHandle";

const app = new koa();

const isDevMode = process.env.NODE_ENV === "production" ? true : false;
const middleWare = compose([
  koaBody(),
  statics(path.join(__dirname, "../public")),
  cors(),
  errorHandle,
  jsonUtils({
    pretty: false,
    param: "pretty",
  }),
  helmet(),
]);
if (!isDevMode) {
  app.use(compress());
}
app.use(middleWare);
app.use(router());
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
