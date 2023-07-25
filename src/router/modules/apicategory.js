/*
* @description 接口查询类别表 路由配置文件
* @author liyaxin
* @date 2023-06-15 08:49:03
*/
import { load } from '@/assets/js/common';
export default [
    {
        path: '/apicategory',
        component: load('layout/mainPage', 'components'),
        children: [
            // 接口查询类别表管理
            { name: 'ApicategoryList', path: 'apicategoryList', meta: { title: '接口类别', bodyClass: 'apicategoryList', permission: ['apicategoryList', 'addApicategory', 'updateApicategory', 'deleteApicategory'] }, component: load('apicategory/apicategoryList') },
            { path: 'apicategoryEdit', meta: { title: '接口类别新增编辑', bodyClass: 'apicategoryEdit', permission: ['apicategoryDetail', 'addApicategory', 'updateApicategory'] }, component: load('apicategory/apicategoryEdit') },
        ],
    },
];
