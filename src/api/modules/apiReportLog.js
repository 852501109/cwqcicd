/*
* @description 系统审计表 后台接口url
* @author liyaxin
* @date 2023-06-15 15:51:11
*/
export default {
    'apiReportLog.apiReportLogList': '/apiReportLog/listByPage.do', //查询数据
    'apiReportLog.goEditApiReportLog': '/apiReportLog/queryById.do', //查询单条数据
    'apiReportLog.deleteApiReportLog': '/apiReportLog/delete.do', //删除数据
    'apiReportLog.addApiReportLog': '/apiReportLog/insert.do', //添加数据
    'apiReportLog.modifyApiReportLog': '/apiReportLog/update.do', //编辑数据
    'apiReportLogAudit.apiReportLogAuditList':'/apiReportLogAudit/listByPage.do'//接口查询监控信息
};
