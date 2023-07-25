<template>
    <div class="retrieve-password-item">
        <div class="form-box">
            <div class="form-title">找回密码</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="psw-form-item">
                <template v-if="step === 0">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model.trim="ruleForm.account" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone" class="phone-item">
                        <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号码" maxlength="11"></el-input>
                        <div class="send-btn">
                            <span v-show="sendAuthCode" slot="append" @click="getAuthCode">发送验证码</span>
                            <span v-show="!sendAuthCode" slot="append">{{ auth_time }} 秒</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="验证码" prop="authCode">
                        <el-input placeholder="请输入验证码" v-model.trim="ruleForm.authCode"> </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="step-btn" @click="stepBtn">下一步</el-button>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="新密码" prop="newPwd" class="newPwd-item">
                        <el-input
                            @blur="passwordHintFun"
                            placeholder="请输入新密码"
                            type="password"
                            v-model.trim="ruleForm.newPwd"
                        ></el-input>
                        <span class="pas-hint" v-if="isViewPasHint">{{ passwordRules }}</span>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPwd">
                        <el-input
                            placeholder="请输入确认密码"
                            type="password"
                            v-model.trim="ruleForm.confirmPwd"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="sure-btn" @click="submitForm('ruleForm')">确定</el-button>
                        <el-button type="primary" class="cancel-btn" @click="cancel">取消</el-button>
                    </el-form-item>
                </template>
            </el-form>
        </div>
    </div>
</template>

