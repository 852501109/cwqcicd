/*
* @description 接口配置表 路由配置文件
* @author liyaxin
* @date 2023-06-15 14:46:10
*/
import { load } from '@/assets/js/common';
export default [
    {
        path: '/apiConf',
        component: load('layout/mainPage', 'components'),
        children: [
            // 接口配置表管理
            { path: 'apiConfList', meta: { title: '接口配置', bodyClass: 'apiConfList', permission: ['apiConfList', 'addApiConf', 'updateApiConf', 'deleteApiConf', 'apiConfDetail', 'changeApiConfState'] }, component: load('apiConf/apiConfList') },
            { path: 'apiConfEdit', meta: { title: '接口配置新增编辑', bodyClass: 'apiConfEdit', permission: ['apiConfDetail', 'addApiConf', 'updateApiConf'] }, component: load('apiConf/apiConfEdit') },
        ],
    },
];
