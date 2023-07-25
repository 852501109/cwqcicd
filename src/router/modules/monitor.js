import { load } from '@/assets/js/common';
/*运维监控*/
export default [
    {
        path: '/monitor',
        component: load('layout/mainPage', 'components'),
        children: [
            //告警 - 告警
            {
                path: 'alarmManage',
                meta: { bodyClass: 'alarmManage', permission: ['monitorAlarmListMenu', 'monitorAlarmDown', 'monitorAlarmClean', 'monitorAlarmUpdate'] },
                component: load('authorManage/alarmManage'),
            },
            /*告警-告警详情*/
            {
                path: 'alarmManageEdit',
                meta: { bodyClass: 'alarmManageEdit', permission: ['monitorAlarmListMenu'] },
                component: load('authorManage/alarmManageEdit'),
            },
            //告警-事件
            {
                path: 'eventManage',
                meta: { bodyClass: 'eventManage', permission: [''] },
                component: load('authorManage/eventManage'),
            },
            /*告警-事件详情*/
            {
                path: 'eventManageEdit',
                meta: { bodyClass: 'eventManageEdit', permission: [''] },
                component: load('authorManage/eventManageEdit'),
            },
        ],
    },
];
