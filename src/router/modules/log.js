import { load } from '@/assets/js/common';
/*日志管理*/
export default [
    {
        path: '/log',
        component: load('layout/mainPage', 'components'),
        children: [
            // 日志-登录日志
            { path: 'logManage', meta: { bodyClass: 'logManage',permission: ['loginLogManageMenu'] }, component: load('log/logManage') },
            // 日志-操作日志
            { path: 'optManage', meta: { bodyClass: 'optManage',permission: ['optLogManageMenu'] }, component: load('log/optManage') },
            //日志-日志管理
            { path: 'loginLeaveManage', meta: { bodyClass: 'loginLeaveManage',permission: ['hwLogManageMenu'] }, component: load('log/loginLeaveManage'),},
            // 日志-部门登录日志
            // { path: 'deptLogManage', meta: { bodyClass: 'deptLogManage' }, component: load('log/deptLogManage') },
            // 日志-部门操作日志
            // { path: 'deptOptManage', meta: { bodyClass: 'deptOptManage' }, component: load('log/deptOptManage') },
        ],
    },
];
