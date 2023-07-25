/*
* @description   vuex文件
* @author zhangweiwei
* @date 2023-07-11 18:25:59
*/
export default (request, API) => {
    const state = {
        apiCallStatisticsList: {},
    };

    const mutations = {
        APICALLSTATISTICS_LIST(state, data) {
            state.apiCallStatisticsList = data;
        }
    };

    const actions = {
        /*列表*/
        APICALLSTATISTICSLIST({ commit }, payload) {
            request({ url: API['apiCallStatistics.apiCallStatisticsList'], params: payload, method: 'GET' }).then((data) => {
                commit('APICALLSTATISTICS_LIST', data);
            });
        },
        // 获取接口查询类别表
        APINAMELIST({ commit }, payload) {
            return request({ url: API['apiCallStatistics.queryApiNameList'], params: payload, method: 'GET' });
        },
        // 获取接口查询类别表
        USERLIST({ commit }, payload) {
            return request({ url: API['apiCallStatistics.queryUserList'], params: payload, method: 'GET' });
        },

    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
