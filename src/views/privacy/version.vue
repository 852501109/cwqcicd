<template>
    <audaque-table-list-page>
        <!-- 右边操作列表 -->
        <template slot="title">
            <audaque-table-title :title="$route.meta.name">
                <audaque-action-icon
                    iconClass="main-add"
                    title="新增"
                    @click="createPrivacyHandle"
                ></audaque-action-icon>
                <audaque-action-icon
                    iconClass="main-list-search"
                    title="筛选"
                    @click="audaqueToggleSearchMinix"
                ></audaque-action-icon>
            </audaque-table-title>
        </template>

        <!-- 搜索 -->
        <template slot="search">
            <audaque-table-search
                @close="audaqueSearchBarVisibleMixin = false"
                v-show="audaqueSearchBarVisibleMixin"
                @search="audaqueSearchListMixin"
                @reset="audaqueResetListMixin"
            >
                <audaque-table-search-item title="版本号">
                    <el-input
                        v-model.trim="audaqueSearchMixin.privacyStatementVersion"
                        placeholder="请输入版本号"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>

        <!-- 列表 -->
        <template>
            <audaque-table
                :data="audaqueDataListMixin.datas"
                :table-fetch-status="audaqueTableFetchStatusMixin"
                @request-list="audaqueRequestListMixin"
            >
                <el-table-column
                    :width="audaqueIndexWidthMixin"
                    label="序号"
                    type="index"
                    :index="audaqueIndexMethodMixin"
                ></el-table-column>
                <el-table-column label="版本号" prop="privacyStatementVersion" show-overflow-tooltip></el-table-column>
                <el-table-column label="PDF名称" prop="privacyStatementName" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <audaque-link-text
                            @click="showPrivacy(scope.row)"
                            type="key"
                            :title="scope.row.privacyStatementName"
                        ></audaque-link-text>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    sortable
                    :width="audaqueDateWidthMixin"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">{{ audaqueFormatTimeToDateMixin(scope.row.lastModifyTime) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <audaque-link-text
                            @click="audaqueDeleteMixin(scope.row)"
                            iconClass="main-delete"
                            title="删除"
                        ></audaque-link-text>
                    </template>
                </el-table-column>
            </audaque-table>
            <audaque-pagination
                @size-change="audaqueOnSizeChangeMixin"
                @current-change="audaqueOnCurrentChangeMixin"
                :current-page="audaquePageRequestMixin.pageNo"
                :page-size="audaquePageRequestMixin.pageSize"
                :total="audaqueDataListMixin.total"
            ></audaque-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { Message } from 'element-ui';
import { AudaqueElementValidator } from '@audaque/vue-utils';
import { mapState, mapActions } from 'vuex';
import {
    audaqueDeleteItemMixin,
    audaqueListSearchMixin,
    audaqueConstantMixin,
    audaqueUtilsMixin,
} from '@audaque/vue-utils';

import { createPrivacy, privacyPage, deletePrivacy, downloadFile } from '@/api/modules/privacy';

