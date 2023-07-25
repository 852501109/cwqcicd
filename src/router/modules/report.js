import { load } from '@/assets/js/common';
/*
库表配置
*/
export default [
    {

        path: '/report',
        meta: { bodyClass: 'report' },
        component: load('layout/mainPage', 'components'),
        children: [
            // 库表展示页
            {
                name: 'ReportDisplay',
                path: 'display',
                meta: {
                    affix: true,
                    title: '库表查询',
                    bodyClass: 'display',
                },
                component: load('report/display'),
            },
        ],
    },
    {
        path: '/reportConfig',
        component: load('layout/mainPage', 'components'),
        children: [
            // 类别
            {
                path: 'reportCategory',
                meta: {
                    title: '库表类别',
                    bodyClass: 'reportCategory',
                    permission: ['reportCategoryList', 'addReportCategory', 'editReportCategory', 'deleteReportCategory', 'queryReportCategory'],
                },
                component: load('reportConfig/category'),
            },
            // 类别新增编辑
            {
                path: 'categoryEdit',
                meta: { title: '库表类别新增编辑', bodyClass: 'categoryEdit', permission: ['addReportCategory', 'editReportCategory', 'queryReportCategory'] },
                component: load('reportConfig/categoryEdit'),
            }
            ,
            // 配置
            {
                path: 'config_1',

                meta: {
                    title: '库表配置',
                    bodyClass: 'config_1',
                    permission: ['authorizatioApiQueryConf', 'configList', 'addReportConfig', 'editReportConfig', 'deleteReportConfig', 'queryReportConfig', 'changeReportConfigState'],
                },
                component: load('reportConfig/config'),
            },
            // 配置新增编辑
            {
                path: 'configEdit',
                meta: { title: '库表配置新增编辑', bodyClass: 'configEdit', permission: ['addReportConfig', 'queryReportConfig'] },
                component: load('reportConfig/configEdit'),
            }
        ],
    },
];
