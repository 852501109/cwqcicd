<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="报表类别">
                <i
                    v-if="permitList.addReportCategory"
                    class="iconfont iconxinzeng2 audaque-rect-icon"
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
                @search="REPORT_CATEGORY_LIST_PARAMS(0)"
                @reset="REPORT_CATEGORY_LIST_PARAMS(1)"
            >
                <audaque-table-search-item title="类别编码">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.code"
                        placeholder="请输入类别编码"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="类别名称">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.name"
                        placeholder="请输入类别名称"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="reportCategoryList.rows"
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
                    width="50"
                >
                </el-table-column>
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
                <!-- <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    v-if="
                        permitList.queryReportCategory ||
                        permitList.editReportCategory ||
                        permitList.deleteReportCategory
                    "
                    align="center"
                    width="220"
                >
                    <template slot-scope="scope">
                        <span
                            title="查看"
                            class="iconfont iconchakan11 operate"
                            @click="operation(scope.row.id, 'view')"
                            v-if="permitList.queryReportCategory"
                        ></span>
                        <span
                            class="iconfont iconziyuan3 operate"
                            @click="operation(scope.row.id, 'edit')"
                            title="编辑"
                            v-if="permitList.editReportCategory"
                        ></span>
                        <span
                            title="删除"
                            class="iconfont iconShape1 operate"
                            @click="deleteOne(scope.row.id)"
                            v-if="permitList.deleteReportCategory"
                        ></span>
                    </template>
                </el-table-column> -->
                <el-table-column show-overflow-tooltip label="操作" align="center" width="220">
                    <template slot-scope="scope">
                        <span
                            title="查看"
                            class="iconfont iconchakan11 operate"
                            @click="operation(scope.row.id, 'view')"
                        ></span>
                        <span
                            class="iconfont iconziyuan3 operate"
                            @click="operation(scope.row.id, 'edit')"
                            title="编辑"
                        ></span>
                        <span title="删除" class="iconfont iconShape1 operate" @click="deleteOne(scope.row.id)"></span>
                    </template>
                </el-table-column>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :total="reportCategoryList.total"
                :page-size="param.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            isSearch: false,
            total: 1,
            param: {
                page: 1,
                rows: 10,
                name: '',
            },
        };
    },
    computed: {
        ...mapState('webkit', ['reportCategoryList']),
    },
    methods: {
        ...mapActions('webkit', ['REPORT_CATEGORY_LIST', 'DELETE_REPORT_CATEGORY']),
        initData() {
            let params = this.param;
            this.REPORT_CATEGORY_LIST(params);
        },
        operation(id, optType) {
            this.$router.push({
                path: '/reportConfig/categoryEdit',
                query: {
                    id: id,
                    optType: optType,
                },
            });
        },
        deleteOne(id) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        let params = { id: id };
                        _this.DELETE_REPORT_CATEGORY(params).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `删除成功`,
                                methods: {
                                    okEvent() {
                                        _this.REPORT_CATEGORY_LIST();
                                    },
                                },
                            });
                        });
                    },
                    cancelEvent() {
                        _this.$store.commit('SHOW_LOADING', false);
                    },
                },
            });
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
        REPORT_CATEGORY_LIST_PARAMS(num) {
            this.param.page = 1;
            if (num > 0) {
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                });
            }
            this.initData();
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
