export default (request, API) => {
    const state = {
        device: 'desktop',
        userList: [], //用户管理-用户列表数据
        userListPages: 0, //用户管理-用户列表总页数
        codeUrl: '',
        sidebar: {
            opened: 'aaaaa',
            withoutAnimation: false,
        },
        deptUserList: [],
        deptUserListTotal: 0,
        deptTagList: [],
        deptTagListTotal: 0,
        tagList: [],
        userIcon: `${API['user.userIcon']}?t=${Math.random()}`,
        messageInfoList: null,
    };

    const mutations = {
        resetImage(state) {
            state.userIcon = `${API['user.userIcon']}?new=${Math.random()}`;
        },
        INIT_USER_LIST(state, obj) {
            state.userList = obj.data;
            state.userListPages = obj.total;
        },
        NEXT_USER_LIST(state, obj) {
            state.userList = state.userList.concat(obj.data);
        },
        toggle_user_status(state, userid) {
            for (let i = 0; i < state.userList.length; i++) {
                if (state.userList[i].id === userid) {
                    state.userList[i].enabled = !state.userList[i].enabled;
                    break;
                }
            }
        },
        delete_user_by_userid(state, userid) {
            for (let i = 0; i < state.userList.length; i++) {
                if (state.userList[i].id === userid) {
                    delete state.userList[i];
                    state.userList = state.userList.filter((v) => v);
                    break;
                }
            }
        },
        CAPTCHA_URL(state, data) {
            state.codeUrl = data;
        },
        init_dept_tag(state, payload) {
            state.deptTagList = payload.data;
            state.deptTagListTotal = payload.total;
        },
        init_dept_user(state, payload) {
            state.deptUserList = payload.data;
            state.deptUserListTotal = payload.total;
        },
        delete_dept_user_by_userid(state, userId) {
            for (let i = 0; i < state.deptUserList.length; i++) {
                if (state.deptUserList[i].userId === userId) {
                    delete state.deptUserList[i];
                    state.deptUserList = state.deptUserList.filter((v) => v);
                    state.deptUserListTotal--;
                    break;
                }
            }
        },
        delete_dept_tag_by_id(state, id) {
            for (let i = 0; i < state.deptTagList.length; i++) {
                if (state.deptTagList[i].id === id) {
                    delete state.deptTagList[i];
                    state.deptTagList = state.deptTagList.filter((v) => v);
                    state.deptTagListTotal--;
                    break;
                }
            }
        },
        news_info(state, data) {
            state.messageInfoList = data;
        },
    };

    const actions = {
        CASLOGIN({ commit }, payload) {
            request({ url: API['casLogin'], params: { ticket: payload }, method: 'GET' }, { showFetchLoading: false });
        },
        GETPUBLICKEY({ commit }) {
            return request({ url: API['user.getPublicKey'], method: 'GET' }, { showFetchLoading: false });
        },
        GETPUBLICKEY_USER({ commit }) {
            return request({ url: API['source.getPublicKey1'], method: 'GET' }, { showFetchLoading: false });
        },
        CAPTCHA({ commit }) {
            request(
                { url: API['user.captcha'], params: { time: new Date().getTime() }, method: 'GET' },
                { showFetchLoading: false }
            ).then((res) => {
                commit('CAPTCHA_URL', res);
            });
        },
        // 退出
        LOGOUT({ commit }, payload) {
            request({ url: API['user.logout'], method: 'GET' }, { showFetchLoading: false }).then((res) => {
                localStorage.removeItem('WEBKIT_MODULE');
                sessionStorage.setItem('isLogin', false);
            });
        },
        LOGIN({ commit }, payload) {
            return request({ url: API['user.login'], data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        GETUSERLIST({ commit }, payload) {
            return request(
                { url: API['webkit.getUserList'], params: payload, method: 'GET' },
                { showFetchLoading: false }
            );
        },
        RESET_PWD({ commit }, payload) {
            return request({ url: API.resetPWD, data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        DELETE_USER_USER({ commit }, payload) {
            return request({ url: API.deleteUser, data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        ENABLE_USER({ commit }, payload) {
            return request({ url: API.enableUser, data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        DISABLE_USER({ commit }, payload) {
            return request({ url: API.disableUser, data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        GET_EDIT_USER({ commit }, userId) {
            return request({ url: API.getEditUser, params: { userId }, method: 'GET' }, { showFetchLoading: false });
        },
        USER_ROLE_LIST({ commit }) {
            return request({ url: API.userRoleList, params: {}, method: 'GET' }, { showFetchLoading: false });
        },
        USER_RESOURCE_LIST({ commit }) {
            return request({ url: API.userResourceList, params: {}, method: 'GET' }, { showFetchLoading: false });
        },
        MODIFY_USER({ commit }, userInfo) {
            return request(
                { url: API['user.modifyUser'], data: userInfo, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        ADD_USER({ commit }, userInfo) {
            return request({ url: API['user.addUser'], data: userInfo, method: 'POST' }, { showFetchLoading: false });
        },
        FIND_USER({ commit }, user) {
            return request({ url: API['org.findUser'], params: user, method: 'GET' }, { showFetchLoading: false }).then(
                (res) => {
                    commit({ type: 'init_dept_user', data: res.rows, total: res.total });
                }
            );
        },
        FIND_TAG({ commit }, params) {
            return request({ url: API['org.findTag'], params: params, method: 'GET' }, { showFetchLoading: false });
        },
        DELETE_USER({ commit }, user) {
            return request({ url: API['org.deleteUser'], data: user, method: 'POST' }, { showFetchLoading: false });
        },
        DELETE_TAG({ commit }, tag) {
            return request({ url: API['org.deleteTag'], data: tag, method: 'POST' }, { showFetchLoading: false });
        },
        TAG_LIST({ commit, state }, params) {
            return request({ url: API['tag.tagList'], params, method: 'GET' }, { showFetchLoading: false });
        },
        ADD_ORG_TAG({ commit }, tag) {
            return request({ url: API['org.addTag'], data: tag, method: 'POST' }, { showFetchLoading: false });
        },
        ADD_ORG_USER({ commit }, user) {
            return request({ url: API['org.addUser'], data: user, method: 'POST' }, { showFetchLoading: false });
        },
        DELETE_DEPARTMENT({ commit }, deptid) {
            return request(
                { url: API['org.deleteDepartment'], data: { adq: deptid }, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        DELETE_POSITION({ commit }, positionid) {
            return request(
                { url: API['org.deletePositions'], data: { adq: positionid }, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        MODIFY_POSITION({ commit }, position) {
            return request(
                { url: API['org.modifyPosition'], data: position, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        ADD_POSITION({ commit }, position) {
            return request(
                { url: API['org.addPosition'], data: position, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        ADD_ORG_DEPARTMENT({ commit }, dept) {
            return request({ url: API['org.addDepartment'], data: dept, method: 'POST' }, { showFetchLoading: false });
        },
        ORG_FIND_POSITION({ commit }, position) {
            return request(
                { url: API['org.findPosition'], params: position, method: 'GET' },
                { showFetchLoading: false }
            );
        },
        ORG_MODIFY_DEPARTMENT({ commit }, department) {
            return request(
                { url: API['org.modifyDepartment'], data: department, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        ORG_CHILDREN_ORG({ commit }, payload) {
            return request(
                { url: API['org.findChildrenOrg'], params: payload, method: 'GET' },
                { showFetchLoading: false }
            );
        },
        FORCE_LOGOUT_USER({ commit }, payload) {
            return request(
                { url: API['user.forceLogoutUser'], data: { userId: payload }, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        GET_CHILDREN_ORG({ commit }, payload) {
            return request(
                { url: API['org.findAccessDept'], params: payload, method: 'GET' },
                { showFetchLoading: false }
            );
        },
        MODIFY_RIGHT({ commit }, payload) {
            return request({ url: API['org.modifyUser'], data: payload, method: 'POST' }, { showFetchLoading: false });
        },
        GET_PERMISSION_LIST({ commit }, payload) {
            return request({ url: API['org.orgManageCfg'], data: payload, method: 'GET' }, { showFetchLoading: false });
        },
        SET_USER_EXPIRATION_DATE({ commit }, payload) {
            //设置账号有效期
            return request(
                { url: API['org.effectExpiredUser'], data: payload, method: 'POST' },
                { showFetchLoading: false }
            );
        },
        GET_MESSAGE_INFO_LIST({ commit }, payload) {
            //待办和消息的信息
            return request(
                { url: API['org.headListCfg'], params: payload, method: 'GET' },
                { showFetchLoading: false }
            ).then((res) => {
                commit('news_info', res.result);
            });
        },
        GET_MESSAGE_PAGE({ commit }, payload) {
            //获得消息待办跳转的详情页面
            return request({ url: API['org.process'], params: payload, method: 'GET' }, { showFetchLoading: false });
        },
    };
    return {
        namespaced: true,
        state,
        mutations,
        actions,
    };
};
