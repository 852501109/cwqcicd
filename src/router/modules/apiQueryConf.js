/*
* @description 接口查询配置表 路由配置文件
* @author liyaxin
* @date 2023-06-15 15:16:37
*/
import { load } from '@/assets/js/common';
export default [
    {
        path: '/apiQueryConf',
        component: load('layout/mainPage', 'components'),
        children: [
            // 接口查询配置表管理
            { path: 'apiQueryConfList', meta: { title: '查询配置', bodyClass: 'apiQueryConfList', permission: ['apiQueryConfList', 'addApiQueryConf', 'updateApiQueryConf', 'deleteApiQueryConf', 'chageStateApiQueryConf', 'authorizationApiQueryConf'] }, component: load('apiQueryConf/apiQueryConfList') },
            { path: 'apiQueryConfEdit', name: 'apiqueryconfedit', meta: { title: '查询配置新增编辑', bodyClass: 'apiQueryConfEdit', permission: ['apiQueryConfDetail', 'addApiQueryConf', 'updateApiQueryConf'] }, component: load('apiQueryConf/apiQueryConfEdit') },
        ],
    },
];
