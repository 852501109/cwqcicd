<template>
    <div>
        <template v-if="type === 'img'">
            <template v-if="fileList && fileList.length > 0">
                <img
                    v-for="(item, i) in fileList"
                    :key="i"
                    :src="item.url"
                    class="view-img-item"
                    @click="isOpenImgDialog"
                />
            </template>
            <i v-else class="el-icon-plus uploader-border" @click="imgDialogVisible = true"></i>
        </template>
        <template v-else>
            <el-button size="small" type="primary" @click="isOpenImgDialog">点击上传</el-button>
        </template>
        <el-dialog
            title="上传"
            :visible.sync="imgDialogVisible"
            width="800px"
            @open="openDialog"
            :before-close="handleClose"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
                <el-form-item label="文件">
                    <template v-if="type === 'img'">
                        <el-upload
                            @mouseenter.native="enter"
                            @mouseleave.native="leave"
                            :class="['avatar-uploader', 'upload-img', isShowDel ? 'isHover' : '']"
                            :headers="publics.ajaxHeaders()"
                            :action="action"
                            accept="image/*"
                            :show-file-list="true"
                            :disabled="disabled"
                            list-type="picture-card"
                            :file-list="fileList"
                            :on-remove="handleImgRemove"
                            :on-error="handleImgError"
                            :on-success="handleAvatarImgSuccess"
                            :before-upload="beforeAvatarImgUpload"
                        >
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </template>
                    <template v-else-if="type === 'file'">
                        <el-upload
                            class="manual-file"
                            :action="action"
                            @click.native="handleFileClick"
                            :on-remove="handleFileRemove"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :on-preview="handlePreview"
                            :before-upload="handleBeforeUpload"
                            :limit="config.limit"
                            :headers="publics.ajaxHeaders()"
                            :file-list="fileList"
                        >
                            <template v-if="!disabled">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="'只能上传   ' + this.uploadFileType.join(',') + '格式的文件'"
                                    placement="right"
                                >
                                    <span class="el-icon-question prompt"></span>
                                </el-tooltip>
                            </template>
                        </el-upload>
                    </template>
                </el-form-item>
                <el-form-item label="可见范围" prop="isPublic">
                    <el-checkbox-group v-model="ruleForm.isPublic" @change="changeCheck">
                        <el-checkbox :label="0">公开</el-checkbox>
                        <el-checkbox :label="1" v-if="!ruleForm.isPublic.includes(0)">用户</el-checkbox>
                        <el-checkbox :label="2" v-if="!ruleForm.isPublic.includes(0)">部门</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="用户" prop="userIds" v-if="ruleForm.isPublic.includes(1)">
                    <adq-user-list-component v-model="ruleForm.userIds" :multiple="true"></adq-user-list-component>
                </el-form-item>
                <el-form-item label="部门" prop="deptIds" v-if="ruleForm.isPublic.includes(2)">
                    <adq-tree ref="tree" :defaultCheckedKeys="ruleForm.deptIds" :check-strictly="true"> </adq-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="imgDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
        <div ref="downDiv" style="display: none"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { deepClone } from '~/utils/index';
