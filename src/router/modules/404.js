import {load} from '@/assets/js/common'

export default [
    {path: '*', redirect: '/404'},
    {path: '/401', component: load('errorPage/401')},
    {path: '/404', component: load('errorPage/404')},
    // {path: '*', redirect: '/index'}
]
