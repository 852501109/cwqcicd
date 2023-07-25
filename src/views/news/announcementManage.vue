<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :title="$route.meta.pageName">
                <i class="iconfont iconxinzeng2 audaque-rect-icon" @click="pageType('add')"> 新增</i>
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
        </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="标题">
                    <el-input class="autoSize f14" v-model.trim="param.title"></el-input>
                </audaque-table-search-item>
                <!--                <audaque-table-search-item title="发布人">-->
                <!--                    <el-input class="autoSize f14" v-model.trim="param.publishUser"></el-input>-->
                <!--                </audaque-table-search-item>-->
                <audaque-table-search-item title="紧急程度">
                    <el-select v-model="param.level" size="mini" clearable>
                        <el-option
                            v-for="item in levelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="发布状态">
                    <el-select v-model="param.sendStatus" size="mini" clearable>
                        <el-option
                            v-for="item in publishStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </audaque-table-search-item>
                <!--                <audaque-table-search-item title="发布时间" class="search-time-line">-->
                <!--                    <el-date-picker-->
                <!--                        class="search-date"-->
                <!--                        v-model="applicationTime"-->
                <!--                        type="datetimerange"-->
                <!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                        align="right"-->
                <!--                        unlink-panels-->
                <!--                        range-separator="-"-->
                <!--                        start-placeholder="开始日期"-->
                <!--                        end-placeholder="结束日期"-->
                <!--                    >-->
                <!--                    </el-date-picker>-->
                <!--                </audaque-table-search-item>-->
                <!--                <audaque-table-search-item title="撤销时间" class="search-time-line">-->
                <!--                    <el-date-picker-->
                <!--                        class="search-date"-->
                <!--                        v-model="revokeTime"-->
                <!--                        type="datetimerange"-->
                <!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
                <!--                        align="right"-->
                <!--                        unlink-panels-->
                <!--                        range-separator="-"-->
                <!--                        start-placeholder="开始日期"-->
                <!--                        end-placeholder="结束日期"-->
                <!--                    >-->
                <!--                    </el-date-picker>-->
                <!--                </audaque-table-search-item>-->
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="announcementList.rows"
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
                <el-table-column show-overflow-tooltip prop="title" label="标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="publishUser" label="发布人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="level" label="紧急程度">
                    <template slot-scope="scope">
                        {{ translation(levelList, scope.row.level) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="receiveType" label="通告对象">
                    <template slot-scope="scope">
                        {{ translation(msgNoticeTypeList, scope.row.receiveType) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="sendStatus" label="发布状态">
                    <template slot-scope="scope">
                        {{ translation(publishStatusList, scope.row.sendStatus) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="publishTime" label="发布时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.publishTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="revokeTime" label="撤销时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.revokeTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.sendStatus === 0"
                            class="iconfont iconFill"
                            @click="pageType('edit', scope.row)"
                            title="编辑"
                        ></span>
                        <span
                            class="iconfont iconchakan11"
                            @click="pageType('view', scope.row)"
                            title="查看详情"
                        ></span>
                        <span
                            v-if="scope.row.sendStatus != 2"
                            :class="[
                                'iconfont operate',
                                scope.row.sendStatus === 0 || scope.row.sendStatus === 2
                                    ? 'iconpublish'
                                    : 'iconquxiaofabu',
                            ]"
                            :title="scope.row.sendStatus === 0 || scope.row.sendStatus === 2 ? '发布' : '撤销'"
                            @click="isActivate(scope.row)"
                        >
                        </span>
                        <span
                            v-if="scope.row.sendStatus === 2"
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
                :total="announcementList.total"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapState, mapActions, mapMutations } from 'vuex';
import { msgNoticeTypeList, levelList, publishStatusList } from './newsSearchJs';
export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                type: 1,
            },
            tableList: {
                rows: [],
                total: 0,
            },
            applicationTime: null,
            revokeTime: null,
            msgNoticeTypeList,
            levelList,
            publishStatusList,
        };
    },
    created() {
        this.loadData();
    },
    mixins: [adqSearchMixin],
    computed: {
        ...mapState('news', ['announcementList']),
    },
    methods: {
        ...mapActions(['_AJAX']),
        ...mapActions('news', ['GIT_ANNOUNCEMENT_LIST']),
        /*初始化数据*/
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
                applicationTime: this.applicationTime,
                revokeTime: this.revokeTime,
            };
            let params = Object.assign({}, this.param);
            params.applyTimeStart = this.applicationTime ? this.applicationTime[0] : null;
            params.applyTimeEnd = this.applicationTime ? this.applicationTime[1] : null;
            params.revokeTimeStart = this.revokeTime ? this.revokeTime[0] : null;
            params.revokeTimeEnd = this.revokeTime ? this.revokeTime[1] : null;
            this.GIT_ANNOUNCEMENT_LIST(params);
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
        search(type) {
            this.param.page = 1;
            if (type == 0) {
                //置空
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                    this.param.type = 1;
                    this.applicationTime = null;
                    this.revokeTime = null;
                });
            }
            this.loadData();
        },
        /**/
        pageType(type, row) {
            this.$router.push({
                path: '/news/announcementManageEdit',
                query: {
                    optType: type,
                    id: row ? row.id : null,
                    uuidCode: row ? row.uuidCode : null,
                },
            });
        },
        /*发布、撤销*/
        isActivate(row) {
            let _this = this;
            let status = row.sendStatus === 0 || row.sendStatus === 2 ? 1 : 2;
            this.$store.commit('SHOW_LOADING', true);
            /*未发布*/
            this._AJAX({
                url: 'sys.message.update.info',
                method: 'POST',
                data: {
                    uuidCode: row.uuidCode,
                    sendStatus: status, //
                },
            }).then((res) => {
                if (res.code === 0) {
                    this._AJAX({
                        url: status === 1 ? 'sys.messagePublishHis.addPublish' : 'sys.messagePublishHis.addRevoke',
                        method: 'POST',
                        data: {
                            messageCode: row.uuidCode,
                        },
                    });
                    this.$AudaqueToast.tip({
                        template: '操作成功',
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
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
                                url: 'sys.message.del',
                                method: 'GET',
                                data: { idStr: row.id },
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
