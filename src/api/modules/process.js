export default {
    //工作台
    "activiti.biz.list": "/activiti/biz/list",//我申请的任务列表
    "activiti.biz.new": "/activiti/biz/new", //新建一个申请
    "activiti.task.list": "/activiti/task/list",//待办任务
    "activiti.task.done": "/activiti/task/done",//已办任务
    "activiti.task.historic.del": "/activiti/task/historic/del",//已办任务 删除
    "activiti.task.submit": "/activiti/task/submit",//审核通过
    "activiti.task.reject": "/activiti/task/reject",//驳回发起人
    "activiti.process.node.next": "/activiti/process/node/next",//下一审批人
    "activiti.task.back.task": "/activiti/task/back/task",//驳回某个节点
    "activiti.task.back.nodes": "/activiti/task/back/nodes",//获得可驳回节点
    "activiti.biz.proc.cancel": "/activiti/biz/proc/cancel",
    "activiti.biz.proc.start": "/activiti/biz/proc/start",//流程启动processApproval
    "activiti.process.list": "/activiti/process/list",//可用流程
    "activiti.biz.proc.viewImage": "/activiti/biz/proc/viewImage",//业务流程图
    "activiti.biz.update": "/activiti/biz/update",//修改我的申请
    "activiti.biz.cc.list": "/activiti/biz/cc/list",//抄送列表
    "activiti.biz.hasten": "/activiti/biz/hasten",//催办


    //工作流
    "activiti.models.list": "/activiti/models/list",//流程配置列表
    "activiti.models.create": "/activiti/models/create",//新增 模型配置
    "activiti.models.delete": "/activiti/models/delete",//删除模型配置
    "activiti.process.del": "/activiti/process/del",//删除流程配置
    "activiti.models.deploy": "/activiti/models/deploy",//版本部署
    "activiti.process.select.id": "/activiti/process/select/id",//根据id查找流程配置详情
    "activiti.process.new": "/activiti/models/new",//新增流程配置
    "activiti.process.update": "/activiti/process/update",//修改流程配置
    "activiti.process.node.edit": "/activiti/process/node/edit",//新增流程定义节点信息
    "activiti.process.instance.run": "/activiti/process/instance/run",//流程监控列表(运行中)
    "activiti.process.instance.finished": "/activiti/process/instance/finished",//流程监控列表(结束)
    "activiti.process.node": "/activiti/process/node",//流程配置列表
    "activiti.process.status": "/activiti/process/status",//激活未激活
    "activiti.models.img": "/activiti/models/img",//流程预览（图片）
    "activiti.process.instance.status": "/activiti/process/instance/status",//挂起、激活
    "activiti.process.audit": "/activiti/process/audit",//流程发布
    "activiti.task.historic": "/activiti/task/historic",//任务流水
    "activiti.process.node.next.all": "/activiti/process/node/next/all",//通过的节点信息
    "activiti.task.todo.id": "/activiti/task/todo/id",//通过id查找详情
    "activiti.task.delegate": "/activiti/task/delegate",//委派
    "activiti.task.done.id": "/activiti/task/done/id",//已结束任务的详情
    "activiti.process.instance.historic/del":"/activiti/process/instance/historic/del", //流程监控  删除
    "activiti.models.import":"/activiti/models/import",//流程模型导入
    "activiti.model.save":"/activiti/model/save",//流程图保存/activiti/model/save/{modelId}
    "activiti.model.json":"/activiti/model/json/",//流程图回显/activiti/model/json/{modelId}


    "sys.category.list": "/sys/category/list",//业务注册列表
    "sys.category.insert": "/sys/category/insert",//新增业务注册
    "sys.category.update": "/sys/category/update",//更新业务注册
    "sys.category.id": "/sys/category/id",//根据Id获得业务注册详情
    "sys.category.del": "/sys/category/del",//根据Id删除业务注册


}
