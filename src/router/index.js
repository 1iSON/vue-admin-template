import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/home',
                    component: resolve => require(['../components/page/Home.vue'], resolve),
                    meta: { title: '电影首页' }
                },
                {
                    path: '/search',
                    component: resolve => require(['../components/page/Search.vue'], resolve),
                    meta: { title: '电影搜索' }
                },
                {
                    path: '/list',
                    component: resolve => require(['../components/page/List.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
