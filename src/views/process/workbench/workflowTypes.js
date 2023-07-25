export default {
    1: { tableName: 'oa_leave_bill', type: '请假审核' }, //请假
    2: { tableName: 'oa_finance', type: '财务审核' }, //财务审核
    3: { tableName: 'sys_category', type: '流程启用审核' },
};
export const status = {
    0: '草稿',
    1: '处理中',
    2: '结束',
};
/*审核状态*/
export const reviewStatus = [
    { label: '待提交', value: 0 },
    { label: '处理中', value: 1 },
    { label: '通过', value: 2 },
    { label: '驳回', value: 3 },
    { label: '撤回', value: 4 },
    { label: '不通过', value: 5 },
    { label: '终止', value: 6 },
];
