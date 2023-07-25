<template>
    <div class="process-config-edit">
        <div style="color: #67c23a; margin-bottom: 15px; text-align: center" v-if="optType !== 'view'">
            请确定已经提交了当前步骤的数据
        </div>
        <el-steps :active="stepsActive" finish-status="success" class="my-steps">
            <el-step
                v-for="(item, index) in stepsList"
                :key="index"
                @click.native="clcikStep(item, index + 1)"
                :title="item.name"
            >
            </el-step>
        </el-steps>
        <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="90px" :disabled="isView">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="节点名称">
                        <el-input v-model.trim="ruleForm.name" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务类型">
                        <el-input v-model.trim="ruleForm.nodeTypeName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="stepsData.nodeType === 1">
                    <el-form-item label="节点类型" prop="approveType">
                        <el-radio-group v-model="ruleForm.approveType">
                            <el-radio :label="-1">内部节点</el-radio>
                            <!--                            <el-radio :label="-2">外部节点</el-radio>-->
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <!--内部节点-->
                <template v-if="stepsData.nodeType === 1 && ruleForm.approveType === -1">
                    <el-col :span="24" class="linkHandler">
                        <el-form-item label="环节处理人" prop="type">
                            <el-col :span="12" style="border-right: 1px solid #dcdfe6">
                                <div class="line-name">基础服务</div>
                                <el-checkbox
                                    v-model="ruleForm.userCheck"
                                    @change="
                                        (val) => {
                                            checkChange(val, 0);
                                        }
                                    "
                                    >指定用户</el-checkbox
                                >
                                <el-checkbox
                                    v-model="ruleForm.roleCheck"
                                    @change="
                                        (val) => {
                                            checkChange(val, 1);
                                        }
                                    "
                                    :disabled="ruleForm.intersectionChoose"
                                    >指定职位标签</el-checkbox
                                >
                                <el-checkbox
                                    v-model="ruleForm.departmentCheck"
                                    @change="
                                        (val) => {
                                            checkChange(val, 2);
                                        }
                                    "
                                    :disabled="ruleForm.intersectionChoose"
                                    >指定部门</el-checkbox
                                >
                                <el-checkbox v-model="ruleForm.depChoose">发起人部门负责人</el-checkbox>
                                <el-checkbox v-model="ruleForm.personalChoose">发起人</el-checkbox>
                                <el-checkbox v-model="ruleForm.departmentChoose">发起人所在部门</el-checkbox>
                                <el-checkbox
                                    v-model="ruleForm.intersectionChoose"
                                    @change="
                                        (val) => {
                                            checkChange(val, 11);
                                        }
                                    "
                                    >部门与标签结合取交集</el-checkbox
                                >
                            </el-col>
                            <el-col :span="12">
                                <div class="line-name">拓展服务</div>
                                <el-checkbox v-model="ruleForm.bizMatch">根据业务自动匹配人员</el-checkbox>
                                <el-checkbox v-model="ruleForm.sourceChoose">资源所在部门负责人</el-checkbox>
                                <el-checkbox v-model="ruleForm.sourceDepChoose">资源所在部门</el-checkbox>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="ruleForm.userCheck">
                        <el-form-item label="用户" prop="userIds">
                            <adq-user-list-component
                                v-model="ruleForm.userIds"
                                :multiple="true"
                            ></adq-user-list-component>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="ruleForm.roleCheck || ruleForm.intersectionChoose">
                        <el-form-item label="职位标签" prop="roleIds">
                            <el-select v-model="ruleForm.roleIds" placeholder="请选择" multiple filterable>
                                <el-option :label="item.name" :value="item.id" v-for="item in tagList" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="ruleForm.departmentCheck || ruleForm.intersectionChoose">
                        <el-form-item label="部门" prop="departmentIds">
                            <adq-tree ref="tree" :defaultCheckedKeys="defaultCheckedKeys" :check-strictly="true">
                            </adq-tree>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="节点期限" prop="days" class="node-the-term">
                            <el-input
                                placeholder="请输正整数"
                                v-model.number="ruleForm.days"
                                maxlength="3"
                                @change="ruleForm.remind = null"
                                oninput="value=value.replace(/[^\d]+/g,'')"
                                class="input-with-select"
                            >
                                <template slot="append">
                                    <el-select v-model="ruleForm.isWeekdays" slot="prepend" placeholder="请选择">
                                        <el-option label="个工作日" :value="1"></el-option>
                                        <el-option label="个自然日" :value="0"></el-option>
                                    </el-select>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="催办提醒" prop="remind">
                            <el-select v-model="ruleForm.remind" placeholder="请选择">
                                <el-option label="12小时前" :value="12"></el-option>
                                <el-option label="1天前" v-if="ruleForm.days >= 1" :value="24"></el-option>
                                <el-option label="2天前" v-if="ruleForm.days >= 2" :value="48"></el-option>
                                <el-option label="3天前" v-if="ruleForm.days >= 3" :value="72"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="approve-method-item">
                        <el-form-item label="审批方式" prop="countersign">
                            <el-checkbox v-model="ruleForm.approveMethod" @change="checkCountersign">会签</el-checkbox>
                            <!--                        <el-checkbox-group v-model="ruleForm.approveMethod" @change="checkCountersign">-->
                            <!--                            <el-checkbox label="1">会签</el-checkbox>-->
                            <!--                        </el-checkbox-group>-->
                            <el-input
                                v-if="isCheckCountersign"
                                placeholder="请输入正整数"
                                oninput="value=value.replace(/[^\d]+/g,'')"
                                v-model.number="ruleForm.countersign"
                                class="percentage"
                                @change="countersignChange"
                            >
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="stepsData.nodeType === 1 && isCheckCountersign">
                        <el-form-item label="否决走向" prop="countersignType">
                            <el-radio v-model="ruleForm.countersignType" :label="0">进入下一节点</el-radio>
                            <el-radio v-model="ruleForm.countersignType" :label="1">流程结束</el-radio>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
            <!--外部节点-->
            <template v-if="stepsData.nodeType === 1 && ruleForm.approveType === -2">
                <el-col :span="24">
                    <el-form-item label="审批链接" prop="pushUrl">
                        <el-input v-model.trim="ruleForm.pushUrl"></el-input>
                    </el-form-item>
                </el-col>
            </template>
        </el-form>
    </div>
