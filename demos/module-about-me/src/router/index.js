import Vue from 'vue';
import VueRouter from 'vue-router';
import Study from '@/views/Study.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/works', // 跳转到下级路由
  },
  {
    path: '/study',
    name: 'Study',
    component: Study,
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('../views/Works.vue'), // 异步加载组件
  },
];

export function createRouter(baseUrl) {
  return new VueRouter({
    mode: 'history',
    base: baseUrl,
    routes,
  });
}
