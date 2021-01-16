import Vue from 'vue';
import VueRouter from 'vue-router';
import Study from '@/views/Study.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/works',
  },
  {
    path: '/study',
    name: 'Study',
    component: Study,
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('../views/Works.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
