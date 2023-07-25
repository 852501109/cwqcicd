<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="我的消息">
                <i v-if="permitList.messageUserDel" class="iconfont iconShape1 audaque-rect-icon" @click="del">删除</i>
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="消息码">
                    <el-input class="autoSize f14" clearable v-model.trim="param.uuidCode"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="应用名称">
                    <el-select v-model="param.appKey" clearable>
                        <el-option v-for="item in sysList" :key="item.id" :label="item.appName" :value="item.appKey">
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="消息标题">
                    <el-input class="autoSize f14" clearable v-model.trim="param.title"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="消息类型">
                    <el-select v-model="param.type" placeholder="请选择" clearable>
                        <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="item in msgTypeList"
                            :key="item.label"
                        >
                        </el-option>
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
                border
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, param.page, param.rows);
                        }
                    "
                    width="50"
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="uuidCode" label="消息码"></el-table-column>
                <el-table-column show-overflow-tooltip prop="appName" label="应用名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="messageAbstract" label="摘要"></el-table-column>
                <el-table-column show-overflow-tooltip prop="templateCode" label="模板编码"></el-table-column>
                <el-table-column show-overflow-tooltip prop="type" label="消息类型">
                    <template slot-scope="scope">
                        {{ translation(msgTypeList, scope.row.type) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="receiveType" label="通知对象">
                    <template slot-scope="scope">
                        {{ translation(msgNoticeTypeList, scope.row.receiveType) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="level" label="紧急程度">
                    <template slot-scope="scope">
                        {{ translation(levelList, scope.row.level) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="level" label="是否已读">
                    <template slot-scope="scope">
                        <!--任务类型-->
                        <span v-if="scope.row.type === 3">
                            <span
                                v-html="$audaquePreventXss(handlerStatus[scope.row.handlerStatus], $xssWhitelist)"
                            ></span>
                            /
                            <span v-html="$audaquePreventXss(readFlags[scope.row.readFlag], $xssWhitelist)"></span>
                        </span>
                        <span v-else>
                            <span v-if="scope.row.readFlag === 1" style="color: #f56c6c">已读</span>
                            <span v-else>未读</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="接收时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="80px" label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.messageUserGet"
                            class="iconfont iconchakan11"
                            @click="view(scope.row)"
                            title="查看"
                        ></span>
                        <span
                            class="iconfont iconbanli"
                            v-if="
                                permitList.messageUserUpdate &&
                                scope.row.type === 3 &&
                                scope.row.handlerStatus != 1 &&
                                scope.row.handlerStatus != 2
                            "
                            @click="handle(scope.row)"
                            title="办理"
                        ></span>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="loadData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :page-size="param.rows"
                :total="tableList.total"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import { msgTypeList, msgNoticeTypeList, levelList, sendStatusList } from './newsSearchJs';
export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
            },
            tableList: {
                rows: [],
                total: 0,
            },
            msgTypeList,
            msgNoticeTypeList,
            levelList,
            sendStatusList,
            activeLineIds: [],
            handlerStatus: {
                null: '<span>未办</span>',
                1: '<span style="color: #f56c6c;">已办</span>',
                0: '<span>未办</span>',
                2: '<span>撤回</span>',
                3: '<span>部分办理</span>',
            },
            readFlags: {
                null: '<span>未读</span>',
                1: '<span style="color: #f56c6c;">已读</span>',
                0: '<span>未读</span>',
            },
            sysList: [], //系统列表
        };
    },
    created() {
        /*请求系统列表*/
        this._AJAX({
            url: 'webkit.appList',
            method: 'GET',
            data: { page: 1, rows: 999999 },
        }).then((res) => {
            if (res.code === 0) {
                this.sysList = res.rows;
            }
        });
        this.loadData();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
            };
            this._AJAX({
                url: 'sys.message.user',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.tableList = result;
                }
            });
        },
        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
            this.loadData();
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.loadData();
        },
        handleSelectionChange(val) {
            this.activeLineIds = val.map((item) => {
                return item.userMessageId;
            });
        },
        search(type) {
            this.param.page = 1;
            if (type == 0) {
                //置空
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                });
            }
            this.loadData();
        },
        /*翻译*/
        translation(data, value) {
            if (value != null) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].value === value) {
                        return data[i].label;
                    }
                }
            } else {
                return '-';
            }
        },
        /**/
        view(row) {
            this.$router.push({
                path: '/news/userAnnouncementEdit',
                query: {
                    optType: 'view',
                    id: row.id,
                    type: row.type,
                },
            });
        },
        /*办理*/
        handle(row) {
            let _this = this;
            this._AJAX({
                url: 'sys.message.update.user.info',
                method: 'POST',
                data: {
                    uuidCode: row.uuidCode,
                    handlerStatus: 1, //已办
                },
            }).then((res) => {
                if (res.code === 0) {
                    _this.$AudaqueToast.tip({
                        template: `办理成功`,
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        del() {
            let _this = this;
            if (this.activeLineIds && this.activeLineIds.length > 0) {
                this.$AudaqueToast.warn({
                    template: `确定删除?`,
                    methods: {
                        okEvent() {
                            _this
                                ._AJAX({
                                    url: 'sys.message.user.del',
                                    method: 'GET',
                                    data: { idStr: _this.activeLineIds.join(',') },
                                })
                                .then((res) => {
                                    if (res.code === 0) {
                                        _this.$AudaqueToast.tip({
                                            template: `删除成功`,
                                            methods: {
                                                okEvent() {
                                                    _this.loadData();
                                                },
                                            },
                                        });
                                    }
                                });
                        },
                    },
                });
            } else {
                _this.$AudaqueToast.error({
                    template: `请选择要删除的消息`,
                    methods: {
                        okEvent() {},
                    },
                });
            }
        },
    },
};
</script>
