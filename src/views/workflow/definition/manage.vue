<!-- 流程定义 -->
<template>
    <div class="workflow-main" style="padding: 0">
        <table-title class="titleBtnbox" title="流程定义">
            <i class="iconfont iconxinzeng2 cur rect-icon" @click="addUser" title="新增审批流程"> 新增审批流程</i>
        </table-title>
        <el-table
            tooltip-effect="light"
            class="el-table-common__list"
            highlight-current-row
            stripe
            :data="definitionList"
            border
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                show-overflow-tooltip
                type="index"
                :index="
                    (index) => {
                        return $utils._indexMethod(index, currentPage, rows);
                    }
                "
                align="center"
                width="50"
                label="序号"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip label="图标" align="center" prop="icon"> </el-table-column>
            <el-table-column show-overflow-tooltip label="名称" align="center" prop="name"> </el-table-column>
            <el-table-column show-overflow-tooltip label="分组" align="center" prop="category">
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="创建时间" align="center" prop="createTime">
                <template slot-scope="scope">{{ scope.row.createTime | datetime }}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="更新时间" align="center" prop="updateTime">
                <template slot-scope="scope">{{ scope.row.createTime | datetime }}</template>
            </el-table-column>
            <el-table-column label="可见范围" align="center" prop="allVisible">
                <template slot-scope="scope">
                    <span class="qs-item">{{ scope.row.allVisible ? '全部可见' : '部分可见' }}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="备注" align="center" prop="remark"> </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" align="center" width="240">
                <template slot-scope="scope">
                    <span class="operate" @click="edit(scope.row)">基本信息</span>
                    <span class="operate" @click="resetPWD(scope.row)">编辑表单</span>
                    <span class="operate" @click="stopStartUser(scope.row)">审批流程</span>
                    <span class="operate" v-if="scope.enabled" @click="deleteUser(scope.row)">禁用</span>
                    <span class="operate" v-if="!scope.enabled" @click="forceLogoutUser(scope.row)">启用</span>
                    <span class="operate" v-if="!scope.enabled" @click="forceLogoutUser(scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <adq-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="definitionListPage"
            :page-size="rows"
            :current-page="currentPage"
        ></adq-pagination>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TableTitle from '@/components/TableTitle';

