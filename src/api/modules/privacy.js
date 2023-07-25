import request from '@/api/handleRequest';
//======================================================
const BASIC_URL = window.urlConfig;
/**
 * 新增隐私声明
 */
export const createPrivacy = (data) =>
    request({ url: `${BASIC_URL}/privacy`, method: 'POST', data }, { showFetchLoading: false });

/**
 * 分页获取隐私声明
 */
export const privacyPage = (data) =>
    request({ url: `${BASIC_URL}/privacy/page`, method: 'POST', data }, { showFetchLoading: false });

/**
 * 删除隐私声明
 */
export const deletePrivacy = (id) =>
    request({ url: `${BASIC_URL}/privacy/${id}`, method: 'DELETE', data: {} }, { showFetchLoading: false });

/**
 * 下载文件然后预览
 * @param {文件hash值} key
 * @returns
 */
export const downloadFile = (key) =>
    request(
        { url: `${BASIC_URL}/file/down/${key}.go`, method: 'GET', responseType: 'blob' },
        { showFetchLoading: false }
    ).then((res) => {
        let blob = res;
        window.URL = window.URL || window.webkitURL;
        return URL.createObjectURL(blob);
    });

/**
 * userId
 * privacyId
 * 用户签订隐私协议
 */
export const bindPrivacy = (userId, privacyId) =>
    request(
        {
            url: `${BASIC_URL}/userprivacystatement/bind`,
            method: 'POST',
            data: {
                leftId: userId,
                rightId: privacyId,
            },
        },
        { showFetchLoading: false }
    );
