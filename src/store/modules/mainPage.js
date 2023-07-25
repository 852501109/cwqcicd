export default (request, API) => {
    const actions = {
        // 取得首页指标
        GET_INDEXS({ commit }, payload) {
            return request({ url: API['mainPage.getIndexs'], data: payload, method: 'GET' });
        },
        // 取得服务器信息
        GET_HARDWARES({ commit }, payload) {
            return request({ url: API['mainPage.getHardwares'], data: payload, method: 'GET' });
        },
        // 取得预警信息
        GET_ALARMMSG({ commit }, payload) {
            return request({ url: API['mainPage.getAlarmMsg'], data: payload, method: 'GET' });
        },
        // 取得线图信息
        GET_LINECHART({ commit }, payload) {
            return request({ url: API['mainPage.getLineChart'], data: payload, method: 'GET' });
        },


    };
    return {
        namespaced: true,
        actions,
    };
};
