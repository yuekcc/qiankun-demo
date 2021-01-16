import { makeMicroAppContainer } from '../micro-app-utils';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'about/*',
        name: 'ModuleAboutMe',
        component: makeMicroAppContainer('ModuleAboutMe'),
      },
      {
        path: 'blog/*',
        name: 'ModuleBlog',
        component: makeMicroAppContainer('ModuleBlog'),
      },
    ],
  },

  {
    path: '*',
    component: {
      render(h) {
        return h('div', 'notfound');
      },
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
