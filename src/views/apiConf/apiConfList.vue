<!--
* @description 接口配置表列表
* @author liyaxin
* @date 2023-06-15 14:46:10
!-->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    v-if="permitList.addApiConf"
                    @click="operation(null, 'add')"
                    >新增</i
                >
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
                <audaque-table-search-item title="接口名称">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.name"
                        placeholder="请输入接口名称"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <!-- <audaque-table-search-item title="接口说明">
                    <el-input class="autoSize f14" v-model.trim="param.remark" placeholder="请输入接口说明" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
                <!-- <audaque-table-search-item title="接口地址">
                    <el-input class="autoSize f14" v-model.trim="param.apiUrl" placeholder="请输入接口地址" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
                <!-- <audaque-table-search-item title="返回数据格式：JSON、XML">
                    <el-input class="autoSize f14" v-model.trim="param.responseType" placeholder="请输入返回数据格式：JSON、XML" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
                <audaque-table-search-item title="创建人">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.createUserName"
                        placeholder="请输入创建人"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="创建时间">
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
                    <!-- <el-input
                        class="autoSize f14"
                        v-model.trim="param.createTime"
                        placeholder="请输入创建时间"
                        maxlength="50"
                        clearable
                    ></el-input> -->
                </audaque-table-search-item>
                <!-- <audaque-table-search-item title="更新人">
                    <el-input class="autoSize f14" v-model.trim="param.updateUser" placeholder="请输入更新人" maxlength="50" clearable ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="更新时间">
                    <el-input class="autoSize f14" v-model.trim="param.updateTime" placeholder="请输入更新时间" maxlength="50" clearable ></el-input>
                </audaque-table-search-item> -->
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="apiConfList.rows"
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
                <el-table-column show-overflow-tooltip align="center" prop="name" label="接口名称"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="remark" label="接口说明"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="apiUrl" label="接口地址" ></el-table-column> -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="responseType" label="返回数据格式：JSON、XML" ></el-table-column> -->
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createUserName"
                    label="创建人"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createTime"
                    label="创建时间"
                ></el-table-column>
                <!-- <el-table-column show-overflow-tooltip align="center" prop="updateUser" label="更新人" ></el-table-column> -->
                <!-- <el-table-column show-overflow-tooltip align="center" prop="updateTime" label="更新时间" ></el-table-column> -->
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <span
                            title="查看"
                            class="iconfont iconchakan11 operate"
                            @click="operation(scope.row.id, 'view')"
                            v-if="permitList.apiConfDetail"
                        ></span>
                        <span
                            class="iconfont iconziyuan3 operate"
                            @click="operation(scope.row.id, 'edit')"
                            title="编辑"
                            v-if="permitList.updateApiConf"
                        ></span>
                        <span
                            title="删除"
                            class="iconfont iconShape1 operate"
                            @click="delRow(scope.row.id)"
                            v-if="permitList.deleteApiConf"
                        ></span>
                    </template>
                </el-table-column>
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
                :total="apiConfList.total"
                :page-size="param.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'ApiConfList',
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
                name: '',
                remark: '',
                apiUrl: '',
                responseType: '',
                createUser: '',
                dateRange: [],
                updateUser: '',
                updateTime: '',
            },
            search_dataRange: '',
        };
    },
    computed: {
        ...mapState('apiConf', ['apiConfList']),
    },
    methods: {
        ...mapActions('apiConf', ['APICONFLIST', 'DELETEAPICONF', 'CHECKAPIQUERYCONFSTATE']),
        ...mapActions(['_AJAX']),
        initData() {
            let params = JSON.parse(JSON.stringify(this.param));
            if (params.dateRange && params.dateRange[0]) params.queryStartTime = params.dateRange[0];
            if (params.dateRange && params.dateRange[1]) params.queryEndTime = params.dateRange[1];
            delete params.dateRange;
            this.APICONFLIST(params);
        },
        operation(id, optType) {
            if (optType === 'edit') {
                this.CHECKAPIQUERYCONFSTATE({ id: id })
                    .then((res) => {
                        if (res.result) {
                            this.$router.push({
                                path: '/apiConf/apiConfEdit',
                                query: {
                                    id: id,
                                    optType: optType,
                                },
                            });
                        } else {
                            // res不为true则返回一个列表，包含了相关联的启用状态的接口列表
                            this.$AudaqueToast.warn({
                                template: `<div style="text-align:left;">${res.queryNameList.join(
                                    '，'
                                )}查询配置状态为启用，请禁用后再执行编辑操作</div>`,
                            });
                        }
                    })
                    .catch((err) => {
                        this.$AudaqueToast.error({
                            template: err.msg,
                        });
                    });
            } else {
                this.$router.push({
                    path: '/apiConf/apiConfEdit',
                    query: {
                        id: id,
                        optType: optType,
                    },
                });
            }
        },
        changeState(id, state) {
            let _this = this;
            let params = { id: id, state: state };
            this.CHANGE_REPORT_CONFIG_STATE(params)
                .then((res) => {
                    let template = '启用成功';
                    if (state == 1) {
                        template = '启用成功';
                    } else {
                        template = '禁用成功';
                    }
                    this.$AudaqueToast.tip({
                        template: template,
                        methods: {
                            okEvent() {
                                _this.initData();
                            },
                        },
                    });
                })
                .catch((err) => (this.loading = false));
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
                        _this.DELETEAPICONF({ id: id }).then((res) => {
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
    },
    created() {
        this.initData();
    },
};
</script>
<style lang="scss" scoped>
.search-date {
    width: 100% !important;
}
</style>
