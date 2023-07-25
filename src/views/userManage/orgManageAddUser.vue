<template>
    <audaque-detail-form-page @submit-click="submit" :opt-type="optType" class="user-edit">
        <template slot="title">
            <audaque-table-title :title="operateName">
                <el-button
                    v-if="optType == 'add' && isAddUser"
                    style="margin-right: 10px"
                    type="primary"
                    @click="(isAddUser = false), (operateName = '拉取用户')"
                    >拉取用户
                </el-button>
                <!--租户环境内没有添加用户功能-->
                <template v-if="!isCluster">
                    <el-button
                        v-if="optType == 'add' && !isAddUser && defTenant === 0"
                        style="margin-right: 10px"
                        type="primary"
                        @click="(isAddUser = true), (operateName = '添加用户')"
                        >添加用户
                    </el-button>
                </template>
                <i class="audaque-edit-tab__return-text iconfont adq-icon-back audaque-rect-icon" @click="prevPage"
                    >返回</i
                >
            </audaque-table-title>
        </template>
        <template>
            <el-form ref="ruleform" :model="form" label-width="90px" :rules="rules" :disabled="isDisabled">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户账号" prop="account">
                            <el-input
                                v-model.trim="form.account"
                                clearable
                                :disabled="optType == 'edit'"
                                :maxlength="userMaxLength"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isAddUser">
                        <el-form-item label="姓名" prop="name">
                            <el-input
                                v-model.trim="form.name"
                                clearable
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12" v-if="isAddUser">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model.trim="form.email" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isAddUser">
                        <el-form-item label="手机" prop="phone">
                            <el-input
                                v-model.trim="form.phone"
                                clearable
                                :disabled="optType == 'edit'"
                                maxlength="11"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <!--                    <el-col :span="12" v-if="isAddUser">-->
                    <!--                        <el-form-item label="身份证" prop="idCardNo">-->
                    <!--                            <el-input-->
                    <!--                                v-model="form.idCardNo"-->
                    <!--                                clearable-->
                    <!--                                maxlength="18"-->
                    <!--                                show-word-limit-->
                    <!--                                :disabled="optType == 'edit'"-->
                    <!--                            ></el-input>-->
                    <!--                        </el-form-item>-->
                    <!--                    </el-col>-->
                    <el-col :span="12" v-if="pageType == 'dept' && isAddUser && optType === 'add'">
                        <el-form-item label="主部门" prop="mainDeptId">
                            <el-select
                                v-model="form.mainDeptId"
                                placeholder="请选择"
                                clearable
                                :disabled="isMainDeptDisabled"
                            >
                                <el-option :label="deptName" :value="Number(deptId)"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="pageType == 'dept' && isAddUser && optType != 'add'">
                        <el-form-item label="主部门" prop="mainDeptId">
                            <el-select
                                v-model="form.mainDeptId"
                                placeholder="请选择"
                                clearable
                                :disabled="isMainDeptDisabled"
                            >
                                <el-option
                                    v-for="item in mainDeptList"
                                    :item="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色" prop="roleIds">
                            <el-select v-model="form.roleIds" placeholder="请选择" multiple filterable clearable>
                                <el-option
                                    :label="item.name"
                                    :value="item.id"
                                    v-for="item in roleList"
                                    :key="item.name"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职位标签" prop="tagIds">
                            <el-select v-model="form.tagIds" filterable multiple clearable placeholder="请选择">
                                <el-option :label="item.name" :value="item.id" v-for="item in tagList" :key="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否领导" prop="isLeader">
                            <el-select v-model="form.isLeader" placeholder="请选择">
                                <el-option label="否" :value="false"></el-option>
                                <el-option label="是" :value="true"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';

