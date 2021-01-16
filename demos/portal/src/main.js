import Vue from 'vue';
import App from './App.vue';
import { systemStart } from './micro-app-utils';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  mounted() {
    systemStart();
  },
}).$mount('#app');
