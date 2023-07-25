import { load } from '@/assets/js/common';
export default [
    /*'
     * 消息管理
     * */

    {
        path: '/news',
        component: load('layout/mainPage', 'components'),
        children: [
            /*消息管理*/
            { path: 'newsTypeSys', meta: { bodyClass: 'newsTypeSys', permission: ['typeList', 'typeNew', 'typeId', 'typeEdit', 'typeDel'] }, component: load('news/newsTypeSys') },
            {
                path: 'newsTypeSysEdit',
                meta: { title: '消息管理', bodyClass: 'newsTypeSysEdit', permission: ['typeNew', 'typeId', 'typeEdit'] },
                component: load('news/newsTypeSysEdit'),
            },
            /*消息渠道*/
            {
                path: 'newsChannelSys',
                meta: {
                    title: '消息渠道',
                    bodyClass: 'newsChannelSys',
                    permission: ['channelList', 'channelNew', 'channelId', 'channelEdit', 'channelDel']
                },
                component: load('news/newsChannelSys')
            },
            /*消息渠道--编辑、新增*/
            {
                path: 'newsChannelSysEdit',
                meta: {
                    title: '消息渠道新增编辑',
                    bodyClass: 'newsChannelSysEdit',
                    permission: ['channelNew', 'channelId', 'channelEdit']
                },
                component: load('news/newsChannelSysEdit'),
            },
            /*消息管理*/
            {
                path: 'newsSearch',
                meta: {
                    title: '消息管理',
                    bodyClass: 'newsSearch',
                    permission: ['/news/newsSearch', 'messageList', 'messageGet', 'messageResend', 'messagesDel', 'messageInfoUpdate']
                },
                component: load('news/newsSearch')
            },
            {
                path: 'newsSearchEdit',
                meta: {
                    title: '消息管理',
                    bodyClass: 'newsSearchEdit',
                    permission: ['messageGet']
                },
                component: load('news/newsSearchEdit')
            },

            /*模板管理*/
            {
                path: 'sysMessageTemplateList',
                meta: {
                    title: '模板管理',
                    bodyClass: 'sysMessageTemplateList',
                    permission: ['templateList', 'templateAdd', 'templateId', 'templateEdit', 'templateDel', 'messageTemp']
                },
                component: load('news/sysMessageTemplateList'),
            },
            {
                path: 'sysMessageTemplateListEdit',
                meta: {
                    title: '模板管理',
                    bodyClass: 'sysMessageTemplateListEdit',
                    permission: ['templateAdd', 'templateId', 'templateEdit']
                },
                component: load('news/sysMessageTemplateListEdit'),
            },

            /*我的消息*/
            {
                path: 'userAnnouncement',
                meta: { title: '我的消息', bodyClass: 'userAnnouncement', permission: ['userMessages', 'messageUserDel', 'messageUserGet', 'messageInfoUpdate', 'messageUserUpdate'] },
                component: load('news/userAnnouncement'),
            },
            {
                path: 'userAnnouncementEdit',
                meta: { title: '我的消息', bodyClass: 'userAnnouncementEdit', permission: ['messageUserGet'] },
                component: load('news/userAnnouncementEdit'),
            },
            {
                path: 'announcementManage',
                meta: { title: '公告管理', bodyClass: 'announcementManage', pageName: '公告管理' },
                component: load('news/announcementManage'),
            },
            {
                path: 'announcementManageEdit',
                meta: { title: '我的消息', bodyClass: 'announcementManageEdit' },
                component: load('news/announcementManageEdit'),
            }
        ],
    },
];
