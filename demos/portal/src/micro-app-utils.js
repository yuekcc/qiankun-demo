import { microAppLoader, makeAppComponentCreator } from '@demos/micro-app-loader';

const appList = [
  {
    name: 'ModuleAboutMe',
    entry: 'http://localhost:9002/module-about-me/',
    propKeys: [],
  },
  {
    name: 'ModuleBlog',
    entry: 'http://localhost:9001/module-blog/',
    propKeys: [],
  },
];

microAppLoader.addApp(...appList);

export function systemStart() {
  microAppLoader.start();
}

export const makeMicroAppContainer = makeAppComponentCreator(microAppLoader, () => {});
