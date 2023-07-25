<!-- 告警列表 -->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="告警列表">
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
                <i class="iconfont iconshuaxin cur audaque-rect-icon" title="刷新" @click="getUserList"></i>
                <i
                    class="iconfont icondaochu1 audaque-rect-icon"
                    title="全部导出"
                    v-if="permitList.monitorAlarmDown"
                    @click="exportFun"
                    >全部导出</i
                >
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
                        <el-option v-for="item in alarmLevelArr" :key="item.id" :label="item.label" :value="item.id">
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="告警ID">
                    <el-input clearable type="text" placeholder="请输入警告ID" v-model.trim="searchList.key"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="告警名称">
                    <el-input
                        clearable
                        type="text"
                        placeholder="请输入告警名称"
                        v-model.trim="searchList.name"
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="告警状态">
                    <el-select v-model="searchList.cleaned" size="mini" clearable>
                        <el-option
                            v-for="item in alarmTypeArr"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="来源">
                    <el-select clearable v-model="searchList.appKey" size="mini">
                        <el-option
                            v-for="item in alarmAppList.list"
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
                <audaque-table-search-item title="清除时间" class="search-time-line">
                    <el-date-picker
                        class="search-date"
                        v-model="cleanTime_dataRange"
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
                :data="alarmList"
                border
                :row-class-name="tableRowClassName"
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
                <el-table-column show-overflow-tooltip label="告警名称" align="left" prop="name">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="告警ID" align="center" prop="key">
                    <template slot-scope="scope">{{ scope.row.key }}</template>
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--label="告警分类ID"-->
                <!--align="center"-->
                <!--sortable-->
                <!--prop=""-->
                <!--&gt;-->
                <!--<template slot-scope="scope">{{ scope.row.name }}</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip label="告警级别" align="center" prop="level">
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

                <el-table-column show-overflow-tooltip label="定位信息" align="center" prop="createTime">
                    <template slot-scope="scope">{{ scope.row.hostInfo }} </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="是否清除" align="center" prop="autoClean">
                    <template slot-scope="scope">{{ scope.row.cleanType ? '是' : '否' }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.monitorAlarmUpdate"
                            :title="scope.row.refuse ? '取消屏蔽' : '屏蔽'"
                            :class="['shield', 'iconfont', scope.row.refuse ? 'iconxianshi' : 'iconziyuan11']"
                            @click="shieldFun(scope.row)"
                        >
                        </span>
                        <span
                            class="iconfont iconziyuanxhdpi operate"
                            @click="clearFun(scope.row)"
                            v-if="permitList.monitorAlarmClean && !scope.row.cleanType"
                            title="清除"
                        >
                        </span>
                        <!-- <a class="iconfont iconbangzhu operate" title="帮助" target="_blank" :href="scope.row.helpUrl">
                        </a>-->
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
                :total="alarmListPages"
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
            alarmList: [],
            alarmListPages: 0,
            alarmLevelArr: [
                { id: 1, label: '致命' },
                { id: 2, label: '严重' },
                { id: 3, label: '一般' },
                { id: 4, label: '警告' },
            ],
            alarmTypeArr: [
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
            cleanTime_dataRange: '',
        };
    },

    computed: {
        ...mapState('webkit', ['alarmAppList']),
    },

    created() {
        this.getUserList();
        this.refreshData(this.refresh);
        this.ALARM_APPLIST();
    },

    mixins: [adqSearchMixin],

    beforeDestroy() {
        clearInterval(this.timer);
    },

    methods: {
        ...mapActions('webkit', ['GET_ALARM_DATA', 'SHIELD_ALARM', 'CLEAN_ALARM', 'ALARM_APPLIST']),
        //查询客户列表
        getUserList() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                searchList: this.searchList,
                createTime_dataRange: this.createTime_dataRange,
                cleanTime_dataRange: this.cleanTime_dataRange,
            };
            let params = Object.assign({}, this.searchList);
            params.createTimeBegin = this.createTime_dataRange ? this.createTime_dataRange[0] : null;
            params.createTimeEnd = this.createTime_dataRange ? this.createTime_dataRange[1] : null;
            params.cleanTimeBegin = this.cleanTime_dataRange ? this.cleanTime_dataRange[0] : null;
            params.cleanTimeEnd = this.cleanTime_dataRange ? this.cleanTime_dataRange[1] : null;

            this.GET_ALARM_DATA(params)
                .then((res) => {
                    if (res.success) {
                        this.alarmList = res.result.rows;
                        this.alarmListPages = res.result.total;
                    }
                })
                .catch((err) => (this.loading = false));
        },
        queryListFn(type) {
            if (type === 1) {
                //重置
                this.publics.resetFun(this.searchList, () => {
                    this.createTime_dataRange = '';
                    this.cleanTime_dataRange = '';
                });
            } else {
                this.isSearch = false;
            }
            this.getUserList();
        },
        ...mapMutations('webkit', ['INFO_ALARM_LIST']),
        handleSelectionChange(val) {},
        handleSizeChange(val) {
            this.searchList.rows = val;
            this.searchList.page = 1;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.searchList.page = val;
            this.getUserList();
        },
        /*屏蔽*/
        shieldFun(row) {
            let refuse = !row.refuse;
            this.SHIELD_ALARM({ key: row.key, refuse: refuse })
                .then((res) => {
                    if (res.success) {
                        this.$AudaqueToast.tip({
                            template: refuse ? '屏蔽成功' : '取消屏蔽成功',
                            methods: {
                                okEvent() {},
                            },
                        });
                        this.getUserList();
                    }
                })
                .catch((err) => {});
        },
        /*清除*/
        clearFun(row) {
            this.CLEAN_ALARM({ id: row.id })
                .then((res) => {
                    if (res.success) {
                        this.getUserList();
                        this.$AudaqueToast.tip({
                            template: `清除成功`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                })
                .catch((err) => (this.loading = false));
        },
        matchLeval(type) {
            let parm = '';
            this.alarmLevelArr.forEach((item) => {
                if (item.id == type) {
                    parm = item.label;
                }
            });
            return parm;
        },
        /*查看详情*/
        viewDetails(row) {
            this.$router.push({
                path: '/monitor/alarmManageEdit',
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
            if (this.alarmList && this.alarmList.length == 0) {
                this.$AudaqueToast.error({
                    template: `无告警信息`,
                    methods: {
                        okEvent() {},
                    },
                });
            } else {
                let url = window.urlConfig + '/monitor/alarm/down.do';
                window.open(url, '_blank');
            }
        },
        /*给table行加class标识*/
        tableRowClassName({ row, rowIndex }) {
            if (row.cleanType) {
                return 'clear-type';
            }
            return '';
        },
    },
};
</script>
