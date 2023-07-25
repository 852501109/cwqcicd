<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :titles="titles" @change="changeTableList" :index="activityName">
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="流程名称">
                    <el-input class="autoSize f14" v-model.trim="param.name"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="申请标题">
                    <el-input clearable class="autoSize f14" v-model.trim="param.title"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="状态" v-if="activeItem === 0">
                    <el-select v-model="param.suspended" placeholder="请选择" clearable>
                        <el-option label="运行中" :value="1"></el-option>
                        <el-option label="暂停" :value="2"></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="发起人">
                    <el-input clearable class="autoSize f14" v-model.trim="param.applyer"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="处理人" v-if="activeItem === 0">
                    <el-input clearable class="autoSize f14" v-model.trim="param.assignee"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="发起时间" class="search-time-line">
                    <el-date-picker
                        class="search-date"
                        v-model="applicationTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tableList.rows"
                border
            >
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, param.page, param.rows);
                        }
                    "
                    width="50"
                >
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--prop="name"-->
                <!--label="业务"-->
                <!--&gt;</el-table-column>-->
                <el-table-column show-overflow-tooltip prop="businessKey" label="流程流水号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="流程名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="申请标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="applyer" label="发起人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="startTime" label="发起时间"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="currTaskName"
                    v-if="activeItem === 0"
                    label="当前节点"
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="suspended" v-if="activeItem === 0" label="状态">
                    <template slot-scope="scope">
                        {{ suspendedObj[scope.row.suspended] }}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="activeItem === 0"
                    show-overflow-tooltip
                    prop="assigneeName"
                    label="处理人"
                ></el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="220px">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.taskHistoric"
                            class="iconfont iconchakan11 operate"
                            title="查看"
                            @click="preview(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.bizCancel && activeItem === 0"
                            class="iconfont icontingzhi operate"
                            title="结束"
                            @click="revoke(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.insStatus && activeItem === 0"
                            :class="['iconfont  operate', scope.row.suspended === 2 ? 'iconjihuo' : 'iconminus']"
                            :title="scope.row.suspended === 2 ? '解挂' : '挂起'"
                            @click="changeStatus(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.taskBack && activeItem === 0"
                            class="iconfont iconiconzhengli_tiaozhuan operate"
                            title="跳转"
                            @click="jump(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.insHistoricDel && activeItem === 1"
                            class="iconfont iconShape1 operate"
                            title="删除"
                            @click="del(scope.row)"
                        ></span>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="loadData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :page-size="param.rows"
                :total="tableList.total"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>
<style scoped lang="scss">
/deep/ .audaque-table-title__title-active {
    position: relative;
    margin-right: 35px;
    &:before {
        content: '';
        width: 100%;
        height: 2px;
        background: #5394eb;
        position: absolute;
        bottom: -12px;
    }
}
</style>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import API from '@/api/index';

