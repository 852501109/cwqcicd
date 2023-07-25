<!-- 用户编辑-->
<template>
    <audaque-detail-form-page @submit-click="submit" :title="operateName" :opt-type="optType" class="user-edit">
        <template>
            <!--逻辑租户环境下面-->
            <el-form
                v-if="defTenant != 0"
                ref="ruleform"
                :model="form"
                label-width="120px"
                :rules="rules"
                class="form-item"
                :disabled="optType === 'view'"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户姓名" prop="userId">
                            <adq-user-list-component
                                :disabled="optType != 'add'"
                                v-model="form.userId"
                                :multiple="false"
                                :userParams="userParams"
                            ></adq-user-list-component>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色" prop="roles">
                            <el-select v-model="form.roles" placeholder="请选择" style="width: 100%" multiple clearable>
                                <el-option
                                    :label="item.name"
                                    :value="item.id"
                                    v-for="item in roleList"
                                    :key="item.name"
                                >
                                    <span
                                        :title="item.disabled ? '没有权限删除该角色' : ''"
                                        :style="{ color: item.disabled ? '#c0c4cc' : '#606266' }"
                                        >{{ item.name }}</span
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="optType != 'add'">
                        <el-form-item label="主部门" prop="mainDeptId">
                            <el-select v-model="form.mainDeptId" placeholder="请选择" clearable style="width: 100%">
                                <el-option
                                    :label="item.name"
                                    :value="item.id"
                                    v-for="item in form.myDept"
                                    :key="item.name"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="!isCluster">
                    <el-col :span="24">
                        <el-form-item label="功能权限">
                            <el-tree
                                class="resource"
                                :data="resourceList"
                                show-checkbox
                                node-key="value"
                                ref="tree"
                                highlight-current
                                :default-checked-keys="myResource"
                                :props="defaultProps"
                            >
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="$route.query.userId">
                    <el-col :span="24">
                        <el-form-item label="所在部门">
                            <el-table
                                highlight-current-row
                                ref="deptListTable"
                                :data="form.myDept"
                                :border="true"
                                style="width: 100%"
                            >
                                <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
                                <el-table-column show-overflow-tooltip label="部门名称">
                                    <template slot-scope="scope">{{ scope.row.name }}</template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="上一级部门">
                                    <template slot-scope="scope">{{ scope.row.parentName }}</template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--                <el-row v-if="optType != 'view'">-->
                <!--                    <el-col :span="24">-->
                <!--                        <el-form-item label="">-->
                <!--                            <el-checkbox @change="isUnderstandingFun" v-model="isUnderstanding"-->
                <!--                                ><span :class="{ agree: isVariety }">已阅读</span></el-checkbox-->
                <!--                            >-->
                <!--                            <a style="color: #3a8ee6" target="_blank" :href="privacyHref">《隐私条例》</a>-->
                <!--                        </el-form-item>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->
            </el-form>

            <el-form
                v-else
                ref="ruleform"
                :model="form"
                label-width="120px"
                :rules="rules"
                :disabled="optType === 'view'"
                class="form-item"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户账号" prop="account">
                            <el-input
                                v-model.trim="form.account"
                                :disabled="optType != 'add'"
                                :maxlength="userMaxLength"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input
                                v-model.trim="form.name"
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model.trim="form.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model.trim="form.phone" maxlength="11" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="角色" prop="roles">
                            <el-select v-model="form.roles" placeholder="请选择" style="width: 100%" multiple clearable>
                                <el-option
                                    :label="item.name"
                                    :value="item.id"
                                    v-for="item in roleList"
                                    :key="item.name"
                                >
                                    <span
                                        :title="item.disabled ? '没有权限删除该角色' : ''"
                                        :style="{ color: item.disabled ? '#c0c4cc' : '#606266' }"
                                        >{{ item.name }}</span
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!--                    <el-col :span="12">-->
                    <!--                        <el-form-item label="身份证" prop="idCardNo">-->
                    <!--                            <el-input v-model.trim="form.idCardNo" clearable maxlength="18" show-word-limit></el-input>-->
                    <!--                        </el-form-item>-->
                    <!--                    </el-col>-->
                    <el-col :span="12" v-if="optType != 'add'">
                        <el-form-item label="主部门" prop="mainDeptId">
                            <el-select v-model="form.mainDeptId" placeholder="请选择" clearable style="width: 100%">
                                <el-option
                                    :label="item.name"
                                    :value="item.id"
                                    v-for="item in form.myDept"
                                    :key="item.name"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="!isCluster">
                    <el-col :span="24">
                        <el-form-item label="功能权限">
                            <el-tree
                                class="resource"
                                :data="resourceList"
                                show-checkbox
                                node-key="value"
                                ref="tree"
                                highlight-current
                                :default-checked-keys="myResource"
                                :props="defaultProps"
                            >
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="$route.query.userId">
                    <el-col :span="24">
                        <el-form-item label="所在部门">
                            <el-table
                                highlight-current-row
                                ref="deptListTable"
                                :data="form.myDept"
                                :border="true"
                                style="width: 100%"
                            >
                                <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
                                <el-table-column show-overflow-tooltip label="部门名称">
                                    <template slot-scope="scope">{{ scope.row.name }}</template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="上一级部门">
                                    <template slot-scope="scope">{{ scope.row.parentName }}</template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--                <el-row v-if="optType != 'view'">-->
                <!--                    <el-col :span="24">-->
                <!--                        <el-form-item label="">-->
                <!--                            <el-checkbox @change="isUnderstandingFun" v-model="isUnderstanding"-->
                <!--                                ><span :class="{ agree: isVariety }">已阅读</span></el-checkbox-->
                <!--                            >-->
                <!--                            <a style="color: #3a8ee6" target="_blank" :href="privacyHref">《隐私条例》</a>-->
                <!--                        </el-form-item>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

