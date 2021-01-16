import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/components/layout.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'BlogList' },
  },
  {
    path: '/blog',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'BlogList',
        component: () => import('../views/blog/list.vue'),
      },
      {
        path: 'details/:postId',
        name: 'BlogDetails',
        component: () => import('../views/blog/blog-details.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/module-blog/',
  routes,
});

export default router;