</template>
<style lang="scss" scoped>
.process-config-edit {
    /deep/ .my-steps {
        margin-bottom: 20px;
    }
    /deep/.node-the-term {
        .el-select {
            display: inline-block;
            width: 120px;
        }
        .el-input-group__append {
            padding: 0 10px;
        }
    }
    .approve-method-item {
        /deep/.el-checkbox-group {
            width: 60px;
            display: inline-block;
            margin-right: 15px;
        }
        /deep/.percentage {
            margin-left: 15px;
            width: calc(100% - 75px);
        }
    }
    /deep/.linkHandler .el-form-item__content {
        border: 1px solid #dcdfe6;
    }
    .linkHandler .line-name {
        line-height: 15px;
        padding: 5px 0;
    }
}
</style>
<script>
import { mapActions, mapState } from 'vuex';
import adqTree from '@/components/adqTree';

export default {
    name: 'procesNodeConfig',
    components: { adqTree },
    props: {
        procDefId: null,
        optType: {
            type: String,
            default: '',
        },
    },
    computed: {
        ...mapState(['_userList']),
    },
    data() {
        return {
            preview: '',
            ruleForm: {
                type: [],
                userIds: [],
                roleIds: [],
                departmentIds: [],
                days: 0,
                isWeekdays: 1,
                approveMethod: false,
                countersignType: 0,
            },
            rules: {
                code: [{ required: true, message: '类型编号不能为空', trigger: 'blur' }],
                countersign: [{ required: false, validator: this.validatorNum, trigger: 'change' }],
                pushUrl: [{ required: true, trigger: 'blur', validator: this.validatorUrl }],
            },
            isView: false,
            stepsList: [],
            stepsActive: 0,
            stepsData: {},
            userList: [],
            userTotal: 0,
            tagList: [],
            tagids: [],
            deptList: [],
            defaultCheckedKeys: [],
            loading: false,
            params: {
                page: 1,
                rows: 200,
                name: null,
            },
            isCheckCountersign: false, //是否选择会签
        };
    },
    created() {
        if (this.procDefId) {
            this.loadData();
            /*获得流程步骤*/
            this.loadStepData();
        }
        if (this.optType === 'view') {
            this.isView = true;
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        loadData() {
            /*标签列表*/
            this._AJAX({
                url: 'webkit.tagList',
                method: 'GET',
                data: {},
            }).then((res) => {
                if (res.code == 0) {
                    this.tagList = res.result;
                    /*标签id的集合*/
                    this.tagIds = res.result;
                    this.tagIds = this.tagIds.map((item) => {
                        return item.id;
                    });
                }
            });
        },
        /*获得流程步骤*/
        loadStepData() {
            this._AJAX({
                url: 'activiti.process.node',
                method: 'POST',
                data: { procDefId: this.procDefId },
            }).then((res) => {
                if (res.code == 0) {
                    this.stepsList = res.result;
                    if (this.stepsActive === 0) {
                        this.ruleForm.name = res.result[0].name;
                        this.ruleForm.nodeTypeName = '开始节点';
                        this.$emit('get-opt-type', 'view'); //隐藏提交按钮
                    }
                }
            });
        },
        /*校验只能输入正整数*/
        validatorNum(rule, value, callback) {
            if (value > 100 || value < 0) {
                callback(new Error('请输入一百以内的正整数'));
            } else {
                callback();
            }
        },
        validatorUrl(rule, value, callback) {
            let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/;
            if (!value) {
                callback(new Error('链接不能为空'));
            } else if (!reg.test(value)) {
                callback(new Error('不是合法的链接'));
            } else {
                callback();
            }
        },
        countersignChange(val) {
            if (val) {
                this.ruleForm.approveMethod = true; //选中会签框
            } else {
                this.ruleForm.approveMethod = false;
            }
        },
        checkCountersign(val) {
            if (!val || val.length === 0) {
                this.ruleForm.countersign = null;
                this.isCheckCountersign = false; //隐藏会签的相关配置
            } else {
                this.isCheckCountersign = true; //显示会签的相关配置
            }
        },
        /*点击步骤*/
        clcikStep(item, index) {
            if (index === this.stepsActive) return;
            this.ruleForm.approveType = -1; //节点类型默认选中 内部节点
            this.isCheckCountersign = false; //隐藏会签的相关配置
            this.getStepData(item, index);
        },
        getStepData(item, index) {
            this.stepsData = item;
            this.stepsActive = index;
            this.$refs.formRef.resetFields(); //重置表单
            this.defaultCheckedKeys = [];
            this.ruleForm = Object.assign({}, item);
            this.$set(this.ruleForm, 'userCheck', false);
            this.$set(this.ruleForm, 'roleCheck', false);
            this.$set(this.ruleForm, 'departmentCheck', false);
            if (this.$refs.tree) {
                this.$refs.tree.$refs.adqTree.setCheckedKeys([]);
            }

            if (item.nodeType == 1) {
                if (this.optType === 'add') {
                    this.$emit('get-opt-type', 'add'); //显示提交按钮行
                } else {
                    this.$emit('get-opt-type', 'view'); //隐藏提交按钮行
                }
                // 回显  节点类型
                if (item.pushUrl) {
                    this.$set(this.ruleForm, 'approveType', -2);
                } else {
                    this.$set(this.ruleForm, 'approveType', -1);
                }
                this.ruleForm.isWeekdays = item.isWeekdays || 1; //回显 节点期限(如果没有值的话默认选中工作日)
                this.$set(this.ruleForm, 'countersignType', item.countersignType || 0); //默认进入下一节点
                /*回显审批方式   有值就选中*/
                if (item.countersign) {
                    this.ruleForm.approveMethod = true;
                    this.isCheckCountersign = true; //显示会签的相关配置
                }
                /*
                 * 用户回显
                 * */
                if (item.userIds && item.userIds.length > 0) {
                    this.$set(this.ruleForm, 'userCheck', true);
                    this.ruleForm.userIds = item.userIds.split(',').map(Number);
                    if (this._userList && this._userList.length > 0) {
                        /*
                         * 所有用户的id集合
                         * */
                        let users = this._userList.map((item) => {
                            return item.id;
                        });
                        //如果列表中没有该id就删除不然会直接显示id
                        this.ruleForm.userIds = this.ruleForm.userIds.filter(
                            (item) => users.indexOf(Number(item)) != -1
                        );
                    }
                }
                /*
                 * 回显标签
                 * */
                this.ruleForm.roleIds = item.roleIds ? item.roleIds.split(',').map(Number) : [];
                //如果列表中没有该id就删除不然会直接显示id
                this.ruleForm.roleIds = this.ruleForm.roleIds.filter((item) => this.tagIds.indexOf(Number(item)) != -1);
                this.defaultCheckedKeys = item.departmentIds ? item.departmentIds.split(',').map(Number) : []; //回显部门
                if (item.roleIds && item.roleIds.length > 0 && !item.intersectionChoose) {
                    this.$set(this.ruleForm, 'roleCheck', true);
                }
                if (item.departmentIds && item.departmentIds.length > 0 && !item.intersectionChoose) {
                    this.$set(this.ruleForm, 'departmentCheck', true);
                }
            } else {
                this.$emit('get-opt-type', 'view');
            }
            this.ruleForm.nodeTypeName =
                item.nodeType === 0 ? '开始节点' : item.nodeType === 1 ? '任务节点' : '结束节点';
        },
        checkChange(ischeck, type) {
            if (ischeck) {
                if (type === 11) {
                    //当选择的是 部门与标签结合取交集 时指定职位标签、指定部门的值清空并禁用
                    this.$set(this.ruleForm, 'roleCheck', false);
                    this.$set(this.ruleForm, 'departmentCheck', false);
                }
            } else {
                if (type === 0) {
                    this.$set(this.ruleForm, 'userIds', []);
                }
                if (type === 1) {
                    this.$set(this.ruleForm, 'roleIds', []);
                }
                if (type === 2) {
                    if (this.$refs.tree) {
                        this.$refs.tree.$refs.adqTree.setCheckedKeys([]);
                    }
                }
            }
        },
        //指定的属性值为null时置为false 不然提交会报错
        nullResetFalse(obj) {
            let resetFalseS = [
                'depChoose',
                'bizMatch',
                'sourceChoose',
                'sourceDepChoose',
                'personalChoose',
                'departmentChoose',
                'intersectionChoose',
            ];
            Object.keys(obj).forEach((item) => {
                if (resetFalseS.indexOf(item) != -1 && !obj[item] && typeof obj[item] != 'undefined' && obj[item] != 0)
                    obj[item] = false;
            });
            return obj;
        },
        submitForm() {
            this.$refs['formRef'].validate((valid) => {
                //内部节点
                if (this.ruleForm.approveType === -1) {
                    this.$set(this.ruleForm, 'pushUrl', null);
                }
                let _this = this,
                    _ruleForm = Object.assign({}, this.ruleForm),
                    dep = null;
                if (this.$refs.tree) {
                    dep = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                }
                let params = Object.assign(_ruleForm, {
                    userIds: _ruleForm.userIds ? _ruleForm.userIds.join(',') : null,
                    roleIds: _ruleForm.roleIds ? _ruleForm.roleIds.join(',') : null,
                    departmentIds: (_ruleForm.dep = dep ? dep.join(',') : null),
                    procDefId: this.procDefId,
                });
                params = this.nullResetFalse(params);

                if (params.approveMethod && !params.countersign) {
                    return _this.$AudaqueToast.error({
                        template: `请输入会签通过率`,
                        methods: {
                            okEvent() {},
                        },
                    });
                    // return false;
                }
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    this._AJAX({
                        url: 'activiti.process.node.edit',
                        method: 'POST',
                        data: params,
                    }).then((res) => {
                        if (res.code == 0) {
                            _this.$AudaqueToast.tip({
                                template: `配置成功`,
                                methods: {
                                    okEvent() {
                                        _this.loadStepData();
                                    },
                                },
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
