import './public-path';

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

const render = () => {
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#sssAppAContainer');
};

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount() {
  console.log('MicroApp mounted. app name: ModuleBlog');
  render();
}

export async function unmount() {}
