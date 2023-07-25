<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :titles="titles" @change="changeTableList" :index="activityName">
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="流程名称">
                    <el-input class="autoSize f14" v-model.trim="param.name"></el-input>
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
                <el-table-column show-overflow-tooltip prop="categoryName" label="业务"></el-table-column>
                <el-table-column show-overflow-tooltip prop="processName" label="业务名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="申请标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="owner" label="发起人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="deptnames" label="发起人所属组织"></el-table-column>
                <el-table-column show-overflow-tooltip prop="startTime" label="发起时间"></el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--prop="isSuspended"-->
                <!--label="状态"-->
                <!--&gt;-->
                <!--<template slot-scope="scope">-->
                <!--{{suspendedObj[scope.row.suspended]}}-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip label="操作" width="220px">
                    <template slot-scope="scope">
                        <span
                            class="iconfont iconchakan11 operate"
                            title="查看"
                            v-if="scope.row.categoryId === 3"
                            @click="view(scope.row)"
                        >
                        </span>
                        <span class="iconfont iconxianshi operate" title="预览" @click="preview(scope.row)"> </span>
                        <span
                            v-if="activityName === 0"
                            class="iconfont iconjianyishupc-icon1024_shenhe operate"
                            title="审核"
                            @click="by(scope.row)"
                        ></span>
                        <!--<span v-if="activityName ===0"-->
                        <!--:class="['iconfont operate',scope.row.isSuspended === 1 ? 'iconguaqi' : 'iconjihuo']"-->
                        <!--:title="scope.row.isSuspended ==1 ? '挂起' : '激活'"-->
                        <!--@click="changeStatus(scope.row)"></span>-->
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
        <el-dialog
            title="查看"
            :visible.sync="idVisibleDialog"
            width="1000"
            :close-on-click-modal="false"
            class="data-permission"
        >
            <el-form label-width="80px" :model="ruleForm" disabled>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="流程名称">
                            <el-input v-model.trim="ruleForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务标识">
                            <el-input v-model.trim="ruleForm.bizCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型名称">
                            <el-input v-model.trim="ruleForm.categoryName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input v-model.trim="ruleForm.description"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="可见范围">
                            <el-input v-model.trim="ruleForm.depName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <node-config-public
                v-if="idVisibleDialog"
                opt-type="view"
                :procDefId="activeProcDefId"
            ></node-config-public>
            <div style="text-align: center">
                <img style="height: 250px" class="content-image" :src="imageDataSrc" v-show="imageDataSuccess" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="idVisibleDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>
<style lang="scss" scoped>
/deep/ .audaque-table-title__title-active {
    position: relative;
    margin-right: 35px;
    &:before {
        content: '';
        width: 100%;
        height: 2px;
        background: #5394eb;
        position: absolute;
        bottom: -12px;
    }
}

.operate {
    cursor: pointer;
}

/deep/ .data-permission {
    .el-dialog__body {
        /*max-height: 90% !important;*/
    }
}
</style>
<script>
import { mapActions } from 'vuex';
import API from '@/api/index';
import nodeConfigPublic from './nodeConfigPublic';

