import ErrorRecord from '@/model/ErrorRecord';
import path from 'path';
import fs from 'fs';
import config from '@/config';
import makeDir from 'make-dir';
import log4js from '@/config/Log4j';

const logger = log4js.getLogger('out');

export default async () => {
  const days = 30;
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  ErrorRecord.find({ created: { $lt: cutoffDate } }, async (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      logger.info(
        '🚀 ~ file: error_records.js:21 ~ ErrorRecord.find ~ logPath:',
        config.logPath
      );
      if (docs && docs.length > 0) {
        // 将要删除的文档保存为日志文件
        const filename = `error_records_${cutoffDate.toISOString()}.log`;
        await makeDir(config.logPath);

        const logPath = path.join(config.logPath, filename);
        const logStream = fs.createWriteStream(logPath);
        docs.forEach((doc) => {
          logStream.write(
            `username ${doc.username} code: ${doc.code}, method: ${doc.method}, path: ${doc.path} \ncreated: ${doc.created}, message: ${doc.message} \nstack: ${doc.stack}\n`
          );
        });
        logStream.end();
      }

      // 删除文档
      ErrorRecord.deleteMany(
        { created: { $lt: cutoffDate } },
        (err, result) => {
          if (err) {
            logger.error(err);
          } else {
            logger.info(result.deletedCount + ' document(s) deleted!');
          }
        }
      );
    }
  });
};
