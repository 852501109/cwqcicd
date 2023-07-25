<!--
* @description 列表
* @author zhangweiwei
* @date 2023-07-11 18:25:59
!-->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="接口调用次数统计">
                <em class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </em>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="QUERYLIST_PARAMS(0)"
                @reset="QUERYLIST_PARAMS(1)">
                <audaque-table-search-item title="接口查询人">
                    <el-select v-model.trim="param.queryUser" placeholder="请选择查询人" maxlength="50" clearable>
                        <el-option
                            v-for="user in userList"
                            :key="user.id"
                            :label="user.name"
                            :value="user.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="调用接口名称">
                    <el-select v-model.trim="param.apiName" placeholder="请选择调用接口名称" maxlength="50" clearable>
                        <el-option
                            v-for="apiName in apiNameList"
                            :key="apiName.value"
                            :label="apiName.label"
                            :value="apiName.value"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="统计时间">
                    <div style="display: flex; align-items: center">
                        <el-date-picker
                            v-model="dateRange"
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
                :data="apiCallStatisticsList.rows"
                border>
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
                    width="100">
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="queryUser" label="接口查询人"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="apiName" label="调用接口名称" ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="apiCallNum" label="接口调用次数" width="240"></el-table-column>
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
                :total="apiCallStatisticsList.total"
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
            getHeight: false,
            total: 1,
            param: {
                includeRole: true,
                page: 1,
                rows: 10,
                apiName: '',
                queryUser: '',
                queryStartTime: '',
                queryEndTime: '',
            },
            dateRange: [],
            search_dataRange: '',
            userList: [], // 存放查询人的数组
            apiNameList: [], // 存放接口的数组
        };
    },
    computed: {
        ...mapState('apiCallStatistics', ['apiCallStatisticsList']),
    },
    mounted() {
        this.USERLIST().then((res) => {
                this.userList = res;
            }).catch((err) => {
                console.error('获取查询人数据失败：', err.message);
            });
        this.APINAMELIST().then((res) => {
                this.apiNameList = res;
            }).catch((err) => {
                console.error('获取接口数据失败：', err.message);
            });
    },
    methods: {
        ...mapActions('apiCallStatistics', ['APICALLSTATISTICSLIST', 'APINAMELIST', 'USERLIST']),
        ...mapActions(['_AJAX']),
        initData() {
            let params = this.param;
            if (this.dateRange && this.dateRange[0]) params.queryStartTime = this.dateRange[0];
            if (this.dateRange && this.dateRange[1]) params.queryEndTime = this.dateRange[1];
            this.APICALLSTATISTICSLIST(params);
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
