<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="平台管理">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="$router.push('/config/systemGroupingEdit?add=true&optType=add')"
                    v-if="permitList.addPlatform"
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
                <el-table-column show-overflow-tooltip prop="name" label="平台"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="systemList" label="系统">
                    <template slot-scope="scope">
                        {{ scope.row.systemList ? scope.row.systemList.join(',') : '-' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="150">
                    <template slot-scope="scope">
                        <div class="operate">
                            <router-link
                                v-if="permitList.modifyPlatform"
                                title="编辑"
                                :to="'/config/systemGroupingEdit?id=' + scope.row.id + '&edit=true' + '&optType=edit'"
                            >
                                <i class="iconfont iconFill"></i>
                            </router-link>
                            <router-link
                                v-if="permitList.modifyPlatform"
                                title="查看"
                                :to="'/config/systemGroupingEdit?id=' + scope.row.id + '&view=true' + '&optType=view'"
                            >
                                <i class="iconfont iconchakan11"></i>
                            </router-link>
                            <span
                                v-if="permitList.movePlatformOrder"
                                title="降序"
                                class="iconfont iconDesce"
                                @click="sortFun(scope.row, false)"
                            ></span>
                            <span
                                title="升序"
                                v-if="permitList.movePlatformOrder && scope.$index != 0"
                                class="iconfont iconAsce"
                                @click="sortFun(scope.row, true)"
                            ></span>
                            <a v-if="permitList.deletePlatform" title="删除" @click="deleteRole(scope.row)"
                                ><i class="iconfont iconShape1"></i
                            ></a>
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
                url: 'authorManage.platform.findAll',
                method: 'GET',
                data: this.form,
            }).then((res) => {
                if (res.code === 0) {
                    let result = res.result;
                    result.rows.forEach((item) => {
                        if (item.systems && item.systems.length > 0) {
                            item.systemList = [];
                            item.systems.forEach((item1) => {
                                item.systemList.push(item1.name);
                            });
                        }
                    });
                    this.appList.rows = result.rows;
                    this.appList.total = result.total;
                    //this.$set(this.appList, 'list', result);
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
                                url: 'authorManage.platform.delete',
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
        /*排序*/
        sortFun(row, upOrDown) {
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'authorManage.platform.moveOrder',
                method: 'POST',
                data: {
                    id: row.id,
                    upOrDown: upOrDown, //true向上移动，false向下移动
                    step: 1, // 移动步骤，等于0表示置顶或置底
                },
            }).then((res) => {
                if (res.code === 0) {
                    this.initData();
                }
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
