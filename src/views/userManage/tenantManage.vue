<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="租户列表">
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    v-if="permitList.addTenant && (tenantMode == 1 || tenantMode == 2)"
                    @click="add"
                >
                    新增</i
                >
            </audaque-table-title>
        </template>
        <template>
            <!--物理租户-->
            <el-table
                v-if="tenantMode == 1"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tenantList.rows"
                border
            >
                <el-table-column show-overflow-tooltip type="index" label="序号" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="租户名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="realm" label="管理域"></el-table-column>
                <el-table-column show-overflow-tooltip prop="email" label="邮箱"></el-table-column>
                <el-table-column show-overflow-tooltip prop="extTenant" label="平台租户"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="appNames"
                    label="创建状态"
                    :formatter="
                        (row) => {
                            return row.status == 2 ? '成功' : row.status == 3 ? '失败' : '进行中';
                        }
                    "
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operate">
                            <router-link
                                v-if="permitList.tenantUserList"
                                title="租户用户列表"
                                :to="'/webkit/userCount?id=' + scope.row.id"
                            >
                                <i class="iconfont iconliebiao"></i>
                            </router-link>
                            <span
                                title="编辑"
                                v-if="permitList.modifyTenant"
                                class="iconfont iconFill"
                                @click="edit(scope.row)"
                            ></span>
                            <a title="删除" v-if="permitList.deleteTenant" @click="delTenat(scope.row.id)">
                                <i class="iconfont shanchu iconShape1"></i>
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="initData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>

            <!--逻辑租户-->
            <el-table
                v-if="tenantMode == 2"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tenantList.rows"
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
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="租户名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="managerName" label="租户管理员"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="appNames"
                    label="创建状态"
                    :formatter="
                        (row) => {
                            return row.status == 2 ? '成功' : row.status == 3 ? '失败' : '进行中';
                        }
                    "
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operate">
                            <router-link
                                title="租户用户列表"
                                v-if="permitList.tenantUserList"
                                :to="'/webkit/userCount?id=' + scope.row.id"
                            >
                                <i class="iconfont iconliebiao"></i>
                            </router-link>
                            <span
                                title="编辑"
                                v-if="permitList.modifyTenant"
                                class="iconfont iconFill"
                                @click="edit(scope.row)"
                            ></span>
                            <a title="删除" v-if="permitList.deleteTenant" @click="delTenat(scope.row.id)">
                                <i class="iconfont shanchu iconShape1"></i>
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="initData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <div v-if="tenantMode == 1 || tenantMode == 2">
                <adq-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :total="tenantList.total"
                    :page-size="form.rows"
                    :current-page="form.page"
                ></adq-pagination>
            </div>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            form: {
                page: 1,
                rows: 10,
            },
        };
    },
    computed: {
        ...mapState('webkit', ['tenantList', 'tenantMode']),
    },
    created() {
        this.initData();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions('webkit', ['TENANT_LIST', 'DELETE_TENANT']),
        initData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                form: this.form,
            };
            this.TENANT_LIST(this.form);
        },
        delTenat(id) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this.DELETE_TENANT(id).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `已删除`,
                                methods: {
                                    okEvent() {
                                        _this.initData();
                                    },
                                },
                            });
                        });
                    },
                },
            });
        },
        prevClick(val) {
            this.form.page = val;
            this.initData();
        },
        nextClick(val) {
            this.form.page = val;
            this.initData();
        },
        currentChange(val) {
            this.form.page = val;
            this.initData();
        },
        sizeChange(rows) {
            this.form.page = 1;
            this.form.rows = rows;
            this.initData();
        },
        add() {
            this.$router.push({
                path: '/webkit/tenantManageEdit',
                query: {
                    optType: 'add',
                },
            });
        },
        edit(row) {
            this.$router.push({
                path: '/webkit/tenantManageEdit',
                query: {
                    optType: 'edit',
                    userId: row.managerId,
                    tenantId: row.id,
                    name: row.name,
                },
            });
        },
    },
};
</script>
<style lang="scss" scoped></style>
