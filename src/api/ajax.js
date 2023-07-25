import axios from 'axios';
import utils from '../utils';
import store from '@/store';
import Router from '../router';
import Vue from '@/main';
import Axios from 'axios';

import { Message, Loading } from 'element-ui';

let loading


// loading开始 方法


/*
 * 要过滤的url
 * */
const filterUrl = [
    window.urlConfig + '/security/accessibles.do',
    window.urlConfig + '/security/userIcon.do',
    window.urlConfig + '/security/getBaseInfo.do',
    window.urlConfig + '/security/logout.do',
    window.urlConfig + '/security/getPublicKey1.go',
    window.urlConfig + '/security/login.go',
    window.urlConfig + '/casLogin',
    window.urlConfig + '/oauth2/phoneResetPwdRequest',
    window.urlConfig + '/oauth2/phoneResetPwd',
    window.urlConfig + '/oauth2/getPublicKey',
];

let ticket = utils.$utils.getQueryString('ticket');
const axiosDefault = {
    //timeout: 6000,
    headers: {
        'Content-Type': 'application/json;',
        'X-Requested-With': 'XMLHttpRequest',
    },
};

const handleErr = (err) => {
    return Promise.reject(err);
};


const request = axios.create(axiosDefault);
request.interceptors.request.use((config) => {

    store.state.isSHowButtonLoading = true; //显示加载按钮图标
    const isLogin = JSON.parse(sessionStorage.getItem('isLogin')); //是否登录的标记
    /*当没有登录时不允许发送除指定过滤外的其他接口*/
    if (!isLogin && !filterUrl.includes(config.url) && config.url.indexOf('.go') == -1) {
        // config.cancelToken = new axios.CancelToken(); //取消请求
        return
    }

    if (sessionStorage.getItem('token')) {
        config.headers['X-CSRF-TOKEN'] = sessionStorage.getItem('token');
    }
    if (utils.$utils.isIE() && config.method.toUpperCase() == 'GET') {
        config.url += config.url.indexOf('?') > -1 ? '&' : '?' + 't=' + Date.now();
        return config;
    } else {
        return config;
    }

}, handleErr);
request.interceptors.response.use(
    (response) => {
        store.state.isSHowButtonLoading = false; //不显示加载按钮图标

        store.commit('SHOW_LOADING', false);
        if (
            (response.headers['adq_license'] && response.headers['adq_license'] == 1111) ||
            (response.headers['ADQ_LICENSE'] && response.headers['ADQ_LICENSE'] == 1111)
        ) {
            Vue.$AudaqueToast.warn({ template: '您的产品使用期限即将到期，请联系管理员进行更新' });
        }
        if (
            (response.headers['adq_license'] && response.headers['adq_license'] == 1107) ||
            (response.headers['ADQ_LICENSE'] && response.headers['ADQ_LICENSE'] == 1107)
        ) {
            Vue.$AudaqueToast.error({ template: '您的产品使用期限已到期，请联系管理员进行激活' });
            Axios({
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': sessionStorage.getItem('token'),
                },
                url: window.urlConfig + '/security/logout.do',
                method: 'get',
            }).then((res) => { });
        }

        if (response.headers['x-csrf-token']) {
            sessionStorage.setItem('token', response.headers['x-csrf-token']);
        }
        if (response.headers['X-CSRF-TOKEN']) {
            sessionStorage.setItem('token', response.headers['X-CSRF-TOKEN']);
        }
        /*   let href = window.location.href;
        if (response.data.code == 1107) {
            let href404 = href.split('?')[0] + '#/404';
            window.location.href = href404;
        } else if (ticket) {
            let hrefIndex = href.split('?')[0] + '#/index';
            window.location.href = hrefIndex;
        } else */
        if (response.headers.adqlocation) {
            window.location.href = response.headers.adqlocation;
        } else if (
            !ticket &&
            (response.data.code === 1002 || response.data.code === 1003 || response.config.url.indexOf('logout') > -1)
        ) {
            if (
                response.headers.adqlocation &&
                (response.headers.adqlocation == 'login' || response.headers.adqlocation.indexOf('#/login') > -1)
            ) {
                Router.push('/login');
            } else {
                window.location.href = response.headers.adqlocation;
            }
        }
        /*统一处理当表单数据为空时的样式*/
        if (
            response.data.hasOwnProperty('rows') ||
            (response.data.result && response.data.result.hasOwnProperty('rows'))
        ) {
            let list = response.data.hasOwnProperty('rows') ? response.data : response.data.result;
            // status 1：加载 2：成功有数据 3：成功无数据 4：请求异常
            let status = 1;
            if (list.rows == null) {
                status = 3;
            } else {
                status = list.rows.length > 0 ? 2 : 3;
            }
            store.commit('MODIFY_REQUERY_TABLE_STATUS', status);
        }
        return response.data;
    },
    (err) => {
        console.log(err)
        store.state.isSHowButtonLoading = false; //不显示加载按钮图标
        store.commit('SHOW_LOADING', false);
        store.commit('MODIFY_REQUERY_TABLE_STATUS', 4);
        let response = err.response;
        let path = Router.app._route.path;
        /*当用户没有权限时重新去登录。登录后跳转回原来的页面而不是首页*/
        if (
            response.data &&
            response.data.code === 1002 &&
            !['/login', '/modifyPassword', '/modifyPassword_changShu', '/retrievePassword', '/main'].includes(path)
        ) {
            localStorage.setItem('WEBKIT_MODULE', window.location.hash.split('#')[1]);
        }
        if (response.headers.adqlocation) {
            //针对http状态码返回为302的处理
            window.location.href = response.headers.adqlocation;
        } else {
            return Promise.reject(err);
        }
    }
);

export default request;
