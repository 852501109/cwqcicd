import { load } from '@/assets/js/common';
export default [
    {
        path: '/main',
        meta: { bodyClass: 'main' },
        component: load('layout/mainPage', 'components'),
        children: [
            { path: '', meta: { bodyClass: 'main' }, component: load('main') },
        ],
    },
];
