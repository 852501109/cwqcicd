/*
* @description 接口配置表  vuex文件
* @author liyaxin
* @date 2023-06-15 14:46:10
*/
export default (request, API) => {
    const state = {
        apiConfList: {},
    };

    const mutations = {
        APICONF_LIST(state, data) {
            state.apiConfList = data;
        }
    };

    const actions = {
        /*接口配置表列表*/
        APICONFLIST({ commit }, payload) {
            request({ url: API['apiConf.apiConfList'], params: payload, method: 'GET' }).then((data) => {
                commit('APICONF_LIST', data);
            });
        },
        // 获取接口配置表
        GOEDITAPICONF({ commit }, payload) {
            return request({ url: API['apiConf.goEditApiConf'], params: payload, method: 'GET' });
        },
        // 删除接口配置表
        DELETEAPICONF({ commit }, payload) {
            return request({ url: API['apiConf.deleteApiConf'], data: payload, method: 'POST' });
        },
        // 新增接口配置表
        ADDAPICONF({ commit }, payload) {
            return request({ url: API['apiConf.addApiConf'], data: payload, method: 'POST' });
        },
        // 编辑接口配置表
        MODIFYAPICONF({ commit }, payload) {
            return request({ url: API['apiConf.modifyApiConf'], data: payload, method: 'POST' });
        },
        // 检查接口查询配置的状态
        CHECKAPIQUERYCONFSTATE({ commit }, payload) {
            return request({ url: API['apiConf.checkApiQueryConfState'], params: payload, method: 'GET' });
        },

    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