<script>
import JSEncrypt from 'jsencrypt';
import { mapActions } from 'vuex';
export default {
    name: 'retrievePassword',
    data() {
        const validateConfirmPass = (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
                callback(new Error('请输入确认密码'));
            } else if (value !== this.ruleForm.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {},
            rules: {
                account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                authCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                confirmPwd: [{ required: true, validator: validateConfirmPass, trigger: 'blur' }],
            },
            sendAuthCode: true /* 布尔值，通过v-show控制显示‘发送’还是‘倒计时’ */,
            auth_time: 60 /* 倒计时 计数器 */,
            isViewPasHint: true, //是否显示密码提示
            step: 0,
        };
    },
    computed: {
        //密码规则
        passwordRules() {
            return window.userPwdComplexStrateg > 1
                ? window.userPasswordRule[window.userPwdComplexStrateg - 1].message
                : '';
        },
    },
    created() {},
    mounted() {
        /*设置密码的校验规则*/
        if (window.userPwdComplexStrateg > 1) {
            let rules = window.userPasswordRule[window.userPwdComplexStrateg - 1];
            this.rules.newPwd.push(rules);
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        // 倒计时
        getCountdown() {
            if (this.authTimeTimer) {
                clearTimeout(this.authTimeTimer);
            }
            this.authTimeTimer = setTimeout(() => {
                this.auth_time -= 1;
                if (this.auth_time < 0) {
                    this.sendAuthCode = true;
                    clearTimeout(this.authTimeTimer);
                } else {
                    this.getCountdown();
                }
            }, 1000);
        },
        /*
         * 校验
         * list 要校验得项的集合
         * cb 回调函数
         * */
        check(list, cb) {
            let _self = this;
            Promise.all(
                list.map((item) => {
                    let p = new Promise(function (resolve) {
                        _self.$refs['ruleForm'].validateField(item, (error) => {
                            resolve(error);
                        });
                    });
                    return p;
                })
            ).then((data) => {
                cb(data);
            });
        },
        //下一步
        stepBtn() {
            this.check(['account', 'phone', 'authCode'], (data) => {
                if (data.join('').length === 0) {
                    this.step = 1;
                }
            });
        },
        //获取验证码
        getAuthCode() {
            this.$refs.ruleForm.clearValidate('authCode'); //移除验证码的验证信息
            this.check(['account', 'phone'], (data) => {
                if (data.join('').length === 0) {
                    this.auth_time = 60;
                    this._AJAX({
                        url: 'oauth2.phoneResetPwdRequest',
                        method: 'POST',
                        data: {
                            account: this.ruleForm.account,
                            phone: this.ruleForm.phone,
                        },
                    }).then((res) => {
                        if (res.code == 0) {
                            this.sendAuthCode = false;
                            this.getCountdown();
                            this.$AudaqueToast.tip({
                                template: `验证码已发送至登记手机号上，请注意查收。`,
                                methods: {
                                    okEvent() {},
                                },
                            });
                        }
                    });
                }
            });
        },
        passwordHintFun() {
            this.$refs['ruleForm'].validateField('newPwd', (error) => {
                if (error.length > 0) {
                    this.isViewPasHint = false;
                } else {
                    this.isViewPasHint = true;
                }
            });
        },
        //提交
        submitForm() {
            this.passwordHintFun();
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let encrypt = new JSEncrypt(),
                        _this = this;
                    var p = new Promise(function (resolve) {
                        _this
                            ._AJAX({
                                url: 'user.getPublicKey',
                                method: 'GET',
                                data: {},
                            })
                            .then((res) => {
                                if (res.code == 0) {
                                    resolve(res);
                                }
                            });
                    });
                    p.then((res) => {
                        encrypt.setPublicKey(res.result);
                        let params = Object.assign({}, _this.ruleForm);
                        params.newPwd = encrypt.encrypt(params.newPwd);
                        _this
                            ._AJAX({
                                url: 'oauth2.phoneResetPwd2',
                                method: 'POST',
                                data: params,
                            })
                            .then((res) => {
                                if (res.code == 0) {
                                    _this.$AudaqueToast.tip({
                                        template: `密码重置成功`,
                                        methods: {
                                            okEvent() {
                                                _this.$router.go(-1);
                                            },
                                        },
                                    });
                                }
                            });
                    });
                } else {
                    return false;
                }
            });
        },
        cancel() {
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss" scoped>
$frameHeight: 40px;
.retrieve-password-item {
    width: 100%;
    height: 100%;
    background: url('../../assets/images/retrieve-password-bg.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    /deep/.el-form-item {
        margin-bottom: 30px;
        .el-form-item__content,
        .el-form-item__label {
            height: $frameHeight;
            line-height: $frameHeight;
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }
        .el-input__inner {
            border: 1px solid #eaedf3;
            font-size: 13px;
            height: $frameHeight;
            line-height: $frameHeight;
        }
        &.phone-item {
            position: relative;
            .send-btn {
                position: absolute;
                top: 0;
                right: 10px;
                font-size: 14px;
                color: #5394eb;
                font-weight: 500;
                cursor: pointer;
            }
        }
        .step-btn {
            width: 100%;
            background: #5394eb;
            color: #fff;
            font-size: 14px;
            color: #ffffff;
            border-radius: 3px;
        }
    }
    /deep/.el-form-item.is-error .el-input__inner {
        border: 1px solid #f56c6c;
    }
    /deep/.newPwd-item {
        .el-form-item__content {
            position: relative;
        }
        .pas-hint {
            position: absolute;
            left: 0;
            bottom: -10px;
            line-height: 0;
            font-size: 12px;
        }
    }
}
.form-box {
    width: 600px;
    height: 450px;
    background-color: #ffffff;
    /*box-shadow: 0px 8px 16px 0px rgba(170, 196, 230, 0.36);*/
    border-radius: 0;
    padding: 40px 60px 20px 45px;
}
.form-title {
    font-size: 18px;
    color: #333;
    font-weight: 500;
    text-align: center;
    padding-bottom: 45px;
}
.sure-btn {
    background-color: #5394eb;
    font-size: 14px;
    color: #fff;
    width: calc(50% - 10px);
    margin-right: 20px;
}
.cancel-btn {
    background-color: #fff;
    font-size: 14px;
    color: #5394eb;
    border: 1px solid #5394eb;
    width: calc(50% - 10px);
}
.el-button + .el-button {
    margin-left: 0;
}
</style>
