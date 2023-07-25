export default (request, API) => {
    const state = {
        // valueList: [],
        // infoList: []
        indexData: {},
        jumpUrl:null,//外部系统的跳转地址
    }

    const mutations = {
        setIndexData(state, data) {
            state.indexData = data
        },
        setJumpUrl(state,data){
            state.jumpUrl = data
        }
    }

    const actions = {
        getIndexData({ commit }, payload) {
            return request(
                { url: API['home.getIndexData'], method: 'GET' },
                { showFetchLoading: false }
            ).then(res => {
                commit('setIndexData', res.result)
                return res
            })
        },

    }
    return {
        namespaced: true,
        state,
        mutations,
        actions
    }
}
