import Candy from "@/model/Candy";
import Comapny from "@/model/Company";
import qs from "qs";

class CandyController {
  constructor() {
    this.initCompanyFn = this.initCompanyFn.bind(this);
    this.initCandyFn = this.initCandyFn.bind(this);
    this.getCandyList = this.getCandyList.bind(this);
  }
  async initCompanyFn() {
    const comapny = new Comapny({
      name: "厂家1",
      description: "这是一个生产花生糖的厂家",
      area: "山东",
      tags: [{ name: "花生糖" }, { name: "硬糖" }],
    });
    const tmp = comapny.save();
    console.log(tmp);
  }
  async initCandyFn() {
    糖果初始化数据;
    const candy = new Candy({
      name: "糖果1",
      description: "这是一个花生糖",
      price_per_unit: "",
      price_per_weight: "",
      weight_unit: "kg",
      price_unit: "元",
      stock: "1",
      image_url: "",
      tags: [{ name: "花生糖" }, { name: "硬糖" }],
      rating: "1",
      year: "2024",
      length: "10cm",
      width: "2cm",
      density: "1",
    });
    const tmp = await candy.save();
    console.log(tmp, "tmp-tmp");
  }
  async getCandyList(ctx) {
    const body = qs.parse(ctx.query);
    console.log(body, "body-body");
    // 初始化企业
    // this.initCompanyFn();

    const sort = body.sort ? body.sort : "created";
    const page = body.page ? parseInt(body.page) : 0;
    const limit = body.limit ? parseInt(body.limit) : 20;
    const options = {};

    if (body.title) {
      options.title = { $regex: body.title };
    }
    if (typeof body.tag !== "undefined" && body.tag !== "") {
      options.tags = { $elemMatch: { name: body.tag } };
    }
    const result = await Candy.getCandyList(options, sort, page, limit);
    console.log(result, "result-result");
    // const total = await Candy.countList(options);

    ctx.body = {
      code: 200,
      data: result,
      msg: "获取文章列表成功",
      total: 10,
    };
  }
}

export default new CandyController();
