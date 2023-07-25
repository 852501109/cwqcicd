<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="标签管理">
                <i
                    v-if="permitList.addTag"
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="$router.push('/webkit/tagManageEdit?optType=add')"
                >
                    新增标签</i
                >
            </audaque-table-title>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tagList"
                border
            >
                <el-table-column show-overflow-tooltip type="index" label="序号" align="center" width="50">
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="type"-->
                <!--width="200"-->
                <!--align="center"-->
                <!--:formatter="typeChange"-->
                <!--label="标签类型">-->

                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip prop="name" align="center" label="标签名称"> </el-table-column>
                <!--                <el-table-column show-overflow-tooltip prop="flag" align="center" label="标签标识"> </el-table-column>-->
                <!--暂时屏蔽-->
                <!--<el-table-column label="功能权限" align="center">-->
                <!--<template slot-scope="scope">-->
                <!--<span v-for="(item,index) in scope.row.resources"-->
                <!--class="qs-item" :key="index">{{item.name}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <router-link
                            v-if="permitList.modifyTag"
                            title="编辑"
                            :to="{ path: '/webkit/tagManageEdit', query: { id: scope.row.id, optType: 'edit' } }"
                            class="iconfont iconfill operate"
                        >
                        </router-link>
                        <a
                            title="删除"
                            v-if="permitList.deleteTag"
                            @click="deleteTag(scope.row)"
                            class="iconfont iconShape2 operate"
                        >
                        </a>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="TAGLIST({ includeResource: includeResource })"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination :is-paging="false" :total="tagList.length"></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            id: '',
            isDel: false,
            includeResource: true,
        };
    },
    computed: {
        ...mapState('webkit', ['tagList']),
    },
    created() {
        this.TAGLIST({ includeResource: this.includeResource });
    },
    methods: {
        ...mapActions('webkit', ['TAGLIST', 'DELETETAG']),
        ...mapActions(['_AJAX']),
        typeChange(row, column, cellValue, index) {
            return row.type === 1 ? '部门标签' : '职位标签';
        },
        deleteTag(row) {
            this.$store.commit('SHOW_LOADING', true);
            let _this = this;
            /*校验该标签是否在使用*/
            _this
                ._AJAX({
                    url: 'tag.checkDelete',
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
                    /*有在使用的确认需要删除后解除相关的标签绑定后再删除*/
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
            _this.DELETETAG({ adq: row.id }).then((res) => {
                if (res.code == 0) {
                    _this.$AudaqueToast.tip({
                        template: `删除成功`,
                        methods: {
                            okEvent() {
                                _this.TAGLIST({ includeResource: _this.includeResource });
                            },
                        },
                    });
                }
            });
        },
    },
};
</script>
