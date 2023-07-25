<template>
    <audaque-detail-form-page
        @submit-click="submitForm"
        :title="$route.query.id ? '编辑应用' : '新增应用'"
        :opt-type="$route.query.filter"
    >
        <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="source-ruleForm"
        >
            <el-form-item class="source-list" label="应用类型" prop="type">
                <el-radio-group v-model="ruleForm.appType" :disabled="$route.query.id ? true : false">
                    <el-radio :label="1">内部应用</el-radio>
                    <el-radio :label="2">外部应用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="ruleForm.appType == 1" class="source-list" label="应用KEY" prop="appKey">
                <el-input
                    :disabled="$route.query.id ? true : false"
                    v-model.trim="ruleForm.appKey"
                    maxlength="24"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <!--外部应用回显   start-->
            <el-form-item
                v-if="$route.query.id && ruleForm.appType == 2"
                class="source-list"
                label="APPKEY"
                prop="appKey"
            >
                <el-input :disabled="$route.query.id ? true : false" v-model.trim="ruleForm.appKey"></el-input>
            </el-form-item>
            <el-form-item
                v-if="$route.query.id && ruleForm.appType == 2"
                class="source-list"
                label="APPSECRET"
                prop="clientSecret"
            >
                <el-input :disabled="$route.query.id ? true : false" v-model.trim="ruleForm.clientSecret"></el-input>
            </el-form-item>
            <!--外部应用回显   end-->
            <el-form-item class="source-list" label="应用名称" prop="appName">
                <el-input v-model.trim="ruleForm.appName"></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="服务上下文URL" prop="contextUrl">
                <el-input v-model.trim="ruleForm.contextUrl"></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="登录URL" prop="loginUrl">
                <el-input v-model.trim="ruleForm.loginUrl"></el-input>
            </el-form-item>
            <el-form-item class="source-list" label="主页URL" prop="mainUrl">
                <el-input v-model.trim="ruleForm.mainUrl"></el-input>
            </el-form-item>
        </el-form>
        <template slot="bottom">
            <el-button type="primary" @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="submitForm" v-if="permitList.modifyApp" :loading="isSHowButtonLoading"
                >提交</el-button
            >
        </template>
        <el-dialog :visible.sync="imgVisible" :width="'300px'">
            <div style="width: 100%; display: flex; justify-content: center"><img :src="preview" /></div>
        </el-dialog>
    </audaque-detail-form-page>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
    created() {
        this.token = sessionStorage.getItem('token');
        let id = this.$route.query.id;
        if (id) {
            this.APPDETAIL(id).then((res) => {
                let myApp = res.result.myApp;
                this.ruleForm = myApp;
                // if (myApp.appType == 2) {//外部应用
                //     this.ruleForm.type = 2;
                // } else {
                //     this.ruleForm.type = 1;
                // }
            });
        }
    },
    computed: {
        ...mapState(['upload']),
    },
    data() {
        return {
            small: false,
            large: false,
            imgVisible: false,
            preview: '',
            smallIconFile: [],
            largeIconFile: [],
            ruleForm: {
                appType: 1,
                appKey: '',
                appName: '',
                contextUrl: '',
                loginUrl: '',
                mainUrl: '',
                smallIcon: '',
                largeIcon: '',
            },
            rules: {
                appType: { required: true, message: '请指定应用KEY', trigger: 'change' },
                appKey: [{ required: true, message: '请指定应用KEY', trigger: 'blur' }],
                appName: [
                    { required: true, message: '请输入应用名称', trigger: 'blur' },
                    { min: 2, max: 30, message: '应用名称长度为2-30个字符', trigger: 'blur' },
                ],
                contextUrl: [
                    { required: true, message: '请输入服务上下文URL', trigger: 'blur' },
                    { max: 200, message: 'URL最多200个字符', trigger: 'blur' },
                ],
                loginUrl: [
                    { required: true, message: '请输入登录URL', trigger: 'blur' },
                    { max: 200, message: 'URL最多200个字符', trigger: 'blur' },
                ],
                mainUrl: [
                    { required: true, message: '请输入主页URL', trigger: 'blur' },
                    { max: 200, message: 'URL最多200个字符', trigger: 'blur' },
                ],
            },
            token: null,
            fileList: [],
        };
    },
    methods: {
        ...mapActions(['LOADIMG', 'LOADFILE']),
        ...mapActions('webkit', ['MODIFYAPP', 'ADDAPP', 'APPDETAIL']),
        getImg(e) {
            let tar = e.target;
            let eWidth = tar.naturalWidth,
                eHeight = tar.naturalHeight;
            if (tar.className.indexOf('small') > -1) {
                if (eWidth > 130 || eHeight > 131) {
                    this.$message({
                        type: 'warning',
                        message: '该图片尺寸超出小图标显示大小,请控制在 150 x 121像素内',
                        showClose: true,
                    });
                    return setTimeout(() => {
                        this.smallIconFile = [];
                    }, 500);
                }
            } else {
                if (eWidth > 170 || eHeight > 170) {
                    this.$message({
                        type: 'warning',
                        message: '该图片尺寸超出大图标显示大小,请控制在 170 x 170像素内',
                        showClose: true,
                    });
                    this.handleRemove({ url: tar.src }, 'largeIcon');
                    return setTimeout(() => {
                        this.largeIconFile = [];
                    }, 500);
                }
            }
        },
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    let _this = this;
                    let params = Object.assign({}, this.ruleForm);
                    if (params.appType == 2) {
                        this.$delete(params, 'appKey');
                    }
                    this.$route.query.id
                        ? this.MODIFYAPP(params).then((res) => {
                              this.$AudaqueToast.tip({
                                  template: `修改成功`,
                                  methods: {
                                      okEvent() {
                                          _this.$router.go(-1);
                                      },
                                  },
                              });
                          })
                        : this.ADDAPP(params).then((res) => {
                              this.$AudaqueToast.tip({
                                  template: `添加成功`,
                                  methods: {
                                      okEvent() {
                                          _this.$router.go(-1);
                                      },
                                  },
                              });
                          });
                } else {
                    return false;
                }
            });
        },
        handlePictureCardPreview(file) {
            this.preview = file.url;
            this.imgVisible = true;
        },
        beforeAvatarUpload(file) {
            let format = ['jpg', 'png', 'gif'];
            let isFlag = true;
            if (file.size / 1024 > 500) {
                this.$AudaqueToast.error({
                    template: `上传图片大小必须小于500K`,
                    methods: {
                        okEvent() {},
                    },
                });
                return (isFlag = false);
            }
            if (!format.includes(file.name.split('.')[1])) {
                this.$AudaqueToast.error({
                    template: '上传格式必须是.' + format.join(','),
                    methods: {
                        okEvent() {},
                    },
                });
                isFlag = false;
            }
            return isFlag;
        },
        handleSuccess(res, fileList, item) {
            this[item + 'File'] = fileList;
            this.ruleForm[item] = res.result;
        },
        handleRemove(file, item) {
            this.ruleForm[item] = '';
            this[item + 'File'].forEach((list, index) => {
                let listUrl = list.url || list.response.result;
                let fileUrl = file.url || file.response.result;
                if (listUrl == fileUrl) {
                    this[item + 'File'].splice(index, 1);
                }
            });
        },
    },
};
</script>
