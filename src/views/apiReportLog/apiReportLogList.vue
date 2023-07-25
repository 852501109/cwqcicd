<!--
* @description 系统审计表列表
* @author liyaxin
* @date 2023-06-15 15:51:11
!-->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="库表接口查询监控">
                <!-- <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    v-if="permitList.addApiReportLog"
                    @click="$router.push('/apiReportLog/apiReportLogEdit')"
                >
                </i> -->

                <em class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </em>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="QUERYLIST_PARAMS(0)"
                @reset="QUERYLIST_PARAMS(1)"
            >
                <!-- <audaque-table-search-item title="id">
                    <el-input class="autoSize f14" v-model.trim="param.id" placeholder="请输入id" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
                <audaque-table-search-item title="查询名称">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.queryReportName"
                        placeholder=""
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>

                <audaque-table-search-item title="数据来源">
                    <el-select v-model.trim="param.dataSource" placeholder="请选择数据来源" maxlength="50" clearable>
                        <!-- <el-option label="库表" value="0"></el-option>
                        <el-option label="接口" value="1"></el-option> -->
                        <el-option
                            v-for="source in sourceList"
                            :key="source.value"
                            :label="source.label"
                            :value="source.value"
                        />
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="查询类别">
                    <el-select v-model.trim="param.categoryId" placeholder="请选择查询类别" maxlength="50" clearable>
                        <el-option
                            v-for="category in categoryList"
                            :key="category.id"
                            :label="category.name"
                            :value="category.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="查询人">
                    <el-select v-model.trim="param.queryUser" placeholder="请选择查询人" maxlength="50" clearable>
                        <el-option
                            v-for="user in userList"
                            :key="user.id"
                            :label="user.name"
                            :value="user.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="查询结果">
                    <el-select v-model.trim="param.queryResult" placeholder="请选择查询结果" maxlength="50" clearable>
                        <el-option label="查询中" value="0"></el-option>
                        <el-option label="查询成功" value="1"></el-option>
                        <el-option label="查询失败" value="2"></el-option>
                    </el-select>
                </audaque-table-search-item>

                <audaque-table-search-item title="查询时间">
                    <div style="display: flex; align-items: center">
                        <el-date-picker
                            v-model="param.dateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            style="width: 100%"
                            value-format="yyyy-MM-dd"
                            clearable
                        ></el-date-picker>
                    </div>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="apiReportLogList.rows"
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
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
                    align="center"
                    width="80"
                >
                </el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="id" label="id" ></el-table-column> -->
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="dataSource"
                    label="数据来源"
                    width="100"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="categoryId"
                    label="查询类别"
                    width="150"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="queryReportName"
                    label="查询名称"
                    width="150"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="queryUser" label="查询人"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="queryStartTime"
                    label="查询时间"
                    width="150"
                ></el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="queryEndTime" label="查询结束时间" ></el-table-column> -->
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="queryCondition"
                    label="查询条件"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="relationTableApiId"
                    label="相关表/接口"
                    width="150"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="uploadFileUrl" label="查询excel">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span>
                                <a
                                    title="下载"
                                    @click="exportTemplate('/common/fileDownLoad.do', scope.row.uploadFileUrl)"
                                    >{{ scope.row.uploadFileUrl }}</a
                                >
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="queryStatus" label="查询状态：0 查询中   1 查询完成" ></el-table-column> -->
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="queryResult"
                    label="查询结果"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="queryMsg"
                    label="失败消息"
                ></el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="logTime" label="日志入库时间" ></el-table-column> -->
                <!-- <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span>
                                <a title="编辑" v-if="permitList.updateApiReportLog" @click="goEdit(scope.row.id)"
                                    ><i class="iconfont iconFill"></i
                                ></a>
                            </span>
                            <span>
                                <a title="删除" v-if="permitList.deleteApiReportLog" @click="delRow(scope.row.id)"
                                    ><i class="iconfont shanchu iconShape1"></i
                                ></a>
                            </span>
                        </div>
                    </template>
                </el-table-column> -->
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="LOGLIST(param)"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :total="apiReportLogList.total"
                :page-size="param.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { queryUserList, queryCategoryList } from '@/api/apiReportLog';
export default {
    data() {
        return {
            isSearch: false,
            getHeight: false,
            total: 1,
            param: {
                includeRole: true,
                page: 1,
                rows: 10,
                id: '',
                dataSource: '',
                categoryId: '',
                queryReportName: '',
                queryUser: '',
                queryStartTime: '',
                queryEndTime: '',
                queryCondition: '',
                relationTableApiId: '',
                uploadFileUrl: '',
                queryStatus: '',
                queryResult: '',
                queryMsg: '',
                logTime: '',
                dateRange: [],
            },
            search_dataRange: '',
            categoryList: [], // 存放查询类别的数组
            userList: [], // 存放查询人的数组
            sourceList: [
                // 数据来源的选项
                {
                    label: '库表',
                    value: '0',
                },
                {
                    label: '接口',
                    value: '1',
                },
            ],
        };
    },
    computed: {
        ...mapState('apiReportLog', ['apiReportLogList']),
    },
    mounted() {
        // 获取查询类别的数据
        queryUserList() //{ a: 1 }
            .then((res) => {
                this.userList = res;
            })
            .catch((err) => {
                console.error('获取查询人数据失败：', err.message);
            });
    },
    methods: {
        ...mapActions('apiReportLog', ['APIREPORTLOGLIST', 'DELETEAPIREPORTLOG']),
        ...mapActions(['_AJAX']),
        initData() {
            let params = JSON.parse(JSON.stringify(this.param));
            if (params.dateRange && params.dateRange[0]) params.queryStartTime = params.dateRange[0];
            if (params.dateRange && params.dateRange[1]) params.queryEndTime = params.dateRange[1];
            delete params.dateRange;
            this.APIREPORTLOGLIST(params);
        },
        /*导出*/
        exportTemplate(api, fileName) {
            this.publics.exportFile(this, api, { fileName: fileName });
        },
        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
            this.initData();
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.initData();
        },
        QUERYLIST_PARAMS(num) {
            this.param.page = 1;
            if (num > 0) {
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                    this.search_dataRange = null;
                });
            }
            this.initData();
        },
        delRow(id) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this.DELETEAPIREPORTLOG({ id: id }).then((res) => {
                            if (res.code == 0) {
                                _this.$AudaqueToast.tip({
                                    template: `删除成功`,
                                    methods: {
                                        okEvent() {
                                            _this.initData();
                                        },
                                    },
                                });
                            }
                        });
                    },
                },
            });
        },
        /*编辑*/
        goEdit(id) {
            this.$router.push('/apiReportLog/apiReportLogEdit?filter=edit&id=' + id);
        },
        watchDataSource(newDataSource) {
            // 获取查询类别的数据
            if (!newDataSource) {
                this.categoryList = [];
                this.param.categoryId = '';
                return;
            }
            queryCategoryList({ newDataSource: newDataSource }) //{ a: 1 }
                .then((res) => {
                    this.categoryList = res;
                    this.param.categoryId = '';
                })
                .catch((err) => {
                    console.error('获取查询类别数据失败：', err.message);
                });
        },
    },
    created() {
        this.initData();
    },
    watch: {
        'param.dataSource': 'watchDataSource',
    },
};
</script>
<style lang="scss" scoped>
.search-date {
    width: 100% !important;
}
</style>
