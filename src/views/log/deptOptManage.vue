<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="部门操作日志">
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="OPTLIST_PARAMS(0)"
                @reset="OPTLIST_PARAMS(1)"
            >
                <audaque-table-search-item title="操作用户">
                    <el-input
                        v-model.trim="param.username"
                        maxlength="50"
                        placeholder="请输入操作用户"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="时间">
                    <el-date-picker
                        class="search-date"
                        v-model="search_dataRange"
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
                <audaque-table-search-item title="操作组">
                    <el-select clearable v-model="param.group">
                        <el-option
                            v-for="(item, index) in SERACHOPT_GROUP"
                            :label="item"
                            :key="index"
                            :value="item"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="操作类型">
                    <el-select clearable v-model="param.type">
                        <el-option
                            v-for="(item, index) in options"
                            :label="item"
                            :value="item"
                            :key="index"
                        ></el-option>
                    </el-select>
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
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
                border
            >
                <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="userId" label="用户ID"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="username"
                    label="操作用户"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="group" label="操作组"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="type" label="操作类型"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="optTime"
                    :formatter="
                        (row) => {
                            return $utils.timeToDate(row.optTime, true);
                        }
                    "
                    label="操作时间"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="remark"
                    :formatter="
                        (row) => {
                            return row.remark == null ? '-' : row.remark;
                        }
                    "
                    label="备注"
                ></el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="initData"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :total="tableList.total"
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
            search_dataRange: '',
            param: {
                includeRole: true,
                page: 1,
                rows: 10,
                username: null,
                optBeginTimeStr: null,
                optEndTimeStr: null,
                group: null,
                type: null,
            },
            options: [],
            tableList: {},
        };
    },
    computed: {
        ...mapState('webkit', ['SERACHOPT_LIST', 'SERACHOPT_GROUP']),
    },
    watch: {
        'param.group'(val) {
            this.param.type = '';
            this.options = [];
            for (let name in this.SERACHOPT_LIST) {
                if (name == val) {
                    this.options = this.SERACHOPT_LIST[name];
                    break;
                }
            }
        },
    },
    created() {
        this.initData();
        this.GETOPTLIST();
    },
    methods: {
        ...mapActions('webkit', ['GETOPTLIST']),
        ...mapActions(['_AJAX']),
        initData() {
            this._AJAX({
                url: 'optLog.deptLogList',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code === 0) {
                    this.tableList = res;
                }
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
        OPTLIST_PARAMS(num) {
            this.param.page = 1;
            let params = this.param;
            params.optBeginTimeStr = this.search_dataRange ? this.search_dataRange[0] : '';
            params.optEndTimeStr = this.search_dataRange ? this.search_dataRange[1] : '';
            if (num > 0) {
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                    this.search_dataRange = null;
                });
            }
            this.initData();
        },
    },
};
</script>
<style lang="scss" scoped>
.search-date {
    width: 100% !important;
}
</style>
