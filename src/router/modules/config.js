import { load } from '@/assets/js/common';
/*
配置管理
*/
export default [
    {
        path: '/config',
        component: load('layout/mainPage', 'components'),
        children: [
            // 应用管理
            {
                path: 'appManage',
                meta: {
                    title: '应用管理',
                    bodyClass: 'appManage',
                    permission: ['addApp', 'appList', 'deleteApp', 'modifyApp', 'enableApp', 'disableApp', 'getEditApp'],
                },
                component: load('authorManage/appManage'),
            },
            // 应用新增编辑
            {
                path: 'appManageEdit',
                meta: { title: '应用新增编辑', bodyClass: 'appManageEdit', permission: ['modifyApp', 'getEditApp'] },
                component: load('authorManage/appManageEdit'),
            },
            /*数据源管理*/
            {
                path: 'datasource',
                meta: {
                    title: '数据源管理',
                    bodyClass: 'datasource',
                    permission: ['sourceList', 'addSource', 'modifySource', 'deleteSource', 'enableSource', 'disableSource', 'testSource',],
                },
                component: load('datasource/datasource'),
            },
            /*我的数据源*/
            {
                path: 'myDatasource',
                meta: {
                    title: '我的数据源',
                    bodyClass: 'myDatasource',
                    permission: ['mySourceList', 'mySourceDetail', 'addMySource', 'modifyMySource', 'deleteMySource', 'enableMySource', 'disableMySource', 'testMySource'],
                },
                component: load('datasource/myDatasource'),
            },
            /*数据源编辑*/
            {
                path: 'datasourceEdit',
                meta: { title: '数据源编辑', bodyClass: 'datasourceEdit', permission: ['testSource', 'testMySource', 'modifyMySource', 'modifySource', 'addSource'] },
                component: load('datasource/datasourceEdit'),
            },
            /*模型管理*/
            {
                path: 'modelManagement',
                meta: { title: '模型管理', bodyClass: 'modelManagement' },
                component: load('model/modelManagement'),
            },
            /*系统管理|*/
            {
                path: 'systemConfig',
                meta: { title: '系统管理', bodyClass: 'systemConfig', permission: ['systemConfigMenu', 'addSystem', 'modifySystem', 'deleteSystem'] },
                component: load('authorManage/systemConfig'),
            },
            /*系统管理 编辑新增修改*/
            {
                path: 'systemConfigEdit',
                meta: { title: '系统管理新增编辑', bodyClass: 'systemConfigEdit', permission: ['modifySystem'] },
                component: load('authorManage/systemConfigEdit'),
            },
            /*平台管理|*/
            {
                path: 'systemGrouping',
                meta: { title: '平台管理', bodyClass: 'systemGrouping', permission: ['platformConfigMenu', 'addPlatform', 'modifyPlatform', 'deletePlatform', 'movePlatformOrder'] },
                component: load('authorManage/systemGrouping'),
            },
            /*平台管理  编辑新增修改*/
            {
                path: 'systemGroupingEdit',
                meta: { title: '平台管理新增编辑', bodyClass: 'systemGroupingEdit', permission: ['addPlatform', 'modifyPlatform'] },
                component: load('authorManage/systemGroupingEdit'),
            },
        ],
    },
];
