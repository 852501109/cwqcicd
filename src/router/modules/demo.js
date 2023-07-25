import { load } from '@/assets/js/common';
export default [
    /*演示模块*/
    {
        path: '/demo',
        component: load('layout/mainPage', 'components'),
        children: [
            { path: 'governanceProcess', meta: { title: '演示模块', bodyClass: 'demoCls' }, component: load('demo/governanceProcess') },
        ],
    },
    /*数据库版本信息*/
    {
        path: '/lists',
        component: load('layout/mainPage', 'components'),
        children: [
            { path: 'pageList', meta: { title: '数据库版本信息', bodyClass: 'pageList' }, component: load('lists/pageList') },
            { path: 'pageListEdit', meta: { title: '数据库版本信息', bodyClass: 'pageListEdit' }, component: load('lists/pageListEdit') },
        ],
    },
];
