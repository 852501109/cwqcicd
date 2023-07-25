<template>
    <el-upload
        @mouseenter.native="enter"
        @mouseleave.native="leave"
        :class="['avatar-uploader', 'upload-img', isShowDel ? 'isHover' : '']"
        :headers="publics.ajaxHeaders()"
        :action="action"
        accept="image/*"
        :show-file-list="true"
        :disabled="isDisabled"
        list-type="picture-card"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-error="handleError"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
        <!--<img v-if="imageUrl" :src="imageUrl" @load="getImg" class="avatar">-->
        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <!--<div class="mask">-->
        <!--<span @click="removeImg" class="iconfont iconShape1"></span>-->
        <!--</div>-->
    </el-upload>
</template>
<script>
export default {
    name: 'adqUploadImg',
    data() {
        return {
            imageUrl: '',
            token: null,
            isShowDel: false,
        };
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        fileList: {
            type: Array,
            default: [],
        },
        action: {
            type: String,
            default: '',
        },
        config: {
            type: Object,
            default: () => {
                return {
                    width: 100, //图片的宽度
                    height: 100, //图片的高度
                    size: 100, //图片的大小
                };
            },
        },
    },
    watch: {
        fileList(value) {
            if (value.length > 0) {
                /*隐藏上传框*/
                document.querySelector('.upload-img > .el-upload--picture-card').style.display = 'none';
            } else {
                document.querySelector('.upload-img > .el-upload--picture-card').style.display = '';
                this.leave();
            }
        },
    },
    created() {
        this.token = sessionStorage.getItem('token');
    },
    mounted() {},
    methods: {
        handleAvatarSuccess(res, file, fileList) {
            const _this = this;
            if (res.success) {
                this.$AudaqueToast.tip({
                    template: `上传成功`,
                    methods: {
                        okEvent() {},
                    },
                });
                this.imageUrl = URL.createObjectURL(file.raw);
                this.$emit('uploadSuccess', { res: res, file: file, fileList: fileList });
            } else {
                this.$AudaqueToast.error({
                    template: res.msg,
                    methods: {
                        okEvent() {
                            _this.handleRemove();
                        },
                    },
                });
            }
        },
        handleError(err) {
            const errJson = err.code ? err : JSON.parse(err.message);
            this.$AudaqueToast.error({
                template: errJson.msg,
                methods: {
                    okEvent() {},
                },
            });
        },
        beforeAvatarUpload(file) {
            let format = ['jpg', 'png', 'gif', 'svg'];
            let isFlag = true;
            if (file.name.length > 40) {
                this.$AudaqueToast.error({
                    template: `上传图片的文件名不能超过40个字符`,
                    methods: {
                        okEvent() {},
                    },
                });
                return (isFlag = false);
            }
            if (file.size / 1024 > this.config.size) {
                let unit = this.config.size > 1024 ? 'M' : 'k';
                this.$AudaqueToast.error({
                    template: '上传图片大小必须小于' + this.config.size + unit,
                    methods: {
                        okEvent() {},
                    },
                });
                return (isFlag = false);
            }
            let suffix = file.name.split('.')[1].toLowerCase();
            if (!format.includes(suffix)) {
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
        handleRemove(file, fileList) {
            this.$emit('closeFileList'); //清空
            this.imageUrl = '';
        },
        getImg(e) {
            let tar = e.target;
            let eWidth = tar.naturalWidth,
                eHeight = tar.naturalHeight;
            if (eWidth > this.config.width || eHeight > this.config.height) {
                this.$AudaqueToast.warn({
                    template:
                        '该图片尺寸超出小图标显示大小,请控制在' +
                        this.config.width +
                        '*' +
                        this.config.height +
                        '像素以内',
                    methods: {
                        okEvent() {},
                    },
                });
                return setTimeout(() => {
                    this.$emit('closeFileList'); //清空
                    this.imageUrl = '';
                }, 500);
            }
        },
        enter() {
            if (this.fileList.length > 0) {
                this.isShowDel = true;
                document.querySelector('.upload-img .el-upload__input').disabled = true;
            }
        },
        leave() {
            document.querySelector('.upload-img .el-upload__input').disabled = false;
            this.isShowDel = false;
        },
        removeImg() {
            this.$emit('closeFileList'); //清空
            this.imageUrl = '';
            setTimeout(() => {
                this.leave();
            }, 200);
        },
    },
};
</script>
<style lang="scss">
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
    /*&.isHover {*/
    /*.mask {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*background: rgba(0, 0, 0, .5);*/
    /*.iconfont {*/
    /*font-size: 16px;*/
    /*color: #fff;*/
    /*}*/
    /*}*/
    /*}*/
}
</style>
