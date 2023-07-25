<template>
    <dia-log :style="{ height: '100%' }">
        <div class="login-container">
            <!--<div-->
            <!--class="login-text"-->
            <!--style="display:flex;align-items:center;"-->
            <!--&gt;-->
            <!--&lt;!&ndash; <img src="@/assets/images/login_text.png"> &ndash;&gt;-->
            <!--<div :style="{'width':'60px','height':'50px','background':'url('+topBG+') no-repeat 0 3px','margin-right':'8px'}"></div>-->
            <!--<span-->
            <!--class="fzltdh"-->
            <!--:data-text="title"-->
            <!--&gt;{{title}}</span>-->
            <!--</div>-->
            <div class="logo-line">
                <img v-show="isShowLogo" src="static/images/logo.png" alt="" />
            </div>
            <div class="login-bj">
                <div class="login-main">
                    <div class="login-main-bj">
                        <img src="@/assets/images/login-left.png" />
                    </div>
                    <div class="login-main-form">
                        <el-form
                            class="login-form"
                            autoComplete="on"
                            :model="loginForm"
                            :rules="loginRules"
                            ref="loginForm"
                            label-position="left"
                        >
                            <div class="title-container">
                                <h3 class="title">用户登录</h3>
                            </div>
                            <!--<div style="width:100%;height:1px;background:#ebebeb;margin-bottom:0.4rem;"></div>-->
                            <el-form-item prop="username">
                                <span class="svg-container svg-container_login">
                                    <i class="iconfont iconzhanghao"></i>
                                </span>
                                <el-input
                                    name="username"
                                    type="text"
                                    v-model.trim="loginForm.username"
                                    :maxlength="userMaxLength"
                                    autoComplete="off"
                                    placeholder="账号"
                                />
                            </el-form-item>
                            <el-form-item prop="password">
                                <span class="svg-container">
                                    <i class="iconfont iconmima"></i>
                                </span>
                                <el-input
                                    name="password"
                                    :type="passwordType"
                                    @keyup.enter.native="handleLogin"
                                    @blur="pwdBlur"
                                    @focus="loginForm.password = ''"
                                    v-model.trim="loginForm.password"
                                    autoComplete="off"
                                    placeholder="密码"
                                />
                                <span class="show-pwd" @click="showPwd">
                                    <!--<svg-icon icon-class="eye" />-->
                                </span>
                            </el-form-item>
                            <el-form-item class="configDiv" prop="username" v-if="yzmShow">
                                <!--<span class="svg-container svg-container_login">-->
                                <!--&lt;!&ndash;<svg-icon icon-class="user" />&ndash;&gt;-->
                                <!--</span>-->
                                <span class="svg-container">
                                    <i class="iconfont iconyanzhengma" style="font-size: 0.2rem"></i>
                                </span>
                                <el-input
                                    style="width: 120px"
                                    name="authCode"
                                    type="text"
                                    v-model.trim="loginForm.authCode"
                                    placeholder="验证码"
                                />
                                <a @click="CAPTCHA" style="display: inline-block; height: 32px"
                                    ><img style="height: 32px" :src="'data:image/gif;base64,' + codeUrl"
                                /></a>
                            </el-form-item>
                            <el-button
                                type="primary"
                                style="width: 100%; margin-bottom: 30px; height: 38px"
                                :loading="loading"
                                @click.native.prevent="handleLogin"
                                >登录
                            </el-button>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </dia-log>
</template>

