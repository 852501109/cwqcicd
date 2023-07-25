export default {
    /*
     * 统一消息
     * */
    'news.sys.msg.new': '/sys/msg/type/new.do', //消息类型新增
    'news.sys.msg.edit': '/sys/msg/type/edit.do', //消息类型修改
    'news.sys.msg.type.del': '/sys/msg/type/del.do', //消息类型删除  根据{id}删除
    'news.sys.msg.type.list': '/sys/msg/type/list.do', //消息类型管理列表
    'news.sys.msg.type.id': '/sys/msg/type/id.do', //根据id查询详情

    'news.sys.channel.new': '/sys/msg/channel/new.do', //消息渠道新增
    'news.sys.channel.edit': '/sys/msg/channel/edit.do', //消息渠道修改
    'news.sys.channel.del': '/sys/msg/channel/del.do', //消息渠道删除  根据{id}删除
    'news.sys.channel.list': '/sys/msg/channel/list.do', //消息渠道列表
    'news.sys.msg.channel.id': '/sys/msg/channel/id.do', //根据id查询详情

    'sys.message.list': '/sys/message/list', // 消息列表（所有的）
    'sys.message.notice.list': '/sys/message/notice/list', // 公告列表
    'sys.message.userNotice.list': '/sys/message/userNotice/list', // 公告列表（当前登录用户关联的公告）
    'sys.messagePublishHis.list': '/sys/messagePublishHis/list', // 公告发布历史
    'sys.messagePublishHis.addPublish': '/sys/messagePublishHis/addPublish', // 发布公告
    'sys.messagePublishHis.addRevoke': '/sys/messagePublishHis/addRevoke', // 撤销公告
    'sys.message.id': '/sys/message/id', //根据id查找消息
    'sys.message.user.id': '/sys/message/user/id', //根据id查找消息
    'sys.message.notice.id': '/sys/message/notice/id', //根据id查找消息
    'sys.message.user': '/sys/message/user', //我的消息  列表
    'sys.message.user.del': '/sys/message/user/del', //我的消息  删除
    'sys.message.del': '/sys/message/del', //消息 删除
    'sys.message.resend': '/sys/message/resend', // 邮箱消息重发
    'sys.message.user.todo': '/sys/message/user/todo', // 是否有待办任务

    'news.sys.id': '/sys/msg/id.do', //
    'news.sys.msg.user': '/sys/msg/user.do', // 用户消息查询
    'news.sys.msg.read': '/sys/msg/read.do', // 用户消息读取
    'news.sys.send': '/sys/msg/send.do', // 立即重发
    'sys.message.template.list': '/sys/message/template/list', //模板管理列表
    'sys.message.template.add': '/sys/message/template/add', //模板管理  新增
    'sys.message.template.edit': '/sys/message/template/edit', //模板管理  修改
    'sys.message.template.del': '/sys/message/template/del', //模板管理  删除
    'sys.message.template.id': '/sys/message/template/id', //模板管理  (根据id查找详情)
    'sys.message.add': '/sys/message/add', //新增消息
    'sys.message.temp.add': '/sys/message/temp/add ', //新增消息
    'orguser.insertMsg': '/orguser/insertMsg.do', //消息推送
    'sys.message.read': '/sys/message/read', //消息是否已讀取，調用過後就會標記為已讀
    'sys.message.update.info': '/sys/message/update/info', //任務是否已辦，調用過後就會標記為辦
    'sys.message.update.user.info': '/sys/message/update/user/info', //任務是否已辦，調用過後就會標記為辦
    'sys.message.edit': '/sys/message/edit', //编辑公告
};
