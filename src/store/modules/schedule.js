export default (request, API) => {
    const state = {
        strategytableList: [],
        total:0
    }

    const mutations = {
        setStrategyList(state, data) {
            state.strategytableList = data.rows
            state.total = data.total
        }
    }

    const actions = {
        addStrategy({
            commit
        }, payload) {
            return request({
                url: API['schedule.addStrategy'],
                method: 'POST',
                data: payload
            }).then(res => {
                return res
            })
        },
        modifyStrategy({
            commit
        }, payload) {
            return request({
                url: API['schedule.modifyStrategy'],
                method: 'POST',
                data: payload
            }).then(res => {
                return res
            })
        },
        strategyList({
            commit
        }, payload) {
            return request({
                url: API['schedule.strategyList'],
                method: 'GET',
                params: payload
            }).then(res => {
                commit('setStrategyList',res)
            })
        },
        deleteStrategy({
            commit
        }, payload) {
            return request({
                url: API['schedule.deleteStrategy'],
                method: 'POST',
                data: payload
            }).then(res => {
               return res
            })
        }
    }
    return {
        namespaced: true,
        state,
        mutations,
        actions
    }
}
