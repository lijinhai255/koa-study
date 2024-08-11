import mongoose from "@/config/DBHelpler";

const Schema = mongoose.Schema;

const CompanyChema = new Schema(
  {
    uid: { type: String },
    name: { type: String },
    description: { type: String },
    area: { type: String },
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
CompanyChema.statics = {
  getCandyList: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: "uid",
        select: "name",
      });
  },
};
const CandyModel = mongoose.model("company", CompanyChema);

export default CandyModel;
