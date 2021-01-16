import { qiankunHelper, makeAppComponentCreator } from 'qiankun-helper';

const appList = [
  {
    id: 'about-12345',
    name: 'AboutApp',
    entry: '//localhost:8081/about/',
    propKeys: [],
  },
];

qiankunHelper.addApp(...appList);

export function qiankunStart() {
  qiankunHelper.start();
}

export const makeMicroAppContainer = makeAppComponentCreator(qiankunHelper, () => {});
