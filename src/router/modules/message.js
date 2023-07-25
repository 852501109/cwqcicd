import {load} from '@/assets/js/common';

export default [
    {
        path: '/message',
        component: load('layout/mainPage', 'components'),
        children: [{path: 'messageManage', meta: {bodyClass: 'messageManage'}, component: load('message/messageManage')}]
    },
];
