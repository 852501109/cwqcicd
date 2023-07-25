<!-- 事件列表 -->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="事件列表">
                <div class="select-box">
                    <el-select v-model="refresh" size="mini" clearable @change="refreshData">
                        <el-option
                            v-for="item in refreshArr"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </div>
                <i class="iconfont iconshuaxin audaque-rect-icon" title="刷新" @click="getUserList"></i>
                <i class="iconfont icondaochu1 audaque-rect-icon" title="全部导出" @click="exportFun"> 全部导出 </i>
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>

        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="queryListFn(0)"
                @reset="queryListFn(1)"
            >
                <audaque-table-search-item title="级别">
                    <el-select v-model="searchList.level" clearable size="mini">
                        <el-option
                            v-for="item in eventLevelArr"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="事件ID">
                    <el-input clearable type="text" placeholder="请输入事件ID" v-model.trim="searchList.key"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="事件名称">
                    <el-input clearable type="text" placeholder="请输入事件名称" v-model.trim="searchList.name"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="事件状态">
                    <el-select v-model="searchList.cleaned" size="mini" clearable>
                        <el-option
                            v-for="item in eventTypeArr"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="来源">
                    <el-select clearable v-model="searchList.appKey" size="mini">
                        <el-option
                            v-for="item in eventAppList.list"
                            :key="item.appKey"
                            :label="item.appName"
                            :value="item.appKey"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="产生时间" class="search-time-line">
                    <el-date-picker
                        class="search-date"
                        v-model="createTime_dataRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
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
                :data="eventList"
                border
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, searchList.page, searchList.rows);
                        }
                    "
                    align="center"
                    width="60"
                    label="序号"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="事件名称" align="left" prop="name">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="事件ID" align="center" prop="key">
                    <template slot-scope="scope">{{ scope.row.key }}</template>
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--label="事件分类ID"-->
                <!--align="center"-->
                <!--sortable-->
                <!--prop=""-->
                <!--&gt;-->
                <!--<template slot-scope="scope">{{ scope.row.name }}</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip label="事件级别" align="center" prop="level">
                    <template slot-scope="scope">{{ matchLeval(scope.row.level) }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="产生时间" align="center" prop="createTime">
                    <template slot-scope="scope">{{
                        publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s')
                    }}</template>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="来源" align="center" prop="appName">
                    <template slot-scope="scope">{{ scope.row.appName }}</template>
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--label="对象"-->
                <!--align="center"-->
                <!--sortable-->
                <!--prop=""-->
                <!--&gt;-->
                <!--<template slot-scope="scope">{{ scope.row.createTime|datetime }}</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip label="定位信息" align="center" prop="createTime">
                    <template slot-scope="scope"
                        >{{ scope.row.hostInfo + ';' + scope.row.appKey + ';' + scope.row.key }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <span
                            class="iconfont iconchakan11 operate"
                            @click="viewDetails(scope.row)"
                            title="查看详情"
                        ></span>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="refreshData(refresh)"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="eventListPages"
                :page-size="searchList.rows"
                :current-page="searchList.page"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
    data() {
        return {
            isSearch: false,
            searchList: {
                page: 1,
                rows: 10,
            },
            eventList: [],
            eventListPages: 0,
            eventLevelArr: [
                { id: 1, label: '致命' },
                { id: 2, label: '严重' },
                { id: 3, label: '一般' },
                { id: 4, label: '警告' },
            ],
            eventTypeArr: [
                { id: '', label: '全部' },
                { id: true, label: '已清除' },
                { id: false, label: '未清除' },
            ],
            refresh: 30,
            refreshArr: [
                { id: 30, label: '每30秒刷新一次' },
                { id: 60, label: '每60秒刷新一次' },
                { id: 0, label: '停止刷新' },
            ],
            timer: null,
            createTime_dataRange: '',
        };
    },

    computed: {
        ...mapState('webkit', ['eventAppList']),
    },

    created() {
        this.getUserList();
        this.refreshData(this.refresh);
        this.EVENT_APPLIST();
    },
    mixins: [adqSearchMixin],
    beforeDestroy() {
        clearInterval(this.timer);
    },

    methods: {
        ...mapActions('webkit', ['GET_EVENT_DATA', 'SHIELD_ALARM', 'CLEAN_ALARM', 'EVENT_APPLIST']),
        //查询客户列表
        getUserList() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
                createTime_dataRange: this.createTime_dataRange,
            };
            let params = Object.assign({}, this.searchList);
            params.createTimeBegin = this.createTime_dataRange ? this.createTime_dataRange[0] : '';
            params.createTimeEnd = this.createTime_dataRange ? this.createTime_dataRange[1] : '';
            this.GET_EVENT_DATA(params)
                .then((res) => {
                    if (res.success) {
                        this.eventList = res.result.rows;
                        this.eventListPages = res.result.total;
                    }
                })
                .catch((err) => (this.loading = false));
        },
        queryListFn(type) {
            if (type === 1) {
                //重置
                this.publics.resetFun(this.searchList, () => {
                    this.createTime_dataRange = '';
                });
            } else {
                this.isSearch = false;
            }
            this.getUserList();
        },
        ...mapMutations('webkit', ['INFO_ALARM_LIST']),
        handleSelectionChange(val) {},
        handleSizeChange(val) {
            this.searchList.page = 1;
            this.searchList.rows = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.searchList.page = val;
            this.getUserList();
        },
        matchLeval(type) {
            let parm = '';
            this.eventLevelArr.forEach((item) => {
                if (item.id == type) {
                    parm = item.label;
                }
            });
            return parm;
        },
        /*查看详情*/
        viewDetails(row) {
            this.$router.push({
                path: '/monitor/eventManageEdit',
                query: {
                    id: row.id,
                    optType: 'view',
                },
            });
        },
        refreshData(value) {
            if (value == 0) {
                clearInterval(this.timer);
                this.timer = null;
                return;
            }
            clearInterval(this.timer);
            this.timer = null;
            if (this.timer == null) {
                this.timer = setInterval(() => {
                    this.getUserList();
                }, value * 1000);
            }
        },
        /*导出*/
        exportFun() {
            if (this.eventList && this.eventList.length == 0) {
                this.$AudaqueToast.error({
                    template: `无事件下载`,
                    methods: {
                        okEvent() {},
                    },
                });
            } else {
                let url = window.urlConfig + '/monitor/event/down.do';
                window.open(url, '_blank');
            }
        },
    },
};
</script>