let phoneSupport = false;
let emailSupport = false;
let idCardNoSupport = false;
export default {
    name: 'orgManageAddUser',
    data() {
        const validateUsername = (rule, value, callback) => {
            const userReg = '&<>@,/$#\\\\';
            for (let i = 0; i < userReg.length; i++) {
                let item = userReg[i];
                if (value.indexOf(item) > 0) {
                    callback(new Error('用户名不能包含特殊字符'));
                    return;
                }
            }
            /*校验用户账号*/
            this.$utils.validityUserName(rule, value, callback);
        };
        return {
            form: {
                account: '',
                name: '',
                email: '',
                phone: '',
                roleIds: [],
                tagIds: [],
                mainDeptId: null,
                isLeader: false,
            },
            rules: {
                account: [{ required: true, trigger: ['blur', 'change'], validator: validateUsername }],
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
                            //脱敏后带*的数据直接不校验
                            if ((!emailSupport && !value) || /\*/.test(value)) {
                                callback();
                                return;
                            }
                            if (!value) {
                                callback(new Error('请输入邮箱地址'));
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
                                callback(new Error('不能为空'));
                            } else if (!/^1\d{10}$/.test(value)) {
                                callback(new Error('手机号码不合法'));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
            },
            operateName: null,
            roleList: [],
            tagList: [],
            isDisabled: false,
            isAddUser: this.$route.query.addType == 'add' ? true : false,
            deptUserId: this.$route.query.deptUserId, //部门用户id
            deptId: this.$route.query.deptId, //部门id
            deptName: this.$route.query.deptName, //部门名称
            userId: this.$route.query.userId, //用户id
            optType: this.$route.query.optType,
            pageType: this.$route.query.pageType,
            isMainDeptDisabled: false, //是否禁用主部门
            mainDeptList: [],
            userMaxLength: window.accountMaxLength,
            isCluster: window.isCluster, //是否是集群环境
        };
    },
    async created() {
        if (this.optType == 'view') {
            this.operateName = '查看用户';
            this.isDisabled = true;
        } else if (this.optType == 'edit') {
            this.operateName = '编辑用户';
            this.isDisabled = false;
        } else {
            this.operateName = this.isAddUser ? '新增用户' : '拉取用户';
            this.isDisabled = false;
        }
        await this.getDeptRole();
        await this.getDeptTag();
        this.validatorEmailPhone();
        if (this.deptUserId) {
            this.getUserInfo();
        }
    },
    watch: {
        userInfo(val) {
            this.validatorEmailPhone();
        },
    },
    computed: {
        ...mapState('webkit', ['defTenant']),
        ...mapState('webkit', ['userInfo']),
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*请求接口校验邮箱手机号是否必填*/
        validatorEmailPhone() {
            emailSupport = this.userInfo.emailSupport;
            phoneSupport = this.userInfo.phoneSupport;
            idCardNoSupport = this.userInfo.idCardNoSupport;
            this.$set(this.rules.email[0], 'required', emailSupport); //验证邮箱是否必填
            this.$set(this.rules.phone[0], 'required', phoneSupport); //验证手机是否必填
            // this.$set(this.rules.idCardNo[0], 'required', idCardNoSupport); //验证身份证是否必填
        },
        /*获取登录用户所在的部门*/
        loadUserDep() {
            Promise.all([
                this._AJAX({
                    url: 'org.findMyManageDept',
                    method: 'GET',
                    data: {},
                }),
            ]).then((res) => {
                let deptList = res[0].result.filter((item) => this.form.myDept.some((ele) => ele.id === item.id)); //查找相同的集合
                let isSame = false,
                    _this = this;
                if (this.form.mainDeptId) {
                    isSame = deptList.some((item) => item.id === _this.form.mainDeptId); //查找当前选择的主部门是否在该登录用户管理的部门内。不在则不允许修改
                    this.isMainDeptDisabled = !isSame;
                    if (!isSame) {
                        this.mainDeptList = res[0].result.concat(this.form.myDept);
                    } else {
                        this.mainDeptList = deptList;
                    }
                } else {
                    this.mainDeptList = deptList;
                }
            });
        },
        /*查找用户详情*/
        getUserInfo() {
            this._AJAX({
                url: this.pageType === 'system' ? 'orguser.findDeptUser' : 'orguser.findMyDeptUser',
                method: 'GET',
                data: {
                    deptUserId: this.deptUserId,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.form = res.result;
                    if (this.optType != 'add') {
                        this.loadUserDep();
                    }
                }
            });
        },
        /*部门可用角色*/
        getDeptRole() {
            this._AJAX({
                url: this.pageType === 'system' ? 'org.getDeptRole' : 'org.getMyDeptRole',
                method: 'GET',
                data: {
                    deptId: this.deptId,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.roleList = res.result;
                }
            });
        },

        /*部门可用标签*/
        getDeptTag() {
            this._AJAX({
                url: this.pageType === 'system' ? 'org.getDeptTag' : 'org.getMyDeptTag',
                method: 'GET',
                data: {
                    deptId: this.deptId,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.tagList = res.result;
                }
            });
        },

        prevPage() {
            this.$router.go(-1);
        },

        submit() {
            const _this = this;
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    let params = {
                        deptId: this.deptId,
                        isLeader: this.form.isLeader,
                        roleIds: this.form.roleIds,
                        tagIds: this.form.tagIds,
                        mainDeptId: this.form.mainDeptId,
                        user: {
                            account: this.form.account,
                            name: this.form.name,
                            email: this.form.email,
                            phone: this.form.phone,
                            // idCardNo: this.form.idCardNo,
                        },
                    };

                    if (this.optType === 'add') {
                        if (this.isAddUser) {
                            //新增
                            this._AJAX({
                                url: this.pageType === 'system' ? 'orguser.addDeptUser' : 'orguser.addMyDeptUser',
                                method: 'POST',
                                data: params,
                            })
                                .then((res) => {
                                    if (res.code === 0) {
                                        this.$AudaqueToast.tip({
                                            template: `添加用户成功`,
                                            methods: {
                                                okEvent() {
                                                    _this.$router.go(-1);
                                                },
                                            },
                                        });
                                    }
                                })
                                .catch((err) => {
                                    if (err.code == 2222) {
                                        this.isAddUser = false;
                                        this.operateName = '拉取用户';
                                    }
                                });
                        } else {
                            //拉取
                            this._AJAX({
                                url: this.pageType === 'system' ? 'orguser.addDeptUser' : 'orguser.addMyDeptUser',
                                method: 'POST',
                                data: {
                                    deptId: this.deptId,
                                    account: this.form.account,
                                    roleIds: this.form.roleIds,
                                    tagIds: this.form.tagIds,
                                    isLeader: this.form.isLeader,
                                },
                            }).then((res) => {
                                if (res.code === 0) {
                                    this.$AudaqueToast.tip({
                                        template: `拉取用户成功`,
                                        methods: {
                                            okEvent() {
                                                _this.$router.go(-1);
                                            },
                                        },
                                    });
                                }
                            });
                        }
                    } else {
                        params = Object.assign({ id: this.form.id }, params);
                        this._AJAX({
                            url: this.pageType === 'system' ? 'orguser.modifyDeptUser' : 'orguser.modifyMyDeptUser',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `编辑用户成功`,
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
