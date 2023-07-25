//消息类型
export const msgTypeList = [
    { label: '其他', value: 0 },
    { label: '公告', value: 1 },
    { label: '消息', value: 2 },
    { label: '任务', value: 3 },
    { label: '告警', value: 4 },
];
//通知对象
export const msgNoticeTypeList = [
    { label: '标签', value: 0 },
    { label: '全部用户', value: 1 },
    { label: '用户', value: 2 },
    { label: '部门', value: 3 },
];
//紧急程度
export const levelList = [
    { label: '默认', value: 0 },
    { label: '低', value: 1 },
    { label: '中', value: 2 },
    { label: '高', value: 3 },
];
/*发送状态*/
export const sendStatusList = [
    { label: '初始化', value: 0 },
    { label: '已发送', value: 1 },
    // { label: '撤销', value: 2 },
    { label: '推送失败', value: 3 },
    { label: '失败不再发送', value: -1 },
];
/*发布状态*/
export const publishStatusList = [
    { label: '未发布', value: 0 },
    { label: '已发布', value: 1 },
    { label: '已撤销', value: 2 },
];
/*办理状态*/
export const handleStatusList = [
    { label: '-', value: null },
    { label: '部分办理', value: 3 },
    { label: '撤销', value: 2 },
    { label: '办理', value: 1 },
    { label: '未办', value: 0 },
];
/*渠道列表*/
export const channelList = [
    // { label: '其他', value: '0' },
    { label: '系统', value: '1' },
    { label: '邮件', value: '2' },
    { label: '短信', value: '3' },
];
