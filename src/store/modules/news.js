export default (request, API) => {
    const state = {
        announcementList: [], //公告列表（所有的）
        publishedAnnouncementList: [], //公告列表（已发布的）
        isUpdateAnnouncement: new Date(), //监听头部公告列表
        unreadAnnouncementTotal: 0, //未读的公告
    };

    const mutations = {
        ANNOUNCEMENT_LIST(state, data) {
            state.announcementList = data.result;
            state.isUpdateAnnouncement = new Date();
        },
        PUBLISHED_ANNOUNCEMENT_LIST(state, data) {
            state.publishedAnnouncementList = data.result || {};
            state.unreadAnnouncementTotal = 0;
            data.result && data.result.rows && data.result.rows.forEach((item) => {
                /*未读公告的总数*/
                if (item.readFlag === 0) {
                    ++state.unreadAnnouncementTotal;
                }
            });
        },
    };

    const actions = {
        // 公告列表(所有的)
        GIT_ANNOUNCEMENT_LIST({ commit }, payload) {
            return request({ url: API['sys.message.notice.list'], params: payload, method: 'GET' }).then((data) => {
                commit('ANNOUNCEMENT_LIST', data);
            });
        },
        //公告列表（当前用户关联的已发布）
        GET_PUBLISHED_ANNOUNCEMENT_LIST({ commit }, payload) {
            return request({
                url: API['sys.message.userNotice.list'],
                params: { page: 1, rows: 999999, type: 1, sendStatus: 1 },
                method: 'GET',
            }).then((data) => {
                commit('PUBLISHED_ANNOUNCEMENT_LIST', data);
            });
        },
    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
