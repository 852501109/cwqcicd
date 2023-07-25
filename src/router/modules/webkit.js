import { load } from '@/assets/js/common';
export default [
    // 安全管理
    {
        path: '/webkit',
        component: load('layout/mainPage', 'components'),
        children: [
            //角色列表
            {
                path: 'roleManage',
                meta: {
                    title: '角色列表',
                    bodyClass: 'roleManage',
                    permission: ['getEditRole', 'roleList', 'addRole', 'deleteRole', 'modifyRole'],
                },
                component: load('userManage/roleManage'),
            },
            //角色管理-新增、编辑
            {
                path: 'roleManageEdit',
                meta: { title: '角色列表新增编辑', bodyClass: 'tagManage', permission: ['modifyRole', 'getEditRole'] },
                component: load('userManage/roleManageEdit'),
            },
            /*用户管理*/
            {
                path: 'userManage',
                meta: {
                    title: '用户管理',
                    bodyClass: 'userManage',
                    permission: [
                        'userList',
                        'getEditUser',
                        'modifyUser',
                        'resetPwd',
                        'disableUser',
                        'enableUser',
                        'deleteUser',
                        'forceLogoutUser',
                        'addUser',
                        'effectExpiredUser',
                    ],
                },
                component: load('userManage/userManage'),
            },
            //用户管理--编辑、新增
            {
                path: 'userManageEdit',
                meta: {

                    title: '用户管理新增编辑',
                    bodyClass: 'userManageEdit',
                    permission: ['modifyUser', 'getEditUser'],
                },
                component: load('userManage/userManageEdit'),
            },
            /*部门用户*/
            {
                path: 'myUserManage',
                meta: {
                    title: '部门用户',
                    bodyClass: 'myUserManage',
                    permission: ['myUserList'],
                },
                component: load('userManage/myUserManage'),
            },
            //租户用户管理
            {
                path: 'userCount',
                meta: { title: '租户用户管理', bodyClass: 'userCount', permission: ['addTenantUser', 'deleteTenantUser'] },
                component: load('userManage/userCount'),
            },
            //租户用户管理--新增
            {
                path: 'userCountEdit',
                meta: {
                    title: '租户用户新增编辑',
                    bodyClass: 'userCountEdit',
                    permission: ['addTenantUser'],
                },
                component: load('userManage/userCountEdit'),
            },
            //租户管理
            {
                path: 'tenantManage',
                meta: {
                    title: '租户用户',
                    bodyClass: 'tenantManage',
                    permission: [
                        'tenantList',
                        'addTenant',
                        'deleteTenant',
                        'modifyTenant',
                        'tenantUserList',
                        'getEditTenant',
                        'addTenantUser',
                        'deleteTenantUser',
                    ],
                },
                component: load('userManage/tenantManage'),
            },
            //租户管理--新增、编辑
            {
                path: 'tenantManageEdit',
                meta: { title: '租户用户新增编辑', bodyClass: 'tenantManageEdit', permission: ['modifyTenant'] },
                component: load('userManage/tenantManageEdit'),
            },
            /*安全管理-组织管理(系统管理员)*/
            {
                path: 'orgManage',
                meta: {
                    title: '组织管理',
                    bodyClass: 'orgManage',
                    keepAlive: false,
                    permission: [
                        'findRootDeptTree',
                        'addDepartment',
                        'modifyDepartment',
                        'deleteDepartment',
                        'moveDeptOrder',
                        'addDeptUser',
                        'modifyDeptUser',
                        'deleteDeptUser',
                        'findDataAccess',
                        'setDataAccess',
                        'setDeptManager',
                    ],
                },
                component: load('userManage/orgManage'),
            },
            /*安全管理-组织管理(部门管理员)*/
            {
                path: 'myOrgManage',
                meta: {
                    title: '组织管理',
                    bodyClass: 'myOrgManage',
                    keepAlive: false,
                    permission: [
                        'findMyDept',
                        'getMyDeptTag',
                        'addMyDepartment',
                        'modifyMyDepartment',
                        'deleteMyDepartment',
                        'addMyDeptUser',
                        'modifyMyDeptUser',
                        'deleteMyDeptUser',
                        'setMyDataAccess',
                        'setMyDeptManager',
                    ],
                },
                component: load('userManage/myOrgManage'),
            },
            /*标签管理*/
            {
                path: 'tagManage',
                meta: {
                    title: '标签管理',
                    bodyClass: 'tagManage',
                    permission: ['tagList', 'modifyTag', 'deleteTag', 'addTag', 'getEditTag'],
                },
                component: load('userManage/tagManage'),
            },
            /*标签管理--编辑、新增*/
            {
                path: 'tagManageEdit',
                meta: {

                    title: '标签管理编辑新增',
                    bodyClass: 'tagManageEdit',
                    permission: ['modifyTag', 'getEditTag'],
                },
                component: load('userManage/tagManageEdit'),
            },
            /*安全管理-组织管理-添加用户*/
            {
                path: 'orgManageAddUser',
                meta: {

                    title: '组织管理添加用户',
                    bodyClass: 'orgManageAddUser',
                    permission: ['addDeptUser', 'addMyDeptUser'],
                },
                component: load('userManage/orgManageAddUser'),
            },
            /*安全管理-组织管理 数据权限*/
            {
                path: 'orgManageAuthority',
                meta: { title: '组织管理数据权限', bodyClass: 'orgManageAuthority', permission: ['setDataAccess', 'setMyDataAccess'] },
                component: load('userManage/orgManageAuthority'),
            },
            //隐私声明管理
            {
                path: 'privacy/version',
                meta: { title: '隐私声明管理', bodyClass: 'privacy-version', permission: [] },
                component: load('privacy/version'),
            },
        ],
    },
];
