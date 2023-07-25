<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="租户用户列表">
                <i
                    class="audaque-edit-tab__return-text iconfont adq-icon-back audaque-rect-icon"
                    @click="$router.go(-1)"
                    >返回</i
                >
                <i class="iconfont iconxinzeng2 audaque-rect-icon" v-if="permitList.addTenantUser" @click="isAdd">
                    新增</i
                >
            </audaque-table-title>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tenantUserList.list"
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
                <el-table-column prop="name" label="姓名"> </el-table-column>
                <el-table-column prop="account" label="账号"> </el-table-column>
                <el-table-column prop="phone" label="手机号"> </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operate" v-if="permitList.deleteTenantUser">
                            <a @click="delTenat(scope.row.id)"><i class="iconfont shanchu iconShape1"></i></a>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <adq-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :total="tenantUserList.total"
                :page-size="form.row"
                :current-page="form.page"
            ></adq-pagination>
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
                tenantId: this.$route.query.id,
                page: 1,
                rows: 10,
            },
        };
    },
    computed: {
        ...mapState('webkit', ['tenantUserList']),
    },
    created() {
        this.initData();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions('webkit', ['TENANT_USER_LIST', 'DELETE_TENANT_USER']),
        initData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            this.form.tenantId = this.$route.query.id;
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                form: this.form,
            };
            this.TENANT_USER_LIST(this.form);
        },
        delTenat(id) {
            const _this = this;
            let param = {
                tenantId: this.$route.query.id,
                userIds: [id],
            };
            this.$AudaqueToast.warn({
                template: `确定删除?`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this.DELETE_TENANT_USER(param).then((res) => {
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

        isAdd() {
            this.$router.push({
                path: '/webkit/userCountEdit',
                query: {
                    id: this.$route.query.id,
                },
            });
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
    },
};
</script>
