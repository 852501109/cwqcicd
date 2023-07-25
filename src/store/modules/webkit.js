import { resolve } from 'core-js/fn/promise';
import list from '../../views/formGenerator/views/index/list';

export default (request, API) => {
    const state = {
        securityUserList: [],
        tenantUserList: {
            list: [],
            total: 0,
        },
        tenantList: [],
        userList: [], //用户管理-用户列表数据
        userListPages: 0, //用户管理-用户列表总页数
        appList: {
            list: [],
            total: 0,
        },
        alarmAppList: {
            //告警列表的应用列表
            list: [],
        },
        eventAppList: {
            //事件管理的应用列表
            list: [],
        },
        rootorgList: [],
        tagList: [], // 权限标签
        logList: {}, // 登录日志
        optList: {}, // 操作记录
        schedList: {}, //调度管理
        cheduleGroups: [], //调度管理 业务分类
        resourceList: [], // 新增标签数
        getResourceList: [], // 权限菜单列表
        isArr: [], // 默认选中一级菜单数
        execDetail: {},
        calcRunTime: [], // 最近5次
        roleList: [],
        propertyConfigList: {
            list: [],
            total: 0,
        },
        userInfo: {},
        tenantMode: null, //0表示非租户,1表示物理,2表示逻辑
        tenantName: '', //租户名称
        defTenant: null, //0表示在租户环境内容
        headerStic: '',
        SERACHOPT_LIST: [],
        SERACHOPT_GROUP: [],
        myAppList: [],
        ImgUrlList: [],
        largeImgUrlList: [],
        reportCategoryList: [],
        reportCategoryDetail: {},
        reportCategoryAll: [],
        reportConfigList: [],
        reportConfigDetail: {},
        reportConfigMenuList: [],
        apiConfigMenuList: [],
        reportTableList: [],
        reportColumnList: [],
        reportDisplayList: {},
        reportDrillList: {},
        apiDisplayList: {},
        traversalChildren(data, keys, filter, isDisabled) {
            // 非叶子节点
            if (data.value != null && data.value != '') data.value = keys + '.' + data.value;
            if (data.children && data.children.length > 0) {
                // var flag = true; //
                data.other = true; // 默认禁用
                data.children.forEach((item) => {
                    var flag = this.traversalChildren(item, keys, filter, item.other);
                    if (!flag) {
                        data.other = false;
                    }
                });

                return data.other;
            }
            // 叶子节点
            data.other = false; // 默认启用
            if (!filter || isDisabled || data.disabled == 'disabled') {
                data.other = true;
            }

            return data.other;
        },
    };

    const mutations = {
        SECURTYTENANTUSERLIST(state, data) {
            state.securityUserList = data;
        },
        TENANTUSERLIST(state, data) {
            state.tenantUserList.total = data.total;
            state.tenantUserList.list = data.rows;
        },
        TENANTLIST(state, data) {
            state.tenantList = data;
        },
        APP_LIST(state, data) {
            state.appList.list = data.rows;
            state.appList.total = data.total;
        },
        alarm_AppList(state, data) {
            state.alarmAppList.list = data.result;
        },
        event_AppList(state, data) {
            state.eventAppList.list = data.result;
        },
        ROLE_LIST(state, data) {
            state.roleList = data;
        },
        EXEC_DETAIL(state, data) {
            state.execDetail = data;
        },
        RESOURCE_LIST(state, code) {
            let resourceList = [];
            let data = code.data;
            let arr = Object.keys(data);
            let filter = code.filter;
            arr.forEach((key) => {
                let keys = key.split('__')[0],
                    name = key.split('__')[1];
                data[key].forEach((item) => {
                    // if (!filter) {
                    //     //查看状态下整个树为不可点击
                    //     item.other = true;
                    // } else {
                    //     if (item.disabled == 'disabled') item.other = true;
                    // }
                    if (item.value != null && item.value != '') {
                        // item.value = keys + '.' + item.value;
                        state.isArr.push(keys + '.' + item.value); //  展开一家页面
                    }
                    state.traversalChildren(item, keys, filter);
                });
                resourceList.push({ name: name, children: data[key], index: '' });
            });
            state.resourceList = resourceList;
        },
        //租户专用
        GET_RESOURCE_LIST(state, code) {
            let getResourceList = [];
            let data = code.data;
            let arr = Object.keys(data);
            let filter = code.filter;
            arr.forEach((key) => {
                let keys = key.split('__')[0],
                    name = key.split('__')[1];
                data[key].forEach((item) => {
                    // if (!filter) {
                    //     //查看状态下整个树为不可点击
                    //     item.other = true;
                    // } else {
                    //     if (item.disabled == 'disabled') item.other = true;
                    // }
                    if (item.value != null && item.value != '') {
                        // item.value = keys + '.' + item.value;
                        state.isArr.push(keys + '.' + item.value); //  展开一家页面
                    }
                    state.traversalChildren(item, keys, filter, item.other);
                    ////当子集全部disabled时给父级也设置disabled属性
                    let num = 0;
                    item.children.forEach((list) => {
                        if (list.other) {
                            ++num;
                        }
                    });
                    if (num > 0 && num === item.children.length) {
                        item.other = true;
                    }
                });
                getResourceList.push({ name: name, children: data[key], index: '' });
            });
            state.getResourceList = getResourceList;
        },

        CHEDULE_GROUPS(state, data) {
            state.cheduleGroups = data.groups;
        },
        SCHED_LIST(state, data) {
            state.schedList = data;
        },
        CALC_RUN_TIME(state, data) {
            state.calcRunTime = data;
        },
        OPT_LIST(state, data) {
            state.optList = data;
        },
        LOG_LIST(state, data) {
            state.logList = data;
        },
        TAG_LIST(state, data) {
            state.tagList = data;
        },
        INIT_USER_LIST(state, obj) {
            state.userList = obj.data;
            state.userListPages = obj.total;
        },
        INFO_ALARM_LIST(state, obj) {
            state.alarmList = obj.data;
            state.alarmListPages = obj.total;
        },
        INIT_FINDROOTORG_LIST(state, obj) {
            state.rootorgList = obj.data;
        },
        NEXT_USER_LIST(state, obj) {
            state.userList = state.userList.concat(obj.data);
        },
        setPropertiesList(state, obj) {
            state.propertyConfigList.list = obj.rows;
            state.propertyConfigList.total = obj.total;
        },
        setBaseInfo(state, obj) {
            state.userInfo = obj;
            state.tenantMode = obj.tenantMode;
            state.defTenant = obj.myUser.defTenant;
            if (obj.tenantMode != 0) {
                obj.tenantList &&
                    obj.tenantList.map((item) => {
                        if (item.id === state.defTenant) {
                            state.tenantName = item.name;
                        }
                    });
            }
        },
        headerSticConfig(state, str) {
            state.headerStic = str;
        },
        SETOPTLIST(state, list) {
            let pushArr = [];
            for (let optName in list) {
                pushArr.push(optName);
            }
            state.SERACHOPT_LIST = list;
            state.SERACHOPT_GROUP = pushArr;
        },
        SETMYAPP(state, list) {
            state.myAppList = list;
        },
        SETIMGURL(state, list) {
            state.ImgUrlList = list;
        },
        SETLARGEURL(state, list) {
            state.largeImgUrlList = list;
        },
        ALARMLIST(state, list) {
            state.alarmList = list;
        },
        REPORT_CATEGORY_LIST(state, data) {
            state.reportCategoryList = data;
        },
        REPORT_CATEGORY_DETAIL(state, data) {
            state.reportCategoryDetail = data;
        },
        REPORT_CATEGORY_ALL(state, data) {
            state.reportCategoryAll = data;
        },
        REPORT_CONFIG_LIST(state, data) {
            state.reportConfigList = data;
        },
        REPORT_CONFIG_DETAIL(state, data) {
            state.reportConfigDetail = data;
        },
        REPORT_CONFIG_MENU(state, data) {
            state.reportConfigMenuList = data;
        },
        API_CONFIG_MENU(state, data) {
            state.apiConfigMenuList = data;
        },
        REPORT_TABLE_LIST(state, data) {
            state.reportTableList = data;
        },
        REPORT_COLUMN_LIST(state, data) {
            state.reportColumnList = data;
        },
        REPORT_DISPLAY_LIST(state, data) {
            state.reportDisplayList = data;
        },
        API_DISPLAY_LIST(state, data) {
            state.apiDisplayList = data;
        },
        REPORT_DRILL_LIST(state, data) {
            state.reportDrillList = data;
        },
        API_DETAIL(state, data) {
            state.apiDetail = data;
        },
    };

    const actions = {
        // 应用管理编辑
        MODIFYAPP({ commit }, payload) {
            return request({ url: API['webkit.modifyApp'], data: payload, method: 'POST' });
        },
        // 应用管理详情
        APPDETAIL({ commit }, id) {
            return request({ url: API['webkit.getEditApp'], params: { id: id }, method: 'GET' });
        },
        // 删除应用
        DELETEAPP({ commit }, payload) {
            return request({ url: API['webkit.deleteApp'], data: payload, method: 'POST' });
        },
        // 删除应用
        ADDAPP({ commit }, payload) {
            return request({ url: API['webkit.addApp'], data: payload, method: 'POST' });
        },
        // 应用管理
        APPLIST({ commit }, payload) {
            request({ url: API['webkit.appList'], params: payload, method: 'GET' }).then((res) => {
                commit('APP_LIST', res);
            });
        },
        // 获取角色
        GOEDITROLE({ commit }, payload) {
            return request({ url: API['webkit.goEditRole'], params: payload, method: 'GET' });
        },
        // 删除角色
        DELETEROLE({ commit }, payload) {
            return request({ url: API['webkit.deleteRole'], data: payload, method: 'POST' });
        },
        // 新增角色
        ADDROLE({ commit }, payload) {
            return request({ url: API['webkit.addRole'], data: payload, method: 'POST' });
        },
        // 编辑角色
        MODIFYROLE({ commit }, payload) {
            return request({ url: API['webkit.modifyRole'], data: payload, method: 'POST' });
        },
        // 角色管理
        ROLELIST({ commit }, payload) {
            request({ url: API['webkit.roleList'], params: payload, method: 'GET' }).then((res) => {
                commit('ROLE_LIST', res.result.rows);
            });
        },
        // 添加调度
        ADDJOB({ commit }, payload) {
            return request({ url: API['webkit.addJob'], data: payload, method: 'POST' });
        },
        // 编辑调度
        EDITJOB({ commit }, payload) {
            return request({ url: API['webkit.editJob'], data: payload, method: 'POST' });
        },
        // 最近5次
        CALCRUNTIME({ commit }, payload) {
            request(
                {
                    url: API['webkit.calcRunTime'],
                    params: payload,
                    method: 'GET',
                },
                { showFetchLoading: false }
            ).then((res) => {
                commit('CALC_RUN_TIME', res.result);
            });
        },
        // 调度获取业务分类
        GETUSERLIST({ commit }, payload) {
            return request({ url: API['webkit.getUserList'], params: payload, method: 'GET' });
        },
        // 调度管理任务名称
        TASKLIST({ commit }, payload) {
            return request({ url: API['webkit.taskList'], method: 'GET', params: payload });
        },
        // 编辑获取调度数据
        GETEDITJOB({ commit }, payload) {
            return request({ url: API['webkit.getEditJob'], method: 'GET', params: payload });
        },
        // 删除调度
        DELETEJOB({ commit }, payload) {
            return request({ url: API['webkit.deleteJob'], method: 'POST', data: payload });
        },
        // 调度管理 播放暂停
        STATECHANGE({ commit }, payload) {
            return request({ url: API['webkit.state'], method: 'POST', data: payload });
        },
        // 错误日志
        ERRORLOG({ commit }, payload) {
            return request({ url: API['webkit.errorLog'], method: 'GET', params: payload });
        },
        // 调度详情
        EXECDETAIL({ commit }, payload) {
            request({ url: API['webkit.execDetail'], method: 'GET', params: payload }).then((res) => {
                commit('EXEC_DETAIL', res);
            });
        },
        // 删除权限标签
        DELETETAG({ commit }, payload) {
            return request({ url: API['webkit.deleteTag'], method: 'post', data: payload });
        },
        // 添加权限标签
        ADDTAG({ commit }, payload) {
            return request({ url: API['webkit.addTag'], method: 'post', data: payload });
        },
        // 权限编辑修改
        MODIFYTAG({ commit }, payload) {
            return request({ url: API['webkit.modifyTag'], method: 'post', data: payload });
        },
        // 权限菜单列表
        RESOURCELIST({ commit }, payload) {
            return request({ url: API['webkit.resourceList'], method: 'GET', params: payload }).then((data) => {
                if (payload && payload.filter) {
                    commit('RESOURCE_LIST', {
                        data: data.result,
                        filter: payload.filter == 'false' || payload.filter == false ? false : true,
                    });
                } else {
                    commit('RESOURCE_LIST', { data: data.result });
                }
            });
        },
        //权限菜单列表(租户专用)
        GET_RESOURCE_LIST({ commit }, payload) {
            return request({ url: API['webkit.getResourceList'], method: 'GET', params: payload }).then((data) => {
                if (payload && payload.filter) {
                    commit('GET_RESOURCE_LIST', {
                        data: data.result,
                        filter: payload.filter == 'false' || payload.filter == false ? false : true,
                    });
                } else {
                    commit('GET_RESOURCE_LIST', { data: data.result });
                }
            });
        },
        // 权限菜单列表(系统管理用)
        RESOURCELIST_SYS({ commit }, payload) {
            return request({ url: API['webkit.displayChildrenResourceList'], method: 'GET', params: payload }).then((data) => {
                if (payload && payload.filter) {
                    commit('RESOURCE_LIST', {
                        data: data.result,
                        filter: payload.filter == 'false' || payload.filter == false ? false : true,
                    });
                } else {
                    commit('RESOURCE_LIST', { data: data.result });
                }
            });
        },
        GOEDITTAG({ commit }, payload) {
            return request({ url: API['webkit.goEditTag'], method: 'GET', params: payload });
        },
        // 业务分类
        CHEDULEGROUPS({ commit }) {
            request({ url: API['webkit.getAddJobCfg'], method: 'GET' }).then((data) => {
                commit('CHEDULE_GROUPS', data.result);
            });
        },
        //调度管理
        SCHEDLIST({ commit }, payload) {
            request({ url: API['webkit.definitionList'], params: payload, method: 'GET' }).then((data) => {
                commit('SCHED_LIST', data);
            });
        },
        // 操作记录
        OPTLIST({ commit }, payload) {
            request({ url: API['webkit.optList'], params: payload, method: 'GET' }).then((data) => {
                commit('OPT_LIST', data);
            });
        },
        // 登录日志
        LOGLIST({ commit }, payload) {
            request({ url: API['webkit.logList'], params: payload, method: 'GET' }).then((data) => {
                commit('LOG_LIST', data);
            });
        },
        // 权限标签
        TAGLIST({ commit }, payload) {
            request({ url: API['webkit.tagList'], params: payload, method: 'GET' }).then((data) => {
                commit('TAG_LIST', data.result);
            });
        },

        //获取组织架构列表
        FINDROOTORG({ commit }, payload) {
            return request(
                { url: API['webkit.findRootOrg'], params: payload, method: 'GET' },
                { showFetchLoading: false }
            );
        },
        /*获取组织结构列表(子集)*/
        FIND_CHILDREN_ORG({ commit }, payload) {
            return request(
                {
                    url: API['org.findChildrenOrg'],
                    params: payload,
                    method: 'GET',
                },
                { showFetchLoading: false }
            );
        },
        //获取属性配置列表
        getPropertiesList({ commit }, payload) {
            return request(
                {
                    url: API['webkit.propertiesList'],
                    params: payload,
                    method: 'GET',
                },
                { showFetchLoading: false }
            ).then((re) => {
                commit('setPropertiesList', re);
            });
        },
        //属性修改
        modifyProperty({ commit }, payload) {
            return request(
                {
                    url: API['webkit.modifyProperty'],
                    data: payload,
                    method: 'POST',
                },
                { showFetchLoading: false }
            );
        },
        //获取用户信息
        getBaseInfo({ commit }, payload) {
            return request({ url: API['webkit.getBaseInfo'], method: 'GET' }, { showFetchLoading: false }).then(
                (re) => {
                    commit('setBaseInfo', re.result);
                    return re.result;
                }
            );
        },
        modifyPwd({ commit }, payload) {
            return request({ url: API['webkit.modifyPwd'], data: payload, method: 'POST' });
        },
        modifyPwd2({ commit }, payload) {
            return request({ url: API['webkit.modifyPwd2'], data: payload, method: 'POST' });
        },
        setIcon({ commit }, payload) {
            return request({ url: API['webkit.setIcon'], data: payload, method: 'POST' });
        },
        modifyBaseInfo({ commit }, payload) {
            return request(
                {
                    url: API['webkit.modifyBaseInfo'],
                    data: payload,
                    method: 'POST',
                },
                { showFetchLoading: false }
            );
        },
        GETOPTLIST({ commit }, payload) {
            return request({ url: API['webkit.groupType'], method: 'GET' }).then((re) => {
                commit('SETOPTLIST', re.result);
            });
        },
        TENANT_LIST({ commit }, data) {
            //租户列表
            request({ url: API['webkit.tenantList'], method: 'GET', params: data }).then((res) => {
                commit('TENANTLIST', res);
            });
        },
        ADD_TENANT({ commit }, data) {
            // 添加租户
            return request({ url: API['webkit.addTenant'], method: 'POST', data: data });
        },
        MODIFY_TENANT({ commit }, data) {
            // 修改租户
            return request({ url: API['webkit.modifyTenant'], method: 'POST', data: data });
        },
        TENANT_DETAIL({ commit }, id) {
            // 租户详情
            return request({ url: API['webkit.getEditTenant'], method: 'GET', params: { tenantId: id } });
        },
        DELETE_TENANT({ commit }, id) {
            // 租户详情
            return request({ url: API['webkit.deleteTenant'], method: 'POST', data: { adq: id } });
        },
        TENANT_USER_LIST({ commit }, data) {
            // 租户用户列表
            request({ url: API['webkit.tenantUserList'], method: 'GET', params: data }).then((res) => {
                commit('TENANTUSERLIST', res);
            });
        },
        SECURTY_TENANT_USER_LIST({ commit }, data) {
            // 获取租户
            // request({url: API["webkit.securityUserList"], method: 'GET', params: data}).then((res) => {
            request({ url: API['user.userList'], method: 'GET', params: data }).then((res) => {
                commit('SECURTYTENANTUSERLIST', res.rows);
            });
        },
        ADD_TENANT_USER({ commit }, data) {
            // 添加租户
            return request({ url: API['webkit.addTenantUser'], method: 'POST', data });
        },
        DELETE_TENANT_USER({ commit }, data) {
            // 删除租户
            return request({ url: API['webkit.deleteTenantUser'], method: 'POST', data });
        },
        myApp({ commit }, data) {
            // 租户列表
            return request({ url: API['webkit.myapp'], method: 'GET' }).then((res) => {
                commit('SETMYAPP', res.result);
            });
        },

        /*运维监控-告警列表*/
        GET_ALARM_DATA({ commit }, data) {
            //查询数据
            return request({ url: API['webkit.alarmData'], method: 'GET', params: data });
        },
        SHIELD_ALARM({ commit }, data) {
            // 屏蔽
            return request({ url: API['webkit.alarmUpdate'], method: 'POST', data });
        },
        CLEAN_ALARM({ commit }, data) {
            // 清除
            return request({ url: API['webkit.alarmClean'], method: 'POST', data });
        },
        GET_ALARM_DETAIL({ commit }, data) {
            //查看详情
            return request({ url: API['webkit.alarmDetail'], method: 'GET', params: data });
        },
        ALARM_APPLIST({ commit }, payload) {
            //应用列表
            request({ url: API['webkit.alarmAllApp'], params: payload, method: 'GET' }).then((res) => {
                commit('alarm_AppList', res);
            });
        },
        /*运维监控-事件管理*/
        GET_EVENT_DATA({ commit }, data) {
            //查询数据
            return request({ url: API['webkit.eventData'], method: 'GET', params: data });
        },
        GET_EVENT_DETAIL({ commit }, data) {
            //查看详情
            return request({ url: API['webkit.eventDetail'], method: 'GET', params: data });
        },
        EVENT_APPLIST({ commit }, payload) {
            //应用列表
            request({ url: API['webkit.eventAllApp'], params: payload, method: 'GET' }).then((res) => {
                commit('event_AppList', res);
            });
        },

        /*日志管理-文件日志*/
        GET_LOG_DATA({ commit }, data) {
            //查询数据
            return request({ url: API['webkit.list'], method: 'GET', params: data });
        },

        GET_ACCOUNT_INFO({ commit }, data) {
            return request({ url: API['webkit.remind'], method: 'GET', params: data });
        },
        // 报表类别列表
        REPORT_CATEGORY_LIST({ commit }, payload) {
            request({ url: API['webkit.reportCategoryList'], params: payload, method: 'GET' }).then((data) => {
                commit('REPORT_CATEGORY_LIST', data);
            });
        },
        // 新增报表类别
        ADD_REPORT_CATEGORY({ commit }, payload) {
            return request({ url: API['webkit.addReportCategory'], params: payload, method: 'POST' });
        },
        // 更新报表类别
        UPDATE_REPORT_CATEGORY({ commit }, payload) {
            return request({ url: API['webkit.updateReportCategory'], params: payload, method: 'POST' });
        },
        // 根据ID查询报表类别详情
        QUERY_REPORT_CATEGORY_DETAIL({ commit }, payload) {
            return request({ url: API['webkit.queryReportCategory'], params: payload, method: 'GET' }).then((data) => {
                commit('REPORT_CATEGORY_DETAIL', data);
            });
        },
        // 查询所有报表类别
        QUERY_REPORT_CATEGORY_All({ commit }, payload) {
            return request({ url: API['webkit.reportCategoryAll'], params: payload, method: 'GET' }).then((data) => {
                commit('REPORT_CATEGORY_ALL', data);
            });
        },
        // 删除报表类别
        DELETE_REPORT_CATEGORY({ commit }, payload) {
            return request({ url: API['webkit.deleteReportCategory'], params: payload, method: 'POST' });
        },
        // 报表配置列表
        REPORT_CONFIG_LIST({ commit }, payload) {
            request({ url: API['webkit.reportConfigList'], params: payload, method: 'GET' }).then((data) => {
                commit('REPORT_CONFIG_LIST', data);
            });
        },
        // 新增报表配置
        ADD_REPORT_CONFIG({ commit }, payload) {
            return request({ url: API['webkit.addReportConfig'], data: payload, method: 'POST' });
        },

        // 新增报表配置
        ADD_API_CONF({ commit }, payload) {
            return request({ url: API['webkit.addApiConf'], data: payload, method: 'POST' });
        },
        ADD_API_EDIT({ commit }, payload) {
            return request({ url: API['webkit.apiConfUpdateDetailById'], data: payload, method: 'POST' });
        },
        // 根据ID查询报表配置详情
        QUERY_REPORT_CONFIG_DETAIL({ commit }, payload) {
            return request({ url: API['webkit.queryReportConfig'], params: payload, method: 'GET' }).then((data) => {
                commit('REPORT_CONFIG_DETAIL', data);
                return data;
            });
        },
        // 更新报表配置
        UPDATE_REPORT_CONFIG({ commit }, payload) {
            return request({ url: API['webkit.editReportConfig'], data: payload, method: 'POST' });
        },
        // 变更报表配置状态
        CHANGE_REPORT_CONFIG_STATE({ commit }, payload) {
            return request({ url: API['webkit.changeReportConfigState'], params: payload, method: 'POST' });
        },
        // 删除报表配置
        DELETE_REPORT_CONFIG({ commit }, payload) {
            return request({ url: API['webkit.deleteReportConfig'], params: payload, method: 'POST' });
        },
        // 根据配置项获取菜单列表
        QUERY_REPORT_CONFIG_MENU({ commit }, payload) {
            return request({ url: API['webkit.buildMenu'], params: payload, method: 'GET' }).then((data) => {
                return commit('REPORT_CONFIG_MENU', data);
            });
        },
        // 根据配置项获取接口菜单列表
        QUERY_API_CONFIG_MENU({ commit }, payload) {
            return request({ url: API['webkit.buildApiMenu'], params: payload, method: 'GET' }).then((data) => {
                return commit('API_CONFIG_MENU', data);
            });
        },
        // 查询库中表列表
        QUERY_REPORT_TABLE_LIST({ commit }, payload) {
            return request({ url: API['webkit.tableList'], params: payload, method: 'GET' });
        },
        // 查询库中表字段信息 
        QUERY_REPORT_COLUMN_LIST({ commit }, payload) {
            return request({ url: API['webkit.columnList'], params: payload, method: 'GET' }).then((data) => {
                return commit('REPORT_COLUMN_LIST', data);
            });
        },
        // 查询报表配置属性
        QUERY_REPORT_PROPERTY_ALL({ commit }, payload) {
            return request({ url: API['webkit.reportPropertyAll'], params: payload, method: 'GET' });
        },
        // 根据配置项获取菜单列表
        QUERY_REPORT_DISPLAY_LIST({ commit }, payload) {
            return new Promise((resolve, reject) => {
                return request({ url: API['webkit.reportDisplayList'], data: payload, method: 'POST' }).then((data) => {
                    resolve(data)
                    commit('REPORT_DISPLAY_LIST', data);
                }).catch(err => {
                    reject(err)
                });
            })
        },
        // 取得钻取列表
        QUERY_REPORT_DRILL_LIST({ commit }, payload) {
            return request({ url: API['webkit.reportDisplayList'], data: payload, method: 'POST' }).then((data) => {
                return commit('REPORT_DRILL_LIST', data);
            });
        },
        // 导出报表数据
        EXPORT_REPORT_DATA({ commit }, payload) {
            return request({ url: API['webkit.reportDisplayExport'], data: payload, method: 'POST', responseType: 'blob' });
        },
        SET_REPORT_DISPLAY_LIST({ commit }, payload) {
            commit('REPORT_DISPLAY_LIST', payload);
            commit('REPORT_DRILL_LIST', payload);
        },
        SET_REPORT_DRILL_LIST({ commit }, payload) {
            commit('REPORT_DRILL_LIST', payload);
        },
        // 根据ID查询接口配置详情
        QUERY_API_DETAIL({ commit }, payload) {
            return request({ url: API['webkit.queryConfAndPropertyById'], params: payload, method: 'GET' }).then((data) => {
                commit('API_DETAIL', data);
            });
        },


        // 根据配置项查询接口数据
        QUERY_API_DISPLAY_LIST({ commit }, payload) {
            return new Promise((resolve, reject) => {
                return request({ url: API['webkit.apiDisplayList'], data: payload, method: 'POST' }).then((data) => {
                    resolve(data)
                    commit('API_DISPLAY_LIST', data);
                }).catch(err => {
                    reject(err)
                });
            })

        },
        // 查询接口配置属性
        QUERY_API_PROPERTY_ALL({ commit }, payload) {
            return request({ url: API['webkit.apiPropertyAll'], params: payload, method: 'GET' });
        },
        // 导出报表数据
        EXPORT_API_DATA({ commit }, payload) {
            return request({ url: API['webkit.apiDisplayExport'], data: payload, method: 'POST', responseType: 'blob' });
        },
        // 导出接口数据
        EXPORT_API_DATA_HIS({ commit }, payload) {
            return request({ url: API['webkit.apiDisplayExportHis'], data: payload, method: 'POST', responseType: 'blob' });
        },
        // 验证接口是否有查询历史可以导出
        VALIDATE_API_EXPORT_EXCELHIS({ commit }, payload) {
            return request({ url: API['webkit.validateApiExportExcelHis'], data: payload, method: 'POST' });
        },
        // 导出接口数据
        EXPORT_REPORT_DATA_HIS({ commit }, payload) {
            return request({ url: API['webkit.reportDisplayExportHis'], data: payload, method: 'POST', responseType: 'blob' });
        },
        // 验证库表是否有查询历史可以导出
        VALIDATE_REPORT_EXPORT_EXCELHIS({ commit }, payload) {
            return request({ url: API['webkit.validateReportExportExcelHis'], data: payload, method: 'POST' });
        },
        SET_API_DISPLAY_LIST({ commit }, payload) {
            commit('API_DISPLAY_LIST', payload);
        },

    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
