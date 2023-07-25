import { load, loadfunc } from '@/assets/js/common';
export default [
    /*流程设计*/
    {
        path: '/process/index',
        meta: { permission: ['modelImg'] },
        component: loadfunc('views/process/workflow/index'),
    },

    {
        path: '/process',
        component: load('layout/mainPage', 'components'),
        children: [
            /**工作台**/
            /*工单申请*/
            {
                path: 'workbench/startWorkflowTypes',
                meta: {
                    title: '工单申请',
                    bodyClass: 'workbench-startWorkflowTypes',
                    permission: ['formListApply', 'bizNew']
                },
                component: load('process/workbench/startWorkflowTypes'),
            },
            /*我的工单+*/
            {
                path: 'workbench/myWorkflowList',
                meta: {
                    title: '我的工单',
                    bodyClass: 'workbench-myWorkflowList',
                    permission: ['myWorkflowListMenu', 'bizSelect', 'bizUpdate', 'bizDel', 'bizStart', 'bizCancel', 'bizHasten', 'proImg']
                },
                component: load('process/workbench/myWorkflowList'),
            },
            /*我的工单--详情*/
            {
                path: 'workbench/myWorkflowEdit',
                meta: { title: '我的工单详情', bodyClass: 'workbench-myWorkflowEdit', permission: ['bizSelect', 'bizUpdate', 'ccList'] },
                component: load('process/workbench/myWorkflowEdit'),
            },
            /*我的待办*/
            {
                path: 'workbench/workflowReviewList',
                meta: {
                    title: '我的待办',
                    bodyClass: 'workbench-workflowReviewList',
                    permission: ['workflowReviewListMenu', 'taskSubmit', 'taskDelegate', 'taskReject', 'taskBackNodes', 'taskBack', 'taskHistoric']
                },
                component: load('process/workbench/workflowReviewList'),
            },
            //我的已办
            {
                path: 'workbench/workflowReviewListOver',
                meta: { title: '我的已办', bodyClass: 'workbench-workflowReviewList', permission: ['workflowReviewListMenuOver'] },
                component: load('process/workbench/workflowReviewListOver'),
            },
            /*我的已办--查看*/
            {
                path: 'workbench/workflowReviewEdit',
                meta: { title: '我的已办查看', bodyClass: 'workbench-workflowReviewEdit', permission: ['workflowReviewListMenuOver'] },
                component: load('process/workbench/workflowReviewEdit'),
            },

            /*抄送我的*/
            {
                path: 'workbench/ccMineList',
                meta: { title: '抄送我的', bodyClass: 'workbench-ccMineList', permission: ['ccList'], pageName: '抄送我的' },
                component: load('process/workbench/ccMineList'),
            },


            /*业务注册*/
            {
                path: 'workflow/businessRegistration',
                meta: { title: '业务注册', bodyClass: 'businessRegistration', permission: ['businessRegistrationMenu', 'categoryInsert', 'categoryUpdate', 'categoryId', 'categoryDel'] },
                component: load('process/workflow/businessRegistration'),
            },
            {
                path: 'workflow/businessRegistrationEdit',
                meta: { bodyClass: 'businessRegistrationEdit', permission: ['businessRegistrationMenu'] },
                component: load('process/workflow/businessRegistrationEdit'),
            },
            /*流程配置*/
            // { path: 'workflow/processConfig', meta: { bodyClass: 'processConfig',permission:[] }, component: load('process/workflow/processConfig') },
            {
                path: 'workflow/processConfigEdit',
                meta: { title: '流程配置', bodyClass: 'processConfigEdit', permission: ['modelNew'] },
                component: load('process/workflow/processConfigEdit'),
            },
            /*版本管理*/
            {
                path: 'workflow/versionManagement',
                meta: { title: '版本管理', bodyClass: 'versionManagement', permission: ['processList', 'processId', 'processStatus', 'processUpdate', 'processDel', 'processNode', 'modelNew', 'modelDel', 'modelExport'] },
                component: load('process/workflow/versionManagement'),
            },
            /*流程节点配置*/
            {
                path: 'workflow/procesNodeConfig',
                meta: { title: '流程节点配置', bodyClass: 'procesNodeConfig', permission: ['processNode', 'processId', 'processNodeNext', 'processNodeAll'] },
                component: load('process/workflow/procesNodeConfig'),
            },
            /*流程模型*/
            {
                path: 'workflow/processModel',
                meta: {
                    title: '流程模型',
                    bodyClass: 'processModel',
                    permission: ['processModelMenu', 'modelDesign', 'modelList', 'modelNew', 'modelDeploy', 'modelDel', 'modelImg', 'modelExport', 'modelImport', 'processList', 'processId', 'processStatus', 'processUpdate', 'processDel', 'processNodeNext', 'processNodeAll']
                },
                component: load('process/workflow/processModel'),
            },
            /*流程监控*/
            {
                path: 'workflow/processMonitoring',
                meta: { title: '流程监控', bodyClass: 'processMonitoring', permission: ['processMonitoringMenu', 'runningInsList', 'finishedInsList', 'insStatus', 'taskHistoric', 'bizCancel', 'insStatus', 'taskBack', 'insHistoricDel'] },
                component: load('process/workflow/processMonitoring'),
            },
        ],
    },
];
