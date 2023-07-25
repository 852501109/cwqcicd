/**
 * 存储流程设计相关参数
 */
export default class BpmData {
    constructor() {
        this.controls = []; // 设计器控件
        this.init();
    }

    init() {
        this.controls = [
            {
                action: 'create.start-event',
                title: '开始',
                isShow: true,
            },
            {
                action: 'create.intermediate-event',
                title: '中间',
                isShow: false,
            },
            {
                action: 'create.end-event',
                title: '结束',
                isShow: true,
            },
            {
                action: 'create.exclusive-gateway',
                title: '网关',
                isShow: true,
            },
            {
                action: 'create.task',
                title: '任务',
                isShow: true,
            },
            {
                action: 'create.user-task',
                title: '用户任务',
                isShow: true,
            },
            {
                action: 'create.user-sign-task',
                title: '会签任务',
                isShow: false,
            },
            {
                action: 'create.subprocess-expanded',
                title: '子流程',
                isShow: false,
            },
            {
                action: 'create.data-object',
                title: '数据对象',
                isShow: false,
            },
            {
                action: 'create.data-store',
                title: '数据存储',
                isShow: false,
            },
            {
                action: 'create.participant-expanded',
                title: '扩展流程',
                isShow: false,
            },
            {
                action: 'create.group',
                title: '分组',
                isShow: false,
            },
        ];
    }

    //  获取控件配置信息
    getControl(action) {
        const result = this.controls.filter((item) => item.action === action);
        return result[0] || {};
    }
}
