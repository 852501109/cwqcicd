import { load } from '@/assets/js/common';
/*
接口配置
*/
export default [
    {

        path: '/api',
        meta: { bodyClass: 'api' },
        component: load('layout/mainPage', 'components'),
        children: [
            // 报表展示页
            {
                name: 'ApiDisplay',
                path: 'display',
                meta: {
                    title: '接口查询',
                    bodyClass: 'display',
                },
                component: load('api/display'),
            },
        ],
    }
];
