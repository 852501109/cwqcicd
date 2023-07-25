/*
* @description  路由配置文件
* @author zhangweiwei
* @date 2023-07-11 18:25:59
*/
import { load } from '@/assets/js/common';
export default [
    {
        path: '/apiCallStatistics',
        component: load('layout/mainPage', 'components'),
        children: [
            // 管理
            { path: 'apiCallStatisticsList', meta: { bodyClass: 'apiCallStatisticsList',permission: ['apiCallStatisticsList'] }, component: load('apiCallStatistics/apiCallStatisticsList') },
         ],
    },
];
