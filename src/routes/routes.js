import combileRoutes from "koa-combine-routers";

import publicRouters from "./modules/publicRouter";
import loginRouters from "./modules/loginRouter";
module.exports = combileRoutes(publicRouters, loginRouters);
