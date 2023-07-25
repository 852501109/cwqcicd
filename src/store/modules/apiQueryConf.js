/*
* @description 接口查询配置表  vuex文件
* @author liyaxin
* @date 2023-06-15 15:16:37
*/
export default (request, API) => {
    const state = {
        apiQueryConfList: {},
        queryCategoryAll: [],
        queryApiAll: [],
        queryColumnList: []
    };

    const mutations = {
        APIQUERYCONF_LIST(state, data) {
            state.apiQueryConfList = data;
        },
        GETAPICATEGORY_ALL(state, data) {
            state.queryCategoryAll = data;
        },
        GETQUERYAPI_ALL(state, data) {
            state.queryApiAll = data;
        },
        QUERY_COLUMN_LIST(state, data) {
            state.queryColumnList = data;
        },
    };

    const actions = {
        /*接口查询配置表列表*/
        APIQUERYCONFLIST({ commit }, payload) {
            request({ url: API['apiQueryConf.apiQueryConfList'], params: payload, method: 'GET' }).then((data) => {
                commit('APIQUERYCONF_LIST', data);
            });
        },
        // 获取接口查询配置表
        GOEDITAPIQUERYCONF({ commit }, payload) {
            return request({ url: API['apiQueryConf.goEditApiQueryConf'], params: payload, method: 'GET' });
        },
        // 删除接口查询配置表
        DELETEAPIQUERYCONF({ commit }, payload) {
            return request({ url: API['apiQueryConf.deleteApiQueryConf'], data: payload, method: 'POST' });
        },
        // 新增接口查询配置表
        ADDAPIQUERYCONF({ commit }, payload) {
            return request({ url: API['apiQueryConf.addApiQueryConf'], data: payload, method: 'POST' });
        },
        // 编辑接口查询配置表
        MODIFYAPIQUERYCONF({ commit }, payload) {
            return request({ url: API['apiQueryConf.modifyApiQueryConf'], data: payload, method: 'POST' });
        },
        // 新增接口查询配置表
        QUERYCATEGORYLIST({ commit }, payload) {
            return request({ url: API['apiQueryConf.queryCategoryList'], params: payload, method: 'GET' }).then((data) => {
                commit('GETAPICATEGORY_ALL', data)
            })
        },
        // 编辑接口查询配置表
        QUERYCONFIGLIST({ commit }, payload) {
            return request({ url: API['apiQueryConf.queryConfigList'], params: payload, method: 'GET' }).then((data) => {
                commit('GETQUERYAPI_ALL', data)
            })
        },
        // 
        QUERY_query_COLUMN_LIST({ commit }, payload) {
            return request({ url: API['apiQueryConf.queryPropertyList'], params: payload, method: 'GET' }).then((data) => {
                return commit('QUERY_COLUMN_LIST', data);
            });
        },
        // 变更状态
        CHANGE_REPORT_CONFIG_STATE({ commit }, payload) {
            return request({ url: API['apiQueryConf.changeReportConfigState'], data: payload, method: 'POST' });
        },
        // 授权回显接口
        QUERYBYCONFID({ commit }, payload) {
            return request({ url: API['apiQueryConf.queryByConfId'], params: payload, method: 'GET' });
        },
        // 授权接口
        AUTHORIZATION({ commit }, payload) {
            return request({ url: API['apiQueryConf.authorization'], data: payload, method: 'POST' });
        },
    }
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