export default {
    mixins: [
        audaqueDeleteItemMixin(deletePrivacy), // 删除网络请求
        audaqueListSearchMixin(privacyPage), // 列表网络请求
        audaqueConstantMixin,
        audaqueUtilsMixin,
    ],

    created() {},
    data() {
        return {
            audaqueFormInfoMixin: {},
        };
    },
    computed: {
        ...mapState(['upload']),
    },
    mounted() {},

    methods: {
        ...mapActions(['_AJAX']),
        showPrivacy(row) {
            downloadFile(row.privacyStatementUrl).then((res) => {
                this.$AudaqueToast.dialog({
                    title: '隐私声明',
                    width: '1000px',
                    className: 'dialog-to-max-height',
                    template: `<iframe :src="src" style="width:100%;height:100%"></iframe>`,
                    data: {
                        src: res,
                        hideCancel_a_d_q: true,
                    },
                    mounted() {},
                    methods: {
                        okEvent() {
                            URL.revokeObjectURL(res);
                        },
                        cancelEvent() {
                            URL.revokeObjectURL(res);
                        },
                    },
                });
            });
        },
        createPrivacyHandle() {
            let _t = this;
            this.$AudaqueToast.dialog({
                title: '隐私声明',
                width: '800px',
                template: `
                    <div>
                        <el-form ref="form" :model="form" label-width="160px" >
                            <el-form-item 
                                label="版本号" 
                                prop="privacyStatementVersion" 
                                :rules="[
                                    AudaqueElementValidator.isNotEmpty('blur', '请输入版本号'),
                                    { required: true, trigger: 'blur', validator: versionValidator }
                                ]"
                            >
                                <el-input v-model="form.privacyStatementVersion" show-word-limit  maxlength="8"></el-input>
                            </el-form-item>
                            <el-form-item 
                                label="上传隐私声明" 
                                prop="files" 
                                :rules="[{ required: true, trigger: 'change', validator: validator }]"
                            >
                                <el-upload
                                    ref="upload"
                                    :limit="1"
                                    accept="accept"
                                    class="upload-demo"
                                    :action="upload"
                                    :headers="publics.ajaxHeaders()"
                                    :file-list="form.files"
                                    :on-exceed="onExceed"
                                    :before-upload="onBeforeUploadHandle"
                                    :on-change="onChangeHandle"
                                >
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip" style="color:#666;">注意: 仅支持上传{{accept}}格式文件！不超过{{ uploadFileSize }}M</div>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>`,
                data: {
                    form: { privacyStatementVersion: '', files: [] },
                    upload: _t.upload,
                    publics: _t.publics,
                    accept: '.pdf',
                    uploadFileSize: 50,
                    AudaqueElementValidator,
                },
                mounted() {},
                methods: {
                    validator(rule, value, callback) {
                        if (this.$refs.upload.uploadFiles.length > 0) {
                            callback();
                        } else {
                            callback(new Error(`请上传文件`));
                        }
                    },
                    versionValidator(rule, value, callback) {
                        if (/^\d+(\.\d+){2}$/.test(value)) {
                            callback();
                        } else {
                            callback(new Error(`版本格式应该为/^\\d+(\\.\\d+){2}$/，例如2.11.3`));
                        }
                    },
                    okEvent() {
                        console.log('this.form', this.form, this.$refs.upload.uploadFiles);

                        let keep = false;
                        this.$refs.form.validate((valid) => {
                            if (valid) {
                                let upFile = this.$refs.upload.uploadFiles[0],
                                    url = upFile.response,
                                    name = upFile.name;

                                createPrivacy(this._AJAX)({
                                    privacyStatementVersion: this.form.privacyStatementVersion,
                                    privacyStatementName: name,
                                    privacyStatementUrl: url,
                                }).then(() => {
                                    Message.success(`新增隐私声明成功`);
                                    _t.audaqueRequestListMixin();
                                });
                            } else {
                                keep = true;
                                return false;
                            }
                        });
                        return keep;
                    },
                    cancelEvent() {},
                    onBeforeUploadHandle(file) {
                        return this.onBeforeUpload(file, { accept: this.accept, uploadFileSize: this.fileUploadSize });
                    },
                    onBeforeUpload(file, options = { accept: '', uploadFileSize: 10 }) {
                        let suffixList = options.accept.split(','),
                            fileName = file.name;
                        let suffix = fileName.split('.').pop().toLowerCase(); //文件后缀名
                        if (suffixList.indexOf(`.${suffix}`) === -1 && options.accept) {
                            Message.error(`只允许上传${suffixList.join(',')}格式的文件`);
                            return false;
                        } else if (file.size > options.uploadFileSize * 1024 * 1024) {
                            Message.error(`超出单个文件最大${options.uploadFileSize}M限制！`);
                            return false;
                        } else {
                            return true;
                        }
                    },
                    onExceed() {
                        Message.error(`只能上传1个文件，请先删除再上传`);
                    },
                    onChangeHandle() {
                        //效验是否正确
                        this.$refs.form.validateField('files');
                    },
                },
            });
        },
    },
};
</script>

<style scoped></style>
