import path from "path";

const MONGO_USERNAME = process.env.DB_USER || "test";
const MONGO_PASSWORD = process.env.DB_PASS || "123456";
const MONGO_HOSTNAME = process.env.DB_HOST || "42.193.104.12";
const MONGO_PORT = process.env.DB_PORT || "27017";
const DB_NAME = process.env.DB_NAME || "initaldb";

// const DB_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${DB_NAME}`;
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;

const REDIS = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASS || "",
};

const JWT_SECRET = "long-random-password";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "http://front.dev.toimc.com:22500"
    : "http://localhost:8080";

const uploadPath =
  process.env.NODE_ENV === "production"
    ? "/app/public"
    : path.join(path.resolve(__dirname), "../../public");

const logPath =
  process.env.NODE_ENV === "production"
    ? "/tmp/log"
    : path.join(path.resolve(__dirname), "../../logs");

const adminEmail = ["1322928787@qq.com"];

const publicPath = [
  /^\/public/,
  /^\/login/,
  /^\/content/,
  /^\/user/,
  /^\/comments/,
];

const isDevMode = process.env.NODE_ENV !== "production";

const port = 3000;
const wsPort = 3001;

const AppID = "your-wx-appid";
const AppSecret = process.env.WX_SECRET || "your-wx-app-secret";

const SubIds = ["FSQZganmBgaRRoNNlelQ1Qm2u4gx6pVSt69EJfkLbPA"];

const mchid = "1565952921";

const serialNo = "random-serial-no";

const apiV3Key = process.env.API_V3 || "wx-api-v3-key";

const WebAppID = "wx-appid";
const WebSECRET = "wx-secret";

export default {
  DB_NAME,
  MONGO_HOSTNAME,
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl,
  uploadPath,
  adminEmail,
  publicPath,
  isDevMode,
  port,
  wsPort,
  AppID,
  AppSecret,
  SubIds,
  mchid,
  serialNo,
  apiV3Key,
  WebAppID,
  WebSECRET,
  logPath,
};
