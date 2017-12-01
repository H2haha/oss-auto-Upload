const fs = require('fs');
const co = require('co');
const path = require('path');
const oss = require('ali-oss');

const store = oss({
  accessKeyId:'LTAI1t7Nwnu3Jgko',
  accessKeySecret: 'Y852oOIWZhdYpuzatjXj9minm84dai',
  bucket: 'rennana',
  region: 'oss-cn-beijing',
});

(() => {
  const root = path.resolve(__dirname, './rennana');
  const files = [];
  function readDirSync(p) {
    const pa = fs.readdirSync(p);
    pa.forEach((e) => {
      const cur_path = `${p}/${e}`;
      const info = fs.statSync(cur_path);
      if (info.isDirectory()) {
        readDirSync(cur_path);
      } else {
        files.push(cur_path);
      }
    });
  }
  readDirSync(root);
  co(function* () {
    for (let index = 0; index < files.length; index += 1) {
      const e = files[index];
      const result = yield store.put(e.replace(root, ''), e);
      console.log(result);
    }
  });
})();
