import Comapny from "@/model/Company";
import qs from "qs";

class CompanyController {
  async saveInitCompany() {
    const body = qs.parse(ctx.query);
    console.log(body, "body-body");

    const comapny = new Comapny({
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
    const tmp = await comapny.save();
    console.log(tmp);
  }
}

export default new CompanyController();
