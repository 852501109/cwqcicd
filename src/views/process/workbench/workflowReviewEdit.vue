<template>
    <audaque-detail-form-page class="workflow-review-edit" title="查看我的待办" :opt-type="$route.query.optType">
        <el-tabs tab-position="left" v-model="activeName">
            <el-tab-pane label="基本信息" name="0">
                <el-form
                    :model="userInfoForm"
                    :rules="userInfoRules"
                    ref="userInfoForm"
                    label-width="110px"
                    id="updateNode0"
                    class="demo-ruleForm"
                >
                    <el-col :span="12">
                        <el-form-item label="业务" prop="categoryName">
                            <el-input disabled v-model.trim="userInfoForm.categoryName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流程名称" prop="processName">
                            <el-input disabled v-model.trim="userInfoForm.processName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="节点名称" prop="name">
                            <el-input disabled v-model.trim="userInfoForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请标题" prop="title">
                            <el-input disabled v-model.trim="userInfoForm.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发起人" prop="applyer">
                            <el-input disabled v-model.trim="userInfoForm.applyer"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="抄送人"
                            prop="ccInfo"
                            v-if="userInfoForm.ccInfo && userInfoForm.ccInfo.length > 0"
                        >
                            <div class="form-border">
                                {{ userInfoForm.ccInfo.join(',') }}
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发起人所属组织" prop="deptnames">
                            <el-input disabled v-model.trim="userInfoForm.deptnames"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发起时间" prop="startTime">
                            <el-input disabled v-model.trim="userInfoForm.startTime"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="状态" prop="suspended">
                            <!--待办页面进来-->
                            <div
                                v-if="pageType === 'upcoming'"
                                class="form-border"
                                v-html="$audaquePreventXss(suspendedObj[userInfoForm.suspended], $xssWhitelist)"
                            ></div>
                            <!--已办页面进来-->
                            <div v-else class="form-border">
                                {{ translation(reviewStatus, userInfoForm.result) }}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="表单信息" name="1">
                <template v-if="isShowFormItem">
                    <div>
                        <form-parser
                            id="updateNode1"
                            v-if="Object.keys(formConf).length > 0"
                            ref="formParser"
                            :key="key2"
                            @submit="submitForm"
                            :formConf="formConf"
                            :isDisabled="false"
                        ></form-parser>
                    </div>
                </template>
                <div v-else class="air-item">暂无表单信息!</div>
            </el-tab-pane>
            <el-tab-pane v-if="pageType === 'upcoming'" label="任务办理" name="2">
                <div class="operation-item">
                    <el-form
                        id="updateNode2"
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="110px"
                        label-position="top"
                        class="demo-ruleForm"
                        :disabled="activeData.suspended === 2"
                    >
                        <el-form-item label="审核意见" prop="comment">
                            <el-select
                                v-model="ruleForm.opinion"
                                placeholder="请选择"
                                clearable
                                class="opinion-line"
                                @change="switchOpinion"
                            >
                                <el-option label="同意" value="同意"></el-option>
                                <el-option label="同意**的意见" value="同意***的意见"></el-option>
                                <el-option label="请指示" value="请指示"></el-option>
                                <el-option label="请**阅示" value="请**阅示"></el-option>
                                <el-option label="请处理" value="请处理"></el-option>
                                <el-option label="不同意" value="不同意"></el-option>
                                <el-option label="呈领导阅示" value="呈领导阅示"></el-option>
                                <el-option label="请审批" value="请审批"></el-option>
                                <el-option label="审核无误" value="审核无误"></el-option>
                            </el-select>
                            <el-input
                                type="textarea"
                                placeholder=""
                                clearable
                                maxlength="70"
                                show-word-limit
                                v-model.trim="ruleForm.comment"
                                @change="changeContent"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            label="会签投票"
                            prop="type"
                            v-if="userInfoForm.countersign && userInfoForm.countersign > 0"
                        >
                            <el-radio-group v-model="ruleForm.type">
                                <el-radio label="true">通过票</el-radio>
                                <el-radio label="false">否决票</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="" prop="type" v-else>
                            <div class="pass-reject">
                                <el-radio-group v-model="ruleForm.type" @change="switchType">
                                    <el-radio label="pass" v-if="activeData.procCode != 'SYS_DATA_ANALYSIS'"
                                        >通过</el-radio
                                    >
                                    <el-radio label="reject">驳回</el-radio>
                                    <el-radio label="entrust">委办</el-radio>
                                    <el-radio label="select" v-if="activeData.procCode === 'SYS_DATA_ANALYSIS'"
                                        >选择节点</el-radio
                                    >
                                </el-radio-group>
                            </div>
                        </el-form-item>
                        <el-form-item label="抄送人" prop="selectedUserIds">
                            <adq-user-list-component
                                v-model="ruleForm.selectedUserIds"
                                :multiple="true"
                            ></adq-user-list-component>
                        </el-form-item>
                        <el-form-item v-if="ruleForm.type === 'pass' || ruleForm.type === 'select'" label="下一节点">
                            <el-select
                                :disabled="nextNodeIsDisabled"
                                v-model="ruleForm.backTaskSid"
                                placeholder="请选择"
                                @change="switchNode"
                                clearable
                                class="opinion-line"
                            >
                                <el-option
                                    v-for="(item, index) in nodeData"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.nodeId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="ruleForm.type === 'reject'" label="下一节点" prop="backTaskSid">
                            <el-select
                                v-if="ruleForm.type === 'reject'"
                                v-model="ruleForm.backTaskSid"
                                placeholder="请选择"
                                clearable
                                class="opinion-line"
                            >
                                <el-option
                                    v-for="(item, index) in nodeData"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="指定下一操作人"
                            prop="userIds"
                            v-if="(ruleForm.type === 'pass' && isshowSelect) || ruleForm.type === 'select'"
                        >
                            <adq-user-list-component
                                v-model="ruleForm.userIds"
                                :multiple="true"
                            ></adq-user-list-component>
                        </el-form-item>

                        <el-form-item label="委派用户" prop="assigneeId" v-if="ruleForm.type === 'entrust'">
                            <adq-user-list-component
                                v-model="ruleForm.assigneeId"
                                :multiple="false"
                            ></adq-user-list-component>
                        </el-form-item>
                        <el-form-item label=" ">
                            <div class="submit-line">
                                <el-button
                                    type="primary"
                                    @click="submit"
                                    :loading="isSHowButtonLoading"
                                    :disabled="activeData.suspended === 2"
                                    >提交</el-button
                                >
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审核历史" name="3">
                <process-info-component
                    id="updateNode3"
                    v-if="activeName === '3'"
                    :procInstId="activeData.procInstId"
                    :procDefId="activeData.procDefId"
                ></process-info-component>
            </el-tab-pane>
        </el-tabs>
     <!--   <template slot="bottom" v-if="activeName != 2">
            &lt;!&ndash;            <el-button type="primary" @click="$refs.formParser.submitForm()" v-if="activeName == 1">提交</el-button>&ndash;&gt;
            <el-button type="primary" @click="handleDown">导出流程信息</el-button>
        </template>
        &lt;!&ndash;隐藏的节点做导出Pdf用&ndash;&gt;
        <div id="copyFormNode" style="position: absolute; width: 100%; right: 99999px; top: 99999px"></div>-->
    </audaque-detail-form-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import processInfoComponent from '../modules/processInfoComponent';
