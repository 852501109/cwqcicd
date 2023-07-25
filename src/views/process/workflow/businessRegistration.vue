<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="业务注册">
                <i
                    v-if="permitList.categoryInsert"
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="infoEdit('add')"
                >
                    新增</i
                >
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="业务名称">
                    <el-input v-model.trim="param.name" placeholder="请输入业务名称" clearable></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="业务编号">
                    <el-input v-model.trim="param.code" placeholder="请输入业务编号" clearable></el-input>
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
                <el-table-column show-overflow-tooltip prop="name" label="业务名称"></el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--prop="type"-->
                <!--label="类型"-->
                <!--&gt;-->
                <!--<template slot-scope="scope">-->
                <!--{{statusObj[scope.row.type]}}-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip prop="code" label="业务编号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="createUserName" label="创建人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.updateTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="description" label="备注"></el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="220px">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.categoryId"
                            class="iconfont iconchakan11 operate"
                            title="查看"
                            @click="infoEdit('view', scope.row)"
                        ></span>
                        <span
                            v-if="permitList.categoryUpdate"
                            class="iconfont iconziyuan3 operate"
                            title="编辑"
                            @click="infoEdit('edit', scope.row)"
                        ></span>
                        <span
                            v-if="permitList.categoryDel"
                            class="iconfont iconShape1 operate"
                            title="删除"
                            @click="del(scope.row)"
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
import API from '@/api/index';

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
            statusObj: {
                1: '请假审核',
                2: '财务审核',
                3: '流程启用审核',
                null: '无',
            },
        };
    },
    mixins: [adqSearchMixin],
    created() {
        this.loadData();
    },
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
                url: 'sys.category.list',
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
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                    this.applicationTime = null;
                });
            }
            this.loadData();
        },
        infoEdit(type, row) {
            this.$router.push({
                path: '/process/workflow/businessRegistrationEdit',
                query: {
                    optType: type,
                    id: row ? row.id : null,
                },
            });
        },
        del(row) {
            const _this = this;
            this.$AudaqueToast.warn({
                template: `确定删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        let url = API['sys.category.del'] + '/' + row.id;
                        _this
                            ._AJAX({
                                url: url,
                                method: 'GET',
                                data: {},
                            })
                            .then((res) => {
                                if (res.code == 0) {
                                    this.$AudaqueToast.tip({
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
