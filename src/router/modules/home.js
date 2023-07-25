import { load } from '@/assets/js/common';
export default [
    {
        path: '/',
        redirect: window.isSignIn == 'login' ? '/login' : "index",
    },
    {
        path: '/index',
        meta: { bodyClass: 'index' },
        component: load('layout/mainPage', 'components'),
        children: [
            { path: '', meta: { bodyClass: 'home' }, component: load('home') },
            {
                path: 'announcementList',
                meta: { bodyClass: 'announcementList', pageName: '公告列表' },
                component: load('message/announcementList'),
            },
            {
                path: 'announcementEdit',
                meta: { bodyClass: 'announcementEdit', pageName: '公告详情' },
                component: load('message/announcementEdit'),
            },
        ],
    },
    // {
    //     path: '/index',
    //     component: load('layout/mainPage', 'components'),
    //     children: [{path: 'announcementList', meta: {bodyClass: 'announcementList',pageName:'公告列表'}, component: load('message/announcementList')}]
    // },
    // {
    //     path: '/index',
    //     component: load('layout/mainPage', 'components'),
    //     children: [{path: 'announcementEdit', meta: {bodyClass: 'announcementEdit',pageName:'公告详情'}, component: load('message/announcementEdit')}]
    // }
];
