import { Loading } from 'element-ui';
export default (request, API) => {
    const state = {
        isFetching: false,
        upload: API['tempFile'],
        Sidebar: true,
        Permission: [],
        RouterShow: [],
        permitList: {},
        platFormList: [],
        tableFetchStatus: null, // 1：加载 2：成功有数据 3：成功无数据 4：请求异常
        isUpdateMenu: false, //是否重新更新菜单
        _isLoading: null, //是否显示全局加载图标
        isSHowButtonLoading: false, //是否显示按钮的加载图标
        _userList: [], //user/userList.do接口返回的数据
        storeSearch: {}, //将查询条件存入store
        routerHistory: [], //路由历史记录
        // requestPermissionList: false
    };

    const getters = {
        storeListLength(state) {
            let checkList = state.RouterShow;
            state.permitList = {};
            for (let i = 0; i < state.Permission.length; i++) {
                state.permitList[checkList[i]] = state.Permission[i];
            }
            return state.permitList;
        },
    };

    const mutations = {
        // 加载中
        SHOW_FETCH_LOADING(state, options) {
            state.isFetching = options;
        },
        TOGGLE_SIDEBAR(state) {
            state.Sidebar = !state.Sidebar;
        },
        platForm_List(state, options) {
            state.platFormList = options ? options : [];
        },
        /*修改请求表格数据的状态*/
        MODIFY_REQUERY_TABLE_STATUS(state, options) {
            state.tableFetchStatus = options;
        },
        /*设置路由历史记录*/
        SET_ROUTER_HISTORY(state, options) {
            state.routerHistory.push(options);
        },
        SHOW_LOADING(state, options) {
            if (options) {
                state._isLoading = Loading.service({
                    lock: true,
                    customClass: 'global-loading', //自定义class名
                    text: '正在处理中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.1)',
                });
            } else {
                state._isLoading && state._isLoading.close();
            }
        },
        SET_STORE_SEARCH(state, options) {
            //修改storeSearch的值
            if (options) {
                state.storeSearch[options.key] = options.value;
            } else {
                state.storeSearch = {};
            }
        },
    };

    const actions = {
        //  前端 登出
        ACCESSIBLES({ commit }, payload) {
            return request(
                { url: API['global.accessibles'], method: 'GET', params: { resource: payload } },
                { showFetchLoading: false }
            );
        },
        LOGIN({ commit }, payload) {
            return request({ url: API['user.login'], data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        // 上传
        VIEWFILE({ commit }, payload) {
            return request(
                { url: API['viewFile'], params: { key: payload }, method: 'GET' },
                { showFetchLoading: false }
            );
        },
        // 获取菜单
        _DIR_MENU({ commit }, payload) {
            return request({ url: API['webkit.menu'], params: payload, method: 'GET' });
        },
        LOADIMG({ commit }, payload) {
            return request({
                url: `${API['global.loadImg']}${payload}.do`,
                params: payload,
                method: 'GET',
                responseType: 'blob',
            });
        },
        LOADFILE({ commit }, payload) {
            return request({ url: `${API['global.load']}${payload}.go`, params: payload, method: 'GET' });
        },
        LOADOBJ({ commit }, payload) {
            return request({ url: `${API['global.loadObj']}${payload}.do`, params: {}, method: 'GET' });
        },
        MYPLATFORM({ commit }, payload) {
            //系统列表
            return request({ url: API['global.myPlatform'], params: payload, method: 'GET' }).then((res) => {
                commit('platForm_List', res.result);
                return res;
            });
        },
        //两个通用方法 get post
        _AJAX({}, payload) {
            let method = (payload.method || '').toUpperCase(),
                paramName = 'data',
                reqParams = {};
            if (method === 'GET') {
                paramName = 'params';
            }
            reqParams = {
                url: API[payload.url] || payload.url,
                [paramName]: payload.data,
                method: payload.method || 'GET',
            };
            if (payload.responseType) reqParams.responseType = payload.responseType;
            return request(reqParams, Object.assign({}, { showFetchLoading: false }, payload.config));
        },
    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
        getters,
    };
};
