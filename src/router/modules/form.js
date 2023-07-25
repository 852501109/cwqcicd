import { load, loadfunc } from '@/assets/js/common';
/*
表单设计
*/
export default [
    {
        path: '/process/form',
        component: load('layout/mainPage', 'components'),
        children: [
            /*表单列表*/
            {
                path: 'list',
                meta: {
                    title: '表单列表',
                    bodyClass: 'form-list',
                    permission: ['formList', 'formNew', 'formId', 'formUpdate', 'formDel', 'formTableInfo', 'formTableCheck', 'formDateList', 'formDateNew', 'formDateUpdate', 'formDateSelect', 'formDateDel']
                },
                component: loadfunc('views/formGenerator/views/index/list'),
            },
            /*表单数据*/
            /*  {
                  path: 'dataList',
                  meta: {
                      bodyClass: 'form-dataList',
                      permission:['formDateList','formDateNew','formDateUpdate','formDateSelect','formDateDel']
                  },
                  component: loadfunc('views/formGenerator/views/index/dataList'),
              },*/
            /*表单设计*/
            {
                path: 'design',
                meta: {
                    title: '表单设计',
                    bodyClass: 'form-design',
                    permission: ['formId', 'formUpdate']
                },
                component: loadfunc('views/formGenerator/views/index/design'),
            },
        ],
    },
];
