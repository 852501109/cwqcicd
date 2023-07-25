export default {
    /*
     *查询jssdk  'user.uploadMany': '${nfMcht}/qiniu/uploadMany.json'
     * */
    casLogin: '/casLogin',
    'user.getPublicKey': '/security/getPublicKey1.go', //获取检验吗
    'source.getPublicKey1': '/source/getPublicKey1.do', //获取检验吗
    'user.logout': '/security/logout.do', // 退出
    'user.login': '/security/login.go', //登录
    'user.captcha': '/security/captcha.go',
    'user.forceLogoutUser': '/user/forceLogoutUser.do', //踢出
    resetPWD: '/user/resetPwd.do', //post userId
    deleteUser: '/user/deleteUser.do', //post userId body直接发
    enableUser: '/user/enableUser.do', //post userId body直接发
    disableUser: '/user/disableUser.do', //post userId body直接发
    getEditUser: '/user/getEditUser.do', //get userId
    userRoleList: '/role/roleList.do', //get
    userResourceList: '/resource/resourceList.do', //get
    'user.modifyUser': '/user/modifyUser.do',
    'user.getMyDepts': '/source/getMyDepts.do', //获取当前用户的部门信息
    /*post account,email,leval:'',name,num:'',phone,resources:{},roleIds:[],userId*/
    'user.addUser': '/user/addUser.do', //同modifyUser ，只是没有userId
    'user.userList': '/user/userList.do', //includeRole:false,分页参数 get

    'org.findUser': '/org/findUser.do', //分页参数 positionId get
    'org.findTag': '/org/findTag.do', // positionId get
    'org.addTag': '/org/addTag.do', //post positionId,tagIds:[]
    'org.addUser': '/org/addUser.do', //post  positionId,deptIds:[],userIds:[]
    'tag.tagList': '/tag/tagList.do', //get includeResource:false, type:2|1, 分页参数
    'org.deleteUser': '/org/deleteUser.do', //positionId,userIds:[] post
    'org.deleteTag': '/org/deleteTag.do', //positionId,tagIds:[] post
    'org.deletePositions': '/org/deletePosition.do', //post {adq:10014}
    'org.modifyPosition': '/org/modifyPosition.do', //post id leader:boolean,name
    'org.addPosition': '/org/addPosition.do', //post deptId leader:bool,name

    'org.findPosition': '/org/findPosition.do', //get deptId isLeader
    'org.modifyDepartment': '/org/modifyDepartment.do',
    'org.findChildrenOrg': '/org/findChildrenOrg.do', //get includePosition: true dimension: 1 pid: 10013
    'user.userIcon': '/security/userIcon.do', //获取用户头像
    'org.findAccessDept': '/org/findAccessDept.do', //获得职位人员权限信息
    'org.modifyUser': '/org/modifyUser.do', //修改职位人员权限
    'org.orgManageCfg': '/org/orgManageCfg.do', //获得职位人员的权限列表
    'org.effectExpiredUser': '/user/effectExpiredUser.do', //设置账号有效期
    'org.headListCfg': '/event/headListCfg.do', //获得消息和待办信息
    'org.process': '/event/process.do', //获得消息待办跳转的详情页面
    'org.findMyManageDept': '/org/findMyManageDept.do', //获取登录用户管理的部门,

    /*
     * 系统管理员使用
     * */
    'org.findRootDept': '/org/findRootDept.do', //获得组织权限树(一级节点)
    'org.findChildrenDept': '/org/findChildrenDept.do', //获得组织权限树(除了一级节点外的节点)
    'org.findRootDeptTree': '/org/findRootDeptTree.do', //组织部门树（一次性请求所有的）
    'org.findRootDeptList': '/org/findRootDeptList.do', //组织部门树（一次性请求所有的）数据结构为list格式
    'org.getDeptRole': '/org/getDeptRole.do', //根据部门id获得可用角色
    'org.getDeptTag': '/org/getDeptTag.do', //根据部门id获得可用标签
    'org.addDepartment': '/org/addDepartment.do', //新增部门
    'org.deleteDepartment': '/org/deleteDepartment.do', //删除部门
    'org.findDepartment': '/org/findDepartment.do', //根据节点id查找节点详情
    'org.setDeptManager': '/org/setDeptManager.do', //设置节点管理员
    'org.checkModify': '/org/checkModify.do', //检测角色或标签是否有在使用
    'org.orgListImport': '/org/orgListImport.do',//导入组织
    'orguser.orgUserListImport': '/orguser/orgUserListImport.do',//导入组织用户关联关系
    'org.importDeptInfo': '/org/importDeptInfo.do',//导入组织

    'orguser.findDeptUserList': '/orguser/findDeptUserList.do', //用户列表
    'orguser.addDeptUser': '/orguser/addDeptUser.do', //添加用户
    'orguser.findDeptUser': '/orguser/findDeptUser.do', //根据Id查询用户详情
    'orguser.modifyDeptUser': '/orguser/modifyDeptUser.do', //编辑用户
    'orguser.deleteDeptUser': '/orguser/deleteDeptUser.do', //删除用户
    'orguser.findDataAccess': '/orguser/findDataAccess.do', //数据权限列表
    'orguser.setDataAccess': '/orguser/setDataAccess.do', //新增数据权限

    /*
     * 部门管理员使用
     * */
    'org.findMyDept': '/org/findMyDept.do', //获得组织权限树(一级节点)
    'org.findMyChildren': '/org/findMyChildren.do', //获得组织权限树(除了一级节点外的节点)
    'org.getMyDeptRole': '/org/getMyDeptRole.do', //根据部门id获得可用角色
    'org.getMyDeptTag': '/org/getMyDeptTag.do', //根据部门id获得可用标签
    'org.addMyDepartment': '/org/addMyDepartment.do', //新增部门
    'org.modifyMyDepartment': '/org/modifyMyDepartment.do', //修改部门
    'org.deleteMyDepartment': '/org/deleteMyDepartment.do', //删除部门
    'org.findMyDepartment': '/org/findMyDepartment.do', //根据节点id查找节点详情
    'org.setMyDeptManager': '/org/setMyDeptManager.do', //设置节点管理员

    'orguser.findMyDeptUserList': '/orguser/findMyDeptUserList.do', //用户列表
    'orguser.addMyDeptUser': '/orguser/addMyDeptUser.do', //添加用户
    'orguser.findMyDeptUser': '/orguser/findMyDeptUser.do', //根据Id查询用户详情
    'orguser.modifyMyDeptUser': '/orguser/modifyMyDeptUser.do', //编辑用户
    'orguser.deleteMyDeptUser': '/orguser/deleteMyDeptUser.do', //删除用户
    'orguser.findMyDataAccess': '/orguser/findMyDataAccess.do', //数据权限列表
    'orguser.setMyDataAccess': '/orguser/setMyDataAccess.do', //新增数据权限
    'orguser.allApp': '/orguser/allApp.do', //获取所有应用

    'role.myRoleList': '/role/myRoleList.do', //获取当前用户可用的角色
    'userAppLogin.weixinLoginUrl': '/userAppLogin/weixinLoginUrl.do', //获取微信扫码登录的二维码
    'userAppLogin.check': '/userAppLogin/check/{userId}.do', //轮询获取扫码的结果，是成功还是失败
    'userAppLogin.UnbundlingUserAppLogin': '/userAppLogin/UnbundlingUserAppLogin.do', //解除微信绑定
    'userAppLogin.callback': '/userAppLogin/callback.go', //回调地址（现在微信资源没申请下来。先模拟扫码，等资源下来了就删掉）
    'common.getCurrentUserRole': '/common/getCurrentUserRole.do',
    'common.buildOperatorMenu': '/common/buildOperatorMenu.do'
};
