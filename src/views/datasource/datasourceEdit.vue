<template>
    <audaque-detail-form-page
        @submit-click="submitForm"
        :title="$route.query.id ? '编辑数据源' : '新增数据源'"
        :opt-type="$route.query.filter"
    >
        <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="160px" class="source-manage-form">
            <el-form-item class="source-list" label="数据源名称" prop="name" :rules="rules.name">
                <el-input v-model.trim="ruleForm.name" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="数据源分类名" prop="key" :rules="rules.key">
                <el-select
                    :disabled="$route.query.id ? true : false"
                    v-model="ruleForm.key"
                    placeholder="请选择数据源分类名"
                    @change="changeForm(ruleForm.key)"
                >
                    <el-option
                        v-for="(item, index) in category"
                        :key="index"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>
            </el-form-item>

            <!--所属部门-->
            <el-form-item
                v-if="pageType === 'dept'"
                class="source-list"
                label="所属部门"
                prop="deptId"
                :rules="rules.deptId"
            >
                <el-select v-model="ruleForm.deptId" placeholder="请选择所属部门">
                    <el-option
                        v-for="(item, index) in deptList"
                        :key="index"
                        :label="item.deptName"
                        :value="item.deptId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="pageType === 'system'"
                class="source-list"
                label="所属部门"
                prop="deptName"
                :rules="rules.deptName"
            >
                <el-input
                    v-model.trim="ruleForm.deptName"
                    ref="ssbm"
                    readonly
                    @focus="isShowDeptTree = true"
                ></el-input>
                <div class="search-tree" v-show="isShowDeptTree" @mouseleave="treeMouseLeave">
                    <adq-tree
                        ref="deptTree"
                        @node-click="handleNodeClick"
                        :defaultCheckedKeys="deptDefaultCheckedKeys"
                        :show-checkbox="false"
                        :expandOnClickNode="false"
                    >
                    </adq-tree>
                </div>
            </el-form-item>

            <el-form-item class="source-list" label="状态" prop="enabled" :rules="rules.enabled">
                <el-select v-model="ruleForm.enabled" placeholder="请选择状态">
                    <el-option label="启用" :value="true"></el-option>
                    <el-option label="禁用" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="source-sq-list sq-cls" label="授权" prop="appKeys" :rules="rules.appKeys">
                <label class="all">全部</label>
                <el-switch v-model="ruleForm.publicSource"></el-switch>
                <el-select v-if="!ruleForm.publicSource" multiple v-model="ruleForm.appKeys" placeholder="请选择授权">
                    <el-option
                        :disabled="ruleForm.publicSource ? true : false"
                        v-for="(app, index) in appList"
                        :key="index"
                        :label="app.appName"
                        :value="app.appKey"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="source-sq-list" label="可见范围" prop="permissionLevel" :rules="rules.permissionLevel">
                <el-select v-model="ruleForm.permissionLevel" placeholder="请选择">
                    <el-option label="私有" :value="1"></el-option>
                    <!--                    <el-option label="公开" :value="2"></el-option>-->
                    <!--                    <el-option label="自定义" :value="3" v-if="pageType === 'system'"></el-option>-->
                </el-select>
            </el-form-item>
            <el-form-item class="source-sq-list tree-box" label="访问部门:" v-if="ruleForm.permissionLevel === 3">
                <adq-tree ref="tree" :defaultCheckedKeys="defaultCheckedKeys" :check-strictly="true"></adq-tree>
            </el-form-item>
            <el-form-item class="source-sq-list" label="应用场景" prop="sceneType" :rules="rules.sceneType">
                <el-select v-model="ruleForm.sceneType" placeholder="请选择" clearable>
                    <el-option label="生产环境" :value="1"></el-option>
                    <el-option label="前置机" :value="2"></el-option>
                    <el-option label="归集库" :value="3"></el-option>
                    <el-option label="其它" :value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                class="source-sq-list"
                label="数据采集方式"
                prop="dataCollection"
                :rules="rules.dataCollection"
            >
                <el-select v-model="ruleForm.dataCollection" placeholder="请选择" clearable>
                    <el-option label="数据采集" :value="1"></el-option>
                    <el-option label="共享交换" :value="2"></el-option>
                    <el-option label="在线报送" :value="3"></el-option>
                    <el-option label="业务生产" :value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="source-list-full" label="描述" prop="remark">
                <el-input type="textarea" v-model.trim="ruleForm.remark" maxlength="256" show-word-limit></el-input>
            </el-form-item>
            <div class="change-form" v-if="addForm.length > 0">
                <!--
                type 1文本框组件，2密码组件，3文件组件，4单选组件，5多选组件，6textarea
                -->
                <!--                    "'addForm.' + index + '.defaultValue'" :rules="{-->
                <!--                    required: item.required, message: '请输入'+ item.name, trigger: item.type==3|| item.type==4?'change':'blur'}"-->
                <template v-for="(item, index) in addForm">
                    <!-- 因为有集群密码label,需要根据大数据平台来控制是否必填,非必填则隐藏  多选组件时需根据selectValue来控制显示和隐藏 -->
                    <el-form-item
                        :key="index"
                        class="source-list"
                        :label="item.name"
                        :prop="item.key"
                        :rules="ruleFun(item)"
                        v-if="beforeMultiple(item, ruleForm[parentSelect]) && beforIsShow(item, ruleForm[parentSelect])"
                    >
                        <!--没有上级选项   全部展示不需要过滤-->
                        <el-select
                            v-if="item.type == 4 && !item.parentSelect"
                            v-model="ruleForm[item.key]"
                            :placeholder="item.sampleValue"
                            @change="changeSelection(item)"
                        >
                            <template v-for="(val, key, index) in item.selectValue">
                                <el-option
                                    :label="val"
                                    :key="index"
                                    :value="key"
                                    :title="val + ',' + key + ',' + index"
                                ></el-option>
                            </template>
                        </el-select>

                        <el-select
                            v-else-if="item.type == 4 && item.parentSelect"
                            v-model="ruleForm[item.key]"
                            :placeholder="item.sampleValue"
                            @change="changeSelection(item)"
                        >
                            <template v-for="(val, key, index) in item.selectValue">
                                <el-option
                                    v-if="key.split('_').indexOf(ruleForm[parentSelect]) > -1"
                                    :label="val"
                                    :key="index"
                                    :value="key.split('_')[1]"
                                    :title="val + ',' + key + ',' + index"
                                ></el-option>
                            </template>
                        </el-select>
                        <el-checkbox-group v-else-if="item.type == 5" v-model="ruleForm[item.key]">
                            <template v-for="(val, key) in item.selectValue">
                                <el-checkbox
                                    v-if="key.split('_').indexOf(ruleForm[parentSelect]) > -1"
                                    :label="key.split('_')[1]"
                                    :name="val"
                                    :key="key"
                                    >{{ val }}
                                </el-checkbox>
                            </template>
                        </el-checkbox-group>
                        <!-- 因为有集群密码,需要根据大数据平台来控制是否必填,非必填则隐藏,根据clusterPwdisShow指定查验ruleForm里的值 -->
                        <el-input
                            v-else-if="item.type == 2 && !item.parentSelect"
                            type="password"
                            @focus="emptyVal(ruleForm[item.key], item.key)"
                            @blur="des_encrypt(ruleForm[item.key], item.key)"
                            auto-complete="new-password"
                            v-model.trim="ruleForm[item.key]"
                            :placeholder="item.sampleValue"
                        ></el-input>
                        <el-input
                            v-else-if="
                                item.type == 2 &&
                                item.parentSelect &&
                                item.displayValue.split(',').indexOf(ruleForm[parentSelect]) > -1
                            "
                            type="password"
                            @focus="emptyVal(ruleForm[item.key], item.key)"
                            @blur="des_encrypt(ruleForm[item.key], item.key)"
                            auto-complete="new-password"
                            v-model="ruleForm[item.key]"
                            :placeholder="item.sampleValue"
                        ></el-input>
                        <el-input
                            v-else-if="item.type == 6"
                            type="textarea"
                            v-model.trim="ruleForm[item.key]"
                            :placeholder="item.sampleValue"
                        ></el-input>
                        <el-upload
                            v-else-if="item.type == 3"
                            class="upload-demo"
                            multiple
                            :action="upload"
                            :headers="publics.ajaxHeaders()"
                            :on-error="handleError"
                            :before-upload="
                                (file) => {
                                    return beforeAvatarUpload(file, item);
                                }
                            "
                            :on-success="
                                (res, file, fileList) => {
                                    return handleSuccess(fileList, item);
                                }
                            "
                            :on-remove="
                                (file) => {
                                    return handleRemove(file, item);
                                }
                            "
                            :file-list="ruleForm[item.key]"
                        >
                            <el-checkbox-group v-model="ruleForm[item.key]" style="display: none">
                                <el-checkbox label="复选框 A"></el-checkbox>
                            </el-checkbox-group>
                            <el-button size="small" type="primary">点击上传</el-button>
                            <span
                                v-if="item.fatherKey == 'customJdbc'"
                                @click.stop="blankUrl"
                                style="text-decoration: underline; color: #409eff"
                                >相关产品驱动包配置指引</span
                            >
                            <!--                            <div slot="tip" class="el-upload__tip">{{JSON.stringify(item.fileList)}}</div>-->
                        </el-upload>

                        <el-input
                            v-else-if="item.type == 1"
                            v-model.trim="ruleForm[item.key]"
                            :placeholder="item.sampleValue"
                        ></el-input>
                    </el-form-item>
                </template>
            </div>
        </el-form>
        <template slot="bottom">
            <el-button
                v-if="permitFun(permitList.testSource, permitList.testMySource)"
                type="primary"
                v-loading="loadingTest"
                @click="submitForm(1)"
                >测试连接</el-button
            >
            <el-button
                type="primary"
                @click="submitForm()"
                v-loading="loadingSave"
                v-if="permitFun(permitList.modifySource, permitList.modifyMySource)"
                >提交</el-button
            >
            <el-button @click="resetForm">重置</el-button>
        </template>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import adqTree from '@/components/adqTree';
