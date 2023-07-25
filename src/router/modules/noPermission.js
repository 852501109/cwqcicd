import {load} from '@/assets/js/common'

export default [
    //没有权限调转的页面
    {
        path: '',
        component: load('layout/mainPage', 'components'),
        children: [
            { path: '/noPermission',  component: load('noPermission') },
        ],
    },


]
