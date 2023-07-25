import { load } from '@/assets/js/common';

export default [
    { path: '/login', component: load(window.isSignIn) },
    /*不需要登录权限在路由解析页面做限制*/
    {
        path: '/modifyPassword',
        component: load('login/modifyPassword'),
    },
    /*不需要登录权限在路由解析页面做限制  (常熟定制，常熟webkit后端配置的页面)*/
    {
        path: '/modifyPassword_changShu', component: load('login/modifyPassword1'),
    },
    /*需要登录权限 （常熟定制  常熟门户进来配置的页面）*/
    {
        path: '/modifyPassword_changShu1',
        component: load('login/modifyPassword1'),
    },
    /*找回密码页面*/
    {
        path: '/retrievePassword',
        component: load('login/retrievePassword'),
    },
    {
        path: '/redirect',
        component: load('layout/mainPage', 'components'),
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
];