<script>
import JSEncrypt from 'jsencrypt';
import diaLog from '@/components/dialog';
import { mapState, mapActions, mapMutations } from 'vuex';
import utils from '../../utils';
// import { isvalidUsername } from '@/assets/js/common'
export default {
    name: 'login',
    components: { diaLog },
    provide() {
        //定义父级组件依赖
        return {
            reload: this.reload,
        };
    },
    computed: {
        ...mapState('user', ['getPublicKey', 'codeUrl']),
    },
    data() {
        const validateUsername = (rule, value, callback) => {
            const userReg = '&<>@,/$#';
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
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码不能少于六位数'));
            } else {
                callback();
            }
        };
        return {
            isShowLogo: window.isShowLogo,
            loginForm: {
                username: '',
                password: '',
                authCode: '',
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
            },
            passwordType: 'password',
            loading: false,
            showDialog: false,
            yzmShow: false,
            title: window.title,
            userMaxLength: window.accountMaxLength,
        };
    },
    methods: {
        ...mapActions('user', ['LOGIN', 'GETPUBLICKEY', 'CAPTCHA']),
        ...mapActions(['_AJAX']),
        ...mapMutations('webkit', ['headerSticConfig']),
        ...mapMutations(['LOGIN_RETURN_DATA']),
        reload() {},
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = '';
            } else {
                this.passwordType = 'password';
            }
        },
        pwdBlur() {
            /*密码加密*/
            if (this.loginForm.password.substring(0, 4) != '?**?') {
                this.loginForm.password = '?**?' + utils.$utils.encrypt(this.loginForm.password);
            }
        },
        handleLogin() {
            if (this.loginForm.password.substring(0, 4) != '?**?') {
                this.loginForm.password = '?**?' + utils.$utils.encrypt(this.loginForm.password);
            }
            let pwdSave = this.loginForm.password.substring(4);
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let encrypt = new JSEncrypt();
                    let password = utils.$utils.decrypt(pwdSave);
                    this.GETPUBLICKEY().then((res) => {
                        encrypt.setPublicKey(res.result);
                        let loginForm = {
                            username: this.loginForm.username,
                            // password: encrypt.encrypt(this.loginForm.password),
                            password: encrypt.encrypt(password),
                            authCode: this.loginForm.authCode,
                        };
                        this.LOGIN(loginForm)
                            .then((re) => {
                                this.loading = false;
                                sessionStorage.setItem('isLogin', true);
                                this._AJAX({
                                    url: 'common.getCurrentUserRole',
                                    method: 'GET',
                                    data: {},
                                }).then((res) => {
                                    if (res.success) {
                                        window.currentUserRole = res.result;
                                        console.log(window);
                                        if (res.result === 'bdAdmin' || res.result === 'orgAdmin') {
                                            this.$router.push({ path: '/report/display' });
                                        } else {
                                            this.$router.push({ path: '/main' });
                                        }
                                    }
                                });
                                // let path = sessionStorage.getItem('menuListedLastPath');
                                // this.$router.push({ path: window.isSignIn == 'login' ? path ? path : '/report/display' : "/" });
                                // this.$router.push({ path: '/report/display' });
                            })
                            .catch((re) => {
                                if (re.msg == '验证码错误') {
                                    this.CAPTCHA();
                                    this.yzmShow = true;
                                }
                                this.loading = false;
                            });
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
    created() {
        this.CAPTCHA();
    },
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https:// github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #333;
$cursor: #fff;
.fzltdh {
    font-family: 'fzltdh' !important;
    font-size: 40px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: 12px;
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#5eadf1), to(#3b78ef));
    /* filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='#5eadf1', endColorStr='#3b78ef', gradientType='1'); */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    color: #3b78ef;
    position: relative;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: #333;
        &::first-line {
            color: #333;
        }
    }
}

/* reset element-ui css */
.login-container {
    background: url('../../assets/images/login-bg.png') no-repeat;
    height: 100%;
    width: 100%;
    background-size: cover;
    .logo-line {
        position: fixed;
        left: 40px;
        top: 20px;
    }
    .login-copyright {
        margin-bottom: 20px;
        color: #fff;
        text-align: center;
        font-size: 14px;
    }
    .login-text {
        /*width: 960px;*/
        width: 100%;
        margin: 0.7rem auto 0;
    }
    .login-bj {
        width: 100%;
        height: 100%;
        /*height: calc(100% - 100px);*/
        /*height: 6.4rem;*/
        /*margin-top: 0.2rem;*/
    }
    .login-main {
        /*width: 960px;*/
        width: 100%;
        margin: 0 auto;
        display: flex;
        height: calc(100% - 40px);
        align-items: center;
        justify-content: center;
        .login-main-bj {
            display: table-cell;
            text-align: right;
            width: 50%;
            padding-right: 20px;
            vertical-align: middle;
            img {
                width: 400px;
            }
        }
        .login-main-form {
            display: table-cell;
            text-align: left;
            vertical-align: middle;
            padding-left: 20px;
            width: 50%;
            .login-form {
                position: static;
                width: 340px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 12px;
                /*padding: 0px 0.56rem;*/
                .title-container {
                    padding-top: 0.4rem;
                    text-align: left;
                    .title {
                        text-align: left;
                        color: #617da3;
                        font-size: 22px;
                        font-weight: normal;
                        margin-bottom: 0.4rem;
                        /*padding-bottom: 0.18rem;*/
                        /*border-bottom: 0.03rem solid #2193fe;*/
                    }
                }
                .el-form-item {
                    margin-bottom: 0.3rem;
                }
            }
        }
    }
    .el-input {
        display: inline-block;
        height: 0.47rem;
        width: calc(100% - 45px);
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 0.12rem 0.05rem 0.12rem 0.15rem;
            color: #333;
            height: 0.47rem;
            caret-color: #333;
            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: #333 !important;
            }
        }
    }
    .el-form-item {
        background: #fff;
        color: #333;
        border-radius: 4px;
    }
}

.configDiv {
    /deep/ .el-form-item__content {
        display: flex;
        align-items: center;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 5.2rem;
        padding: 0.35rem 0.35rem 0.35rem 0.35rem;
        /*margin: 1.2rem auto;*/
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 0 0.2rem;
        color: $dark_gray;
        vertical-align: middle;
        width: 40px;
        display: inline-block;
        &_login {
            /*font-size: 0.2rem;*/
        }
        .iconfont {
            font-size: 16px;
        }
    }
    .title-container {
        position: relative;
        .title {
            font-size: 0.26rem;
            color: $light_gray;
            margin: 0px auto 0.4rem auto;
            text-align: center;
            font-weight: bold;
        }
        .set-language {
            color: #fff;
            position: absolute;
            top: 5px;
            right: 0px;
        }
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .thirdparty-button {
        position: absolute;
        right: 35px;
        bottom: 28px;
    }
}

@media screen and (max-width: 1400px) {
    .login-text {
        margin: 0.3rem auto 0;
    }
}
</style>
