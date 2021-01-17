# appletLoader 

appletLoader 是 qiankun 简单封装。

主要概念是将子应用封装一个 vue 组件，子应用的生命周期就变成为组件的生命周期。这样就更方便集成子主应用中。

## 使用

`applet-list.js` 文件：

```js
export default [
  {
    name: 'ModuleAboutMe',
    entry: 'http://localhost:9002/module-about-me/',
    propKeys: ['baseUrl'], // propKeys 是需要注入的子应用的数据 key 名称
  },
  {
    name: 'ModuleBlog',
    entry: 'http://localhost:9001/module-blog/',
    propKeys: ['baseUrl'],
  },
];

```

`applet-utils.js` 文件：

```js
import { appletLoader, makeAppletComponentCreator } from '@demos/applet-loader';
import appletList from '@/applet-list';

// 注册子应用
// 目前子应用是使用固定列表，也可能过调用接口方式实现
appletLoader.addApplet(...appletList);

// 启动微服务框架
export function systemStart() {

  // 应该先注册子应用后，再启动
  appletLoader.start();
}

// propsData 数据获取方法
// vm 是子应用容器组件实例。可以访问全局的 $router 等数据
const propsDataGetter = vm => {
  const route = vm.$route;

  return {
    baseUrl: route.meta.baseUrl, // 应用设置子应用 router 的 base
  };
};

// 创建一个子应用容器组件工厂函数
// 工厂函数签名 (name: string, options?: {autoRemove: boolean; propsData: PropsData;}) => VueConstructor<Vue>
// propsData 可以在实例化时覆盖 propsDataGetter 的数据
export const makeAppletComponent = makeAppletComponentCreator(appletLoader, propsDataGetter);

```