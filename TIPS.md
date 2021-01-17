# 微前端改造 TIPS

## 一、微前端概念

微前端一般分为主应用和子应用；所谓的“微”是指一个应用本身的业务是相对较确定的，适合按应用的领
进行域划分。通常情况下，这些应用是限制具体的实现手段的，理论上无论使用何种前端框架实现，通过
微前端都可以集成为一个应用。

具体实现上可以是一个工程实现多个业务领域，也可以是一个工程实现一个业务领域。主应用更多是导航性质
和公共服务，比如登录、登录过期管理、统一异常处理等。

## 二、qiankun 是什么

[qiankun][qiankun-websit] 是阿里出品的基于 single-spa 的微前端解决方案。

最大的特点是引入了 js 沙箱功能，在一定程度上实现子应用的独立性。js 沙箱使用的是 proxy 实现的
包装方案。大概就是在子应用加载时，将主应用的一些全局环境使用 proxy 包装一层。子应用中对于全局上下文
的读写都是经过代理的，从而实现了独立性。有趣的是阿里云的一个团队使用了 iframe 实现的沙箱。

> 我人个是比较倾向基于 iframe 的沙箱方案，兼容性应该是最好的。但是 iframe 比较 low。

qiankun 也提供了两个实验性质的 css 沙箱方案，但是效果一般。比较理想的是基于 web component 实现
的 css 沙箱。在 shadow DOM 标准，css 样式是完全隔离。但是 web component 有兼容性问题。主要是
一些早期的 ui 库（主要就是 element ui 2.x）不兼容 web component。

就目前的功能来看，qiankun 更像是一个远程组件加载器。

[qiankun-websit]: https://qiankun.umijs.org/

## 三、vue 工程微前端化

vue 工程微前端化分为主应用和子应用两个部分。

### 1. 主应用

主应用一般是 portal 性质的应用。作为用户的入口，需要改造的主要是增加子应用的加载能力。这个 demo 里
我给 qiankun 做了一些简单封装：

- 子应用在表现是更接近远程组件（或组件集合）。与单个组件不同，子应用有自己的路由表。
- 将子应用的容器封装为一个组件，那么子应用的生命周期管理，就可以等同于一般组件的生命周期管理。这样更容易理解。

具体的代码见：[applet-loader](packages/applet-loader)

#### 1.1 子应用注册信息

主应用需要加载子应用，首先需要注册一个子应用。注册信息如下面的类型：

```ts
export declare type AppletManifest = {
  name: string; // 子应用的名称
  entry: string;
  propKeys?: string[];
};
```

`name` 是子应用的名称，这个名称可能会出现在代码中，应该按 `/[A-Z][A-Za-z0-9_]+/`（大写 CamelCase 风格）方式命名。比如：`ModuleAboutMe`、`AppletBlog` 等。

`entry` 是子应用的入口。如果子应用部署在二级目录。请记住最后的 `/`。如 `ModuleAboutMe` 应用的入口是
`http://localhost:9002/module-about-me/`，也可以写成 `//localhost:9002/module-about-me/`。

#### 1.2 路由表修改

如果子应用有自己的路由，那么在主应用中相应的路由设置中，需要增加 `*`，让主应用不再响应后续的路由。

在主应用加载一个带路由的子应用后，对于 url 的改变。主应用的 router 会响应，子应用的 router 也会响应，但主应用中
可能不存在相应的路由，会导致页面出现异常显示的问题。

> vue-router 在没有找到匹配的路由 path 时，会显示为空白。

如在主应用的 router 中，`/applets/about-me` 计划应用于子应用 ModuleAboutMe。所以需要改为：`/applets/about-me/*`。
另外，子应用中也需要增加代码，用于在创建根 vue 实现前，动态设置 router 的 `base`（下文中也会说明）。

