export default [{
        name: '用户管理',
        id: '11',
        icon: 'icon-yonghuguanli',
        children: [{
                name: '用户管理',
                // id: 'systemUser',
                id: 'userList',
                icon: '',
                path: '/webkit/userManage'
            },
            {
                name: '角色管理',
                // id: 'systemRole',
                id: 'roleList',
                icon: '',
                path: '/webkit/roleManage'
            },

        ]
    },
    {
        name: '权限管理',
        id: '1211',
        icon: 'icon-erji-quanxianguanli',
        children: [{
                name: '属性配置',
                // id: 'config',
                id: 'propertiesList',
                icon: '',
                path: '/webkit/propertyConfig'
            },
            {
                name: '登录日志',
                // id: 'loginLog',
                id: 'loginLogList',
                icon: '',
                path: '/webkit/logManage'
            },
            {
                name: '操作记录',
                // id: 'optLog',
                id: 'optLogList',
                icon: '',
                path: '/webkit/optManage'
            }
        ]
    },
    {
        name: '数据源管理',
        id: '3',
        icon: 'icon--peizhishujuyuan',
        children: [{
                name: '关系数据来源管理',
                // id: 'datasource',
                id: 'datasourceList',
                icon: '',
                path: '/webkit/datasource_list'
            },
            {
                name: '文件来源管理',
                // id: 'datasource',
                id: 'getDimFileSourceConnects',
                icon: '',
                path: '/webkit/filesource_list'
            },
            {
                name: '大数据来源管理',
                // id: 'datasource',
                id: 'getDimBigDataSourceConnects',
                icon: '',
                path: '/webkit/bigDatasource_list'
            },
        ]
    }
]