import API from '@/api/index';
import { fillFormData } from '@/components/form/formPublic';
import htmlToPdf from '@/utils/modules/htmlToPdf';
import { reviewStatus } from '@/views/process/workbench/workflowTypes';
export default {
    data() {
        return {
            initedFileUUIDs: [],
            taskId: this.$route.query.id,
            pageType: this.$route.query.pageType, //upcoming  待办  done  已办
            ruleForm: {},
            rules: {
                comment: { required: true, message: '请输入审核意见', trigger: ['blur', 'change'] },
                type: { required: true, message: '请选择操作的类型', trigger: 'change' },
                assigneeId: { required: true, message: '请指定委派人', trigger: 'change' },
                backTaskSid: { required: true, message: '请选择下一节点处理人', trigger: 'change' },
            },
            nodeData: [],
            activeNodeData: {},
            activeNodeVariables: {},
            operationData: [],
            key2: +new Date(),
            formConf: {},
            activeName: '0',
            activeData: {},
            userInfoForm: {},
            userInfoRules: {},
            suspendedObj: {
                null: '<span>-</span>',
                1: '<span>运行中</span>',
                2: '<span style="color: red">暂停</span>',
            },
            isshowSelect: true,
            nextNodeIsDisabled: false,
            dataMapStr: null,
            isShowFormItem: true,
            tabsNames: {
                0: '基本信息',
                1: '表单信息',
                2: '任务办理',
                3: '审核历史',
            },
            reviewStatus,
        };
    },
    computed: {
        ...mapState(['_userList']),
    },
    components: {
        processInfoComponent,
    },
    created() {
        if (this.taskId) {
            this.init();
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        submitForm(data) {
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'activiti.biz.update',
                method: 'POST',
                data: {
                    tableName: this.activeData.tableName,
                    dataMap: data,
                    rowId: this.activeData.businessKey,
                    bizCode: this.activeData.businessKey,
                    id: '',
                },
            }).then((res) => {
                this.$AudaqueToast.tip({
                    template: `编辑成功`,
                    methods: {
                        okEvent() {},
                    },
                });
            });
        },
        /*翻译*/
        translation(data, value) {
            if (value != null) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].value === value) {
                        return data[i].label;
                    }
                }
            } else {
                return '-';
            }
        },
        /*获取基本信息和表单的回显信息*/
        init() {
            this._AJAX({
                url: this.pageType === 'upcoming' ? 'activiti.task.todo.id' : 'activiti.task.done.id',
                method: 'GET',
                data: { taskId: this.taskId },
            }).then((res) => {
                if (res.code === 0) {
                    this.activeData = res.result;
                    this.userInfoForm = res.result; //基本信息
                    /*处理抄送人字段*/
                    if (this.userInfoForm.ccInfo) {
                        this.userInfoForm.ccInfo = this.userInfoForm.ccInfo.map((item) => {
                            return item.username;
                        });
                    } else {
                        this.userInfoForm.ccInfo = [];
                    }
                    if (res.result.dataMapStr) {
                        let dataMap = JSON.parse(res.result.dataMapStr);
                        //dataMapKeys=dataMap.; //表单的回显数据
                        this.dataMapStr = dataMap;
                        //this.initedFileUUIDs=
                    }
                    this.loadFormInfo();
                }
            });
        },
        /*获取表单信息*/
        loadFormInfo() {
            if (this.activeData.formId) {
                this.isShowFormItem = true;
                let url = API['form.design.select'] + '/' + this.activeData.formId;
                this._AJAX({
                    url: url,
                    method: 'GET',
                    data: {},
                }).then((res) => {
                    if (res.code === 0) {
                        this.formConf = JSON.parse(res.result.formJson);
                        //initedFileUUIDs
                        //this.formConf.disabled = true; //禁用表单
                        if (this.dataMapStr) {
                            //除上传外都不可编辑
                            let fields = this.formConf.fields.map((item) => {
                                if (item.__config__.tag === 'el-upload') {
                                    item.disabled = false;
                                } else {
                                    item.disabled = true;
                                }
                                if (item.__config__.tag === 'el-tree') {
                                    item['show-checkbox'] = false;
                                }
                                return item;
                            });

                            fillFormData.call(this, fields, this.dataMapStr, this.formConf);

                            //更新表单;
                            this.key2 = +new Date();
                        }
                    }
                });
            } else {
                this.isShowFormItem = false;
            }
        },
        /*处理意见列表*/
        switchOpinion(val) {
            let comment = val;
            this.$set(this.ruleForm, 'comment', comment);
        },
        /*下拉处理意见触发*/
        changeContent(val) {
            this.ruleForm.content = this.ruleForm.opinion + val;
        },
        /*切换通过、驳回、委办、选择节点*/
        switchType(val) {
            this.nodeData = [];
            this.$set(this.ruleForm, 'backTaskSid', '');
            this.$refs['ruleForm'].clearValidate(); //清除校验信息
            if (val === 'pass' || val === 'select') {
                //通过   选取节点
                this._AJAX({
                    url: val === 'pass' ? 'activiti.process.node.next' : 'activiti.process.node.next.all',
                    method: 'POST',
                    data: {
                        currActId: this.activeData.key,
                        procDefId: this.activeData.procDefId,
                        procInstId: this.activeData.procInstId,
                    },
                }).then((res) => {
                    if (res.result && res.result.length > 0) {
                        this.nodeData = res.result;
                        this.nodeData.forEach((item) => {
                            item.name = item.name || ' ';
                            this.activeNodeData[item.nodeId] = { users: item.users, variables: item.variables };
                        });
                        this.$set(this.ruleForm, 'backTaskSid', res.result[0].nodeId); //默认选中第一个
                        this.switchNode(res.result[0].nodeId); //选中第一个后全选一下指定操作人
                    }
                });
            } else if (val === 'reject') {
                //驳回
                this._AJAX({
                    url: 'activiti.task.back.nodes',
                    method: 'GET',
                    data: {
                        procInstId: this.activeData.procInstId,
                        taskId: this.taskId,
                    },
                }).then((res) => {
                    if (res.result && res.result.length > 0) {
                        this.nodeData = res.result;
                        this.$set(this.ruleForm, 'backTaskSid', res.result[0].key);
                    }
                    this.nodeData.push({ name: '发起人', key: 'sponsor' }); //插入一条驳回至发起人的数据
                });
            } else if (val === 'entrust') {
                //委派
            }
        },
        /*通过、选择节点、 选择下一节点*/
        switchNode(val) {
            this.isshowSelect = true; //显示指定下一操作人
            this.nextNodeIsDisabled = false; //下一节点不允许选择
            //当前节点是结束节点时不显示指定下一操作人
            this.nodeData.forEach((item) => {
                if (item.nodeId === val && item.type === 2) {
                    this.isshowSelect = false;
                    // this.nextNodeIsDisabled = true;
                }
            });

            this.$set(this.ruleForm, 'userIds', []);
            /*指定下一操作人 id的集合*/
            this.operationData = [];
            this.operationData =
                this.activeNodeData[val].users &&
                this.activeNodeData[val].users.map((item) => {
                    return item.id;
                });

            /*所有用户id的集合*/
            let userIds = this._userList.map((item) => {
                return item.id;
            });
            /*默认选中下一操作人*/
            //如果列表中没有该id就删除不然会直接显示id
            this.ruleForm.userIds = this.operationData.filter((item) => userIds.indexOf(item) != -1);
            this.activeNodeVariables = this.activeNodeData[val].variables;
        },
        handleDown() {
            htmlToPdf.loadNode(
                document.querySelector('#updateNode' + this.activeName),
                this.userInfoForm.title + '_' + this.tabsNames[this.activeName]
            );
        },
        /*提交*/
        submit() {
            let _this = this;
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    //通过、选择节点、
                    this.$store.commit('SHOW_LOADING', true);
                    if (this.ruleForm.type === 'pass' || this.ruleForm.type === 'select') {
                        this._AJAX({
                            url: 'activiti.task.submit',
                            method: 'POST',
                            data: {
                                id: this.taskId,
                                userIds: this.ruleForm.userIds,
                                comment: this.ruleForm.comment,
                                variables: this.activeNodeVariables,
                                procDefId: this.activeData.procDefId,
                                ccUid: this.ruleForm.selectedUserIds,
                            },
                        }).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `操作成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                        /*通过票、否决票*/
                    } else if (this.ruleForm.type === 'true' || this.ruleForm.type === 'false') {
                        this._AJAX({
                            url: 'activiti.task.submit',
                            method: 'POST',
                            data: {
                                id: this.taskId,
                                userIds: this.ruleForm.userIds,
                                comment: this.ruleForm.comment,
                                variables: this.activeNodeVariables,
                                procDefId: this.activeData.procDefId,
                                pass: this.ruleForm.type,
                                ccUid: this.ruleForm.selectedUserIds,
                            },
                        }).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `操作成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    } else if (this.ruleForm.type === 'reject') {
                        //驳回
                        let params = null;
                        if (this.ruleForm.backTaskSid === 'sponsor') {
                            //驳回至发起人
                            params = {
                                id: this.taskId,
                                comment: this.ruleForm.comment,
                                ccUid: this.ruleForm.selectedUserIds,
                            };
                        } else {
                            params = {
                                id: this.taskId,
                                comment: this.ruleForm.comment,
                                procInstId: this.activeData.procInstId,
                                procDefId: this.activeData.procDefId,
                                backTaskSid: this.ruleForm.backTaskSid,
                                ccUid: this.ruleForm.selectedUserIds,
                            };
                        }
                        this._AJAX({
                            url: 'activiti.task.back.task',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `操作成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    } else if (this.ruleForm.type === 'entrust') {
                        /*委派*/
                        this._AJAX({
                            url: 'activiti.task.delegate',
                            method: 'POST',
                            data: {
                                id: this.taskId,
                                procInstId: this.activeData.procInstId,
                                assigneeId: this.ruleForm.assigneeId,
                                comment: this.ruleForm.comment,
                                ccUid: this.ruleForm.selectedUserIds,
                            },
                        }).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `操作成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
<style scoped lang="scss">
/deep/ .el-tabs {
    height: 100% !important;
    .el-tabs__content {
        height: 100%;
        overflow: auto;
    }
    .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: 100%;
        .operation-item {
            height: 100%;
            text-align: left !important;
            .el-form-item__label {
                padding: 0;
                font-weight: 600;
            }
        }
        .submit-line {
            margin-top: 25px;
            .el-button {
                padding: 8px 20px;
            }
        }
        .opinion-line {
            margin-bottom: 10px;
        }

        .pass-reject {
            display: flex;
            flex-direction: row;
            .el-select {
                width: 300px;
                margin-left: 30px;
            }
            .el-radio-group {
                position: relative;
                top: 10px;
            }
        }
    }
}
.form-border {
    background-color: #f5f7fa;
    color: #c0c4cc;
    padding: 5px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    word-break: break-all;
    line-height: 25px;
}
.air-item {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
}
/deep/#copyFormNode .tinymce-editor,
/deep/#copyFormNode .el-textarea {
    border: 1px solid #ccc;
    padding: 10px;
}
/deep/.download-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding: 0 0 15px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}
</style>