import JSEncrypt from 'jsencrypt';

export default {
    async created() {
        this.getPublicKey(); //请求加密规则
        await this._AJAX({
            url: 'user.getMyDepts',
            method: 'GET',
            data: {},
        }).then((res) => {
            if (res.result && res.result.length > 0) {
                this.isMyDept = true;
                this.deptList = res.result;
            } else {
                this.isMyDept = false;
            }
        });
        this.ALL_CATEGORY();
        this.ALL_APP();
        let sourceId = this.$route.query.id;
        if (sourceId) {
            this._AJAX({
                url: this.pageType === 'dept' ? 'datasource.mySourceDetail' : 'datasource.sourceDetail',
                method: 'GET',
                data: { sourceId: sourceId },
            }).then((res) => {
                //defaultValue
                let result = res.result;
                this.ruleForm.id = result.id || '';
                this.ruleForm.name = result.name || '';
                this.ruleForm.key = result.key || '';
                this.ruleForm.permissionLevel = result.permissionLevel; //可见范围
                this.ruleForm.sceneType = result.sceneType; //应用场景
                this.ruleForm.dataCollection = result.dataCollection; //数据采集方式
                this.defaultCheckedKeys = result.deptIdList ? result.deptIdList : []; //当自定义范围时 树的回显
                this.$set(this.ruleForm, 'deptId', result.deptId); //所属部门id
                this.$set(this.ruleForm, 'deptName', result.deptName); //所属部门名称
                this.deptDefaultCheckedKeys = [result.deptId]; //当时管理员角色时 树的回显
                let appKeys = '';
                appKeys = result.appKeys
                    ? result.appKeys.split(',').filter((s) => {
                          return s && s.trim();
                      })
                    : [];
                this.ruleForm.appKeys = [];
                appKeys.forEach((item) => {
                    this.appList.forEach((item1) => {
                        if (item == item1.appKey) {
                            this.ruleForm.appKeys.push(item);
                        }
                    });
                });
                this.ruleForm.enabled = result.enabled;
                this.ruleForm.remark = result.remark || '';
                if (result.key) this.changeForm(result.key, true);
                let checkObj = {};
                this.addForm = result.definition.properties.map((item) => {
                    item.defaultValue = result[item.key] || result.customMap[item.key] || '';
                    if (item.type == 4 && item.key == this.parentSelect) checkObj = Object.assign({}, item);
                    if (item.type == 3) {
                        this.$set(this.ruleForm, item.key, []);
                    } else {
                        this.$set(this.ruleForm, item.key, item.defaultValue);
                    }
                    if (item.type == 5) {
                        this.$set(this.ruleForm, item.key, item.defaultValue ? item.defaultValue.split(',') : []);
                    }
                    return item;
                });
                this.changeSelection(checkObj, true);
                this.getKeyToName();
            });
        }
    },
    watch: {
        'ruleForm.publicSource': function (bool) {
            this.$refs.ruleForm.validateField('appKeys');
            if (bool) this.$set(this.ruleForm, 'appKeys', []);
        },
        'ruleForm.appKeys': {
            handler: function (newVal, oldVal) {
                newVal.length > 0
                    ? this.$set(this.ruleForm, 'publicSource', false)
                    : this.$set(this.ruleForm, 'publicSource', true);
            },
            deep: true,
        },
    },
    computed: {
        ...mapState('datasource', ['appList', 'category']),
        ...mapState(['upload']),
    },
    components: { adqTree },
    data() {
        let validateAppKeys = (rule, value, callback) => {
            if (!this.ruleForm.publicSource && this.ruleForm.appKeys.length == 0) {
                callback(new Error('请输入权限'));
            } else {
                callback();
            }
        };
        return {
            clusterPwdisShow: '',
            parentSelect: '',
            selectionObj: {},
            addForm: [],
            ruleForm: {
                name: '',
                publicSource: false,
                key: '',
                appKeys: [],
                enabled: '',
                remark: '',
                deptId: null,
                permissionLevel: 1,
                deptIds: null,
                sceneType: null, //应用场景
                dataCollection: null, //数据采集方式
            },
            rules: {
                enabled: [{ required: true, message: '请选择状态', trigger: 'change' }],
                appKeys: [{ validator: validateAppKeys, trigger: ['blur', 'change'] }],
                name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
                key: [{ required: true, message: '请输入数据源分类名称', trigger: 'change' }],
                deptName: [{ required: true, message: '请选择所属部门', trigger: ['change', 'blur'] }],
                deptId: [{ required: true, message: '请选择所属部门', trigger: ['change', 'blur'] }],
                permissionLevel: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
            },
            defaultCheckedKeys: [],
            deptDefaultCheckedKeys: [],
            isShowDeptTree: false,
            isMyDept: true, //是否是部门权限
            deptList: [],
            pageType: this.$route.query.pageType,
            passwordS: {},
            token: sessionStorage.getItem('token'),
            privateKey: null, //密码框加密规则
            loadingTest: false,
            loadingSave: false,
            isCluster: window.isCluster, //是否是集群环境
        };
    },
    methods: {
        ...mapActions('datasource', ['ALL_CATEGORY', 'ALL_APP']),
        ...mapActions(['VIEWFILE', '_AJAX']),
        ...mapActions('user', ['GETPUBLICKEY', 'GETPUBLICKEY_USER']),
        /*
         * 按钮权限的实现
         * systemPermit 系统组织的按钮权限
         * deptPermit 部门组织的按钮权限
         * */
        permitFun(systemPermit, deptPermit) {
            if (this.pageType === 'system') return systemPermit;
            else if (this.pageType === 'dept') return deptPermit;
        },
        /*
         * 请求加密规则
         * */
        getPublicKey() {
            //集群环境
            if (this.isCluster) {
                this.GETPUBLICKEY_USER().then((res) => {
                    this.privateKey = res.result; //加密规则
                });
            } else {
                //单机版
                this.GETPUBLICKEY().then((res) => {
                    this.privateKey = res.result; //加密规则
                });
            }
        },
        /*判断  displayValue  当上级选项的值等于该值，当前组件显示，如果未配置表示一直显示，多个值用逗号分隔*/
        beforIsShow(obj, parentSelect) {
            if (!obj.parentSelect) {
                return true;
            } else if (!obj.displayValue || obj.displayValue.split(',').indexOf(parentSelect) > -1) {
                return true;
            } else {
                /*清除已隐藏框的值*/
                this.$set(this.ruleForm, obj.key, '');
                return false;
            }
        },
        beforRenderFilter(obj) {
            if (obj.type !== 2) return true;
            else if (!obj.parentSelect) return true;
            else if (this.ruleForm[this.parentSelect]) {
                let checkArr = this.clusterPwdisShow.split(',');
                if (checkArr && checkArr.indexOf(this.ruleForm[this.parentSelect]) > -1) {
                    return true;
                }
                return false;
            } else return false;
        },
        /*验证多选组件时是否显示*/
        beforeMultiple(obj, parentSelect) {
            if (obj.type !== 5) return true;
            else {
                let i = 0;
                for (let key in obj.selectValue) {
                    if (key.split('_').indexOf(parentSelect) > -1) i++;
                }
                if (i > 0) return true;
                return false;
            }
        },
        ruleFun(item) {
            let trigStr = item.type == 3 || item.type == 4 ? 'change' : 'blur';
            let arr = [
                {
                    required: item.required,
                    message: '请输入' + item.name,
                    trigger: trigStr,
                },
            ];
            if (item.key == 'host') {
                let reg = null;
                if (this.ruleForm.key === 'redis') {
                    //校验 ip+端口
                    // reg = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                    return;
                } else {
                    //校验ip
                    reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                }

                let validateIp = (rule, value, callback) => {
                    if (!reg.test(value)) {
                        callback(new Error('主机名或IP地址错误！'));
                    } else {
                        callback();
                    }
                };
                arr.push({ validator: validateIp, trigger: trigStr });
            } else if (item.key == 'port') {
                let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                let validatePort = (rule, value, callback) => {
                    if (!reg.test(value)) {
                        callback(new Error('端口错误！'));
                    } else {
                        callback();
                    }
                };
                arr.push({ validator: validatePort, trigger: trigStr });
            }
            return arr;
        },
        getKeyToName() {
            let getNewArray = [];
            this.addForm.forEach((item) => {
                if (item.type == 3 && item.defaultValue && item.defaultValue != '') getNewArray.push(item.defaultValue);
            });
            let getNewStr = getNewArray.join(',');
            if (getNewStr == '' || !getNewStr) return;
            this.VIEWFILE(getNewArray.join(',')).then((res) => {
                let result = res.result;
                this.addForm.forEach((item) => {
                    if (item.type == 3) {
                        result.forEach((item2) => {
                            if (item.defaultValue.indexOf(item2.key) > -1) {
                                this.ruleForm[item.key].push({ name: item2.value, url: item2.key });
                            }
                        });
                    }
                });
            });
        },
        handleRemove(file, item) {
            this.ruleForm[item.key].forEach((list, index) => {
                let listUrl = list.url || list.response.result;
                let fileUrl = file.url || file.response.result;
                if (listUrl == fileUrl) {
                    this.ruleForm[item.key].splice(index, 1);
                }
            });
        },
        handleError(err, file, fileList) {
            this.$AudaqueToast.error({
                template: err ? JSON.parse(err.message).msg : `文件上传失败`,
                methods: {
                    okEvent() {},
                },
            });
        },
        beforeAvatarUpload(file, item) {
            let isFlag = true;
            if (item.format && item.format != '' && file.name.indexOf(item.format) < 0) {
                this.$AudaqueToast.error({
                    template: '上传格式必须是.' + item.format,
                    methods: {
                        okEvent() {},
                    },
                });
                isFlag = false;
            }
            return isFlag;
        },
        handleSuccess(fileList, item) {
            this.ruleForm[item.key] = [];
            fileList &&
                fileList.forEach((list) => {
                    if (list.url || (list.response && list.response.code === 0)) {
                        //上传成功
                        this.$message({
                            message: '上传成功',
                            type: 'success',
                        });
                        this.ruleForm[item.key].push(list);
                    } else {
                        this.$AudaqueToast.error({
                            //上传失败
                            template: list.response.msg,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                });
            // this.ruleForm[item.key] = fileList;
        },
        submitForm(testId) {
            const _this = this;
            this.isShowDeptTree = false;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid && this.isContain()) {
                    if (testId) {
                        this.loadingTest = true;
                    } else {
                        this.loadingSave = true;
                    }
                    let ruleForm = {};
                    let ruleFormCopy = Object.assign({}, this.ruleForm);
                    for (let key in ruleFormCopy) {
                        let list = ruleFormCopy[key];
                        if (list && typeof list == 'object') {
                            ruleForm[key] = list
                                .map((element) => {
                                    if (typeof element == 'object') {
                                        return element.url || element.response.result;
                                    }
                                    return element;
                                })
                                .join(',');
                        } else {
                            ruleForm[key] = ruleFormCopy[key];
                        }
                    }
                    if (this.ruleForm.permissionLevel == 3) {
                        //自定义范围
                        let deptList = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                        if (deptList.indexOf(this.ruleForm.deptId) == -1) {
                            //去重
                            ruleForm['deptIds'] = this.ruleForm.deptId + ',' + deptList.join(',');
                        } else {
                            ruleForm['deptIds'] = deptList.join(',');
                        }
                    } else if (this.ruleForm.permissionLevel == 1) {
                        //私有
                        ruleForm['deptIds'] = this.ruleForm.deptId;
                    }

                    this.$store.commit('SHOW_LOADING', true);
                    if (testId) {
                        this._AJAX({
                            url: _this.pageType === 'dept' ? 'datasource.testMySource' : 'datasource.testSource',
                            method: 'POST',
                            data: ruleForm,
                        })
                            .then((res) => {
                                if (res.code === 0) {
                                    this.loadingTest = false;
                                    this.$AudaqueToast.tip({
                                        template: `测试连接成功`,
                                        methods: {
                                            okEvent() {},
                                        },
                                    });
                                }
                            })
                            .catch(() => {
                                this.loadingTest = false;
                            });
                    } else if (this.$route.query.id) {
                        this._AJAX({
                            url: _this.pageType === 'dept' ? 'datasource.modifyMySource' : 'datasource.modifySource',
                            method: 'POST',
                            data: ruleForm,
                        })
                            .then((res) => {
                                if (res.code === 0) {
                                    this.loadingSave = false;
                                    this.$AudaqueToast.tip({
                                        template: `修改成功`,
                                        methods: {
                                            okEvent() {
                                                _this.$router.go(-1);
                                            },
                                        },
                                    });
                                }
                            })
                            .catch(() => [(this.loadingSave = false)]);
                    } else {
                        this._AJAX({
                            url: _this.pageType === 'dept' ? 'datasource.addMySource' : 'datasource.addSource',
                            method: 'POST',
                            data: ruleForm,
                        })
                            .then((res) => {
                                if (res.code === 0) {
                                    this.loadingSave = false;
                                    this.$AudaqueToast.tip({
                                        template: `添加成功`,
                                        methods: {
                                            okEvent() {
                                                _this.$router.go(-1);
                                            },
                                        },
                                    });
                                }
                            })
                            .catch(() => [(this.loadingSave = false)]);
                    }
                } else {
                    return false;
                }
            });
        },
        emptyVal(data, key) {
            /*密码框获得焦点时清空数据*/
            this.$set(this.ruleForm, key, '');
        },
        des_encrypt(data, key) {
            if (data && data.length > 0) {
                let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
                //请求加密规则
                // return this.GETPUBLICKEY().then((res) => {
                encryptor.setPublicKey(this.privateKey); //设置公钥
                encryptor.encrypt(data); //加密
                this.$set(this.ruleForm, key, encryptor.encrypt(data));
                return encryptor.encrypt(data);
                // });
            }
        },
        isContain() {
            if (this.ruleForm.permissionLevel == 3) {
                let deptList = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                if (deptList.indexOf(this.ruleForm.deptId) == -1) {
                    //去重
                    this.$AudaqueToast.error({
                        template: `所属部门不在自定义访问部门内!`,
                        methods: {
                            okEvent() {},
                            cancelEvent() {},
                        },
                    });
                    return false;
                }
                return true;
            } else {
                return true;
            }
        },
        resetForm() {
            let sjyflm = this.ruleForm.key; //数据源分类名
            this.$refs['ruleForm'].resetFields();
            this.publics.resetFun(this.ruleForm); //重置
            this.ruleForm.key = sjyflm;
            this.getPublicKey(); //请求加密规则
        },
        changeForm(key, flag = false) {
            let saveObj;
            if (!flag) {
                saveObj = this.ruleForm = {
                    name: this.ruleForm.name,
                    key: this.ruleForm.key,
                    appKeys: this.ruleForm.appKeys,
                    enabled: this.ruleForm.enabled,
                    remark: this.ruleForm.remark,
                };
            } else {
                saveObj = {};
                saveObj = Object.assign({}, this.ruleForm);
            }
            this.$refs['ruleForm'].resetFields();
            this.ruleForm = Object.assign({}, saveObj);
            this.category.forEach((item) => {
                if (item.key == key) {
                    this.addForm = item.properties.map((file) => {
                        if (file.type == 3 || file.type == 5) {
                            this.$set(this.ruleForm, file.key, file.defaultValue ? file.defaultValue.split(',') : []);
                        }
                        // else{this.$set(this.ruleForm, file.key, file.defaultValue || '')}
                        // 回显平台版本,根据大数据平台类型是否需要填集群密码
                        // parentSelect是ruleForm的key,clusterPwdisShow查询ruleform的key是否在其中，有则必填
                        if (file.parentSelect && file.type == 4 && file.key == 'platformVersion') {
                            this.parentSelect = file.parentSelect;
                            this.selectionObj = Object.assign({}, file.selectValue);
                        } else if (file.parentSelect && file.type == 2) {
                            this.clusterPwdisShow = file.displayValue;
                        }
                        file.fatherKey = key;
                        return file;
                    });
                }
            });
        },
        changeSelection(obj, changeStic = false) {
            if (this.parentSelect == obj.key) {
                let splitKey = this.parentSelect;
                let currentKeyName = this.ruleForm[splitKey];
                if (!changeStic) {
                    /*切换大数据平台类型时清空复选框选中的数据（如果不清空复选框的数据在反复切换时回有多余的选中数据）*/
                    this.addForm.map((item) => {
                        if (item.type === 5) {
                            this.ruleForm[item.key] = [];
                        }
                    });
                }
                let chooseArr = {};
                let findIndex = this.addForm.findIndex((item) => {
                    return item.parentSelect == splitKey;
                });
                let changeKeyOBJ = this.addForm.find((item) => {
                    return item.parentSelect == splitKey;
                });
                let changeKey = changeKeyOBJ.key;
                for (let key in this.selectionObj) {
                    if (key.indexOf(currentKeyName) > -1) {
                        chooseArr[key] = this.selectionObj[key];
                    }
                }
                this.addForm[findIndex].selectValue = chooseArr;
                if (Object.keys(chooseArr).length > 0 && !changeStic) {
                    let firstKey = Object.keys(chooseArr)[0];
                    this.$set(this.ruleForm, changeKey, chooseArr[firstKey]);
                } else if (Object.keys(chooseArr).length === 0 && !changeStic) {
                    this.$set(this.ruleForm, changeKey, '');
                } else if (!this.ruleForm[changeKey] && !changeStic) {
                    this.$set(this.ruleForm, changeKey, '');
                }
            }
        },
        blankUrl() {
            let routeUrl = this.$router.resolve({
                path: '/guide',
                query: {},
            });
            window.open(routeUrl.href, '_blank');
        },
        treeMouseLeave() {
            this.$refs.ssbm.blur();
            this.isShowDeptTree = false;
        },
        handleNodeClick(data, Node) {
            if (data.level != 0) {
                this.$set(this.ruleForm, 'deptName', data.name);
                this.$set(this.ruleForm, 'deptId', data.id);
                this.isShowDeptTree = false;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.source-manage-form {
    /deep/ .source-list-full {
        width: 100%;
        float: left;
    }

    /deep/ .source-list {
        width: 50%;
        float: left;
        position: relative;

        .all {
            width: 40px;
        }

        /deep/ .el-switch {
            margin: 6px 20px 0 0;
        }
    }

    /deep/ .search-tree {
        position: relative;
        top: -2px;

        .el-input__validateIcon {
            display: none;
        }
    }

    /deep/ .source-sq-list {
        width: 100%;
        float: left;

        .all {
            width: 40px;
        }

        /deep/ .el-switch {
            margin: 6px 20px 0 0;
        }

        &.tree-box .el-tree {
            border: 1px solid #dcdfe6;
            min-height: 200px;
            max-height: 300px;
            overflow: auto;
        }
    }

    /deep/ .change-form {
        float: left;
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #f2f2f2;
        margin: 34px 0 0;
        padding-top: 12px;
    }

    /deep/ .sq-cls .el-select {
        width: calc(100% - 120px);
    }
}
</style>
