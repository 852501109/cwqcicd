<!-- 角色管理 -->
<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="角色列表">
                <i
                    v-if="permitList.addRole"
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="$router.push('/webkit/roleManageEdit')"
                    >新增角色</i
                >
            </audaque-table-title>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                border
                :data="roleList"
            >
                <el-table-column show-overflow-tooltip label="角色名称" align="center">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <!--                <el-table-column show-overflow-tooltip label="功能权限" align="center" min-width="120">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <span v-for="item in scope.row.resources" :key="item.id" class="qs-item">{{ item.name }}</span>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column align="center" show-overflow-tooltip label="操作" width="130">
                    <template slot-scope="scope">
                        <router-link
                            v-if="permitList.modifyRole"
                            title="编辑"
                            :to="{ path: '/webkit/roleManageEdit', query: { roleId: scope.row.id } }"
                            class="iconfont iconziyuan3 operate"
                        ></router-link>
                        <router-link
                            v-if="permitList.getEditRole"
                            title="查看"
                            :to="{ path: '/webkit/roleManageEdit', query: { roleId: scope.row.id, filter: 'view' } }"
                            class="iconfont iconchakan11 operate"
                        ></router-link>
                        <a
                            title="删除"
                            v-if="permitList.deleteRole"
                            @click="deleteRole(scope.row)"
                            class="iconfont iconShape1 operate"
                        ></a>
                    </template>
                </el-table-column>
            </el-table>
            <adq-pagination :is-paging="false" :total="roleList.length"></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {};
    },
    computed: {
        ...mapState('webkit', ['roleList']),
    },
    created() {
        this.ROLELIST({ includeResource: true });
    },
    methods: {
        ...mapActions('webkit', ['ROLELIST', 'DELETEROLE']),
        ...mapActions(['_AJAX']),
        deleteRole(row) {
            let _this = this;
            /*校验该角色是否在使用*/
            _this
                ._AJAX({
                    url: 'webkit.checkDelete',
                    method: 'POST',
                    data: { adq: row.id },
                })
                /*没有在使用直接删除*/
                .then((res) => {
                    if (res.code == 0) {
                        _this.del(row);
                    }
                })
                .catch((err) => {
                    /*有在使用的确认需要删除后解除相关的角色绑定后再删除*/
                    if (err.code === 999999) {
                        this.$AudaqueToast.warn({
                            template: err.msg,
                            methods: {
                                okEvent() {
                                    _this.del(row);
                                },
                            },
                        });
                    }
                });
        },
        del(row) {
            const _this = this;
            _this.DELETEROLE({ adq: row.id }).then((res) => {
                if (res.code == 0) {
                    _this.$AudaqueToast.tip({
                        template: `删除成功`,
                        methods: {
                            okEvent() {
                                _this.ROLELIST({ includeResource: true });
                            },
                        },
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table .cell.el-tooltip {
    white-space: normal;
}
</style>
