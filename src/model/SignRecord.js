import mongoose from '../config/DBHelpler';
import moment from 'dayjs';
import { isToday } from '../common/Utils';

const Schema = mongoose.Schema;

const SignRecordSchema = new Schema(
  {
    uid: { type: String, ref: 'users' },
    favs: { type: Number },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

SignRecordSchema.statics = {
  findByUid: function (uid) {
    return this.findOne({ uid: uid }).sort({ created: -1 });
  },
  getUidTotalSign: function (uid) {
    return this.find({ uid: uid }).countDocuments();
  },
  findLastestByUid: function ({ uid, limit = 10, page = 0 }) {
    return this.find({ uid: uid })
      .sort({ created: -1 })
      .skip(page * limit)
      .limit(limit);
  },
  getLatestSign: function (page, limit) {
    return this.find({})
      .populate({
        path: 'uid',
        select: '_id name pic',
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 });
  },
  getTopSign: function (page, limit) {
    // const m = new Date(moment().hour(0).minute(0).second(0))
    // console.log('🚀 ~ file: SignRecord.js ~ line 28 ~ m', m)
    return this.find({
      created: { $gte: new Date(moment().hour(0).minute(0).second(0)) },
    })
      .populate({
        path: 'uid',
        select: '_id name pic',
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: 1 });
  },
  getSignCount: function () {
    return this.find({}).countDocuments();
  },
  getTopSignCount: function () {
    return this.find({
      created: { $gte: new Date(moment().hour(0).minute(0).second(0)) },
    }).countDocuments();
  },
  isSign: function (uid) {
    // 判断用户是否签到
    return this.findOne({ uid: uid }, { openid: 0 })
      .sort({ created: -1 })
      .then((doc) => {
        return doc && isToday(doc.created) ? 1 : 0;
      });
  },
  // 取得最快签到
  findQuickestSign: function () {
    return this.find({
      created: { $gte: new Date(moment().hour(0).minute(0).second(0)) },
    })
      .sort({ created: 1 })
      .limit(20)
      .populate({
        path: 'uid',
        select: 'name pic isVip _id',
      });
  },
  // 取得最新签到
  findLastSign: function () {
    return this.find({}).sort({ created: -1 }).limit(20).populate({
      path: 'uid',
      select: 'name pic isVip _id',
    });
  },
};

const SignRecord = mongoose.model('sign_record', SignRecordSchema);

export default SignRecord;