例如主应用的路由：

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        // 这个路由用于子应用，加上 `*` 表示，这个/applets/about-me/开头的 url 都渲染 AboutMe 组件
        path: '/applets/about-me/*',
        name: 'ModuleAboutMe',
        component: AboutMe, // AboutMe 是一个组件，内部是一个子应用
      },
      {
        path: '/applets/blogs/*',
        name: 'ModuleBlog',
        meta: {
          baseUrl: '/applets/blogs/',
        },
        component: makeAppletComponent('ModuleBlog'), // 动态创建一个子应用容器组件
      },
    ],
  },
];
```

#### 1.3 子应用后台接口代理

微前端架构中，主应用子应用是组合为一个应用，子应用是作为主应用的一个模块出现。对于用户（浏览器）而言是一个页面。因此，
需要将子应用的后台改由主应用进行代理。

> 现实项目中，主应用和子应用更多情况下是两个不同的工程（可能由不同的项目组开发），应用的部署更多是独立部署。为了规范管理
> 主应用 nginx 中 `/api/applet/<应用名称>/` 应用于子应用的接口代理。子应用中通过 httpClient 的拦截器可以实现动态
> 增加前缀。

#### 1.4 启动微前端支持

主应用应该在根实例的 mounted 中启动微前端支持。如：

```js
new Vue({
  router,
  render: (h) => h(App),
  mounted() {
    systemStart(); // 由 applet-utils.js 提供
  },
}).$mount('#app');
```

### 2 子应用改造

子应用改造涉及多个部分：入口、构建、样式。

下面代码仅适用于使用 vue-cli 创建的 vue 工程。

> 2021 年了，应该统一使用 vue-cli 创建 vue 工程了。

#### 2.1 工程构建配置改为 umd 输出

umd 是一种 js 工程的打包格式。vue-cli 工程改为输出 umd 格式，可以在 vue.config.js 文件中增加 output 选项：

```js
const name = 'ModuleAboutMe'; // 名称与主应用中注册的保持一致

module.exports = {
  // 部署在二级目录，注意最后的 `/`。部署在根目录 publicPath 值是 `/`
  publicPath: '/module-about-me/',
  devServer: {
    // 本地开发，需要 CORS 支持
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // ... 其他配置
  },
  configureWebpack: {
    // 支持输出 umd 格式
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  // ... 其他配置
};
```

使用自定义脚本构建的，可以参与 webpack 文档。

#### 2.2 导入 public-path

默认配置下 webpack 会分 chunk 构建出项目的 js 文件，然后在浏览器加载时异步加载相应的文件。此时使用的路径一般是固定的。
但改为微前端子工程后，需要让 webpack 由指定的地址加载 js 文件。为此，需要需要动态设置 public-path。

要让 webpack 支持动态设置路径，需要增加一个 `__webpack_public_path__` 变量。具体就是在 src 目录下创建一个 `public-path.js` 文件。内容如下：

```js
/** eslint-disable */
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

在 vue 工程的入口 `src/main.js` 文件增加：

```js
// public-path 作为第一个 import 语句
import './public-path';

import Vue from 'vue';
// ... 其他代码
```

#### 2.3 动态设置 router 的 base 字段

默认情况下，vue-cli 创建的 router 默认导出为 vue-router 实例。微前端子应用化之后，需要改为动态设置 base：

`src/router/index.js` 文件：

```js
// 导出一个函数，用于动态设置 vue-router 的 base
export function createRouter(baseUrl) {
  return new VueRouter({
    mode: 'history',
    base: baseUrl, // base 改为参数
    routes,
  });
}
```

#### 2.4 main.js 中导出子应用生命周期函数

子应用的生命周期函数需要由具体子应用实现。主要是 `bootstrap()`、`mount(props)`、 `unmount()` 三个函数：

文档可看这里 [qiankun 快速上手-导出相应的生命周期][lifecycle1]、[Building single-spa applications][lifecycle2]

[lifecycle1]: https://qiankun.umijs.org/zh/guide/getting-started#1-%E5%AF%BC%E5%87%BA%E7%9B%B8%E5%BA%94%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90
[lifecycle2]: https://single-spa.js.org/docs/building-applications/

```js
function render(baseUrl) {
  const router = createRouter(baseUrl);

  rootInstance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#ModuleAboutMe');
}

// window.__POWERED_BY_QIANKUN__ 是标记属性，由 qiankun 加载时 window.__POWERED_BY_QIANKUN__ 非空
if (!window.__POWERED_BY_QIANKUN__) {
  render('/module-about-me/'); // 非 qiankun 引导时直接渲染
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  // 渲染子应用
  // 这里也可以实现一些参数配置，特别是子应用的 router 的 base 字段设置。
  // 通过 props，可以将主应用的一些数据传入到子应用中。
  render(props.baseUrl);
}

export async function unmount() {}
```

#### 2.5 httpClient 增加请求拦截器

微前端系统在用户的角度来看是一个独立的 spa 程序。浏览器窗口也只有一个，因此子应用的后台接口实际上是需要由
主应用代理。对于子应用，考虑到独立部署测试和微前端集成两种场景。可以在 httpClient 中增加一个请求拦截器
来实现环境区分。

对于 axios 可以使用类似下面的代码：

```js
instance.interceptors.request.use(
  (config) => {
    return {
      ...config,
      url: '/api/applet/AboutMe' + config.url,
    };
  },
  (err) => Promise.reject(err),
);
```
