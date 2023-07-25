<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="部门登录日志">
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="LOGLIST_PARAMS(0)"
                @reset="LOGLIST_PARAMS(1)"
            >
                <audaque-table-search-item title="登录用户">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.username"
                        placeholder="请输入登录用户"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="登录系统">
                    <el-select v-model="param.appName" clearable>
                        <el-option v-for="item in sysList" :key="item.id" :label="item.appName" :value="item.appName">
                        </el-option>
                    </el-select>
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
                <el-table-column show-overflow-tooltip type="index" label="序号" align="center" width="50">
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="userId" label="用户ID"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="username"
                    label="登录用户"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="appName" label="登录系统"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="loginSuccess" label="登录状态">
                    <template slot-scope="scope">
                        {{ scope.row.loginSuccess ? '登录成功' : scope.row.remark }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="loginIp" label="登录IP"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="loginTime"
                    :formatter="
                        (row) => {
                            return $utils.timeToDate(row.loginTime, true);
                        }
                    "
                    label="登录时间"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="logoutTime"
                    :formatter="
                        (row) => {
                            return $utils.timeToDate(row.logoutTime, true);
                        }
                    "
                    label="退出时间"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="logoutMode"
                    :formatter="logoutDrop"
                    label="退出方式"
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
            param: {
                includeRole: true,
                page: 1,
                rows: 10,
                username: null,
                loginBeginTimeStr: null,
                loginEndTimeStr: null,
                appName: null,
            },
            search_dataRange: '',
            sysList: [{ appName: 'cas', id: -1 }],
            logoutModeObj: {
                1: '正常退出',
                2: '超时退出',
                3: '其他设备登录',
                4: '强制退出',
                5: '单点退出',
                null: '-',
            },
            tableList: {},
        };
    },
    computed: {
        ...mapState('webkit', ['userInfo']),
    },
    created() {
        this.initData();
        /*请求系统列表*/
        this._AJAX({
            url: 'webkit.appList',
            method: 'GET',
            data: { page: 1, rows: 999999 },
        }).then((res) => {
            if (res.code === 0) {
                this.sysList = this.sysList.concat(res.rows);
            }
        });
    },
    methods: {
        ...mapActions(['_AJAX']),
        initData() {
            this._AJAX({
                url: 'loginLog.deptLogList',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code === 0) {
                    this.tableList = res;
                }
            });
        },
        logoutDrop(row) {
            return this.logoutModeObj[row.logoutMode];
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
        LOGLIST_PARAMS(num) {
            this.param.page = 1;
            let params = this.param;
            params.loginBeginTimeStr = this.search_dataRange ? this.search_dataRange[0] : '';
            params.loginEndTimeStr = this.search_dataRange ? this.search_dataRange[1] : '';
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
