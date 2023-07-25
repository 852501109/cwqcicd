<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="消息管理">
                <i v-if="permitList.messagesDel" class="iconfont iconShape1 audaque-rect-icon" @click="del">删除</i>
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="消息码">
                    <el-input class="autoSize f14" clearable v-model.trim="param.uuidCode"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="应用名称">
                    <el-input class="autoSize f14" clearable v-model.trim="param.appKey"></el-input>
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
                <audaque-table-search-item title="发送状态">
                    <el-select v-model="param.sendStatus" placeholder="请选择" clearable>
                        <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="item in sendStatusList"
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
                <!--      <el-table-column show-overflow-tooltip prop="channelType" label="渠道类型">
                    <template slot-scope="scope">
                        {{ channelType(scope.row.channelType) }}
                    </template>
                </el-table-column>-->
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
                <!--      <el-table-column show-overflow-tooltip prop="sendStatus" label="发送状态">
                    <template slot-scope="scope">
                        {{ translation(sendStatusList, scope.row.sendStatus) }}
                    </template>
                </el-table-column>-->
                <el-table-column show-overflow-tooltip prop="createTime" label="接收时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="80px" label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.messageGet"
                            class="iconfont iconchakan11"
                            @click="view(scope.row)"
                            title="查看"
                        ></span>
                        <!-- <span
                            @click="send(scope.row)"
                            v-if="permitList.messageResend && scope.row.sendStatus != 1 && scope.row.type != 1"
                            class="iconfont iconzhongfu"
                            title="立即重发"
                        ></span>-->
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
import { msgTypeList, msgNoticeTypeList, levelList, sendStatusList, channelList } from './newsSearchJs';
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
            channelList,
            activeLineIds: [],
        };
    },
    created() {
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
                url: 'sys.message.list',
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
                return item.id;
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
        channelType(value) {
            let channelTypeList = {};
            this.channelList.forEach((item) => {
                channelTypeList[item.value] = item.label;
            });
            if (!value) {
                return '-';
            }
            if (/[，,]/g.test(value)) {
                let strArr = value.split(',');
                for (let i = 0; i < strArr.length; i++) {
                    let item = strArr[i];
                    strArr[i] = channelTypeList[item];
                }
                return strArr.join(',');
            } else {
                return channelTypeList[value];
            }
        },
        /**/
        view(row) {
            this.$router.push({
                path: '/news/newsSearchEdit',
                query: {
                    optType: 'view',
                    id: row.id,
                    type: row.type,
                },
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
                                    url: 'sys.message.del',
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
        send(row) {
            this.$store.commit('SHOW_LOADING', true);
            const _this = this;
            this._AJAX({
                url: 'sys.message.resend',
                method: 'POST',
                data: { id: row.id },
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `发送成功`,
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
};
</script>
