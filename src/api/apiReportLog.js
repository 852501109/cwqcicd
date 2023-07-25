import Vue from 'vue';
import request from './ajax';

const urlConfig = window.urlConfig;



export function queryUserList(parameter) {
    return request({
        url: urlConfig + '/apiReportLog/queryUserList.do',
        method: 'get',
        params: parameter,
    });
}


export function queryCategoryList(parameter) {
    return request({
        url: urlConfig + '/apiReportLog/queryCategoryList.do',
        method: 'get',
        params: parameter,
    });
    
}
