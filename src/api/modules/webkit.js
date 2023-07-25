export default {
    /*
     *用户管理
     * */
    'webkit.menu': '/security/menu.do', // 菜单
    'webkit.getEditApp': '/app/getEditApp.do', //应用详情
    'webkit.appList': '/app/appList.do', // 应用管理
    'webkit.modifyApp': '/app/modifyApp.do', // 应用编辑
    'webkit.addApp': '/app/addApp.do', // 应用增加
    'webkit.deleteApp': '/app/deleteApp.do', // 应用增加
    'webkit.tagList': '/tag/tagList.do', // 标签管理
    'webkit.goEditTag': '/tag/getEditTag.do', // 去获取默认选中数据标签
    'tag.checkDelete': '/tag/checkDelete.do', // 删除标签之前先校验该角色是否有在使用
    'webkit.deleteTag': '/tag/deleteTag.do', // 删除标签
    'webkit.addTag': '/tag/addTag.do', // 新增标签
    'webkit.modifyTag': '/tag/modifyTag.do', // 标签修改
    'webkit.definitionList': '/schedule/definitionList.do', // 调度管理
    'webkit.cheduleGroups': '/schedule/scheduleGroups.do', // 获取调度管理groundId
    'webkit.getAddJobCfg': '/schedule/getAddJobCfg.do', // 业务下拉选项
    'webkit.calcRunTime': '/schedule/calcRunTime.go', // 最近5次
    'webkit.getEditJob': '/schedule/getEditJob.do', // 调度编辑获取
    'webkit.taskList': '/schedule/taskList.do', // 调度编辑任务名称根据业务变化
    'webkit.execDetail': '/schedule/execDetail.do', // 调度详情
    'webkit.state': '/schedule/state.do', // 调度播放 暂停
    'webkit.addJob': '/schedule/addJob.do', // 添加调度
    'webkit.editJob': '/schedule/editJob.do', // 编辑调度
    'webkit.errorLog': '/schedule/errorLog.do', // 错误日志
    'webkit.deleteJob': '/schedule/deleteJob.do', // 删除日志
    'webkit.gotoExecDetail': '/schedule/gotoExecDetail.do', // 调度播放 暂停
    'webkit.logList': '/loginLog/logList.do', // 登录日志
    'webkit.optList': '/optLog/logList.do', // 操作记录
    'loginLog.deptLogList': '/loginLog/deptLogList.do', //部门登录日志
    'optLog.deptLogList': '/optLog/deptLogList.do', //部门操作日志
    'webkit.getResourceList': '/resource/getResourceList.do', // 获取权限菜单列表（租户专用）
    'webkit.getUserList': '/user/userList.do', //获取用户列表Table
    'webkit.findRootOrg': '/org/findRootOrg.do', //获取组织结构列表
    'webkit.resourceList': '/resource/resourceList.do', // 获取菜单数列表
    'webkit.displayChildrenResourceList': '/resource/displayChildrenResourceList.do', // 获取菜单数列表(系统管理页面用)
    'webkit.roleList': '/role/roleList.do', // 角色管理列表
    'webkit.addRole': '/role/addRole.do', // 角色新增
    'webkit.goEditRole': '/role/getEditRole.do', // 获取角色默认值
    'webkit.modifyRole': '/role/modifyRole.do', // 角色修改
    'webkit.checkDelete': '/role/checkDelete.do', // 删除角色之前先校验该角色是否有在使用
    'webkit.deleteRole': '/role/deleteRole.do', // 删除角色
    'webkit.propertiesList': '/config/propertiesList.do', // 属性配置Table
    'webkit.modifyProperty': '/config/modifyProperty.do', // 属性修改
    'webkit.getBaseInfo': '/security/getBaseInfo.do', // 用户信息获取 (GET)
    'webkit.modifyPwd': '/security/modifyPwd.do', // 修改用户密码
    'webkit.modifyPwd2': '/security/modifyPwd2.go', // 单点登录进来修改用户密码
    'oauth2.phoneResetPwdRequest': '/oauth2/phoneResetPwdRequest', //手机验证码接口
    'oauth2.phoneResetPwd2': '/oauth2/phoneResetPwd2', //手机号修改密码
    'oauth2.getPublicKey': '/oauth2/getPublicKey',//获取加密的公钥 /oauth2/getPublicKey/{type} 1.用户登录接口公钥 2.修改密码公钥 3.手机修改密码接口公钥
    'webkit.setIcon': '/security/setIcon.do', // 修改用户头像
    'webkit.modifyBaseInfo': '/security/modifyBaseInfo.do', // 修改用户基本信息
    'webkit.groupType': '/optLog/groupType.do', // 获取用户操作对象及类型
    'webkit.tenantList': '/tenant/tenantList.do', //租户列表
    'webkit.addTenant': '/tenant/addTenant.do', //添加租户
    'webkit.getEditTenant': '/tenant/getEditTenant.do', //租户详情,
    'user.getTenantIdManagerUser': '/user/getTenantIdManagerUser.do', //租户详情（新增加的接口）
    // 'user.modifyTenantIdManagerUser': '/user/modifyTenantIdManagerUser.do', //编辑租户（新增加的接口）
    'webkit.modifyTenant': '/tenant/modifyTenant.do', //编辑租户
    'webkit.deleteTenant': '/tenant/deleteTenant.do', //删除租户
    'webkit.tenantUserList': '/tenant/tenantUserList.do', //租户列表
    'webkit.securityUserList': '/user/securityUserList.do', //获取租户
    'webkit.addTenantUser': '/tenant/addTenantUser.do', //添加租户
    'webkit.deleteTenantUser': '/tenant/deleteTenantUser.do', //删除租户列表
    'webkit.myapp': '/app/myApp.do', //租户下首页列表

    /*运维监控-告警列表*/
    'webkit.alarmData': '/monitor/alarm/data.do', //查询数据
    'webkit.alarmUpdate': '/monitor/alarm/update.do', //屏蔽
    'webkit.alarmClean': '/monitor/alarm/clean.do', //清除
    'webkit.alarmDetail': '/monitor/alarm/detail.do', //详情
    'webkit.alarmAllApp': '/monitor/alarm/allApp.do', //告警列表的应用列表

    /*运维监控-事件管理*/
    'webkit.eventData': '/monitor/event/data.do', //查询数据
    'webkit.eventDetail': '/monitor/event/detail.do', //详情
    'webkit.eventAllApp': '/monitor/event/allApp.do', //应用列表

    /*日志管理-文件日志*/
    'webkit.list': '/hwlog/list.do', //查询数据

    /*应用接入*/
    'appManage.enableApp': '/app/enableApp.do', //启用
    'appManage.disableApp': '/app/disableApp.do', //禁用

    'webkit.myUserList': '/user/myUserList.do', //组织用户 获取用户列表Table
    'webkit.activiti.models.create': '/activiti/models/create',
    'user.userListImport': '/user/userListImport.do',//导入用户

    'webkit.remind': '/security/remind.do',

    /*报表配置*/
    'webkit.reportCategoryList': '/config/category/listByPage.do', // 报表类别分页列表
    'webkit.addReportCategory': '/config/category/insert.do', // 报表类别新增
    'webkit.updateReportCategory': '/config/category/update.do', // 报表类别修改
    'webkit.queryReportCategory': '/config/category/queryById.do', // 根据ID查询报表类别详情
    'webkit.deleteReportCategory': '/config/category/delete.do', // 根据ID删除报表类别
    'webkit.reportCategoryAll': '/config/category/queryAll.go', // 报表类别列表
    'webkit.reportConfigList': '/config/listByPage.do', // 报表配置列表
    'webkit.addReportConfig': '/config/insert.do', // 新增报表配置
    'webkit.editReportConfig': '/config/update.do', // 修改报表配置
    'webkit.queryReportConfig': '/config/queryById.do', // 根据ID查询报表配置
    'webkit.changeReportConfigState': '/config/changeState.do', // 变更报表配置状态
    'webkit.deleteReportConfig': '/config/delete.do', // 根据ID删除报表配置
    'webkit.buildMenu': '/config/buildMenu.do', //构建菜单
    'webkit.buildApiMenu': '/api/display/buildMenu.do', //构建菜单
    'webkit.tableList': '/config/queryTableList.do', //查询库中表列表
    'webkit.columnList': '/config/queryColumnList.do', //查询库中表字段信息 
    'webkit.reportPropertyAll': '/report/queryAll.do', //查询报表配置属性
    'webkit.reportDisplayList': '/report/display/listByPage.do', //查询报表配置属性
    'webkit.reportDisplayExport': '/report/display/exportExcel.do', //查询报表配置属性
    'webkit.uploadQueryFile': '/common/queryImport.do',
    
    'webkit.apiPropertyAll': '/api/display/queryApiQueryProperty.do', //查询接口配置属性
    'webkit.apiDisplayList': '/api/display/listByPage.do', //查询接口配置属性
    'webkit.apiDisplayExport': '/api/display/exportExcel.do', //查询接口配置属性
    'webkit.apiDisplayExportHis': '/api/display/exportExcelHis.do', //查询接口配置属性
    'webkit.validateApiExportExcelHis': '/api/display/validateExportExcelHis.do',
    'webkit.reportDisplayExportHis': '/report/display/exportExcelHis.do',
    'webkit.validateReportExportExcelHis': '/report/display/validateExportExcelHis.do',

    /*接口配置*/
    'webkit.addApiConf': '/apiConf/add.do', // 接口配置新增
    'webkit.apiConfUpdateDetailById': '/apiConf/updateDetailById.do', // 接口配置编辑
    /*接口配置详情*/
    'webkit.queryConfAndPropertyById': '/apiConf/queryConfAndPropertyById.do', // 接口配置新增


};
