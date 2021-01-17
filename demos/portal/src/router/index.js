import { Home } from '@/views/home';
import { makeAppletComponent } from '@/applet-utils';
import AboutMe from '@/views/about';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/applets/about-me/*',
        name: 'ModuleAboutMe',
        component: AboutMe,
      },
      {
        path: '/applets/blogs/*',
        name: 'ModuleBlog',
        meta: {
          baseUrl: '/applets/blogs/',
        },
        component: makeAppletComponent('ModuleBlog'),
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
