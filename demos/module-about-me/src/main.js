import './public-path';
import Vue from 'vue';
import App from '@/App.vue';
import { createRouter } from '@/router';

Vue.config.productionTip = false;

let rootInstance;

function render(baseUrl) {
  const router = createRouter(baseUrl);

  rootInstance = new Vue({
    router,
    render: h => h(App),
  }).$mount('#ModuleAboutMe');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render('/module-about-me/');
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('MicroApp mounted. app name: ModuleBlog');
  render(props.baseUrl);
}

export async function unmount() {
  if (rootInstance) {
    rootInstance.$destroy();
  }
}
