/*
* @description 接口查询配置表 后台接口url
* @author liyaxin
* @date 2023-06-15 15:16:37
*/
export default {
    'apiQueryConf.apiQueryConfList': '/apiQueryConf/listByPage.do', //查询数据
    'apiQueryConf.goEditApiQueryConf': '/apiQueryConf/queryCofigAndPropertyListById.do', //查询单条数据
    'apiQueryConf.deleteApiQueryConf': '/apiQueryConf/delete.do', //删除数据
    'apiQueryConf.addApiQueryConf': '/apiQueryConf/insert.do', //添加数据
    'apiQueryConf.modifyApiQueryConf': '/apiQueryConf/update.do', //编辑数据
    'apiQueryConf.queryCategoryList': '/apiQueryConf/queryCategoryList.do', //类别接口
    'apiQueryConf.queryConfigList': '/apiQueryConf/queryConfigList.do', // 类别列表
    'apiQueryConf.queryPropertyList': '/apiQueryConf/queryPropertyList.do', // 获取详情
    'apiQueryConf.changeReportConfigState': '/apiQueryConf/changeState.do', // 变更状态 
    'apiQueryConf.queryByConfId': '/apiQueryConf/queryByConfId.do', // 授权回显接口
    'apiQueryConf.authorization': '/apiQueryConf/authorization.do', // 授权接口
    'apiQueryConf.findRootDept': '/apiQueryConf/findRootDept.do', //获得组织权限树(一级节点)
    'apiQueryConf.findChildrenDept': '/apiQueryConf/findChildrenDept.do', //获得组织权限树(除了一级节点外的节点)
    'apiQueryConf.findDeptUserList': '/apiQueryConf/findDeptUserList.do', //组织部门树（一次性请求所有的）
};
