<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="消息渠道">
                <i class="iconfont iconnewadd audaque-rect-icon"
                @click="pageType('add')">
                新增</i>
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="渠道名称">
                    <el-input class="autoSize f14" clearable v-model.trim="param.channelName"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="消息类型">
                    <el-select v-model="param.msgType" placeholder="请选择" clearable>
                        <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="item in msgTypeList"
                            :key="item.label"
                        >
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="状态">
                    <el-select v-model="param.enable" placeholder="请选择" clearable>
                        <el-option :label="item.label" :value="item.value" v-for="item in statusList" :key="item.label">
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
                    width="50"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="channelName" label="渠道名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="msgType" label="消息类型">
                    <template slot-scope="scope">
                        <span v-for="(item, i) in scope.row.msgType" :key="i">{{ msgTypeObj[item] + '  ' }}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="dataState" label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.enable == 1 ? '启动' : '关闭' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.channelEdit"
                            class="iconfont iconFill"
                            @click="pageType('edit', scope.row)"
                            title="编辑"
                        ></span>
                        <span
                            v-if="permitList.channelId"
                            class="iconfont iconchakan11"
                            @click="pageType('view', scope.row)"
                            title="查看详情"
                        ></span>
                        <span
                            v-if="permitList.channelEdit && scope.row.enable == 1"
                            @click="editStatus(0, scope.row)"
                            class="iconfont iconjinyong1"
                            title="关闭"
                        ></span>
                        <span
                            v-if="permitList.channelEdit && scope.row.enable == 0"
                            @click="editStatus(1, scope.row)"
                            class="iconfont iconqiyong2"
                            title="启动"
                        ></span>
                        <span
                            v-if="permitList.channelDel"
                            class="iconfont iconShape1"
                            @click="del(scope.row)"
                            title="删除"
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
import { mapActions } from 'vuex';
import adqSearchMixin from '@/mixins/adqSearchMixin';

export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                channelName: null,
                msgType: null,
                enable: null,
            },
            statusList: [
                { label: '启动', value: 1 },
                { label: '关闭', value: 0 },
            ],
            msgTypeList: [
                { label: '公告', value: 1 },
                { label: '消息', value: 2 },
                { label: '任务', value: 3 },
                { label: '告警', value: 4 },
                { label: '其他', value: 0 },
            ],
            msgTypeObj: {},
            tableList: {
                rows: [],
                total: 0,
            },
        };
    },
    created() {
        this.loadMsgType();
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
                url: 'news.sys.channel.list',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    result.rows.map((item) => {
                        if (item.msgType) {
                            item.msgType = item.msgType.split(',');
                        } else {
                            item.msgType = [];
                        }
                    });
                    this.tableList = result;
                }
            });
        },
        loadMsgType() {
            this.msgTypeList.forEach((item) => {
                this.msgTypeObj[item.value] = item.label;
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
        search(type) {
            this.param.page = 1;
            if (type == 0) {
                //置空
                this.param.channelName = null;
                this.param.msgType = null;
                this.param.enable = null;
                this.param.rows = 10;
            }
            this.loadData();
        },
        /**/
        pageType(type, row) {
            this.$router.push({
                path: '/news/newsChannelSysEdit',
                query: {
                    optType: type,
                    id: row ? row.id : null,
                },
            });
        },
        editStatus(status, row) {
            const _this = this;
            this.$store.commit('SHOW_LOADING', true);
            if (status == 1) {
                //启动
                this._AJAX({
                    url: 'news.sys.channel.edit',
                    method: 'POST',
                    data: { id: row.id, enable: 1 },
                }).then((res) => {
                    if (res.code == 0) {
                        this.$AudaqueToast.tip({
                            template: `启动成功`,
                            methods: {
                                okEvent() {
                                    _this.loadData();
                                },
                            },
                        });
                    }
                });
            } else {
                //关闭
                this._AJAX({
                    url: 'news.sys.channel.edit',
                    method: 'POST',
                    data: { id: row.id, enable: 0 },
                }).then((res) => {
                    if (res.code == 0) {
                        this.$AudaqueToast.tip({
                            template: `关闭成功`,
                            methods: {
                                okEvent() {
                                    _this.loadData();
                                },
                            },
                        });
                    }
                });
            }
        },
        /*删除*/
        del(row) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this
                            ._AJAX({
                                url: 'news.sys.channel.del',
                                method: 'GET',
                                data: { id: row.id },
                            })
                            .then((res) => {
                                if (res.code == 0) {
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
        },
    },
};
</script>
