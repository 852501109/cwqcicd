<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="应用列表">
                <i class="iconfont iconxinzeng2 audaque-rect-icon" @click="add" v-if="permitList.addApp"> 新增</i>
            </audaque-table-title>
        </template>
        <template>
            <el-table
                :data="appList.list"
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
                <el-table-column prop="appKey" label="应用KEY">
                    <template slot-scope="scope">
                        {{ scope.row.appKey || scope.row.clientId }}
                    </template>
                </el-table-column>
                <el-table-column prop="appName" label="应用名称"> </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.enabled ? '启用' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operate">
                            <!--当不是该用户创建的时候屏蔽掉不让编辑和删除-->
                            <a
                                v-if="permitList.disableApp && scope.row.enabled"
                                title="禁用"
                                @click="disableSource(scope.row)"
                            >
                                <i class="iconfont iconjinyong1"></i>
                            </a>
                            <a
                                v-if="permitList.enableApp && !scope.row.enabled"
                                title="启用"
                                @click="disableSource(scope.row)"
                            >
                                <i class="iconfont iconqiyong2"></i>
                            </a>
                            <router-link
                                v-if="permitList.modifyApp"
                                title="编辑"
                                :to="'/config/appManageEdit?id=' + scope.row.id"
                            >
                                <i class="iconfont iconFill"></i>
                            </router-link>
                            <a title="删除" v-if="permitList.deleteApp" @click="deleteRole(scope.row)">
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
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            form: {
                page: 1,
                rows: 10,
            },
            id: '',
            createUser: null, //登录用户的id
        };
    },
    computed: {
        ...mapState('webkit', ['appList', 'userInfo']),
    },
    created() {
        this.getBaseInfo().then((res) => {
            this.createUser = this.userInfo.myUser.id;
        });
        this.initData();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions('webkit', ['APPLIST', 'DELETEAPP', 'getBaseInfo']),
        ...mapActions(['_AJAX']),
        initData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                form: this.form,
            };
            this.APPLIST(this.form);
        },
        add() {
            this.$router.push({ path: '/config/appManageEdit' });
        },
        deleteRole(row) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this.DELETEAPP({ adq: row.id }).then((res) => {
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
        disableSource(row) {
            let _this = this;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: row.enabled ? 'appManage.disableApp' : 'appManage.enableApp',
                method: 'POST',
                data: { id: row.id },
            }).then((res) => {
                if (res.code === 0) {
                    _this.$AudaqueToast.tip({
                        template: row.enabled ? '禁用成功' : '启用成功',
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
};
</script>
