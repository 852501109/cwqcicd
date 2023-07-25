<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :titles="titles" @change="changeTableList" :index="activityName">
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="业务">
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
                id="demo"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tableList.rows"
                border
            >
                <el-table-column show-overflow-tooltip type="index" label="序号" width="50"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="categoryName" label="业务名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="processName" label="流程名称"></el-table-column>
                <!--                <el-table-column show-overflow-tooltip prop="formName" label="表单名称"></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="name" label="节点名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="申请标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="applyer" label="发起人"></el-table-column>
                <!--                <el-table-column show-overflow-tooltip prop="owner" label="委派"></el-table-column>-->
                <!--                <el-table-column show-overflow-tooltip prop="deptnames" label="发起人所属组织"></el-table-column>-->
                <el-table-column show-overflow-tooltip prop="startTime" label="发起时间"></el-table-column>
                <el-table-column show-overflow-tooltip prop="result" label="流程状态">
                    <template slot-scope="scope">
                        {{ scope.row.result ? (scope.row.result == 1 ? '其他节点处理中' : '已结束') : '-' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span class="iconfont iconchakan11 operate" title="查看" @click="view(scope.row)"></span>
                        <!--                        <span class="iconfont iconShape1" title="删除" @click="del(scope.row)"></span>-->
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

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import htmlToPdf from '@/utils/modules/htmlToPdf';
export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                title: null,
                categoryId: null,
                applyer: null,
            },
            tableList: {
                rows: [],
                total: 0,
            },
            categoryOptions: [],
            applicationTime: null,
            titles: ['我的已办', '会签已办'],
            activityName: 0,
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
                activityName: this.activityName,
            };
            let params = Object.assign({}, this.param);
            params.createTimeBegin = this.applicationTime ? this.applicationTime[0] : null;
            params.createTimeEnd = this.applicationTime ? this.applicationTime[1] : null;
            params.countersignNeed = this.activityName == 1 ? 1 : 0;
            this._AJAX({
                url: 'activiti.task.done',
                method: 'POST',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.tableList = res.result;
                }
            });
        },
        changeTableList(val) {
            this.param.page = 1;
            this.param.rows = 10;
            this.activityName = val;
            this.loadData();
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
            this.$router.push({
                path: '/process/workbench/workflowReviewEdit',
                query: {
                    id: row.id,
                    optType: 'view',
                    pageType: 'done', //upcoming  待办  done  已办
                },
            });
        },
        del(row) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确定删除？`,
                methods: {
                    okEvent() {
                        _this
                            ._AJAX({
                                url: 'activiti.task.historic.del',
                                method: 'GET',
                                data: { taskIdStr: row.id },
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
        handleDown() {
            htmlToPdf.downloadPDF(document.querySelector('#demo'), '离职申请表');
        },
    },
};
</script>
