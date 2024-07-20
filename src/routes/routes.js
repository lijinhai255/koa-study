const combileRoutes = require("koa-combine-routers");
const aRoutes = require("./aRouter");
const bRoutes = require("./bRouter");
module.exports = combileRoutes(aRoutes, bRoutes);
