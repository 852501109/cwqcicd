<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="消息类型">
                <i v-if="permitList.typeNew" class="iconfont iconxinzeng2 audaque-rect-icon" @click="pageType('add')">
                    新增</i
                >
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="消息类型">
                    <el-input class="autoSize f14" v-model.trim="param.name"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="消息编号">
                    <el-input class="autoSize f14" v-model.trim="param.code"></el-input>
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
                <el-table-column show-overflow-tooltip prop="name" label="消息类型"></el-table-column>
                <el-table-column show-overflow-tooltip prop="code" label="类型编号"></el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.typeEdit"
                            class="iconfont iconFill"
                            @click="pageType('edit', scope.row)"
                            title="编辑"
                        ></span>
                        <span
                            v-if="permitList.typeId"
                            class="iconfont iconchakan11"
                            @click="pageType('view', scope.row)"
                            title="查看详情"
                        ></span>
                        <span
                            v-if="permitList.typeDel"
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
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                name: null,
                code: null,
            },
            tableList: {
                rows: [],
                total: 0,
            },
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
                url: 'news.sys.msg.type.list',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code == 0) {
                    this.tableList = res.result;
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
        search(type) {
            this.param.page = 1;
            if (type == 0) {
                //置空
                this.param.code = null;
                this.param.name = null;
                this.param.rows = 10;
            }
            this.loadData();
        },
        /**/
        pageType(type, row) {
            this.$router.push({
                path: '/news/newsTypeSysEdit',
                query: {
                    optType: type,
                    id: row ? row.id : null,
                },
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
                                url: 'news.sys.msg.type.del',
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
