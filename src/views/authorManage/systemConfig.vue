<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="系统管理">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="$router.push('/config/systemConfigEdit?add=true&optType=add')"
                    v-if="permitList.addSystem"
                >
                    新增</i
                >
            </audaque-table-title>
        </template>
        <template>
            <el-table
                :data="appList.rows"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                border
            >
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, form.page, form.rows);
                        }
                    "
                    width="50"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="系统名称"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="app.appName" label="接入应用"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="mainUrl" label="模块url"> </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="120">
                    <template slot-scope="scope">
                        <div class="operate">
                            <template v-if="permitList.modifySystem">
                                <router-link
                                        title="编辑"
                                        :to="'/config/systemConfigEdit?id=' + scope.row.id + '&edit=true' + '&optType=edit'"
                                >
                                    <i class="iconfont iconFill"></i>
                                </router-link>
                            </template>
                            <template v-if="permitList.modifySystem">
                                <router-link
                                        title="查看"
                                        :to="'/config/systemConfigEdit?id=' + scope.row.id + '&view=true' + '&optType=view'"
                                >
                                    <i class="iconfont iconchakan11"></i>
                                </router-link>
                            </template>
                            <template v-if="permitList.deleteSystem">
                                <a title="删除" @click="deleteRole(scope.row)">
                                    <i class="iconfont shanchu iconShape1"></i>
                                </a>
                            </template>
                        </div>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="initData"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :total="appList.total"
                :page-size="form.rows"
                :current-page="form.page"
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
            form: {
                page: 1,
                rows: 10,
            },
            appList: { rows: [], total: 0 },
            id: '',
        };
    },
    computed: {},
    created() {
        this.initData();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions(['_AJAX']),
        initData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                form: this.form,
            };
            this._AJAX({
                url: 'authorManage.findAll',
                method: 'GET',
                data: this.form,
            }).then((res) => {
                if (res.code === 0) {
                    this.appList.rows = res.result.rows;
                    this.appList.total = res.result.total;
                }
            });
        },
        deleteRole(row) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this
                            ._AJAX({
                                url: 'authorManage.delete',
                                method: 'POST',
                                data: {
                                    id: row.id,
                                },
                            })
                            .then((res) => {
                                if (res.code == 0) {
                                    _this.$AudaqueToast.tip({
                                        template: `删除成功`,
                                        methods: {
                                            okEvent() {
                                                _this.initData();
                                            },
                                        },
                                    });
                                }
                            });
                    },
                },
            });
        },
        sizeChange(rows) {
            this.form.rows = rows;
            this.form.page = 1;
            this.initData();
        },
        currentChange(val) {
            this.form.page = val;
            this.initData();
        },
    },
};
</script>
<style lang="scss" scoped></style>
