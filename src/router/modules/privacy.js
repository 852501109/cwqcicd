import { load } from '@/assets/js/common';
export default [
    // 隐私声明
    {
        path: '/privacy',
        component: load('layout/mainPage', 'components'),
        children: [
            //版本管理
            {
                path: 'version',
                meta: { title: '隐私声明', bodyClass: 'privacy-version', permission: ['userList'] },
                component: load('privacy/version'),
            },
        ],
    },
];