export default {
    data() {
        return {
            currentPage: 1,
            rows: 10,
            isShowBar: true,
            is_query: true,
            search_account: '',
            search_name: '',
            listData: [],
            beginTime: '',
            endTime: '',
        };
    },

    components: {
        TableTitle,
    },

    computed: {
        ...mapState('workflow', ['definitionList', 'definitionListPage']),
    },

    created() {
        this.WORKFLOW_DEFINITION_LISTDATA();
    },

    methods: {
        ...mapActions('workflow', ['WORKFLOW_DEFINITION_LISTDATA']),
        ...mapMutations('workflow', ['DEFINITION_LIST']),
        indexMethod(index) {
            return (this.currentPage - 1) * this.rows + index + 1;
        },
        //查询客户列表
        getUserList() {
            // let time= this.seldateVal,
            //     beginCreateTime=time[0],
            //     endCreateTime=time[1];
            let beginCreateTime = this.beginTime,
                endCreateTime = this.endTime;
            let params = {
                includeRole: true,
                rows: this.rows,
                page: this.currentPage,
                // account: this.search_account,
                // name: this.search_name,
                // beginCreateTimeStr: beginCreateTime ? this.$utils.timeToDate(beginCreateTime) : '',
                // endCreateTimeStr: endCreateTime ? this.$utils.timeToDate(endCreateTime) : ''
            };
            if (this.search_account) params['account'] = this.search_account;
            if (this.search_name) params['name'] = this.search_name;
            if (beginCreateTime) params['beginCreateTimeStr'] = this.$utils.timeToDate(beginCreateTime);
            if (endCreateTime) params['endCreateTimeStr'] = this.$utils.timeToDate(endCreateTime);

            this.GETUSERLIST(params)
                .then((res) => {
                    this.INIT_USER_LIST({
                        data: res.rows,
                        total: res.total,
                    });
                })
                .catch((err) => (this.loading = false));
        },
        queryListFn(type) {
            this.is_query = type === 0 ? true : false;
            if (type === 1) {
                //重置
                this.search_account = '';
                this.search_name = '';
                // this.seldateVal=""
                this.beginTime = '';
                this.endTime = '';
            }
            this.getUserList();
        },
        showCon(type) {
            this.isShowBar = type === 0 ? true : false;
        },
        forceLogoutUser(id) {
            this.FORCE_LOGOUT_USER(id).then((re) => {
                this.$AudaqueToast.tip({
                    template: `强制退出成功`,
                    methods: {
                        okEvent() {},
                    },
                });
            });
        },
        handleSelectionChange(val) {},
        handleSizeChange(val) {
            this.currentPage = 1;
            this.rows = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getUserList();
        },
        edit(userId) {
            this.$router.push({ path: '/webkit/userManageEdit', query: { userId } });
        },
        addUser() {
            this.$router.push({ path: '/webkit/userManageEdit' });
        },
        resetPWD(userId) {
            this.RESET_PWD(userId)
                .then((res) => {
                    this.$AudaqueToast.tip({
                        template: `密码重置成功`,
                        methods: {
                            okEvent() {},
                        },
                    });
                })
                .catch((err) => (this.loading = false));
        },
        stopStartUser(row) {
            if (row.enabled) {
                this.DISABLE_USER(row.id).then((res) => {
                    this.$AudaqueToast.tip({
                        template: `禁用成功`,
                        methods: {
                            okEvent() {},
                        },
                    });
                    this.toggle_user_status(row.id);
                });
            } else {
                this.ENABLE_USER(row.id).then((res) => {
                    this.$AudaqueToast.tip({
                        template: `启用成功`,
                        methods: {
                            okEvent() {},
                        },
                    });
                    this.toggle_user_status(row.id);
                });
            }
        },
        deleteUser(userId) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除?`,
                methods: {
                    okEvent() {
                        _this.DELETE_USER_USER(userId).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `删除成功`,
                                methods: {
                                    okEvent() {
                                        _this.delete_user_by_userid(userId);
                                    },
                                },
                            });
                        });
                    },
                },
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.workflow-main {
    .searchBox {
        .el-row {
            color: #666;
        }
    }
    .el-table-common__list {
        height: calc(100% - 102px);
        .operate {
            cursor: pointer;
            color: #53a7f8;
            font-size: 12px;
        }
    }
    table .iconfont {
        //font-weight: 600;
        margin: 0 5px;
    }
    //padding: 23px;
    .select-con {
        .con-head {
            span {
                font-size: 14px;
                color: #3a405b;
            }
            background-color: #fff;
            height: 60px;
            //border-bottom: 1px solid #cccccc;
            .head-left {
                width: 49%;
                line-height: 60px;
                padding-left: 10px;
                text-align: left;
                display: inline-block;
            }
            .head-right {
                width: 50%;
                display: inline-block;
                line-height: 60px;
                text-align: right;
                .query {
                    padding: 10px 16px;
                    border: 1px solid #53a7f8;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }
                .rest {
                    padding: 10px 16px;
                    border: 1px solid #53a7f8;
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
                .active {
                    background: #53a7f8;
                    color: #ffffff;
                }
                .normal {
                    background: #ffffff;
                    color: #53a7f8;
                }
            }
        }
        .con-child {
            line-height: 80px;
            background-color: #fff;
            padding: 0 20px;
            border-top: 1px solid #ebebeb;
            height: 80px;

            /*.con-list {
                  display: inline-block;
                  margin-right: 20px;
                  .el-range-separator {
                    width: 6%;
                  }
                  input {
                    height: 32px;
                    border-radius: 4px;
                    text-indent: 10px;
                    border: 1px solid #ccc;
                  }
                }*/
        }
    }
    .iconfont:before {
        color: #4885d6;
    }
    .ueserM-title {
        height: 60px;
        margin-top: 20px;
        background-color: #fff;
        .title-left {
            width: 49%;
            line-height: 60px;
            text-align: left;
            display: inline-block;
            .icon-ai-list:before {
                padding: 10px;
            }
            .left-text {
                font-size: 14px;
                color: #3a405b;
            }
        }
        .title-right {
            width: 50%;
            display: inline-block;
            line-height: 60px;
            text-align: right;
            .right-text {
                font-size: 14px;
                color: #3a405b;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 2px;
            }
        }
    }
    .controlRow {
        flex: 1;
        align-items: center;
    }
    .autoSize {
        width: 80px;
    }
    .autoSize1 {
        width: 155px;
    }
    .autoSize2 {
        width: 40px;
        margin: 0 5px;
    }
}
</style>