export default {
    data() {
        return {
            isSearch: false,
            param: {
                name: null,
                page: 1,
                rows: 10,
            },
            tableList: {
                tableList: [],
                total: 0,
            },
            activityName: 0, //默认待我审批
            titles: ['待我审批', '已审批'],
            idVisibleDialog: false,
            imageDataSrc: '',
            imageDataSuccess: true,
            activeProcDefId: null,
            ruleForm: {},
            suspendedObj: {
                null: '-',
                1: '运行中',
                2: '暂停',
            },
        };
    },
    created() {
        this.loadData();
    },
    components: { nodeConfigPublic },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            if (this.activityName === 0) {
                let params = Object.assign({}, this.param);
                params.categoryId = 3;
                this._AJAX({
                    url: 'activiti.task.list',
                    method: 'POST',
                    data: params,
                }).then((res) => {
                    if (res.code == 0) {
                        this.tableList = res.result;
                    }
                });
            } else {
                this._AJAX({
                    url: 'activiti.task.done',
                    method: 'POST',
                    data: this.param,
                }).then((res) => {
                    if (res.code == 0) {
                        this.tableList = res.result;
                    }
                });
            }
        },
        changeTableList(val) {
            this.param.page = 1;
            this.param.rows = 10;
            this.activityName = val;
            this.loadData();
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
                });
            }
            this.loadData();
        },
        changeStatus(row) {
            let _this = this;
            let status = row.isSuspended == 1 ? 0 : 1;
            this._AJAX({
                url: 'activiti.process.instance.status',
                method: 'POST',
                data: {
                    procInsId: row.procInstId,
                    status: status,
                },
            }).then((res) => {
                if (res.code == 0) {
                    _this.$AudaqueToast.tip({
                        template: status === 0 ? '激活成功' : '挂起成功',
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        del(row) {},
        /*查看*/
        view(row) {
            this.activeProcDefId = null;
            let _this = this;
            _this
                ._AJAX({
                    url: 'activiti.process.select.id',
                    method: 'GET',
                    data: {
                        bizCode: row.businessKey,
                    },
                })
                .then((res) => {
                    let result = res.result ? res.result : {};
                    this.ruleForm = result;
                    this.activeProcDefId = result.procDefId;
                    let url = API['activiti.models.img'] + '?procDefId=' + result.procDefId + '&t=' + Date.now();
                    this.imageDataSrc = url;
                    this.idVisibleDialog = true;
                });
        },
        /*预览*/
        preview(row) {
            let _this = this;
            this.$AudaqueToast.dialog({
                title: '流程图',
                className: '',
                width: '60%',
                data: {
                    imageDataSrc: '',
                    imageDataSuccess: true,
                    imageDataError: '',
                    hideCancel_a_d_q: true,
                    okBtnName: '确定',
                },
                mounted() {
                    let url = API['activiti.models.img'] + '?procInstId=' + row.procInstId + '&t=' + Date.now();
                    this.imageDataSrc = url;
                },
                template: `
                                 <div style="text-align:center">
                                <img style="min-height:280px" class="content-image" :src="imageDataSrc" v-show="imageDataSuccess"/>
                                <span v-show="!imageDataSuccess">{{ imageDataError }}</span>
                            </div>

                            `,
                methods: {
                    okEvent() {},
                },
            });
        },
        /*通过*/
        by(row) {
            const _this = this;
            this.$AudaqueToast.dialog({
                title: '通过',
                align: 'left',
                className: '',
                width: '650px',
                data: {
                    ruleForm: {
                        users: '',
                        comment: '',
                    },
                    rules: {
                        // users: [{trigger: 'change', required: true, message: '请选择审核人'}],
                        comment: [{ trigger: 'blur', required: true, message: '请输入审核意见' }],
                    },
                    byList: [],
                    isShowSh: true,
                },
                showFooter: false,
                mounted() {
                    _this
                        ._AJAX({
                            url: 'activiti.process.node.next',
                            method: 'POST',
                            data: {
                                procDefId: row.procDefId,
                                procInstId: row.procInstId,
                                currActId: row.key,
                            },
                        })
                        .then((res) => {
                            if (res.code == 0) {
                                if (res.result.type === 2 || res.result.type === 4) {
                                    this.isShowSh = false;
                                } else {
                                    this.isShowSh = true;
                                }
                                if (res.result.users && res.result.users.length > 0) {
                                    this.byList = res.result.users;
                                    /*默认全部选中*/
                                    res.result.users.forEach((item) => {
                                        this.ruleForm.users.push(item.id);
                                    });
                                } else {
                                    this.byList = [];
                                    this.$set(this.ruleForm, 'users', []);
                                }
                            }
                        })
                        .catch(() => {});
                },
                template: `
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
                                <el-form-item label="审核人" prop="users" v-if="isShowSh">
                                  <el-select v-model="ruleForm.users" placeholder="请选择" filterable multiple >
                                    <el-option :label="item.account" :value="item.id" v-for="item in byList"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                                </el-form-item>
                                <el-form-item label="审核意见" prop="comment">
                                  <el-input
                                    class="news-type-sys-introduction"
                                    type="textarea"
                                    autosize
                                    placeholder=""
                                    maxlength="100"
                                    show-word-limit
                                    v-model.trim="ruleForm.comment">
                                    </el-input>
                              </el-form-item>
                            </el-form>
                            <div name="footer" class="dialog-footer" style="text-align: right;">
                            <el-button v-if="!hideCancel_a_d_q" @click.stop="cancelEvent_a_d_q">取 消</el-button>
                            <el-button type="primary"  class="confirm"  @click.stop="okEvent_a_d_q" ><i class="el-icon-loading"></i>通过</el-button>
                            <el-button type="primary"  class="confirm"  @click.stop="turnDown" ><i class="el-icon-loading"></i>驳回发起人</el-button>
                        </div>
                        `,
                methods: {
                    /*驳回*/
                    turnDown() {
                        let _t = this;
                        this.$refs.ruleForm.validate((valid) => {
                            if (valid) {
                                _this
                                    ._AJAX({
                                        url: 'activiti.task.reject',
                                        method: 'POST',
                                        data: {
                                            id: row.id,
                                            comment: this.ruleForm.comment,
                                            pass: true,
                                        },
                                    })
                                    .then((res) => {
                                        if (res.code == 0) {
                                            _this.$AudaqueToast.tip({
                                                template: `操作成功`,
                                                methods: {
                                                    okEvent() {
                                                        _t.cancelEvent_a_d_q();
                                                        _this.loadData();
                                                    },
                                                },
                                            });
                                        }
                                    })
                                    .catch(() => {});
                            } else {
                                return false;
                            }
                        });
                    },
                    /*通过*/
                    okEvent() {
                        let pass = false;
                        this.$refs.ruleForm.validate((valid) => {
                            if (valid) {
                                _this
                                    ._AJAX({
                                        url: 'activiti.task.submit',
                                        method: 'POST',
                                        data: {
                                            id: row.id,
                                            comment: this.ruleForm.comment,
                                            pass: true,
                                        },
                                    })
                                    .then((res) => {
                                        if (res.code == 0) {
                                            _this.$AudaqueToast.tip({
                                                template: `操作成功`,
                                                methods: {
                                                    okEvent() {
                                                        _this.loadData();
                                                    },
                                                },
                                            });
                                        }
                                    })
                                    .catch(() => {});
                            } else {
                                pass = true;
                                return false;
                            }
                        });
                        return pass;
                    },
                    cancelEvent() {},
                },
            });
        },
        /*版本部署*/
        versionDeploy(row) {
            const _this = this;
            this.$AudaqueToast.dialog({
                title: '版本部署',
                align: 'left',
                className: '',
                width: '650px',
                data: {
                    ruleForm: {
                        version: [{ index: 1, account: '' }],
                    },
                    rules: {
                        version: [{ trigger: 'change', required: true, message: '请选择版本号' }],
                    },
                    versionList: [
                        { value: '1.0.0', label: '1.0.0' },
                        { value: '2.0.0', label: '2.0.0' },
                    ],
                },
                mounted() {},
                template: `
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
                                <el-form-item label="流程版本" prop="version">
                                  <el-select v-model="ruleForm.version" placeholder="请选择">
                                    <el-option :label="item.label" :value="item.value" v-for="item in versionList"
                                               :key="item.value">
                                    </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label=" ">
                                    <div style="text-align: left;line-height: 22px;">提示：已审批通过的流程，更换流程版本，需再次提交进行审批，待审批通过，更换了新流程版本的流程才可发布使用。</div>
                              </el-form-item>
                            </el-form>
                        `,
                methods: {
                    okEvent() {
                        let pass = false;
                        this.$refs.ruleForm.validate((valid) => {
                            if (valid) {
                                _this
                                    ._AJAX({
                                        url: 'org.setMyDeptManager',
                                        method: 'POST',
                                        data: {},
                                    })
                                    .then((res) => {
                                        if (res.code == 0) {
                                            _this.$AudaqueToast.tip({
                                                template: `部署成功`,
                                                methods: {
                                                    okEvent() {},
                                                },
                                            });
                                        }
                                    })
                                    .catch(() => {});
                            } else {
                                pass = true;
                                return false;
                            }
                        });
                        return pass;
                    },
                    cancelEvent() {},
                },
            });
        },
    },
};
</script>
