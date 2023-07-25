<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="我的待办">
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="业务名称">
                    <el-select v-model="param.categoryId" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in categoryOptions"
                            :key="'option-' + item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="申请标题">
                    <el-input clearable class="autoSize f14" v-model.trim="param.title"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="发起人">
                    <el-input clearable class="autoSize f14" v-model.trim="param.applyer"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="状态">
                    <el-select v-model="param.suspended" placeholder="请选择" clearable>
                        <el-option label="运行中" :value="1"></el-option>
                        <el-option label="暂停" :value="2"></el-option>
                    </el-select>
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
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="categoryName" label="业务名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="processName" label="流程名称"></el-table-column>
                <!--                <el-table-column show-overflow-tooltip prop="formName" label="表单名称"></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="name" label="节点名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="申请标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="applyer" label="发起人"></el-table-column>
                <!--                <el-table-column show-overflow-tooltip prop="owner" label="委派"></el-table-column>-->
                <!--                <el-table-column show-overflow-tooltip prop="deptnames" label="发起人所属组织"></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="startTime" label="发起时间"></el-table-column>
                <el-table-column show-overflow-tooltip prop="nodeDeadLine" label="节点期限">
                    <template slot-scope="scope"
                        >{{ publics.formatTime(scope.row.nodeDeadLine, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="suspended" label="状态">
                    <template slot-scope="scope">
                        {{ suspendedObj[scope.row.suspended] }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <!--<span-->
                        <!--class="operate iconfont icon_inquiry-template"-->
                        <!--title="表单信息"-->
                        <!--@click="view(scope.row)"-->
                        <!--&gt;</span>-->
                        <span class="iconfont iconbanli operate" title="办理" @click="handle(scope.row)"></span>
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
            <!--表单信息-->
            <el-dialog
                title="表单信息"
                :visible.sync="isVisibleDialog"
                width="500"
                @close="closeDialog"
                :close-on-click-modal="false"
                class="form-parser-dialog"
            >
                <form-parser
                    v-if="isVisibleDialog"
                    ref="formParser"
                    :key="key2"
                    :formConf="formConf"
                    @submit="submitForm"
                ></form-parser>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isVisibleDialog = !isVisibleDialog">取消</el-button>
                    <el-button @click="$refs.formParser.submitForm()" :loading="isSHowButtonLoading">提交</el-button>
                </span>
            </el-dialog>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import API from '@/api/index';
import { fillFormData } from '@/components/form/formPublic';

export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                name: null,
                suspended: null,
                categoryId: null,
                applyer: null,
            },
            tableList: {
                rows: [],
                total: 0,
            },
            categoryOptions: [],
            suspendedObj: {
                null: '-',
                1: '运行中',
                2: '暂停',
            },
            key2: +new Date(),
            isVisibleDialog: false,
            formConf: {},
            activeData: {},
            applicationTime: null,
        };
    },
    created() {
        this.loadData();
        this.loadBusinessName();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
                applicationTime: this.applicationTime,
            };
            let params = Object.assign({}, this.param);
            params.createTimeBegin = this.applicationTime ? this.applicationTime[0] : null;
            params.createTimeEnd = this.applicationTime ? this.applicationTime[1] : null;
            this._AJAX({
                url: 'activiti.task.list',
                method: 'POST',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.tableList = res.result;
                }
            });
        },
        /*获得业务名称列表*/
        loadBusinessName() {
            this._AJAX({
                url: 'sys.category.list',
                method: 'GET',
                data: { page: 1, rows: 9999 },
            }).then((res) => {
                this.categoryOptions = res.result.rows;
            });
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
        /*查看*/
        view(row) {
            this.activeData = row;
            let url = API['form.design.select'] + '/' + row.formId;
            /*请求表单信息*/
            this._AJAX({
                url: url,
                method: 'GET',
                data: {},
            }).then((res) => {
                this.formConf = JSON.parse(res.result.formJson); //表单信息
                this.isVisibleDialog = true;
                this._AJAX({
                    url: 'form.data.select',
                    method: 'GET',
                    data: {
                        rowId: row.businessKey,
                        tableName: row.tableName,
                    },
                }).then((res) => {
                    fillFormData.call(this, this.formConf.fields, res.result, this.formConf); //表单信息的回显

                    // 更新表单
                    this.key2 = +new Date();
                });
            });
        },
        /*办理*/
        handle(row) {
            this.$router.push({
                path: '/process/workbench/workflowReviewEdit',
                query: {
                    id: row.id,
                    optType: 'view',
                    pageType: 'upcoming', //upcoming  待办  done  已办
                },
            });
        },
        closeDialog() {
            this.activeData = {};
        },
        /*提交*/
        submitForm(data) {
            let _this = this;
            this._AJAX({
                url: 'form.data.update',
                method: 'POST',
                data: {
                    tableName: this.activeData.tableName,
                    dataMap: data, //表单数据
                    rowId: this.activeData.bizCode,
                },
            }).then((res) => {
                this.$AudaqueToast.tip({
                    template: `编辑成功`,
                    methods: {
                        okEvent() {
                            _this.isVisibleDialog = false;
                            _this.loadData();
                        },
                    },
                });
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.drawer-content {
    height: 100%;
    overflow: auto;
    .operation-item {
        text-align: left !important;
        /deep/ .el-form-item__label {
            padding: 0;
            font-weight: 600;
        }
    }

    .opinion-line {
        margin-bottom: 10px;
    }

    /deep/ .pass-reject {
        display: flex;
        flex-direction: row;
        .el-select {
            width: 300px;
            margin-left: 30px;
        }
        .el-radio-group {
            position: relative;
            top: 10px;
        }
    }
}
</style>
