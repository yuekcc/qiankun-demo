# micro-frontend-demo

qiankun 的辅助工具，主要用于 vue 项目。文档见代码。

## 微前端笔记

### 1、qiankun 是什么

qiankun 是阿里出品的基于 single-spa 的高级封装。最大的特点是引入了 js 沙箱功能，在一定程序
上实现子应用（组件）的独立性。css 沙箱是基于 web component 实现，微前端改造的过程中，是有可能
出现问题的正是样式。比如 element-ui 2 在 web component 的 shadow DOM 会各种问题，基本不能
直接使用。

就目前的功能来看，qiankun 更像是一个远程组件加载器。

### 2、微前端概念

微前端一般分为主应用和子应用；所谓的“微”是指一个应用本身的业务是相对较确定的，适合按应用的领
进行域划分。

在具体实现上可以是一个工程实现多个业务领域，也可以是一个工程实现一个业务领域。主应用更多是导航性质
和公共服务，比如登录、登录过期管理、统一异常处理等。

### 3、vue 工程如何改造

#### 3.1 主应用

主应用一般是 portal 性质的应用了。作为用户的入口，需要改造的其实是比较少的：

- 增加子应用列表支持
- 路由修改，可某些路由下，引导到子应用，并由子应用接管
- 初始化 qiankun
- 后台接口代理支持

子应用的信息，qiankun 中用 AppMetadata 表示：

```ts
export declare type AppMetadata = {
    name: string;
    entry: string;
}
```

比如：

```ts
const microAppMetadata = {
  name: 'AboutMe', // 应用的名称
  entry: '//example.com/aboutma/' // 注意这里最后的 `/`
}
```

应用的名称应该全局唯一，考虑到 `name` 字段可能会应用代码，应用名称最好以大写 CamelCase 风格命名；
`entry` 是应用的入口（服务地址）。如何应用是部署在二级目录，请在最后加上 `/`。qiankun 在加载远程
资源时，才会正确找到地址。

路由改造主要是让主应用在某些路由地址中才加载子应用。由于 vue-router 的一些坑，需要在路由的 `path` 
段中加入 `*`，让主应用的 router 在后续地址中不再渲染其他组件。

> vue-router 在没有找到匹配的路由 path 时，会显示为空白。

如：

```js
const routes = [
  // ... 其他路由配置，更精确的路由 path，更优先
  {
    path: '/about*', // * 表示以 /about 开头的路由都使用这个配置
    name: 'aboutApp',
    component: makeAppComponent('AboutApp') // makeAppComponent 可以通过 makeAppComponentCreator 创建
  },
  {
    path: '*',
    component: NotFoundComponent
  },
]
```

启动 qiankun：启动 qiankun 只需要在主应用的组件 mounted 之后使用 `qiankunHelper.start()` 就可以

#### 3.2 子应用改造

子应用改造涉及两部分：构建、样式。

构建部分，如果是 vue-cli 创建的工程，需要修改三个地方：

**a) vue 工程增加 umd 格式输出**

修改 vue.config.js 文件增加这些内容：

```js
const { name } = require('./package');

module.exports = {
  publicPath: '/about/', // 部署在二级目录，注意最后的 `/`。部署在根目录 publicPath 值是 `/`
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*', // 本地开发，需要 CORS 支持
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

**b) main.js 中导出子应用生命周期函数**

```js
const render = () => {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#sssAppAContainer'); // 子应用的挂载点，尽量保持全系统唯一
};

// window.__POWERED_BY_QIANKUN__ 是标记属性，由 qiankun 加载时 window.__POWERED_BY_QIANKUN__ 非空
if (!window.__POWERED_BY_QIANKUN__) { 
  render(); // 非 qiankun 引导时直接渲染
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  // 渲染子应用
  // 这里也可以实现一些参数配置，特别是子应用的 router 的 base 字段设置。
  render(); 
}

export async function unmount() {}
```

**c) public-path 配置**

默认情况 webpack 打包出来的 js 文件是按相对路径加载资源文件。由 qiankun 引导后，需要动态设置 public-path。因此
需要在 main.js import 一个名为 'public-path.js' 的文件：

src/public-path.js 内容：
```js
/** eslint-disable */
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```
src/main.js 文件：

```js
import './public-path'; // public-path 作为第一个 import 语句

import Vue from 'vue';
// ... 其他代码

```

**d) httpClient 增加请求拦截器**

微前端系统在用户的角度来看是一个独立的 spa 程序。浏览器窗口也只有一个，因此子应用的后台接口实际上是需要由
主应用代理。对于子应用，考虑到独立部署测试和微前端集成两种场景。可以在 httpClient 中增加一个请求拦截器
来实现环境区分。

对于 axios 可以使用类似下面的代码：

```js
instance.interceptors.request.use(
  config => {
    return {
      ...config,
      url: '/api/eapps/AboutMe' + config.url 
    }
  },
  err => Promise.reject(err)
)
```