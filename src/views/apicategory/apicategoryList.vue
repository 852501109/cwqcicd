<!--
* @description 接口查询类别表列表
* @author liyaxin
* @date 2023-06-15 08:49:03
!-->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    v-if="permitList.addApicategory"
                    @click="$router.push('/apicategory/apicategoryEdit')"
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
                <audaque-table-search-item title="类别编码">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.code"
                        placeholder="请输入编码"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="类别名称">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.name"
                        placeholder="请输入名称"
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
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="apicategoryList.rows"
                border
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
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
                <el-table-column show-overflow-tooltip align="center" prop="code" label="编码"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="name" label="名称"></el-table-column>
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
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="updateUserName"
                    label="更新人"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="updateTime"
                    label="更新时间"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="sortNum" label="排序号"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span>
                                <a title="编辑" v-if="permitList.updateApicategory" @click="goEdit(scope.row.id)"
                                    ><i class="iconfont iconFill"></i
                                ></a>
                            </span>
                            <span>
                                <a title="删除" v-if="permitList.deleteApicategory" @click="delRow(scope.row.id)"
                                    ><i class="iconfont shanchu iconShape1"></i
                                ></a>
                            </span>
                        </div>
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
                :total="apicategoryList.total"
                :page-size="param.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'ApicategoryList',
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
                code: '',
                sortNum: '',
                createUser: '',
                createTime: '',
                updateUser: '',
                updateTime: '',
                dateRange: [],
            },
            search_dataRange: '',
        };
    },
    computed: {
        ...mapState('apicategory', ['apicategoryList']),
    },
    methods: {
        ...mapActions('apicategory', ['APICATEGORYLIST', 'DELETEAPICATEGORY']),
        ...mapActions(['_AJAX']),
        initData() {
            let params = JSON.parse(JSON.stringify(this.param));
            if (params.dateRange && params.dateRange[0]) params.queryStartTime = params.dateRange[0];
            if (params.dateRange && params.dateRange[1]) params.queryEndTime = params.dateRange[1];
            delete params.dateRange;
            this.APICATEGORYLIST(params);
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
                        _this.DELETEAPICATEGORY({ id: id }).then((res) => {
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
            this.$router.push('/apicategory/apicategoryEdit?filter=edit&id=' + id);
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