export default {
    data() {
        return {
            isSearch: false,
            param: {
                name: null,
                title: null,
                applyer: null,
                suspended: null,
                assignee: null,
                page: 1,
                rows: 10,
            },
            applicationTime: null,
            tableList: {
                rows: [],
                total: 0,
            },
            businessList: [
                { value: '财务', label: '财务' },
                { value: '考勤', label: '考勤' },
            ],
            statusList: [
                { value: '状态1', label: '状态1' },
                { value: '状态2', label: '状态2' },
            ],
            // titles: ['运行中', '已结束'],
            activityName: 0,
            activeItem: 0, //选中的模块
            suspendedObj: {
                null: '-',
                1: '运行中',
                2: '暂停',
            },
        };
    },
    computed: {
        titles() {
            let arr = [];
            //有【运行中】的权限
            if (this.permitList.runningInsList) {
                arr.push('运行中');
            }
            if (this.permitList.finishedInsList) {
                //有【已结束】的权限
                arr.push('已结束');
            }
            this.setActiveItem();
            return arr;
        },
    },
    mixins: [adqSearchMixin],
    created() {
        // this.loadData();
    },
    mounted() {
        this.loadData();
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
                applicationTime: this.applicationTime,
                activityName: this.activeItem,
            };
            let params = Object.assign({}, this.param);
            params.createTimeBegin = this.applicationTime ? this.applicationTime[0] : null;
            params.createTimeEnd = this.applicationTime ? this.applicationTime[1] : null;
            this._AJAX({
                url: this.activeItem === 0 ? 'activiti.process.instance.run' : 'activiti.process.instance.finished',
                method: 'GET',
                data: params,
            })
                .then((res) => {
                    if (res.code == 0) {
                        this.tableList = res.result;
                    }
                })
                .catch(() => {});
        },

        setActiveItem() {
            //只有【已结束】的权限
            if (!this.permitList.runningInsList && this.permitList.finishedInsList) {
                this.activeItem = 1;
            }
        },

        changeTableList(val, name) {
            this.param.page = 1;
            this.param.rows = 10;
            this.activityName = val;
            this.activeItem = val;
            this.setActiveItem();
            this.loadData();
        },
        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
            this.loadData();
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.loadData();
        },
        search(type) {
            this.param.page = 1;
            if (type == 0) {
                //置空
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                    this.applicationTime = null;
                });
            }
            this.loadData();
        },
        /*撤销*/
        revoke(row) {
            let _this = this;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'activiti.biz.proc.cancel',
                method: 'POST',
                data: {
                    procInstId: row.procInstId,
                    bizCode: row.businessKey,
                    result: 6,
                },
            })
                .then((res) => {
                    if (res.code == 0) {
                        this.$AudaqueToast.tip({
                            template: `操作成功`,
                            methods: {
                                okEvent() {
                                    _this.loadData();
                                },
                            },
                        });
                    }
                })
                .catch(() => {
                    this.loadData();
                });
        },
        changeStatus(row) {
            let _this = this;
            let status = row.suspended === 2 ? 1 : 0;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'activiti.process.instance.status',
                method: 'POST',
                data: {
                    procInsId: row.procInstId,
                    status: status,
                },
            })
                .then((res) => {
                    if (res.code == 0) {
                        _this.$AudaqueToast.tip({
                            template: status === 0 ? '挂起成功' : '解挂成功',
                            methods: {
                                okEvent() {
                                    _this.loadData();
                                },
                            },
                        });
                    }
                })
                .catch(() => {
                    this.loadData();
                });
        },
        async jump(row) {
            let _t = this;
            let tableData = [];
            await _t
                ._AJAX({
                    url: 'activiti.task.back.nodes',
                    method: 'GET',
                    data: {
                        procInstId: row.procInstId,
                        taskId: row.taskId,
                    },
                })
                .then((res) => {
                    //改变可驳回节点table赋值
                    if (res.result && res.result.length > 0) {
                        tableData = res.result;
                    }
                })
                .catch(() => {
                    this.loadData();
                });
            if (tableData.length === 0) {
                _t.$AudaqueToast.warn({
                    template: `无可跳转节点`,
                    methods: {
                        okEvent() {},
                    },
                });
            } else {
                this.$AudaqueToast.dialog({
                    title: '跳转',
                    width: '800px',
                    data: {
                        ruleForm: {
                            id: _t.taskId,
                            //procInstId: '',
                            //procDefId:'',
                            comment: '',
                            selectedRows: [],
                        },
                        tableData: tableData,
                    },
                    template: `
                        <el-form ref="rejectform" :model="ruleForm" label-width="120px" class="reject-form">
                            <el-form-item
                                label="目标活动环节"
                                prop="selectedRows"
                                :rules="[{ required: true, message: '请选择驳回节点', trigger: 'change' }]"
                            >
                                <el-table

                                    ref="rejecttable"
                                    :data="tableData"
                                    style="width: 100%"
                                    border
                                    @selection-change="handleSelectionChange"
                                >
                                    <el-table-column
                                        type="selection"
                                        width="55">
                                    </el-table-column>
                                    <el-table-column
                                        type="index"
                                        label="序号"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="环节名称"
                                    >
                                    </el-table-column>
<!--                                    <el-table-column-->
<!--                                        prop="address"-->
<!--                                        label="处理人">-->
<!--                                    </el-table-column>-->
                                    <el-table-column
                                        prop="endTime"
                                        label="处理时间"
                                    >
                                        <template #default="scope">
                                            <span>{{scope.row.endTime|audaqueDatetime}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                            <el-form-item
                                label="说明"
                                prop="comment"
                                :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]"
                            >
                                <el-input type="textarea" v-model.trim="ruleForm.comment"/>
                            </el-form-item>
                        </el-form>

                    `,
                    mounted() {},
                    methods: {
                        handleSelectionChange(sections) {
                            if (sections.length > 1) {
                                this.$refs.rejecttable.clearSelection();
                                this.$refs.rejecttable.toggleRowSelection(sections.pop());
                            }
                            this.ruleForm.selectedRows = sections;
                        },

                        okEvent() {
                            let _this = this,
                                keep = false;
                            this.$refs['rejectform'].validate((valid) => {
                                if (valid) {
                                    let aform = _this.ruleForm,
                                        params = {
                                            id: aform.id,
                                            comment: aform.comment,
                                        },
                                        lastnode = _this.ruleForm.selectedRows[0];
                                    params.procInstId = lastnode.procInstId;
                                    params.procDefId = lastnode.procDefId;
                                    params.backTaskSid = lastnode.key;
                                    params.id = row.taskId;
                                    _t.$store.commit('SHOW_LOADING', true);
                                    _t._AJAX({
                                        url: 'activiti.task.back.task',
                                        method: 'POST',
                                        data: params,
                                    }).then((res) => {
                                        _t.$AudaqueToast.tip({
                                            template: `驳回成功`,
                                            methods: {
                                                okEvent() {
                                                    _t.loadData();
                                                },
                                            },
                                        });
                                    });
                                } else {
                                    keep = true;
                                    return false;
                                }
                            });
                            return keep;
                        },
                    },
                });
            }
        },
        del(row) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确定删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this
                            ._AJAX({
                                url: 'activiti.process.instance.historic/del',
                                method: 'GET',
                                data: { procInstIdS: row.id },
                            })
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `删除成功`,
                                    methods: {
                                        okEvent() {
                                            _this.loadData();
                                        },
                                    },
                                });
                            });
                    },
                },
            });
        },
        /*查看*/
        preview(row) {
            let _this = this;
            this.$AudaqueToast.dialog({
                title: '查看',
                className: '',
                width: '1000px',
                data: {
                    imageDataSrc: '',
                    imageDataSuccess: true,
                    imageDataError: '',
                    hideCancel_a_d_q: true,
                    okBtnName: '确定',
                    tableList: {
                        rows: [],
                        total: 0,
                    },
                    result: {
                        null: '-',
                        0: '未提交',
                        1: '处理中',
                        2: '通过',
                        3: '驳回',
                        4: '撤销',
                        5: '不通过',
                        6: '中止',
                    },
                    form: {
                        page: 1,
                        rows: 10,
                        procInstId: null,
                    },
                },
                mounted() {
                    let params = row.procInstId ? { procInstId: row.procInstId } : { procDefId: row.procDefId };
                    this.getImg(params);
                    /*this.imageDataSrc = row.procInstId
                        ? API['activiti.models.img'] + '?procInstId=' + row.procInstId + '&t=' + Date.now()
                        : API['activiti.models.img'] + '?procDefId=' + row.procDefId + '&t=' + Date.now();*/
                    this.tableList.rows = [];
                    this.loadTableData();
                },
                template: `
                             <div style="text-align:center">
                                <img style="min-height:250px" class="content-image" :src="imageDataSrc" v-show="imageDataSuccess"/>
                                <span v-show="!imageDataSuccess">{{ imageDataError }}</span>
                                <div>
                                    <el-table
                                    tooltip-effect='light'
                                    class="el-table-common__list"
                                    highlight-current-row
                                    stripe
                                    :data="tableList.rows"
                                    row-key="id"
                                    :tree-props="{ children: 'audits', hasChildren: 'hasChildren' }"
                                    border>
                                         <el-table-column
                                            show-overflow-tooltip
                                            type="index"
                                            label="序号"
                                            width="50">
                                        </el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                prop="name"
                                                label="环节"
                                        ></el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                prop="startTime"
                                                label="开始时间"
                                        ></el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                prop="endTime"
                                                label="完成时间"
                                        ></el-table-column>
                                        <el-table-column
                                            show-overflow-tooltip
                                            prop="nodeDeadLine"
                                            label="节点期限"
                                    >
                                        <template slot-scope="scope">{{ publics.formatTime(scope.row.nodeDeadLine,'Y-M-D h:m:s') }}</template>
                                    </el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                prop="duration"
                                                label="用时(秒)"
                                        >
                                        <template #default="scope">
                                            {{scope.row.duration ? scope.row.duration / 1000 : '-'}}
                                        </template>
                                        </el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                prop="assignee"
                                                label="审核人"
                                        >
                                            <template #default="scope">
                                                <span v-html="$audaquePreventXss(markRed(scope.row.assignee), $xssWhitelist)"></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                show-overflow-tooltip
                                                prop="comment"
                                                label="审核意见"
                                        ></el-table-column>

                                    </el-table>
                                     <adq-pagination
                                        @size-change="sizeChange"
                                        @current-change="currentChange"
                                        :total="tableList.total"
                                        :page-size="form.rows"
                                    ></adq-pagination>
                                </div>
                            </div>

                            `,
                methods: {
                    okEvent() {},
                    markRed(str) {
                        if (!str) {
                            return '-';
                        }
                        let strArr = str.split(',');
                        for (let i = 0; i < strArr.length; i++) {
                            let item = strArr[i];
                            if (/_\*$/.test(item)) {
                                let real = item.replace('_*', '');
                                strArr[i] = '<span style="color:red;">' + real + '</span>';
                            }
                        }
                        return strArr.join(',');
                    },
                    loadTableData() {
                        let id = row.procInstId ? row.procInstId : row.id;
                        let params = this.form;
                        params.procInstId = id;
                        _this
                            ._AJAX({
                                url: 'activiti.task.historic',
                                method: 'GET',
                                data: params,
                            })
                            .then((res) => {
                                this.tableList = res.result;
                            });
                    },
                    sizeChange(rows) {
                        this.form.rows = rows;
                        this.loadTableData();
                    },
                    currentChange(val) {
                        this.form.page = val;
                        this.loadTableData();
                    },
                    getImg(params) {
                        _this
                            ._AJAX({
                                url: 'activiti.models.img',
                                method: 'GET',
                                responseType: 'blob',
                                data: params,
                            })
                            .then((data) => {
                                let blob = new Blob([data]); // 返回的文件流数据
                                let url = window.URL.createObjectURL(blob); // 将他转化为路径
                                this.imageDataSrc = url;
                            });
                    },
                },
            });
        },
    },
};
</script>
