import Vue from 'vue';
import App from './App.vue';
import { qiankunStart } from './iapp';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  mounted() {
    qiankunStart();
  },
}).$mount('#app');
