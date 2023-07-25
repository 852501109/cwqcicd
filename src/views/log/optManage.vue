<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="操作日志">
                <!--                <em class="iconfont icondaochu1 audaque-rect-icon" title="全部导出" @click="exportFun">全部导出 </em>-->
                <em class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </em>
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
                        v-model.trim="search.username"
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
                    <el-select clearable v-model="search.group">
                        <el-option
                            v-for="(item, index) in SERACHOPT_GROUP"
                            :label="item"
                            :key="index"
                            :value="item"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="操作类型">
                    <el-select clearable v-model="search.type">
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
                :data="optList.rows"
                v-loading="$store.state.isSHowButtonLoading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)"
                border
            >
                <el-table-column
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
                <el-table-column show-overflow-tooltip align="center" prop="userId" label="用户ID"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="appName" label="系统名称"></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="appKey" label="appKey"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="username"
                    label="操作用户"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="optIp" label="操作ip"></el-table-column>
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
                <el-table-column show-overflow-tooltip align="center" prop="input" label="操作对象"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="exceptionDesc"
                    :formatter="
                        (row) => {
                            return row.exceptionDesc ? row.exceptionDesc : '成功';
                        }
                    "
                    label="操作结果"
                ></el-table-column>
                <!-- <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="remark"
                    :formatter="
                        (row) => {
                            return row.remark == null ? '-' : row.remark;
                        }
                    "
                    label="备注"
                ></el-table-column>-->
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="OPTLIST(param)"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :total="optList.total"
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
            search_dataRange: '',
            search: {
                username: '',
                optBeginTimeStr: '',
                optEndTimeStr: '',
                group: '',
                type: '',
            },
            param: {
                includeRole: true,
                page: 1,
                rows: 10,
                username: '',
                optBeginTimeStr: '',
                optEndTimeStr: '',
                group: '',
                type: '',
            },
            options: [],
        };
    },
    computed: {
        ...mapState('webkit', ['optList', 'SERACHOPT_LIST', 'SERACHOPT_GROUP']),
    },
    methods: {
        ...mapActions('webkit', ['OPTLIST', 'GETOPTLIST']),
        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
            this.OPTLIST(this.param);
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.OPTLIST(this.param);
        },
        OPTLIST_PARAMS(num) {
            this.param.page = 1;
            let params = this.param;
            params.username = this.search.username;
            params.optBeginTimeStr = this.search_dataRange ? this.search_dataRange[0] : '';
            params.optEndTimeStr = this.search_dataRange ? this.search_dataRange[1] : '';
            params.group = this.search.group;
            params.type = this.search.type;
            if (num > 0) {
                this.search_dataRange = '';
                this.search.username = '';
                this.search.optBeginTimeStr = '';
                this.search.optEndTimeStr = '';
                this.search.group = '';
                this.search.type = '';
                this.param.username = '';
                this.param.optBeginTimeStr = '';
                this.param.optEndTimeStr = '';
                this.param.group = '';
                this.param.type = '';
                return this.OPTLIST(this.param);
            }
            this.OPTLIST(params);
        },
        /*导出*/
        exportFun() {
            this.publics.exportFile(this, '/optLog/logListDown.do', this.param);
        },
    },
    created() {
        this.OPTLIST(this.param);
        this.GETOPTLIST().then((re) => {
            // this.search.group = this.SERACHOPT_GROUP && this.SERACHOPT_GROUP[0] ? this.SERACHOPT_GROUP[0] : ''
        });
    },
    watch: {
        'search.group'(val) {
            this.search.type = '';
            this.options = [];
            for (let name in this.SERACHOPT_LIST) {
                if (name == val) {
                    this.options = this.SERACHOPT_LIST[name];
                    break;
                }
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.search-date {
    width: 100% !important;
}
</style>
