<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="调度策略">
                <i
                        class="iconfont iconxinzeng2 cur audaque-rect-icon"
                        @click="$router.push({path:'/schedule/scheduleAddorEdit', query:{optType:'add'}})"
                        v-if="permitList.scheduleAddStrategy"
                        title="新增"
                > 新增</i>
                <i
                        class=""
                        :class="`iconfont iconshaixuan cur ${isSearch?'react-active':''} audaque-rect-icon`"
                        @click="isSearch = !isSearch"
                        title="筛选查询"
                >
                    筛选查询
                </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search
                    @close="isSearch = false"
                    v-show="isSearch"
                    @search="queryListFn(0)"
                    @reset="queryListFn(1)">
                <audaque-table-search-item title="策略名称">
                    <el-input
                            type="text"
                            v-model.trim="searchContent"
                    ></el-input>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                    tooltip-effect='light'
                    class="el-table-common__list"
                    highlight-current-row
                    stripe
                    :data="strategytableList"
                    border
            >
                <el-table-column
                        show-overflow-tooltip
                        type="index"
                        :index="indexMethod"
                        align="center"
                        width="60"
                        label="序号"
                >
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="策略名称"
                        align="left"
                        sortable
                        prop="name"
                >
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="策略说明"
                        align="center"
                        sortable
                        prop="remark"
                >
                    <template slot-scope="scope">{{ scope.row.remark }}</template>
                </el-table-column>
                <el-table-column
                        label="表达式"
                        align="center"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.cronExpression ? scope.row.cronExpression : '-'}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        show-overflow-tooltip
                        label="创建/更新时间"
                        align="center"
                        sortable
                        prop="endTime"
                >
                    <template slot-scope="scope">{{ (scope.row.updateTime || scope.row.createTime) | audaqueDatetime }}
                    </template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="引用次数"
                        align="center"
                        sortable
                        prop="repeatCount"
                >
                    <template slot-scope="scope">{{ scope.row.repeatCount ? scope.row.repeatCount : '-'}}</template>
                </el-table-column>
                <el-table-column
                        show-overflow-tooltip
                        label="操作"
                        align="center"
                        width="180"
                >
                    <template slot-scope="scope">
          <span
                  class="iconfont iconziyuan3 operate"
                  v-if="permitList.scheduleModifyStrategy"
                  @click="edit(scope.row)"
                  title="编辑策略"
                  style="color:#53A7F8;cursor:pointer;"
          ></span>
                        <span
                                class="iconfont iconyyziyuan operate"
                                @click="$message({type:'warning',message:'功能开发中!',showClose:true})"
                                title="引用任务"
                                v-if="true"
                                style="color:#53A7F8;cursor:pointer;"
                        ></span>
                        <span
                                class="iconfont iconShape1 opertae"
                                title="删除策略"
                                @click="Delete(scope.row.id)"
                                v-if="permitList.scheduleDeleteStrategy"
                                style="color:#E53E48;cursor:pointer;"
                        ></span>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="total"
                :page-size="rows"
        ></adq-pagination>
    </audaque-table-list-page>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                currentPage: 1,
                rows: 10,
                isSearch: false,
                searchContent: ''
            }
        },
        created() {
            this.getList()
        },
        computed: {
            ...mapState('schedule', ['strategytableList', 'total'])
        },
        methods: {
            ...mapActions('schedule', ['strategyList', 'deleteStrategy']),
            getList() {
                this.strategyList({page: this.currentPage, rows: this.rows, name: this.searchContent})
            },
            indexMethod(index) {
                return (this.currentPage - 1) * this.rows + index + 1;
            },
            edit(row) {
                this.$router.push({
                    path: '/schedule/scheduleAddorEdit',
                    query: {optType: 'edit', data: JSON.stringify(row)}
                })
            },
            queryListFn(type) {
                if (type === 1) {
                    //重置
                    this.searchContent = '';
                }
                this.getList()
                this.isSearch = false
            },
            Delete(id) {
                let _this = this;
                this.$AudaqueToast.warn({
                    template: `此操作将永久删除该策略, 是否继续?`,
                    methods: {
                        okEvent() {
                            _this.deleteStrategy({id: id}).then(re => {
                                if (re.success) {
                                    this.$AudaqueToast.tip({
                                        template: `策略删除成功`,
                                        methods: {
                                            okEvent() {
                                                _this.getList();
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    }
                });
            },
            handleSizeChange(val) {
                this.rows = val
                this.getList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dispatchList {
        .searchBox {
            .el-row {
                color: #666;
            }
        }
        .iconfont {
            font-size: 14px;
        }
        table .iconfont {
            margin: 0 5px;
        }
        .iconfont:before {
            color: #4885d6;
        }
        .el-table-common__list {
            height: calc(100% - 102px);
        }
    }
</style>
