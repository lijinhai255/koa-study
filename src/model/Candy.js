import mongoose from "@/config/DBHelpler";

const Schema = mongoose.Schema;

const CandyChema = new Schema(
  {
    id: { type: String },
    uid: { type: String, ref: "company" },
    name: { type: String },
    description: { type: String },
    category_id: { type: String },
    price_per_unit: { type: String },
    price_per_weight: { type: String },
    weight_unit: { type: String },
    price_unit: { type: String },
    stock: { type: String },
    image_url: { type: String },
    type: { type: String },
    rating: { type: String },
    year: { type: String },
    length: { type: String },
    width: { type: String },
    density: { type: String },
    tags: {
      type: Array,
      default: [
        // {
        //   name: '',
        //   class: ''
        // }
      ],
    },
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);
CandyChema.statics = {
  getCandyList: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: "uid",
        select: "name isVip pic",
      });
  },
};
const CandyModel = mongoose.model("candy", CandyChema);

export default CandyModel;
