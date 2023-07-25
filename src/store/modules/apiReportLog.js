/*
* @description 系统审计表  vuex文件
* @author liyaxin
* @date 2023-06-15 15:51:11
*/
export default (request, API) => {
    const state = {
        apiReportLogList: {},
        apiReportLogAuditList:{},
    };

    const mutations = {
        APIREPORTLOG_LIST(state, data) {
            state.apiReportLogList = data;
        },
        APIREPORTLOGAUDIT_LIST(state,data){
            state.apiReportLogAuditList=data
        }
    };

    const actions = {
        /*系统审计表列表*/
        APIREPORTLOGLIST({ commit }, payload) {
            request({ url: API['apiReportLog.apiReportLogList'], params: payload, method: 'GET' }).then((data) => {
                commit('APIREPORTLOG_LIST', data);
            });
        },
        // 获取系统审计表
        GOEDITAPIREPORTLOG({ commit }, payload) {
            return request({ url: API['apiReportLog.goEditApiReportLog'], params: payload, method: 'GET' });
        },
        // 删除系统审计表
        DELETEAPIREPORTLOG({ commit }, payload) {
            return request({ url: API['apiReportLog.deleteApiReportLog'], data: payload, method: 'POST' });
        },
        // 新增系统审计表
        ADDAPIREPORTLOG({ commit }, payload) {
            return request({ url: API['apiReportLog.addApiReportLog'], data: payload, method: 'POST' });
        },
        // 编辑系统审计表
        MODIFYAPIREPORTLOG({ commit }, payload) {
            return request({ url: API['apiReportLog.modifyApiReportLog'], data: payload, method: 'POST' });
        },
        APIREPORTLOGAUDITLIST({commit},payload){
            return request({url:API['apiReportLogAudit.apiReportLogAuditList'],params:payload,method:'GET'}).then((data)=>{
                commit('APIREPORTLOGAUDIT_LIST',data);
            })
        }

    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
