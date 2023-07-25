export default (request, API) => {
    const state = {
        total: 0,
        appList:[],
        category: [],
        datasourcelist: []
    };

    const mutations = {
        DATASOURCELIST(state, data){
            state.total=data.total
            state.datasourcelist = data.rows
        },
        ALLAPP(state, data){
            state.appList=data
        },
        ALLCATEGORY(state, data){
            state.category=data
        }
    };
    const actions = {
        ALL_CATEGORY({commit,state}){ // 数据源分类名
            request({url: API['datasource.allCategory'], method: 'GET'}, { showFetchLoading: false }).then(res=>{
                commit('ALLCATEGORY',res.result)
            })
        },
        ALL_APP({commit,state}){ //数据源授权
            request({url: API['datasource.allApp'], method: 'GET'}, { showFetchLoading: false }).then(res=>{
                commit('ALLAPP',res.result)
            })
        },
    };
    return {
        namespaced: true,
        state,
        mutations,
        actions
    }
}
