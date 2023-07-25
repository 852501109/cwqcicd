<template>
    <div>
        <slot></slot>
        <el-dialog
                @close="editDialogClosed"
                :visible.sync="editDialog"
                width="50%"
        >
            <el-form
                    :model="editForm"
                    :rules="editRules"
                    ref="editForm"
                    label-width="100px"
            >
                <el-form-item
                        label="旧密码"
                        prop="oldPwd"
                >
                    <el-input
                            type="password"
                            v-model="editForm.oldPwd"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="新密码"
                        prop="newPwd"
                >
                    <el-input
                            type="password"
                            v-model="editForm.newPwd"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="确认新密码"
                        prop="confirmPwd"
                >
                    <el-input
                            type="password"
                            v-model="editForm.confirmPwd"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span
                    slot="footer"
                    class="dialog-footer"
            >
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button
                @click="saveEditPassword"
                type="primary"
        >保 存</el-button>
      </span>
        </el-dialog>
        <el-dialog
                @close="userInfoDialogClosed"
                :visible.sync="userInfoDialog"
                width="50%"
        >
            <el-row
                    justify="center"
                    type="flex"
            >
                <div style="position:relative;overflow:hidden;width:75px;height:75px;">
                    <img
                            ref="uploadPic"
                            :src="userIcon"
                            width="75"
                            height="75"
                            style="border-radius:50%;border:solid 1px #dddddd;"
                    />
                    <input
                            class="inputFile"
                            
                            @change="uploadFile($event)"
                            type="file"
                            ref="upload"
                            accept="image/*"
                    />
                </div>
            </el-row>
            <el-row
                    justify="center"
                    type="flex"
                    style="margin:10px 0;"
            >
                <el-button
                        type="primary"
                        @click="uploadimage"
                >上传头像
                </el-button>
            </el-row>
            <el-row>
                <el-form
                        :model="userForm"
                        :rules="userRule"
                        ref="userForm"
                        label-width="100px"
                        class="demo-ruleForm"
                >
                    <el-form-item
                            label="姓名"
                            prop="name"
                    >
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                    <el-form-item
                            label="邮箱"
                            prop="email"
                    >
                        <el-input v-model="userForm.email"></el-input>
                    </el-form-item>
                    <el-form-item
                            label="手机"
                            prop="phone"
                    >
                        <el-input v-model="userForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item
                            v-if="tenantList.length>0"
                            label="当前租户"
                    >
                        <el-select
                                v-model="userForm.defTenant"
                                placeholder="请选择"
                        >
                            <el-option
                                    v-for="item in tenantList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-row>
            <span
                    slot="footer"
                    class="dialog-footer"
            >
        <el-button @click="userInfoDialog = false">取 消</el-button>
        <el-button
                @click="saveBaseInfo"
                type="primary"
        >保 存</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import JSEncrypt from 'jsencrypt'
    import {mapState, mapMutations, mapActions} from 'vuex'

    let emailSupport = true;
    let phoneSupport = true;
    export default {
        data() {
            const validateConfirmPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                } else if (value !== this.editForm.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback()
                }
            }
            const emailCheck = (rule, value, callback) => {
                // let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
                let reg = /\w+@\w+\.\w+/
                if (!emailSupport && !value) {
                    callback();
                    return;
                }
                if (value === '') {
                    callback(new Error('请输入邮箱地址!'));
                } else if (!reg.test(value)) {
                    callback(new Error('输入的不是有效的邮箱格式!'));
                } else {
                    callback()
                }
            }
            const phoneCheck = (rule, value, callback) => {
                if (!phoneSupport && !value) {
                    callback();
                    return;
                }
                if (!value) {
                    callback(new Error("不能为空"));
                } else if (!/^1\d{10}$/.test(value)) {
                    callback(new Error("电话号码不合法"));
                } else {
                    callback()
                }
            }
            return {
                tenantList: [],
                editDialog: false,
                userInfoDialog: false,
                editForm: {
                    oldPwd: '',
                    newPwd: '',
                    confirmPwd: ''
                },
                editRules: {
                    oldPwd: [
                        {required: true, message: '请输入当前密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '密码长度为 6 - 20 个字符', trigger: 'blur'}],
                    newPwd: [{required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '新密码长度为 6 - 20 个字符', trigger: 'blur'}],
                    confirmPwd: [{validator: validateConfirmPass, trigger: 'blur'}]
                },
                getPicture: '',
                files: '',
                userForm: {
                    name: '',
                    email: '',
                    phone: '',
                    defTenant: ''
                },
                userRule: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 2, max: 15, message: '姓名长度为2-15个字符', trigger: 'blur'}],
                    email: [{
                        required: emailSupport,
                        trigger: 'blur',
                        // min: 5,
                        // max: 20,
                        // message: '邮箱字符长度为5-20个字符',
                        validator: emailCheck,
                    }],
                    phone: [{
                        required: phoneSupport,
                        trigger: 'blur',
                        min: 11,
                        max: 11,
                        message: '输入的不是有效的手机格式',
                        validator: phoneCheck
                    }]
                },
            }
        },
        inject: ['reload'],
        computed: {
            ...mapState('user', ['userIcon']),
            ...mapState('webkit', ['headerStic']),
            ...mapState('webkit', ['userInfo'])
        },
        methods: {
            ...mapMutations('webkit', ['headerSticConfig']),
            ...mapMutations('user', ['resetImage']),
            ...mapActions('user', ['GETPUBLICKEY', 'GET_EDIT_USER', 'LOGOUT']),
            ...mapActions('webkit', [
                'modifyPwd',
                'setIcon',
                'getBaseInfo',
                'modifyBaseInfo'
            ]),
            saveEditPassword() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let encrypt = new JSEncrypt()
                        this.GETPUBLICKEY().then((res) => {
                            encrypt.setPublicKey(res.result)
                            let params = {
                                oldPwd: encrypt.encrypt(this.editForm.oldPwd),
                                newPwd: encrypt.encrypt(this.editForm.newPwd),
                                pwdType: 1
                            }
                            this.modifyPwd(params).then(() => {
                                this.editDialog = false;
                                this.$message({type: 'success', message: '修改密码成功！', showClose: true, duration: 1000});
                                this.LOGOUT();
                            })
                        })
                    } else {
                        return false
                    }
                })
            },
            editDialogClosed() {
                this.$refs.editForm.resetFields()
            },
            userInfoDialogClosed() {
                this.getPicture = ''
                this.files = ''
                this.$refs.userForm.resetFields()
            },
            saveBaseInfo() {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.modifyBaseInfo(this.userForm).then(re => {
                            this.$message({type: 'success', message: '修改用户基本信息成功！', showClose: true, duration: 1000});
                            this.userInfoDialog = false
                            if (this.$route.path.indexOf("index") > -1) return window.location.reload();
                            this.$router.replace("/index");
                            this.$store.state.isUpdateMenu = true;
                            this.loadBaseInfo();//重新请求用户信息接口
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            uploadFile(event) {
                if (event.target.files.length < 1) return this.getPicture = '';
                if ((event.target.files[0].size / 1024 / 1024) > 0.1) {
                    return this.$message({
                        type: 'warning',
                        message: '上传图片大于100Kb,请压缩图片后重新上传!',
                        showClose: true,
                        duration: 1500
                    })
                }
                let imgSrc = window.URL.createObjectURL(event.target.files[0]);
                let img = new Image();
                img.src = imgSrc;
                let _this = this;
                img.onload = function () {
                    if (img.width > 200 || img.height > 200) {
                        return _this.$message({
                            type: 'warning',
                            message: '图片的宽高不能大于200！',
                            showClose: true,
                            duration: 1500
                        })
                    }
                }
                this.files = event.target.files[0]
                this.getPicture = this.getFileUrl(event.target);
                if (this.getPicture) {
                    this.$refs.uploadPic.src = this.getPicture

                }
                else {
                    this.$refs.uploadPic.src = this.userIcon
                }
                event.target.value = ''
            },
            getFileUrl(obj) {
                let url
                url = window.URL.createObjectURL(obj.files.item(0));
                return url
            },
            uploadimage() {
                if (this.files.length < 1) return false;
                let formData = new FormData();
                formData.append('file', this.files);
                this.setIcon(formData).then(re => {
                    this.$message({type: 'success', message: '上传头像成功！', showClose: true, duration: 1000});
                    this.files = '';
                    this.getPicture = '';
                    this.resetImage()
                })
            },
            /*请求用户信息*/
            loadBaseInfo(){
                this.getBaseInfo().then(re => {
                    this.userForm.name = this.userInfo.myUser.name;
                    this.userForm.email = this.userInfo.myUser.email;
                    this.userForm.phone = this.userInfo.myUser.phone;
                    this.userForm.defTenant = this.userInfo.myUser.defTenant;
                    emailSupport = this.userInfo.emailSupport;
                    phoneSupport = this.userInfo.phoneSupport;
                    this.$set(this.userRule.email[0], 'required', emailSupport);//验证邮箱是否必填
                    this.$set(this.userRule.phone[0], 'required', phoneSupport);//验证手机是否必填
                    if (this.userInfo.tenantList && this.userInfo.tenantList.length > 0) this.tenantList = this.userInfo.tenantList
                })
            }
        },
        watch: {
            headerStic(val) {
                if (!val) return
                if (val == 'edit') {
                    this.editDialog = true;
                }
                else if (val == 'base') {
                    this.userInfoDialog = true;
                    this.$nextTick(() => {
                        this.loadBaseInfo();
                    })
                }
                this.headerSticConfig('')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .inputFile {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        font-size: 0;
        cursor: pointer;
    }
</style>