let phoneSupport = false;
let emailSupport = false;
let idCardNoSupport = false;
export default {
    data() {
        return {
            form: {
                userId: null,
                account: '',
                name: '',
                email: '',
                phone: '',
                mainDeptId: null,
                roles: [],
                myDept: [],
            },
            rules: {
                account: [{ required: true, trigger: ['blur', 'change'], validator: this.validateUsername }],
                userId: [{ required: true, trigger: 'change', validator: this.validateUsername }],
                name: [{ trigger: 'blur', required: true, message: '姓名不能为空' }],
                idCardNo: [
                    { required: idCardNoSupport, message: '身份证号码不能为空', trigger: 'blur' },
                    {
                        pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[Xx])$/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur',
                    },
                    {
                        validator: (rule, value, callback) => {
                            this.$utils.idCardValidity(rule, value, callback, idCardNoSupport);
                        },
                        trigger: 'blur',
                    },
                ],
                email: [
                    {
                        trigger: 'blur',
                        required: emailSupport,
                        validator: (rule, value, callback) => {
                            if ((!emailSupport && !value) || /\*/.test(value)) {
                                //脱敏后带*的数据直接不校验
                                callback();
                                return;
                            }
                            if (!value) {
                                callback(new Error('邮箱不能为空'));
                            } else if (!/\w+@\w+\.\w+/.test(value)) {
                                callback(new Error('输入的不是有效的邮箱格式'));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                phone: [
                    {
                        trigger: 'blur',
                        required: phoneSupport,
                        validator: (rule, value, callback) => {
                            //脱敏后带*的数据直接不校验
                            if ((!phoneSupport && !value) || /\*/.test(value)) {
                                callback();
                                return;
                            }
                            if (!value) {
                                callback(new Error('手机号码不能为空'));
                            } else if (!/^1\d{10}$/.test(value)) {
                                callback(new Error('手机号码不合法'));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
            operateName: '',
            filter: '',
            roleList: [],
            myRoleList: [],
            myResource: [],
            defaultProps: {
                label: 'name',
                disabled: 'other',
            },
            isUnderstanding: false,
            isVariety: false,
            pageType: this.$route.query.pageType,
            optType: this.$route.query.optType,
            userParams: {
                page: 1,
                rows: 200,
                name: null,
                includeDep: true,
                tenantId: 0,
            },
            privacyHref:
                process.env.NODE_ENV === 'production'
                    ? window.urlConfig + '/static/pdf/privacyStatement.pdf'
                    : '/static/pdf/privacyStatement.pdf',
            userMaxLength: window.accountMaxLength,
            isCluster: window.isCluster, //是否是集群环境
        };
    },
    watch: {
        defTenant: {
            handler: function (value, oldVal) {
                if (value && value != 0) {
                    /*获取租户列表*/
                    // this.SECURTY_TENANT_USER_LIST({
                    //     page: 1,
                    //     rows: 2147483647,
                    //     includeRole: false,
                    //     tenantId: 0,
                    // }).then(() => {
                    //     this.form.userId = Number(this.$route.query.userId);
                    // });
                }
            },
            deep: true,
        },
    },

    computed: {
        ...mapState('webkit', ['resourceList', 'isArr', 'tenantMode', 'securityUserList', 'userInfo', 'defTenant']),
        ...mapState('user', ['editUserInfo']),
    },
    async created() {
        if ((this.isCluster && !this.optType) || (this.isCluster && this.optType === 'add')) this.optType = 'view'; //集群环境没有新增功能
        let userId = this.$route.query.userId ? this.$route.query.userId : 0;
        this.filter = this.$route.query.filter == 'view' ? false : true; //filter=='view'为查看状态
        if (this.defTenant && this.defTenant != 0) {
            /*获取租户列表*/
            // this.SECURTY_TENANT_USER_LIST({ page: 1, rows: 2147483647, includeRole: false, tenantId: 0 });
        }
        this.RESOURCELIST({ filter: this.filter });
        if (this.optType === 'view') {
            this.operateName = '查看用户';
        } else if (this.optType === 'edit') {
            this.operateName = '编辑用户';
        } else {
            if (!this.isCluster) this.operateName = '新增用户';
        }
        /*获得当前登录用户的角色*/
        await this._AJAX({
            url: 'role.myRoleList',
            method: 'GET',
            data: {},
        }).then((res) => {
            if (res.code == 0) {
                this.roleList = res.result;
            }
        });
        await this.GET_EDIT_USER(userId)
            .then((res) => {
                emailSupport = res.result.emailSupport;
                phoneSupport = res.result.phoneSupport;
                idCardNoSupport = res.result.idCardNoSupport;
                this.$set(this.rules.email[0], 'required', emailSupport); //验证邮箱是否必填
                this.$set(this.rules.phone[0], 'required', phoneSupport); //验证手机是否必填
                // this.$set(this.rules.idCardNo[0], 'required', idCardNoSupport); //验证身份证是否必填
                if (userId) {
                    //编辑用户
                    this.myRoleList = res.result.myRoleList; //该编辑用户的角色
                    let form = Object.assign({}, this.form, res.result.myUser, {
                        roles: res.result.myRole
                            ? res.result.myRole
                                  .split(',')
                                  .filter((v) => v !== '')
                                  .map((v) => Number(v))
                            : [],
                    });
                    form.myDept = res.result.myDept;
                    form.userId = res.result.myUser.id;
                    // form.idCardNo = res.result.myUser.idCardNo;
                    res.result.myDept.map((item) => {
                        let parentNames = item.namePath.split('→');
                        item.parentName = parentNames[parentNames.length - 2];
                    });
                    this.form = form;
                    this.myResource = res.result.myResource.split(',');
                }
            })
            .catch((err) => (this.loading = false));
        /*无角色用户查看其他有角色的用户时只显示id的处理---不属于自己的角色禁用不让操作*/
        if (userId && this.myRoleList) {
            /*统一将不属于自己的角色禁用*/
            this.myRoleList.map((item) => {
                return (item.disabled = true);
            });
            /*合并*/
            let arr = this.roleList.concat(this.myRoleList);
            let temp = {},
                result = [];
            /*将重复的数据剔除*/
            arr.map((item) => {
                if (!temp[item.id]) {
                    result.push(item);
                    temp[item.id] = true;
                }
            });
            /**/
            this.roleList = result;
        }
    },

    methods: {
        ...mapActions('user', ['GET_EDIT_USER', 'USER_ROLE_LIST', 'ADD_USER', 'MODIFY_USER']),
        ...mapActions('webkit', ['RESOURCELIST', 'SECURTY_TENANT_USER_LIST']),
        ...mapActions(['_AJAX']),
        /*校验用户账号*/
        validateUsername(rule, value, callback) {
            /*租户环境内*/
            if (this.userInfo.myUser && this.userInfo.myUser.tenantId != 0) {
                if (value && (value + '').length > 0) {
                    callback();
                } else {
                    callback(new Error('用户账号不能为空'));
                    return;
                }
            } else {
                const userReg = '&<>@,，.。/$#\\\\';
                for (let i = 0; i < userReg.length; i++) {
                    let item = userReg[i];
                    if (typeof value == 'string' && value.indexOf(item) > 0) {
                        callback(new Error('用户名不能包含特殊字符'));
                        return;
                    }
                }
                /*校验用户账号*/
                this.$utils.validityUserName(rule, value, callback);
            }
        },
        getSubmitData() {
            let treeName = '';
            let resources = {};
            this.$refs.tree.getCheckedNodes().forEach((item, index) => {
                if (item && item.value) {
                    if (item.value.split('.')[1]) {
                        treeName = item.value.split('.')[0];
                        if (resources[treeName] == undefined) {
                            resources[treeName] = '';
                        }
                        resources[treeName] += ',' + item.value.split('.')[1];
                    }
                }
            });
            let data = {
                account: this.form.account,
                email: this.form.email,
                level: this.form.level,
                name: this.form.name,
                num: this.form.num,
                phone: this.form.phone,
                mainDeptId: this.form.mainDeptId,
                // idCardNo: this.form.idCardNo,
                // resources: {},
                resources: resources,
                roleIds: this.form.roles,
                userId: this.$route.query.userId || this.form.userId,
            };
            if (!data.userId) delete data.userId;
            return data;
        },
        isUnderstandingFun(val) {
            if (val) this.isVariety = false;
        },
        submit() {
            // if (!this.isUnderstanding) {
            //     this.isVariety = true;
            //     this.$AudaqueToast.error({
            //         template: `请确认已认真阅读隐私条例并同意`,
            //         methods: {
            //             okEvent() {},
            //         },
            //     });
            //     return false;
            // }
            let data = this.getSubmitData();
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    let _this = this;
                    let userId = this.$route.query.userId;
                    _this.$store.commit('SHOW_LOADING', true);
                    if (userId) {
                        this.MODIFY_USER(data)
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `修改用户成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            })
                            .catch((err) => (this.loading = false));
                    } else {
                        //add
                        this.ADD_USER(data)
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `添加用户成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            })
                            .catch((err) => (this.loading = false));
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.user-edit {
    /deep/ .resource {
        border: 1px solid #e1dfdc;
    }

    /deep/ .submit-wrap {
        text-align: center;
        margin-top: 0.2rem;
    }
    /deep/ .el-tree {
        height: 3.5rem;
        overflow-y: scroll;
    }
    .paf-title {
        cursor: pointer;
    }
    .agree {
        color: red;
    }
    /deep/.form-item {
        width: 99%;
        padding-right: 0;
    }
}
</style>
