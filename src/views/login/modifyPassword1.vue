<template>
    <div class="container">
        <el-row class="modify-pwd">
            <!-- <edit-tab style="background-color:#fff" title="为了您的账号安全请修改您的密码"> -->
            <!-- <i class="iconfont icongoback cur rect-icon nocolor f16" @click="$router.to(-1)">返回</i> -->
            <!-- </edit-tab> -->
            <el-col :span="10" :offset="7" class="pwd-box">
                <el-card style="padding: 70px 50px 30px 50px; position: relative">
                    <div class="contain_header">
                        <span>修改密码</span>
                    </div>
                    <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
                        <el-form-item label="旧密码" prop="oldPwd">
                            <el-input type="password" v-model.trim="editForm.oldPwd"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPwd">
                            <el-input type="password" v-model.trim="editForm.newPwd"></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="confirmPwd">
                            <el-input type="password" v-model.trim="editForm.confirmPwd"></el-input>
                        </el-form-item>
                        <el-form-item class="saveBtn">
                            <el-button @click="saveEditPassword" type="primary">保 存 </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import JSEncrypt from 'jsencrypt';
import { mapActions } from 'vuex';

export default {
    data() {
        const validateConfirmPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入确认密码'));
            } else if (value !== this.editForm.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            editDialog: false,
            editForm: {
                oldPwd: '',
                newPwd: '',
                confirmPwd: '',
            },
            editRules: {
                oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                confirmPwd: [{ required: true, validator: validateConfirmPass, trigger: 'blur' }],
            },
        };
    },
    created() {
        if (this.$route.query.account) this.editForm.account = this.$route.query.account;
    },
    mounted() {
        /*设置密码的校验规则*/
        if (window.userPwdComplexStrateg > 1) {
            this.editRules.newPwd.push(window.userPasswordRule[window.userPwdComplexStrateg - 1]);
        }
    },
    methods: {
        ...mapActions('user', ['GETPUBLICKEY', 'LOGOUT']),
        ...mapActions('webkit', ['modifyPwd', 'modifyPwd2', 'setIcon', 'getBaseInfo', 'modifyBaseInfo']),
        saveEditPassword() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let encrypt = new JSEncrypt();
                    this.GETPUBLICKEY().then((res) => {
                        encrypt.setPublicKey(res.result);
                        let params = {
                            oldPwd: encrypt.encrypt(this.editForm.oldPwd),
                            newPwd: encrypt.encrypt(this.editForm.newPwd),
                            pwdType: 1,
                        };
                        if (this.editForm.account) {
                            params.account = this.editForm.account;
                            this.modifyPwd2(params).then(() => {
                                this.editDialog = false;
                                this.$message({
                                    type: 'success',
                                    message: '修改密码成功！',
                                    showClose: true,
                                    duration: 1000,
                                });
                                this.LOGOUT();
                            });
                        } else {
                            this.modifyPwd(params).then(() => {
                                this.editDialog = false;
                                this.$message({
                                    type: 'success',
                                    message: '修改密码成功！',
                                    showClose: true,
                                    duration: 1000,
                                });
                                this.LOGOUT();
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

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100vh;
    background: url('../../assets/images/bg2.jpg') no-repeat;
    background-size: 100% 100%;
}
.modify-pwd {
    .pwd-box {
        padding-top: 160px;
    }
    .saveBtn {
        float: right;
    }
    .contain_header {
        font-size: 20px;
        position: absolute;
        font-weight: 500;
        letter-spacing: 2px;
        left: 3%;
        top: 4%;
        margin: 10px;
    }
}
</style>
