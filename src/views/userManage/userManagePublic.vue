<!-- 用户管理 -->
<template>
    <audaque-table-list-page v-loading="loading">
        <template slot="title">
            <audaque-table-title :title="pageType === 'system' ? '用户管理' : '我的用户'">
                <!-- <template v-if="pageType === 'system'">
                    <i
                        title="导出模板"
                        class="iconfont icondaochu2 audaque-rect-icon"
                        @click="exportFun('/user/userTemplateDown.do')"
                        >导出模板</i
                    >
                    <i
                        title="导出用户"
                        class="iconfont icondaochu2 audaque-rect-icon"
                        @click="exportFun('/user/userListDown.do')"
                        >导出</i
                    >
                    <i
                        title="导入用户"
                        class="iconfont icondaoru1 audaque-rect-icon import-template"
                        v-if="pageType === 'system'"
                        @click="$refs.upload.click()"
                        >导入
                        <input
                            class="inputFile"
                            @change="uploadFile($event)"
                            type="file"
                            ref="upload"
                            accept=".xls,.xlsx"
                            multiple
                        />
                    </i>
                </template>-->
                <template v-if="!isCluster">
                    <i
                        class="iconfont iconxinzeng2 audaque-rect-icon"
                        @click="addUser"
                        v-if="
                            (pageType === 'system' && permitList.addUser) ||
                            (permitList.addUser && pageType === 'system' && defTenant != 0)
                        "
                    >
                        新增</i
                    >
                </template>
                <!--  <template v-if="pageType === 'system' && defTenant === 0">
                    <el-dropdown placement="bottom">
                        &lt;!&ndash;租户内跟我的用户页面没有批量操作功能&ndash;&gt;
                        <i class="iconfont iconpiliang-copy audaque-rect-icon">批量操作</i>
                        <el-dropdown-menu slot="dropdown" class="title-dropdown-item">
                            <el-dropdown-item divided @click.native="stopStartUser(checkIds, false)"
                                >启用</el-dropdown-item
                            >
                            <el-dropdown-item divided @click.native="stopStartUser(checkIds, true)"
                                >禁用</el-dropdown-item
                            >
                            <el-dropdown-item divided @click.native="confirmLoginPassword(checkIds)"
                                >重置密码</el-dropdown-item
                            >
                            <el-dropdown-item divided @click.native="userExpirationDate(null, checkIds)"
                                >设置账号有效期</el-dropdown-item
                            >
                            <el-dropdown-item divided @click.native="deleteUser(checkIds)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>-->
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="searchBarVisible = !searchBarVisible"
                    >筛选查询
                </i>
            </audaque-table-title>
        </template>

        <template slot="search">
            <audaque-table-search
                @close="searchBarVisible = false"
                v-show="searchBarVisible"
                @search="queryListFn(0)"
                @reset="queryListFn(1)"
            >
                <audaque-table-search-item title="用户账号">
                    <el-input
                        type="text"
                        clearable
                        placeholder="请输入账号"
                        v-model.trim="searchList.account"
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="用户姓名">
                    <el-input type="text" clearable placeholder="请输入姓名" v-model.trim="searchList.name"></el-input>
                </audaque-table-search-item>

                <audaque-table-search-item title="注册时间">
                    <el-date-picker
                        class="search-date"
                        v-model="search_dataRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>

        <template>
            <el-table :data="userTableList.rows" height="100%" stripe border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, currentPage, rows);
                        }
                    "
                    align="center"
                    width="60"
                    label="序号"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="用户账号" align="left" sortable prop="account">
                    <template slot-scope="scope">{{ scope.row.account }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="用户姓名" align="center" sortable prop="name">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <!--<el-table-column-->
                <!--label="用户角色"-->
                <!--align="center"-->
                <!--&gt;-->
                <!--<template slot-scope="scope">-->
                <!--<span-->
                <!--v-for="item in scope.row.roles"-->
                <!--:key="item.id"-->
                <!--class="qs-item"-->
                <!--&gt;{{item.name}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip label="加入时间" align="center" sortable prop="createTime">
                    <template slot-scope="scope">{{ scope.row.createTime | audaqueDatetime }}</template>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="账号有效期" align="center">
                    <template slot-scope="scope">
                        <span v-html="$audaquePreventXss(userExpirationDateFun(scope.row), $xssWhitelist)"></span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="pageType === 'system'"
                    show-overflow-tooltip
                    label="操作"
                    align="center"
                    width="220"
                >
                    <!--inside   内置用户如（admin）-->
                    <template slot-scope="scope">
                        <span
                            title="编辑"
                            class="iconfont iconziyuan3 operate"
                            @click="edit(scope.row.id, 'edit')"
                            v-if="permitList.modifyUser && scope.row.id != 1"
                        >
                        </span>
                        <span
                            title="查看"
                            class="iconfont iconchakan11 operate"
                            @click="edit(scope.row.id, 'view')"
                            v-if="permitList.modifyUser"
                        ></span>
                        <template v-if="!isCluster">
                            <span
                                title="禁用"
                                class="iconfont iconjinyong1 operate"
                                @click="stopStartUser([scope.row.id], scope.row.enabled)"
                                v-if="permitList.disableUser && scope.row.enabled && !scope.row.inside"
                            >
                            </span>
                            <span
                                title="启用"
                                class="iconfont iconqiyong2 operate"
                                @click="stopStartUser([scope.row.id], scope.row.enabled)"
                                v-if="permitList.enableUser && !scope.row.enabled && !scope.row.inside"
                            >
                            </span>
                            <!--在租户环境不可设置账号有效期-->
                            <span
                                class="iconfont iconpeizhi operate"
                                @click="userExpirationDate(scope.row, [scope.row.id])"
                                v-if="permitList.effectExpiredUser && defTenant === 0 && !scope.row.inside"
                                title="设置账号有效期"
                            >
                            </span>
                            <span
                                class="iconfont iconmimazhongzhi operate"
                                @click="confirmLoginPassword([scope.row.id])"
                                v-if="permitList.resetPwd && scope.row.id != 1"
                                title="重置密码"
                            ></span>
                            <span
                                title="删除"
                                class="iconfont iconShape1 operate"
                                v-if="permitList.deleteUser && scope.row.id != 1"
                                @click="deleteUser([scope.row.id])"
                            >
                            </span>
                        </template>
                        <!--  <span
                            :title="scope.row.enabled ? '禁用' : '启用'"
                            :class="['iconfont', scope.row.enabled ? 'iconjinyong1' : 'iconqiyong2', 'operate']"
                            @click="stopStartUser([scope.row.id], scope.row.enabled)"
                            v-if="
                                (permitList.disableUser && scope.row.enabled && !scope.row.inside) ||
                                (permitList.enableUser && !scope.row.enabled && !scope.row.inside)
                            "
                        >
                        </span>-->
                        <!--只在单机版上显示该功能在单点登录上没有该功能-->
                        <!-- <span
                            title="强制退出"
                            class="iconfont iconweibiaoti&#45;&#45; operate"
                            v-if="permitList.forceLogoutUser && isSignIn == 'login' && !scope.row.inside"
                            @click="forceLogoutUser(scope.row.id)"
                        >
                        </span>-->
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    v-if="pageType === 'dept'"
                    align="center"
                    width="220"
                >
                    <template slot-scope="scope">
                        <span
                            class="iconfont iconmimazhongzhi operate"
                            @click="confirmLoginPassword([scope.row.id])"
                            v-if="!isCluster && permitList.resetPwd && scope.row.id != 1"
                            title="重置密码"
                        ></span>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <audaque-table-empty
                        @fetch="getUserList"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="userTableList.total"
                :page-size="rows"
                :current-page="currentPage"
            ></adq-pagination>
        </template>

        <el-dialog
            title="设置账号有效期"
            width="40%"
            @close="(userForm.effectTime = null), (userForm.expiredTime = null)"
            :visible.sync="userExpirationDateDialog"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            class="expiration-date"
        >
            <el-form ref="ruleform" :model="userForm" label-width="100px" class="form">
                <el-col :span="24">
                    <el-form-item label="账号生效时间" prop="effectTime">
                        <el-date-picker
                            v-model="userForm.effectTime"
                            type="datetime"
                            placeholder="请选择账号生效时间"
                            :picker-options="pickerOptionsStart"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="账号过期时间" prop="expiredTime">
                        <el-date-picker
                            v-model="userForm.expiredTime"
                            type="datetime"
                            placeholder="请选择账号过期时间"
                            :picker-options="pickerOptionsEnd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <div style="clear: both"></div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userExpirationDateDialog = false">取 消</el-button>
                <el-button type="primary" @click="saveExpirationDate">确 定</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions, mapMutations, mapState } from 'vuex';
import JSEncrypt from 'jsencrypt';
export default {
    data() {
        return {
            searchBarVisible: false,
            currentPage: 1,
            rows: 10,
            search_dataRange: null, //
            userExpirationDateDialog: false,
            userForm: {
                userIds: null,
                effectTime: null,
                expiredTime: null,
            },
            pickerOptionsStart: {
                disabledDate: (time) => {
                    let endDateVal = this.userForm.expiredTime;
                    if (endDateVal) {
                        return time.getTime() < Date.now() - 8.64e7 || time.getTime() > new Date(endDateVal).getTime();
                    } else {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
            },
            pickerOptionsEnd: {
                disabledDate: (time) => {
                    let beginDateVal = this.userForm.effectTime;
                    if (beginDateVal) {
                        return time.getTime() < new Date(beginDateVal).getTime();
                    } else {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
            },
            isSignIn: window.isSignIn /*单点登录‘home’  非单点登录 'login'  在配置文件api.config.js里配置*/,
            searchList: {
                account: '',
                name: '',
            },
            userTableList: {
                rows: [],
                total: 0,
            },
            checkIds: [],
            formData: {},
            loading: false,
            isCluster: window.isCluster, //是否是集群环境
        };
    },

    created() {
        this.getUserList();
    },
    mixins: [adqSearchMixin],
    props: {
        pageType: {
            type: String,
            default: '', //system 系统组织  dept 部门组织
        },
    },
    computed: {
        ...mapState('webkit', ['defTenant']),
    },

    methods: {
        ...mapActions(['_AJAX']),
        ...mapActions('user', [
            'GETUSERLIST',
            'RESET_PWD',
            'DELETE_USER_USER',
            'ENABLE_USER',
            'DISABLE_USER',
            'FORCE_LOGOUT_USER',
            'SET_USER_EXPIRATION_DATE',
            'GETPUBLICKEY',
        ]),
        ...mapMutations('user', ['INIT_USER_LIST', 'NEXT_USER_LIST', 'toggle_user_status', 'delete_user_by_userid']),
        /*导出*/
        exportFun(api) {
            this.publics.exportFile(this, api, {});
        },
        /*
         * 导入用户
         * */
        uploadFile(event) {
            this.formData = new FormData();
            this.formData.append('upFile', event.target.files[0]);
            this.loading = true;
            this._AJAX({
                url: 'user.userListImport',
                data: this.formData,
                method: 'POST',
            })
                .then((res) => {
                    this.loading = false;
                    if (res.code === 0) {
                        //上传成功
                        this.$message({ message: '导入成功', type: 'success' });
                    } else {
                        this.$AudaqueToast.error({
                            template: `${res.msg}`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                    //删除formData对象
                    this.delFormData();
                })
                .catch(() => {
                    this.loading = false;
                    //删除formData对象
                    this.delFormData();
                });
        },
        /*删除formData对象*/
        delFormData() {
            this.$refs.upload.value = null;
            for (var key of this.formData.keys()) {
                this.formData.delete(key);
            }
        },
        /*选中的表格数据*/
        handleSelectionChange(val) {
            this.checkIds = val.map((item) => item.id);
        },
        /*判断是否有选中的表格数据*/
        isCheckTableData(ids) {
            if (ids.length > 0) {
                this.$store.commit('SHOW_LOADING', true);
                return true;
            } else {
                this.$AudaqueToast.error({
                    template: `请选择要操作的数据`,
                    methods: {
                        okEvent() {},
                    },
                });
                return false;
            }
        },

        //查询客户列表
        getUserList() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                includeRole: this.includeRole,
                rows: this.rows,
                currentPage: this.currentPage,
                searchList: this.searchList,
                search_dataRange: this.search_dataRange,
            };
            let params = Object.assign(
                {
                    includeRole: true,
                    rows: this.rows,
                    page: this.currentPage,
                },
                this.searchList
            );
            params.beginCreateTimeStr = this.search_dataRange ? this.search_dataRange[0] : '';
            params.endCreateTimeStr = this.search_dataRange ? this.search_dataRange[1] : '';
            if (this.pageType === 'system') {
                this._AJAX({
                    url: 'webkit.getUserList',
                    method: 'GET',
                    data: params,
                }).then((res) => {
                    if (res.code === 0) {
                        this.userTableList = res;
                    }
                });
            } else {
                this._AJAX({
                    url: 'webkit.myUserList',
                    method: 'GET',
                    data: params,
                }).then((res) => {
                    if (res.code === 0) {
                        this.userTableList = res;
                    }
                });
            }
        },
        queryListFn(type) {
            this.currentPage = 1;
            if (type === 1) {
                //重置
                this.publics.resetFun(this.searchList, () => {
                    this.search_dataRange = null;
                });
            }
            this.getUserList();
        },
        forceLogoutUser(id) {
            this.FORCE_LOGOUT_USER(id).then((res) => {
                this.$AudaqueToast.tip({
                    template: `强制退出成功`,
                    methods: {
                        okEvent() {},
                    },
                });
            });
        },

        handleSizeChange(val) {
            this.rows = val;
            this.currentPage = 1;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getUserList();
        },
        edit(userId, filter) {
            this.$router.push({
                path: '/webkit/userManageEdit',
                query: {
                    userId,
                    filter,
                    pageType: this.pageType,
                    optType: filter,
                },
            });
        },
        addUser() {
            this.$router.push({
                path: '/webkit/userManageEdit',
                query: {
                    pageType: this.pageType,
                    optType: 'add',
                },
            });
        },
        /*确认登录密码*/
        confirmLoginPassword(ids) {
            let _this = this;
            let form = {
                confirmPwd: '', //
            };
            this.$AudaqueToast.dialog({
                title: '重置密码',
                width: '600px',
                template: `
                            <div class="">
                                <div style="text-align: center;margin-bottom: 20px;">重置密码前请先输入您的登录密码</div>
                                <el-form
                                    :model="form"
                                    label-width="100px"
                                    class="form"
                                    ref="form"
                                    :rules="rules"
                                >
                                    <el-form-item label="登录密码" prop="confirmPwd" class="newPwd-item">
                                        <el-input
                                            v-model.trim="form.confirmPwd"
                                            type="password"
                                        >
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                        </div>
                            `,
                mounted() {},
                computed: {},
                data: {
                    form,
                    rules: {
                        confirmPwd: [{ required: true, message: '请输入您的登录密码', trigger: 'blur' }],
                    },
                },
                methods: {
                    okEvent() {
                        let keep = false;
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                let encrypt = new JSEncrypt();
                                _this.GETPUBLICKEY().then((res) => {
                                    encrypt.setPublicKey(res.result);
                                    let confirmPwd = encrypt.encrypt(this.form.confirmPwd);
                                    _this.resetPWD(ids, confirmPwd);
                                });
                            } else {
                                keep = true;
                                return false;
                            }
                        });
                        return keep;
                    },
                },
            });
        },
        /*重置密码*/
        resetPWD(ids, confirmPwd) {
            const _this = this;
            if (this.isCheckTableData(ids)) {
                this.RESET_PWD({ userIds: ids, confirmPwd, pwdType: 1 })
                    .then((res) => {
                        this.$AudaqueToast.tip({
                            template: `密码重置成功`,
                            methods: {
                                okEvent() {
                                    _this.getUserList();
                                },
                            },
                        });
                    })
                    .catch((err) => (this.loading = false));
            }
        },
        /*启用禁用*/
        stopStartUser(ids, enabled) {
            const _this = this;
            if (enabled) {
                if (this.isCheckTableData(ids)) {
                    this.DISABLE_USER({ userIds: ids }).then((res) => {
                        this.$AudaqueToast.tip({
                            template: `禁用成功`,
                            methods: {
                                okEvent() {
                                    _this.getUserList();
                                },
                            },
                        });
                    });
                }
            } else {
                if (this.isCheckTableData(ids)) {
                    this.ENABLE_USER({ userIds: ids }).then((res) => {
                        this.$AudaqueToast.tip({
                            template: `启用成功`,
                            methods: {
                                okEvent() {
                                    _this.getUserList();
                                },
                            },
                        });
                    });
                }
            }
        },
        /*删除*/
        deleteUser(ids) {
            let _this = this;
            if (this.isCheckTableData(ids)) {
                this.$AudaqueToast.warn({
                    template: `确认删除？`,
                    methods: {
                        okEvent() {
                            _this.DELETE_USER_USER({ userIds: ids }).then((res) => {
                                _this.$AudaqueToast.tip({
                                    template: `删除成功`,
                                    methods: {
                                        okEvent() {
                                            _this.getUserList();
                                        },
                                    },
                                });
                            });
                        },
                        cancelEvent() {
                            _this.$store.commit('SHOW_LOADING', false);
                        },
                    },
                });
            }
        },
        userExpirationDateFun(item) {
            if (item.effectTime) {
                item.effectTime = this.publics.formatTime(item.effectTime, 'Y-M-D h:m:s');
            } else {
                item.effectTime = '';
            }
            if (item.expiredTime) {
                item.expiredTime = this.publics.formatTime(item.expiredTime, 'Y-M-D h:m:s');
            } else {
                item.expiredTime = '';
            }
            if (!item.effectTime && !item.expiredTime) return '<span style="color: #b8c316">未设置账号有效期</span>';
            if (item.expiredTime && new Date(item.expiredTime).valueOf() < new Date().valueOf())
                return `<span style="color: red">${item.effectTime} 至 ${item.expiredTime} (账号已过期)</span>`;
            if (!item.effectTime && item.expiredTime) return `<span>有效期至 ${item.expiredTime}</span>`;
            if (item.effectTime && !item.expiredTime) return `<span>${item.effectTime} 开始生效</span>`;
            return `<span>${item.effectTime} 至 ${item.expiredTime}</span>`;
        },
        userExpirationDate(row, ids) {
            this.userExpirationDateDialog = true;
            this.userForm.userIds = ids;
            if (row && row.effectTime)
                this.userForm.effectTime = this.publics.formatTime(row.effectTime, 'Y-M-D h:m:s');
            if (row && row.expiredTime)
                this.userForm.expiredTime = this.publics.formatTime(row.expiredTime, 'Y-M-D h:m:s');
        },
        saveExpirationDate() {
            if (this.userForm.effectTime != '' && this.userForm.effectTime != null) {
                this.userForm.effectTime = this.userForm.effectTime.replace(' ', 'T');
            }
            if (this.userForm.expiredTime != '' && this.userForm.expiredTime != null) {
                this.userForm.expiredTime = this.userForm.expiredTime.replace(' ', 'T');
            }
            this.$store.commit('SHOW_LOADING', true);
            this.SET_USER_EXPIRATION_DATE(this.userForm)
                .then((res) => {
                    this.getUserList();
                    this.userExpirationDateDialog = false;
                })
                .catch((err) => {
                    this.userExpirationDateDialog = false;
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.title-dropdown-item {
    margin-top: 0;
    /deep/.el-dropdown-menu__item--divided {
        margin-top: 0;
        padding: 5px 15px;
        &:before {
            height: 0;
        }
    }
}
.import-template {
    position: relative;
}
.inputFile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
}
</style>
