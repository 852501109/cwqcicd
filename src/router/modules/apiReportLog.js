/*
* @description 系统审计表 路由配置文件
* @author liyaxin
* @date 2023-06-15 15:51:11
*/
import { load } from '@/assets/js/common';
export default [
    {
        path: '/apiReportLog',
        component: load('layout/mainPage', 'components'),
        children: [
            // 系统审计表管理
            { path: 'apiReportLogList', meta: { title: '系统审计', bodyClass: 'apiReportLogList', permission: ['apiReportLogList', 'addApiReportLog', 'updateApiReportLog', 'deleteApiReportLog'] }, component: load('apiReportLog/apiReportLogList') },
            { path: 'apiReportLogEdit', meta: { title: '系统审计', bodyClass: 'apiReportLogEdit', permission: ['apiReportLogDetail', 'addApiReportLog', 'updateApiReportLog'] }, component: load('apiReportLog/apiReportLogEdit') },
            // 接口查询进度监控
            { path: 'apiReportLogAuditList', meta: { keepAlive: true, title: '接口查询进度监控', bodyClass: 'apiReportLogAuditList', permission: ['apiReportLogAuditList'] }, component: load('apiReportLog/apiReportLogAuditList') },
        ],
    },

];
