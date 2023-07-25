import request from './ajax';
import store from '@/store';
import Vue from '@/main';
//  后端接口字段配置
const {
    //  statusKey = 'resultCode',v
    statusKey = 'code',
    msgKey = 'msg',
    dialogTypeKey = 'dialogType',
    dialogTitleKey = 'dialogTitle',
    resultKey = 'result',

    successStatusValue = 0,
    //  dataKey,
    errorDescKey = 'msg',
} = {};

//  默认axios配置项
const axiosConfigDefault = (data) => {
    //  地址栏传递的参数
    return {
        url: '',
        method: 'POST',
        data: typeof data === 'string' || data instanceof FormData ? data : { ...data },
    };
};

/**
 * [处理请求方法]
 * @param  {Object} axiosConfig [axios请求参数配置]
 * @param  {Object} globalMutationConfig [全局state配置]]
 * @return {promise}
 */
export default (axiosConfig = {}, globalMutationConfig = {}) => {
    const {
        showFetchLoading = true, //  加载中loading
        showSuccessTip = false, //  操作成功提示
        customSuccessTip = false, //  自定义成功提示
    } = globalMutationConfig;

    const data = axiosConfig.data;
    data && delete axiosConfig.data;
    const _axiosConfig = { ...axiosConfigDefault(data), ...axiosConfig };
    if (showFetchLoading) store.state.isFetching = true;
    return request(_axiosConfig)
        .then((res) => {
            if (showFetchLoading) store.state.isFetching = false;
            //有些返回没有code字段,需要兼容
            let keys = Object.keys(res || {});
            if (!keys.includes(dialogTypeKey) || (keys.includes(dialogTypeKey) && res[statusKey] === successStatusValue)) {
                //  各业务线状态码不同
                if (showSuccessTip && !customSuccessTip) {
                    Vue.$AudaqueToast.tip({ template: '操作成功' });
                }
                return res;
            } else {
                return Promise.reject(res);
            }
        })
        .catch((e) => {
            console.log(e)
            const errJson = e.code ? e : JSON.parse(e.request.responseText);
            if (showFetchLoading) store.state.isFetching = false;
            const errorMsg = errJson[errorDescKey];
            const text = errorMsg ? errorMsg : '服务器未响应或网络通信失败，请重试';
            if (errJson.code !== 1002 && errJson.code !== 999999) {
                if (errJson.code == 401) {
                    store.dispatch('user/LOGOUT');
                }
                Vue.$AudaqueToast.error({ template: text });
            }

            return Promise.reject(errJson);
        });
};
