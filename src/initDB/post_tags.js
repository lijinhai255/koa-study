import db from '@/config/DBHelpler';
import PostTags from '@/model/PostTags';
import { ObjectId } from 'mongodb';

const data = [
  {
    _id: ObjectId('5e78ca9e78c4d0e4524809ff'),
    tagName: '热门',
    tagClass: 'layui-bg-blue',
  },

  {
    _id: ObjectId('5e78caa478c4d0f37b480a00'),
    tagName: '精华',
    tagClass: 'layui-bg-orange',
  },

  {
    _id: ObjectId('5e78caac78c4d0b99f480a01'),
    tagName: '火',
    tagClass: 'layui-bg-red',

    updated: new Date('2023-03-01T08:29:59.551Z'),
  },

  {
    _id: ObjectId('5e89f2b3f969b3cb8bcbe896'),
    tagName: '前端',
    tagClass: 'layui-bg-cyan',
  },

  {
    _id: ObjectId('5e89f2baf969b32118cbe897'),
    tagName: '后端',
    tagClass: 'layui-bg-black',
  },

  {
    _id: ObjectId('5e89f2c8f969b3b442cbe898'),
    tagName: 'VIP',
    tagClass: 'layui-bg-orange',
  },
];

export default async () => {
  await db.connection.dropCollection('post_tags');
  await PostTags.createCollection();
  try {
    await PostTags.insertMany(data);
  } catch (error) {
    console.log('PostTags数据写入失败', error);
  }
};