import adqTree from './adqTree';
export default {
    name: 'uploadComponents',
    data() {
        return {
            imgDialogVisible: false,
            token: null,
            isShowDel: false,
            ruleForm: {
                isPublic: [0], //默认公开
                deptIds: [],
                userIds: [],
                owner: '', //登陆用户的id
            },
            rules: {},
        };
    },
    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    isPublic: [0], //默认公开
                    deptIds: [],
                    userIds: [],
                    owner: '', //登陆用户的id
                };
            },
        },
        type: {
            type: String,
            default: 'file', //file---文件类型  img---图片类型
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        fileList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        action: {
            type: String,
            default: '',
        },
        //上传文件的类型
        uploadFileType: {
            type: Array,
            default: () => {
                return [];
            },
        },
        config: {
            type: Object,
            default: () => {
                return {
                    width: 100, //图片的宽度
                    height: 100, //图片的高度
                    size: 100, //图片的大小
                    limit: 1, //最大允许上传个数
                };
            },
        },
    },
    computed: {
        ...mapState('webkit', ['userInfo']),
    },
    components: { adqTree },
    watch: {
        //针对上传图片 框的处理
        fileList(value) {
            if (this.imgDialogVisible && this.type === 'img') {
                if (value.length >= this.config.limit) {
                    /*隐藏上传框*/
                    document.querySelector('.upload-img > .el-upload--picture-card').style.display = 'none';
                } else {
                    document.querySelector('.upload-img > .el-upload--picture-card').style.display = '';
                    this.leave();
                }
            }
        },
        data(value) {
            this.initData(value);
        },
    },
    created() {
        this.token = sessionStorage.getItem('token');
        this.initData(this.data);
    },
    mounted() {},
    methods: {
        submit() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let params = deepClone(this.ruleForm);
                    if (this.$refs.tree) {
                        let deptIds = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                        params.deptIds = deptIds;
                        params.owner = this.userInfo.myUser.id; //登录用户的id
                    }
                    this.$emit('submit', params);
                    this.imgDialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        //统一处理初始化值
        initData(data) {
            if (data) {
                this.ruleForm = deepClone(data);
            } else {
                this.ruleForm = {
                    isPublic: [0], //默认公开
                    deptIds: [],
                    userIds: [],
                    owner: '', //登陆用户的id
                };
            }
        },
        changeCheck(value) {
            if (value.includes(0)) {
                this.ruleForm.userIds = [];
                this.ruleForm.deptIds = [];
                this.ruleForm.isPublic = [0];
            }
            if (!value.includes(1)) {
                this.ruleForm.userIds = [];
            }
            if (!value.includes(2)) {
                this.ruleForm.deptIds = [];
            }
        },
        isOpenImgDialog() {
            if (!this.disabled) this.imgDialogVisible = true;
        },
        openDialog() {
            //针对上传图片 框的处理
            if (this.imgDialogVisible && this.type === 'img') {
                this.$nextTick(() => {
                    if (this.fileList.length >= this.config.limit) {
                        /*隐藏上传框*/
                        document.querySelector('.upload-img > .el-upload--picture-card').style.display = 'none';
                    } else {
                        document.querySelector('.upload-img > .el-upload--picture-card').style.display = '';
                        this.leave();
                    }
                });
            }
        },
        handleClose() {},
        //上传成功后的回调
        handleAvatarImgSuccess(res, file, fileList) {
            const _this = this;
            if (res.success) {
                this.$message({ message: '上传成功', type: 'success' });
                this.$emit('uploadSuccess', { res: res, file: file, fileList: fileList });
            } else {
                this.$AudaqueToast.error({
                    template: res.msg,
                    methods: {
                        okEvent() {
                            _this.handleImgRemove();
                        },
                    },
                });
            }
        },
        //上传错误后的回调
        handleImgError(err, file, fileList) {
            this.$message({ message: err.msg, type: 'error' });
            console.log(err);
        },
        //上传前的拦截处理
        beforeAvatarImgUpload(file) {
            let format = this.uploadFileType;
            let isFlag = true;
            if (file.name.length > 40) {
                this.$message({ message: '上传图片的文件名不能超过40个字符', type: 'error' });
                return (isFlag = false);
            }
            if (file.size / 1024 > this.config.size) {
                let unit = this.config.size > 1024 ? 'M' : 'k';
                this.$message({ message: '上传图片大小必须小于' + this.config.size + unit, type: 'error' });
                return (isFlag = false);
            }
            let suffix = file.name.split('.')[1].toLowerCase();
            if (!format.includes(suffix)) {
                this.$message({ message: '上传格式必须是.' + format.join(','), type: 'error' });
                isFlag = false;
            }
            return isFlag;
        },
        handleImgRemove(file, fileList) {
            this.$emit('closeFileList', fileList); //清空
        },
        getImg(e) {
            let tar = e.target;
            let eWidth = tar.naturalWidth,
                eHeight = tar.naturalHeight;
            if (eWidth > this.config.width || eHeight > this.config.height) {
                this.$message({
                    message:
                        '该图片尺寸超出小图标显示大小,请控制在' +
                        this.config.width +
                        '*' +
                        this.config.height +
                        '像素以内',
                    type: 'warning',
                });
                return setTimeout(() => {
                    this.$emit('closeFileList'); //清空
                }, 500);
            }
        },
        enter() {
            if (this.fileList.length >= this.config.limit) {
                this.isShowDel = true;
                document.querySelector('.upload-img .el-upload__input').disabled = true;
            }
        },
        leave() {
            document.querySelector('.upload-img .el-upload__input').disabled = false;
            this.isShowDel = false;
        },
        //删除图片
        removeImg() {
            this.$emit('closeFileList'); //清空
            setTimeout(() => {
                this.leave();
            }, 200);
        },

        /*
         * 上传文件相关的
         *
         * */
        handleFileClick(e) {
            if (e.target.className.indexOf('el-upload__input') != -1 && this.fileList.length >= this.config.limit) {
                //点击上传按钮时
                document.querySelector('.manual-file .el-upload__input').disabled = true;
                this.$AudaqueToast.warn({
                    template: `只能上传${this.config.limit}个文件,如需修改请删除后重新上传`,
                    methods: {
                        okEvent() {},
                    },
                });
            } else {
                document.querySelector('.manual-file .el-upload__input').disabled = false;
            }
        },
        handleFileRemove(file, fileList) {
            this.$emit('closeFileList', fileList); //清空
        },
        handleSuccess(response, file, fileList) {
            if (response.code === 0) {
                this.$message({ message: '上传成功', type: 'success' });
                this.$emit('uploadSuccess', { res: response, file: file, fileList: fileList });
            } else {
                this.$message({ message: response.msg, type: 'error' });
            }
        },
        handleError(err) {
            const errJson = err.code ? err : JSON.parse(err.message);
            this.$message({ message: errJson.msg, type: 'error' });
        },
        handlePreview(file) {
            if (file.key) {
                let url = `/file/pub/down/${file.key}.do`;
                // let url = `/file/pub/down/${file.key ? file.key : file.response.result}.do`;
                this.publics.exportFile(this, url, {});
            }
        },
        handleBeforeUpload(file) {
            let format = this.uploadFileType;
            let isFlag = true;
            if (file.name.length > 40) {
                this.$message({ message: '上传的文件名不能超过40个字符', type: 'error' });
                return (isFlag = false);
            }
            let arr = file.name.split('.');
            let suffix = arr[arr.length - 1].toLowerCase();
            if (!format.includes(suffix)) {
                this.$message({ message: '上传格式必须是.' + format.join('、') + ' 格式', type: 'error' });
                isFlag = false;
            }

            return isFlag;
        },
    },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog__wrapper {
    > div {
        display: flex;
        flex-direction: column;
    }
    .el-dialog__headerbtn {
        display: none;
    }
    .el-dialog__footer {
        padding: 8px 20px;
    }
}
.view-img-item {
    width: 148px;
    height: 148px;
    cursor: pointer;
}
.uploader-border {
    display: inline-block;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
}
/deep/ .manual-file {
    width: 100%;
    /deep/ .el-upload-list__item-name {
        line-height: 40px;
    }
    .prompt {
        width: 20px;
        height: 20px;
        margin-left: 20px;
    }
}
.upload-img {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    /*line-height: 148px;*/
    text-align: center;
    display: inline;
    .el-upload {
        position: relative;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
    }
    .el-upload:hover {
        border-color: #409eff;
    }
    .avatar {
        width: 148px;
        height: 148px;
        /*display: block;*/
    }
}
.el-form-item {
    margin-bottom: 22px;
}
</style>
