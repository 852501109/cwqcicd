/*
* @description 接口查询类别表  vuex文件
* @author liyaxin
* @date 2023-06-15 08:49:03
*/
export default (request, API) => {
    const state = {
        apicategoryList: {},
    };

    const mutations = {
        APICATEGORY_LIST(state, data) {
            state.apicategoryList = data;
        }
    };

    const actions = {
        /*接口查询类别表列表*/
        APICATEGORYLIST({ commit }, payload) {
            request({ url: API['apicategory.apicategoryList'], params: payload, method: 'GET' }).then((data) => {
                commit('APICATEGORY_LIST', data);
            });
        },
        // 获取接口查询类别表
        GOEDITAPICATEGORY({ commit }, payload) {
            return request({ url: API['apicategory.goEditApicategory'], params: payload, method: 'GET' });
        },
        // 删除接口查询类别表
        DELETEAPICATEGORY({ commit }, payload) {
            return request({ url: API['apicategory.deleteApicategory'], data: payload, method: 'POST' });
        },
        // 新增接口查询类别表
        ADDAPICATEGORY({ commit }, payload) {
            return request({ url: API['apicategory.addApicategory'], data: payload, method: 'POST' });
        },
        // 编辑接口查询类别表
        MODIFYAPICATEGORY({ commit }, payload) {
            return request({ url: API['apicategory.modifyApicategory'], data: payload, method: 'POST' });
        }

    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
