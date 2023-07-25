import { load } from '@/assets/js/common';
// 调度策略管理
export default [
    {
        path: '/schedule',
        component: load('layout/mainPage', 'components'),
        children: [
            {
                path: 'scheduleList',
                meta: {
                    title: '调度策略管理',
                    bodyClass: 'scheduleList',
                    permission: [
                        'scheduleStrategyList',
                        'scheduleAddStrategy',
                        'scheduleModifyStrategy',
                        'scheduleDeleteStrategy',
                    ],
                },
                component: load('schedule/scheduleList'),
            },
            {
                path: 'scheduleAddorEdit',
                meta: { bodyClass: 'scheduleAddorEdit', permission: ['scheduleModifyStrategy'] },
                component: load('schedule/scheduleAddorEdit'),
            },
        ],
    },
];
