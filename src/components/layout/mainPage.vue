<template>
    <audaque-frame-page
        :layout-theme="layoutTheme"
        :background-color="theme.menuBackgroundColor"
        :text-color="theme.menuTextColor"
        :active-text-color="theme.menuActiveTextColor"
        ref="framePage"
        :path="activePath || $route.fullPath"
        @item-click="onMenuItemClick"
        @product-click="onProductClick"
        :application-name="applicationName"
        :data="menuTree"
        :project-list="appList"
        class="main-page"
    >
        <!-- <div style="width: 100%">
            <tags-view />
        </div> -->
        <!-- 工具栏 -->
        <template slot="toolbar">
            <!--工具操作栏-->
            <audaque-toolbar
                :title="applicationName"
                :background-color="theme.toolbarBackgroundColor"
                :title-color="theme.toolbarTitleColor"
                :show-shadow="theme.toolbarShowShadow"
                :is-shade="theme.toolbarIsShade"
            >
                <!--logo-->
                <template slot="logo">
                    <span><img v-if="isShowLogo" :src="logoImg" alt="" class="title-image" /> </span>
                </template>
                <!--右边自定义内容-->
                <div class="header-right-item" :class="{ 'audaque-menu-dark': layoutTheme === 4 }">
                    <div
                        v-if="tenantMode != 0 && userInfo.tenantList && userInfo.tenantList.length > 0"
                        class="tenant-name-item"
                    >
                        <span class="tenant-name-title">当前租户：</span>{{ tenantName }}
                    </div>
                    <div class="announcement" v-if="publishedAnnouncementList.total > 0">
                        <el-popover placement="top-start" width="auto" trigger="hover">
                            <ul class="announcement-list-item">
                                <template>
                                    <li
                                        :class="item.readFlag === 1 ? 'haveRead' : ''"
                                        @click="clickAnnouncementRow(item)"
                                        v-for="(item, index) in publishedAnnouncementList.rows"
                                        :key="index"
                                        v-if="index < 5"
                                    >
                                        <span class="title">{{ item.title }}</span>
                                        <span class="date">{{
                                            publics.formatTime(item.publishTime, 'Y-M-D h:m:s')
                                        }}</span>
                                    </li>
                                </template>
                            </ul>
                            <div class="operating-line" v-if="publishedAnnouncementList.total > 5">
                                <el-button size="mini" type="primary" @click="viewAll">查看更多</el-button>
                            </div>
                            <el-badge class="item" slot="reference" :value="unreadAnnouncementTotal">
                                <span class="iconfont icongonggao swing"> </span>
                            </el-badge>
                        </el-popover>
                    </div>
                    <div>
                        <el-dropdown class="header-dropdown" @command="handleCommand">
                            <span :class="{ 'audaque-menu-dark': layoutTheme === 4 }">
                                <img v-lazy="lazyOptions" width="30" height="30" :src="userIcon" />
                                欢迎,{{ userInfo && userInfo.myUser && userInfo.myUser.name }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="!isCluster" command="edit">修改密码</el-dropdown-item>
                                <el-dropdown-item command="bind" v-if="userInfo.wechatSwith && !userInfo.wechat"
                                    >绑定微信</el-dropdown-item
                                >
                                <el-dropdown-item command="unBind" v-if="userInfo.wechatSwith && userInfo.wechat"
                                    >解绑微信</el-dropdown-item
                                >
                                <el-dropdown-item v-if="!isCluster" command="base">基本信息</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </audaque-toolbar>
        </template>

        <!--主内容区域-->
        <template>
            <!-- <keep-alive :include="cachedViews">
                <router-view :key="key"></router-view>
            </keep-alive> -->
            <router-view></router-view>
        </template>
    </audaque-frame-page>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import AudaqueFramePage from '../AudaqueFramePage';
import logo from '@/assets/images/userIcon.jpg';
import { menuList } from '@/assets/js/menus';
import API from '@/api/index';
import JSEncrypt from 'jsencrypt';
import { AudaqueElementValidator, AudaqueMeunUtils } from '@audaque/vue-utils';
import { downloadFile, bindPrivacy } from '@/api/modules/privacy';
import { Message } from 'element-ui';
// import TagsView from './TagsView';
import createRoute from '@/router/routes';
const applicationName = window.title;

export default {
    name: 'mainPage',

    components: {
        AudaqueFramePage,
        // TagsView,
    },

    async created() {
        this.$store.commit('permission/SET_ROUTES', createRoute());
        this.restorePath();
        localStorage.setItem('versionInfo', JSON.stringify(process.env.versionInfo)); //版本号信息，获取的是git上的信息
        // 获取报表配置菜单
        await this.requestReportConfigMenus();

        let arr = this.reportConfigMenuList;
        if (arr.length > 0) {
            let childArr = arr[0].children;
            if (
                this.$route.path !== '/main' &&
                this.$route.path !== '/api/display' &&
                this.$route.path !== '/report/display' &&
                childArr.length > 0
            ) {
                this.onMenuItemClick(childArr[0]);
            }
        }

        // 获取接口配置菜单
        await this.requestApiConfigMenus();

        let arrApi = this.requestApiConfigMenus;
        if (arrApi.length > 0) {
            let childArrApi = arrApi[0].children;
            if (childArrApi.length > 0) {
                this.onMenuItemClick(childArrApi[0]);
            }
        }

        //获取菜单
        this.requestMenus();
        //获取用户信息
        this.getBaseInfo().then((res) => {
            //获取公告列表
            this.GET_PUBLISHED_ANNOUNCEMENT_LIST();
            //根据用户基本信息决定是否要签署隐私协议
            this.showPrivacyDialog(res);
        });
        //获得系统列表
        this.requestAppList();
        //获取消息列表数据
        this.GET_MESSAGE_INFO_LIST();
    },

    data() {
        return {
            layoutTheme: window.layoutTheme, //主布局框架样式
            //主题样式
            theme: {
                toolbarBackgroundColor: window.TOOLBAR_BG_COLOR, //导航栏背景色
                toolbarTitleColor: window.TOOLBAR_TITLE_COLOR, //导航栏字体颜色
                toolbarShowShadow: window.TOOLBAR_SHOW_SHADOW, //导航栏是否显示阴影
                toolbarIsShade: window.TOOLBAR_IS_SHADE, //导航栏文字是否显示渐变色
                menuBackgroundColor: window.MENU_BG_COLOR, //菜单背景色
                menuTextColor: window.MENU_TEXT_COLOR, //菜单文字颜色
                menuActiveTextColor: window.MENU_ACTIVE_TEXT_COLOR, //菜单选中文字颜色
            },
            appList: [], //应用列表
            applicationName: applicationName, //应用名称 (可配置)
            logoImg: window.logoBase64, //logo  (可配置)
            isShowLogo: window.isShowLogo, //是否显示logo  （可配置）
            title: '', //二级标题显示的名称
            menuTree: [], //菜单数据
            activePath: '', //选中的路由
            urlKey: 'url', //节点中url的key
            logo: logo,
            lazyOptions: {
                error: require('@/assets/images/userIcon.jpg'),
                loading: require('@/assets/images/loading.gif'),
                src: '',
            },
            announcementData: [],
            announcementTotal: 0,
            isCluster: window.isCluster, //是否是集群环境
        };
    },

    computed: {
        ...mapState('webkit', ['userInfo', 'tenantMode', 'tenantName', 'reportConfigMenuList', 'apiConfigMenuList']),
        ...mapState('user', ['userIcon']),
        ...mapState('news', ['isUpdateAnnouncement', 'publishedAnnouncementList', 'unreadAnnouncementTotal']),
        cachedViews() {
            return this.$store.state.tagsView.cachedViews.filter((item) => item);
        },
        key() {
            return this.$route.path;
        },
    },
    watch: {
        userIcon: {
            handler(val) {
                this.lazyOptions.src = val;
            },
            immediate: true,
        },
        isUpdateAnnouncement: {
            handler() {
                /*获取公告列表*/
                this.GET_PUBLISHED_ANNOUNCEMENT_LIST();
            },
            deep: true,
        },
        '$route.path': {
            handler: function (val) {
                if (this.layoutTheme === 1) {
                    //公告页面的特殊处理使之可以回显到首页
                    if (val === '/index/announcementEdit' || val === '/index/announcementList') {
                        sessionStorage.setItem('menuListedLastPath', '/index');
                        val = 'index';
                    }
                    this.$refs.framePage.handleMenuPositon(val);
                }
            },
        },
    },

    methods: {
        ...mapMutations(['SET_STORE_SEARCH']),
        ...mapActions(['ACCESSIBLES', '_DIR_MENU']),
        ...mapMutations('webkit', ['headerSticConfig']),
        ...mapMutations('home', ['setJumpUrl']),
        ...mapMutations('user', ['resetImage']),
        ...mapActions('webkit', [
            'getBaseInfo',
            'modifyPwd',
            'modifyBaseInfo',
            'setIcon',
            'QUERY_REPORT_CONFIG_MENU',
            'QUERY_API_CONFIG_MENU',
            'REPORT_CONFIG_MENU',
        ]),
        ...mapActions('user', ['LOGOUT', 'GET_MESSAGE_INFO_LIST', 'GETPUBLICKEY']),
        ...mapActions(['MYPLATFORM', '_AJAX']),
        ...mapActions('news', ['GET_PUBLISHED_ANNOUNCEMENT_LIST']),
        showPrivacyDialog(info) {
            let _t = this;
            if (!info.isNeedSigned || !info.privacyStatementUrl) return;

            downloadFile(info.privacyStatementUrl).then((objectURL) => {
                this.$AudaqueToast.dialog({
                    title: '隐私声明',
                    width: '1000px',
                    className: 'dialog-to-max-height',
                    template: `<iframe :src="src" style="width:100%;height:100%"></iframe>`,
                    data: { src: objectURL, hideCancel_a_d_q: false },
                    showFooter: false,
                    footer: `<div slot="footer" class="dialog-footer" >
                                <el-button
                                    v-if="!hideCancel_a_d_q"
                                    type="primary"
                                    @click.stop="okEvent_a_d_q"
                                >同意此声明</el-button>
                                <el-button
                                    class="confirm"
                                    @click.stop="cancelEvent_a_d_q"
                                >
                                    <i class="el-icon-loading"></i>拒绝并退出
                                </el-button>
                            </div>`,
                    mounted() {},
                    methods: {
                        okEvent() {
                            //调接口，记录用户已经同意
                            bindPrivacy(info.id, info.privacyId).then(() => {
                                Message.success('签订隐私声明协议成功！');
                                _t.getBaseInfo();
                            });
                            URL.revokeObjectURL(objectURL);
                        },
                        cancelEvent() {
                            //退出到登录页面
                            URL.revokeObjectURL(objectURL);
                            this.LOGOUT();
                        },
                    },
                });
            });
        },
        clickAnnouncementRow(row) {
            this.$router.push({
                path: '/index/announcementEdit',
                query: { id: row.id, uuidCode: row.uuidCode },
            });
        },

        restorePath() {
            //记录选择的模块路由
            const path = sessionStorage.getItem('menuListedLastPath');
            if (path) {
                this.activePath = this.$route.fullPath;
            }
        },

        /**
         * 获取应用列表
         */
        requestAppList() {
            this.MYPLATFORM({ page: 1, row: 1000 }).then((res) => {
                this.appList = res.result.map((item) => {
                    if (item.iconBase64) {
                        item.iconBase64 = 'data:image/*;base64,' + item.iconBase64;
                    }
                    return item;
                });
            });
        },

        /**
         * 获取菜单
         */
        requestMenus() {
            this._DIR_MENU().then((data) => {
                let list = data.result.children;
                // 固定的报表页加进去
                const indexReportObj = {
                    parent: null,
                    id: 'report',
                    name: '库表',
                    url: this.reportConfigMenuList.length > 0 ? null : '/report/display',
                    children: this.reportConfigMenuList,
                    fullPath: '库表',
                    parentPath: '',
                    noArgUrl: null,
                };
                const indexApiObj = {
                    parent: null,
                    id: 'api',
                    name: '接口',
                    url: this.apiConfigMenuList.length > 0 ? null : '/api/display',
                    children: this.apiConfigMenuList,
                    fullPath: '接口',
                    parentPath: '',
                    noArgUrl: null,
                };

                list.unshift(indexApiObj);
                list.unshift(indexReportObj);

                //处理菜单数据保持一致
                this.menuTree = AudaqueMeunUtils.handleMenuData(list, menuList);
            });
        },

        /**
         * 获取报表配置菜单
         */
        async requestReportConfigMenus() {
            await this.QUERY_REPORT_CONFIG_MENU();
        },

        /**
         * 获取接口配置菜单
         */
        async requestApiConfigMenus() {
            await this.QUERY_API_CONFIG_MENU();
        },

        /**
         * 菜单点击事件
         * @param meunInfo 菜单信息
         */
        async onMenuItemClick(item, type) {
            console.log(process.env);
            const path = item[this.urlKey];
            this.$nextTick(() => {
                if (type === 3) {
                    const doms = document.querySelectorAll('.audaque-submenu-item__is-active');
                    doms.forEach((dom) => {
                        if (dom.innerText === item.name) {
                            dom.classList.remove('audaque-submenu-item__is-active');
                        }
                    });
                }
            });
            if (path.includes('/api/display') && type === 3) {
                sessionStorage.removeItem('audaquLastPath');
                window.open(
                    `http://${window.location.host}${process.env.VUE_APP_BASE_URL}/#/api/display?id=${item.id}&optModule=${item.name}`
                );
            } else if (path.includes('/report/display') && type === 3) {
                sessionStorage.removeItem('audaquLastPath');
                window.open(
                    `http://${window.location.host}${process.env.VUE_APP_BASE_URL}/#/report/display?id=${item.id}&optModule=${item.name}`
                );
            } else {
                this.SET_STORE_SEARCH(); //点击菜单时清空存储在store的参数
                this.activePath = path;
                //记录菜单的跳转地址
                sessionStorage.setItem('menuListedLastPath', path);
                this.$router.push({ path: path });
            }
            // if (path.includes('/report/display')) {
            //     this.$router.push({ path: path, query: { optModule: item.name } });
            // } else {
            //     this.$router.push({ path: path });
            // }
        },

        /**
         * 跳转到其它的产品
         */
        onProductClick(item) {
            //子系统的跳转方式
            if (window.jumpWay === 2) {
                window.location.href = item.mainUrl;
            } else if (window.jumpWay === 3) {
                //外部系统  需跳到首页用iframe嵌套  带着jumpWay标记
                if (item.appType == 2) {
                    this.setJumpUrl(item.mainUrl);
                    this.$router.push({ path: '/index', query: { jumpWay: 3 } });
                } else {
                    // 内部系统
                    window.location.href = item.mainUrl;
                }
            } else {
                window.open(item.mainUrl, '_blank');
            }
        },

        /**
         * 退出、修改密码和修改用户信息操作
         */
        handleCommand(command) {
            if (command == 'edit') {
                //修改密码
                this.updatePassword();
            } else if (command === 'bind') {
                //绑定微信
                this.bindWechat();
            } else if (command === 'unBind') {
                //解绑微信
                this.unBindWechat();
            } else if (command == 'base') {
                this.getBaseInfo().then(() => {
                    //修改用户信息
                    this.updateUserInfo();
                });
            } else if (command == 'logout') {
                //退出
                this.LOGOUT();
            }
        },

        /*
         * 绑定微信
         * */
        bindWechat() {
            let _this = this;
            this.$AudaqueToast.dialog({
                title: '请使用微信扫码绑定',
                width: '500px',
                template: `
                                    <div id="qrCode_id" style="text-align: center;"></div>
                                    <div v-if="isTip" style="text-align: center;margin: 15px;font-size: 13px;color: #333;">请使用微信扫描二维码绑定</div>
                            `,
                data: {
                    times: null,
                    hideCancel_a_d_q: true,
                    okBtnName: '关闭',
                    isTip: false,
                    appid: null,
                    redirect_uri: null,
                },

                mounted() {
                    /*获取 appid   redirect_uri*/
                    new Promise((resolve) => {
                        _this
                            ._AJAX({
                                url: `userAppLogin.weixinLoginUrl`,
                                method: 'GET',
                                data: {},
                            })
                            .then((res) => {
                                if (res.code === 0) {
                                    resolve(res.result);
                                }
                            });
                    }).then((res) => {
                        this.appid = res.appID;
                        this.redirect_uri = res.redirectUri;
                        this.loadWxLoginScript();
                    });
                },
                methods: {
                    okEvent() {
                        clearInterval(this.times); //清除轮询
                    },
                    /*
                     * 加载wxLogin.js
                     * */
                    loadWxLoginScript() {
                        const oScript = document.createElement('script');
                        oScript.type = 'text/javascript';
                        oScript.src =
                            process.env.NODE_ENV === 'production'
                                ? window.urlConfig + '/static/config/wxLogin.js'
                                : '/static/config/wxLogin.js';
                        oScript.onload = () => {
                            this.getWechatCode();
                            document.getElementById('qrCode_id').children[0].height = '220px'; //修改二维码框的高度
                            this.isTip = true; //显示提示
                            this.cycle();
                        };
                        document.body.appendChild(oScript);
                    },
                    /*
                     * 获取微信二维码
                     * */
                    getWechatCode() {
                        new WxLogin({
                            self_redirect: true,
                            id: 'qrCode_id',
                            appid: this.appid,
                            scope: 'snsapi_login',
                            redirect_uri: encodeURIComponent(this.redirect_uri),
                            state: Math.ceil(Math.random() * 1000),
                            style: 'black',
                            href:
                                'data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIwMHB4O30NCi5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9DQouaW1wb3dlckJveCAuaW5mbyB7d2lkdGg6IDIwMHB4O2Rpc3BsYXk6bm9uZTt9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQ0KLmltcG93ZXJCb3ggLmljb24zOF9tc2cuc3VjYyB7DQogICAgYmFja2dyb3VuZC1zaXplOiAyMHB4Ow0KICAgIGJhY2tncm91bmQtcG9zaXRpb246IDAgLTI0cHg7DQp9DQouaW1wb3dlckJveCAuaWNvbjM4X21zZyB7DQogICAgZGlzcGxheTogaW5saW5lLWJsb2NrOw0KICAgIHdpZHRoOiAyMHB4Ow0KICAgIGhlaWdodDogMjBweDsNCn0NCi5zdGF0dXNfdHh0IGg0e2ZvbnQtc2l6ZToxNHB4O30NCmlmcmFtZXtoZWlnaHQ6MjgwcHggIWltcG9ydGFudDt9',
                        });
                    },
                    /*
                     * 轮询是否绑定成功
                     * */
                    cycle() {
                        this.times = setInterval(() => {
                            _this
                                ._AJAX({
                                    url: window.urlConfig + `/userAppLogin/check/${_this.userInfo.myUser.id}.do`,
                                    method: 'GET',
                                    data: {},
                                })
                                .then((res) => {
                                    if (res.code === 0) {
                                        if (res.result.status != 0) {
                                            this.hideDialog();
                                            clearInterval(this.times);
                                            _this.getBaseInfo();
                                            //绑定成功
                                            if (res.result.status === 2) {
                                                _this.$AudaqueToast.tip({
                                                    template: res.result.msg,
                                                    methods: {
                                                        okEvent() {},
                                                    },
                                                });
                                            } else {
                                                _this.$AudaqueToast.error({
                                                    template: res.result.msg,
                                                    methods: {
                                                        okEvent() {},
                                                    },
                                                });
                                            }
                                        }
                                    } else {
                                        clearInterval(this.times);
                                        this.hideDialog();
                                        _this.$AudaqueToast.error({
                                            template: res.msg,
                                            methods: {
                                                okEvent() {},
                                            },
                                        });
                                    }
                                })
                                .catch(() => {
                                    this.hideDialog();
                                    clearInterval(this.times);
                                });
                        }, 1500);
                    },
                },
            });
        },

        /*
         * 解绑微信
         * */
        unBindWechat() {
            let _this = this;
            this._AJAX({
                url: `userAppLogin.UnbundlingUserAppLogin`,
                method: 'POST',
                data: { userId: this.userInfo.myUser.id },
            }).then((res) => {
                if (res.code === 0) {
                    this.$AudaqueToast.tip({
                        template: '解绑成功',
                        methods: {
                            okEvent() {
                                _this.getBaseInfo();
                            },
                        },
                    });
                }
            });
        },

        /**
         * 修改密码
         */
        updatePassword() {
            let _this = this;
            let form = {
                oldPassword: '', //旧密码
                newPassword: '', //新密码
                confirmPassword: '', //确认密码
            };
            let validatorConfirmPassword = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入确认密码'));
                } else if (form.newPassword != form.confirmPassword) {
                    callback(new Error('新密码与确认密码不一致，请重新输入'));
                } else {
                    callback();
                }
            };
            this.$AudaqueToast.dialog({
                title: '修改密码',
                width: '600px',
                template: `
                            <div class="">
                                <el-form
                                    :model="form"
                                    label-width="100px"
                                    class="form"
                                    ref="form"
                                    :rules="rules"
                                >
                                    <el-form-item  label="旧密码" prop="oldPassword">
                                        <el-input
                                            v-model.trim="form.oldPassword"
                                            type="password"
                                        >
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="新密码" prop="newPassword" class="newPwd-item">
                                        <el-input
                                            v-model.trim="form.newPassword"
                                            type="password"
                                            @blur="passwordHintFun"
                                        >
                                        </el-input>
                                        <span class="pas-hint" v-if="isViewPasHint">{{ passwordRules }}</span>
                                    </el-form-item>
                                    <el-form-item label="确认密码" prop="confirmPassword">
                                        <el-input
                                            v-model.trim="form.confirmPassword"
                                            type="password"
                                        >
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                        </div>
                            `,
                mounted() {
                    /*设置密码的校验规则*/
                    if (window.userPwdComplexStrateg > 1) {
                        this.rules.newPassword.push(window.userPasswordRule[window.userPwdComplexStrateg - 1]);
                    }
                },
                computed: {
                    //密码规则
                    passwordRules() {
                        return window.userPwdComplexStrateg > 1
                            ? window.userPasswordRule[window.userPwdComplexStrateg - 1].message
                            : '';
                    },
                },
                data: {
                    form,
                    rules: {
                        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                        confirmPassword: [{ required: true, validator: validatorConfirmPassword, trigger: 'blur' }],
                    },
                    isViewPasHint: true, //是否显示密码提示
                },
                methods: {
                    okEvent() {
                        this.passwordHintFun();
                        let keep = false;
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                let encrypt = new JSEncrypt();
                                _this.GETPUBLICKEY().then((res) => {
                                    encrypt.setPublicKey(res.result);
                                    let params = {
                                        oldPwd: encrypt.encrypt(this.form.oldPassword),
                                        newPwd: encrypt.encrypt(this.form.newPassword),
                                        pwdType: 1,
                                    };
                                    _this.modifyPwd(params).then((res) => {
                                        if (res.code === 0) {
                                            _this.$message({
                                                type: 'success',
                                                message: '修改密码成功！',
                                                showClose: true,
                                                duration: 1000,
                                            });
                                            _this.LOGOUT();
                                        }
                                    });
                                });
                            } else {
                                keep = true;
                                return false;
                            }
                        });
                        return keep;
                    },
                    passwordHintFun() {
                        this.$refs['form'].validateField('newPassword', (error) => {
                            if (error.length > 0) {
                                this.isViewPasHint = false;
                            } else {
                                this.isViewPasHint = true;
                            }
                        });
                    },
                },
            });
        },

        /**
         * 修改用户信息
         */
        updateUserInfo() {
            //获取用户信息
            const { tenantList, userForm, userIcon, rules } = this.getUerInfo();
            let _this = this;
            this.$AudaqueToast.dialog({
                title: '修改用户信息',
                width: '600px',
                template: `
                            <div class="">
                                    <el-row justify="center" type="flex">
                                        <div style="overflow:hidden;width:75px;height:75px;">
                                            <img
                                                    ref="uploadPic"
                                                    :src="userIcon"
                                                    width="75"
                                                    height="75"
                                                    style="border-radius:50%;border:solid 1px #dddddd;"
                                            />
                                        </div>
                                    </el-row>
                                    <el-row
                                            justify="center"
                                            type="flex"
                                            style="margin:10px 0;">
                                            <div style="position:relative;overflow:hidden;">
                                                <el-button type="primary" @click="$refs.upload.click()">上传头像</el-button>
                                            <input
                                                    style="position: absolute;
                                                            left: 0;
                                                            top: 0;
                                                            opacity: 0;
                                                            width: 100%;
                                                            height: 100%;
                                                            font-size: 0;
                                                            cursor: pointer;"

                                                    @change="uploadFile($event)"
                                                    type="file"
                                                    ref="upload"
                                                    accept="image/*"
                                            />
                                        </div>
                                    </el-row>
                                    <el-form
                                        :model="userForm"
                                        :rules="rules"
                                        ref="userForm"
                                        label-width="100px"
                                        class="demo-ruleForm">
                                    <el-form-item label="姓名" prop="name">
                                        <el-input v-model="userForm.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input v-model="userForm.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机" prop="phone">
                                        <el-input v-model="userForm.phone"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="!isCluster && tenantList.length>0" label="当前租户">
                                        <el-select
                                                v-model="userForm.defTenant"
                                                placeholder="请选择">
                                            <el-option
                                                    v-for="item in tenantList"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                            `,
                data: {
                    userIcon: userIcon, //图片地址
                    tenantList: tenantList, //租户列表
                    getPicture: '', // 图片
                    files: '', //上传的图片
                    userForm: userForm,
                    rules: rules,
                    isCluster: window.isCluster,
                },
                methods: {
                    okEvent() {
                        let keep = false;
                        this.$refs['userForm'].validate((valid) => {
                            if (valid) {
                                _this.modifyBaseInfo(this.userForm).then(() => {
                                    let isSwitchTenant = false; //是否切换租户
                                    if (_this.userInfo.myUser.defTenant != this.userForm.defTenant) {
                                        isSwitchTenant = true;
                                    }
                                    if (_this.tenantMode != 0 && isSwitchTenant) {
                                        //租户环境内
                                        this.$AudaqueToast.tip({
                                            template: '操作成功，重新登录后生效',
                                            methods: {
                                                okEvent() {
                                                    _this.LOGOUT();
                                                },
                                            },
                                        });
                                    } else {
                                        _this.$message({
                                            type: 'success',
                                            message: '修改用户基本信息成功！',
                                            showClose: true,
                                            duration: 1000,
                                        });
                                        _this.GET_PUBLISHED_ANNOUNCEMENT_LIST(); //切换租户重新查询公告
                                        if (_this.$route.path.indexOf('index') > -1) {
                                            return window.location.reload();
                                        } else {
                                            _this.$router.replace('/index');
                                            //获取菜单
                                            setTimeout(() => {
                                                _this.requestMenus();
                                            }, 50);
                                            //获取用户信息
                                            _this.getBaseInfo();
                                        }
                                    }
                                });
                            } else {
                                keep = true;
                                return false;
                            }
                        });
                        return keep;
                    },

                    /**
                     * 上传图片
                     */
                    uploadFile(event) {
                        if (event.target.files.length < 1) return (this.getPicture = '');
                        if (event.target.files[0].size / 1024 / 1024 > 0.1) {
                            event.target.value = '';
                            return this.$message({
                                type: 'warning',
                                message: '上传图片大于100Kb,请压缩图片后重新上传!',
                                showClose: true,
                                duration: 1500,
                            });
                        }
                        let imgSrc = window.URL.createObjectURL(event.target.files[0]);
                        let img = new Image();
                        img.src = imgSrc;
                        let _this = this;
                        img.onload = () => {
                            if (img.width > 200 || img.height > 200) {
                                event.target.value = '';
                                return _this.$message({
                                    type: 'warning',
                                    message: '图片的宽高不能大于200！',
                                    showClose: true,
                                    duration: 1500,
                                });
                            } else {
                                this.files = event.target.files[0];
                                this.getPicture = this.getFileUrl(event.target);
                                if (this.getPicture) {
                                    this.$refs.uploadPic.src = this.getPicture;
                                } else {
                                    this.$refs.uploadPic.src = this.userIcon;
                                }
                                event.target.value = '';
                                this.uploadimage();
                            }
                        };
                    },

                    /**
                     * 获取url
                     */
                    getFileUrl(obj) {
                        let url = window.URL.createObjectURL(obj.files.item(0));
                        return url;
                    },

                    /**
                     * 上传头像
                     */
                    uploadimage() {
                        if (this.files.length < 1) return false;
                        let formData = new FormData();
                        formData.append('file', this.files);
                        _this.setIcon(formData).then(() => {
                            _this.$message({
                                type: 'success',
                                message: '上传头像成功！',
                                showClose: true,
                                duration: 1000,
                            });
                            this.files = '';
                            this.getPicture = '';
                            _this.resetImage();
                        });
                    },
                },
            });
        },

        /**
         * 获取用户信息
         */
        getUerInfo() {
            //用户信息
            const userForm = {
                name: this.userInfo.myUser.name, //姓名
                email: this.userInfo.myUser.email, //邮箱
                phone: this.userInfo.myUser.phone, //手机
                defTenant: this.userInfo.myUser.defTenant, // 租户
            };
            //租户列表
            const tenantList = this.userInfo.tenantList || [];
            //头像
            const userIcon = `${API['user.userIcon']}?t=${Math.random()}`;

            //验证规则
            const rules = {
                name: [AudaqueElementValidator.isNotEmpty('请输入姓名')],
            };
            //验证邮箱是否必填
            const emailSupport = this.userInfo.emailSupport;
            //验证手机是否必填
            const phoneSupport = this.userInfo.phoneSupport;
            if (emailSupport) {
                rules.email = [AudaqueElementValidator.isNotEmpty('请输入邮箱')];
            }
            if (phoneSupport) {
                rules.phone = [AudaqueElementValidator.isNotEmpty('请输入手机号码')];
            }

            return { userForm, tenantList, userIcon, rules };
        },
        /*查看更多公告*/
        viewAll() {
            this.$router.push({
                path: '/index/announcementList',
                query: {},
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.main-page {
    overflow: auto !important;
    .header-right-item {
        > div {
            float: left;
        }
        /deep/.announcement {
            position: relative;
            top: 9px;
            margin-right: 15px;
            cursor: pointer;
            .el-badge__content.is-fixed {
                top: -6px;
                z-index: 9;
            }

            .swing {
                display: inline-block;
                animation: swing 2s 0.5s linear infinite;
                -webkit-animation: swing 2.5s 0.5s linear infinite;
                -moz-animation: swing 2.5s 0.5s linear infinite;
                -o-animation: swing 2.5s 0.5s linear infinite;
            }
            @keyframes swing {
                0% {
                    transform: rotate(25deg);
                }
                20% {
                    transform: rotate(-20deg);
                }
                30% {
                    transform: rotate(15deg);
                }
                40% {
                    transform: rotate(-15deg);
                }
                50%,
                100% {
                    transform: rotate(0deg);
                }
            }
        }
        .header-dropdown {
            padding: 0 10px;
            cursor: pointer;

            img {
                width: 30px;
                height: 30px;
                margin-right: 5px;
                vertical-align: middle;
                border-radius: 100%;
            }
        }
    }
}
.el-popover {
    .announcement-list-item {
        margin: -12px;
        padding: 12px 0;
        li {
            padding: 5px 12px;
            cursor: pointer;
            .title {
                margin-right: 30px;
            }
            .date {
                float: right;
            }
            &:hover {
                background: #f4f5f6;
            }
            &.haveRead {
                color: #c0c4cc;
            }
        }
    }
    .operating-line {
        margin-top: 10px;
    }
}
.tenant-name-item {
    display: inline-block;
    vertical-align: top;
    margin-top: 11px;
    margin-right: 20px;
    font-size: 12px;
    .tenant-name-title {
        font-size: 12px;
        font-weight: bold;
    }
}
/deep/.audaque-more-menu__product-list ul {
    background-color: #282b30;
}
/deep/.audaque-menu {
    width: 100px !important;
    .audaque-menu__item {
        height: 45px !important;
        background: #1b1f25;
        .audaque-menu-content {
            flex-direction: row;
            justify-content: flex-start;
            width: 100%;
            padding-left: 7px;
            span {
                padding-left: 7px;
            }
        }
    }
}
</style>
<style lang="scss">
.newPwd-item {
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
</style>
