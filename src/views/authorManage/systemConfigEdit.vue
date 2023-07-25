<template>
    <audaque-detail-form-page
        @submit-click="submitForm"
        :title="$route.query.id ? (isView ? '查看系统' : '编辑系统') : '新增系统'"
        :opt-type="$route.query.optType"
        class="system-config-edit"
    >
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" :disabled="isView">
            <el-form-item label="系统名称" prop="name">
                <el-input v-model.trim="ruleForm.name" maxlength="24" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="接入应用" prop="appId">
                <el-select v-model="ruleForm.appId" clearable placeholder="" filterable>
                    <el-option v-for="item in options" :key="item.id" :label="item.appName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模块URL" prop="mainUrl">
                <el-input v-model.trim="ruleForm.mainUrl" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="系统介绍内容" prop="remark">
                <el-input
                    class="system-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    maxlength="200"
                    show-word-limit
                    v-model.trim="ruleForm.remark"
                >
                </el-input>
                <div class="clear"></div>
            </el-form-item>
            <!--            <el-form-item label="系统所属权限" prop="systemResource">-->
            <!--                <span slot="label">-->
            <!--                    <span style="color: red">*</span>-->
            <!--                    系统所属权限-->
            <!--                </span>-->
            <!--                <el-tree-->
            <!--                    class="resource"-->
            <!--                    :data="resourceList"-->
            <!--                    show-checkbox-->
            <!--                    node-key="value"-->
            <!--                    ref="tree"-->
            <!--                    :check-strictly="true"-->
            <!--                    highlight-current-->
            <!--                    :default-checked-keys="myResource"-->
            <!--                    :default-expanded-keys="myResource"-->
            <!--                    :props="defaultProps"-->
            <!--                    @check-change="treeCheckChange"-->
            <!--                >-->
            <!--                </el-tree>-->
            <!--            </el-form-item>-->
            <el-form-item label="系统图标">
                <adq-upload-img
                    :disabled="isView"
                    :action="upload"
                    @uploadSuccess="uploadSuccess"
                    :file-list="fileList"
                    @closeFileList="
                        () => {
                            (fileList = []), (ruleForm.smallIcon = '');
                        }
                    "
                >
                </adq-upload-img>
            </el-form-item>
            <!--<el-form-item label="系统图标">
                <upload-components
                    type="img"
                    :disabled="isView"
                    :action="upload"
                    :data="ruleForm.visibleRange"
                    @uploadSuccess="uploadImgSuccess"
                    @submit="uploadDialogSubmit"
                    :file-list="fileList"
                    :upload-file-type="['jpg', 'png', 'gif', 'svg']"
                    @closeFileList="
                        (_fileList) => {
                            (fileList = _fileList), (ruleForm.smallIcon = '');
                        }
                    "
                ></upload-components>
            </el-form-item>-->
            <el-form-item label="用户资料" prop="userGuide">
                <div>
                    <template v-if="!isView">
                        <upload-components
                            type="file"
                            :disabled="isView"
                        :action="upload"
                            :data="ruleForm.visibleRange"
                            @uploadSuccess="handleFileSuccess"
                            @submit="uploadDialogSubmit"
                        :file-list="manualFileList"
                            :upload-file-type="[
                                'xls',
                                'xlsx',
                                'doc',
                                'docx',
                                'word',
                                'txt',
                                'pdf',
                                'ppt',
                                'pptx',
                                'jpg',
                                'png',
                                'gif',
                                'svg',
                                'zip',
                                'rar',
                            ]"
                            @closeFileList="
                                (_fileList) => {
                                    (manualFileList = _fileList), (ruleForm.userGuide = '');
                                }
                            "
                        ></upload-components>
                    </template>
                    <template v-if="manualFileList && manualFileList.length > 0">
                        <ul class="upload-file-list">
                            <li v-for="(item, i) in manualFileList" :key="i">
                                <div>
                                    <span class="el-icon-document" style="margin-right: 8px"></span>
                                    <span @click="handleFilePreview(item)">{{ item.name }}</span>
                                </div>
                                <span class="icon el-icon-error" @click="handleFileRemove(item, [])"></span>
                            </li>
                        </ul>
                    </template>
                </div>
            </el-form-item>
        </el-form>
        <div class="clear"></div>
        <div ref="downDiv" style="display: none"></div>
    </audaque-detail-form-page>
</template>
<style lang="scss" scoped>
/deep/ .resource {
    border: 1px solid #e1dfdc;
}

/deep/ .submit-wrap {
    text-align: center;
    margin-top: 0.2rem;
}
/deep/ .el-tree {
    height: 3.5rem;
    overflow-y: scroll;
}
.system-config-edit {
    /deep/ .system-introduction {
        min-height: 90px !important;
        height: auto !important;
        /deep/ .el-textarea__inner {
            min-height: 90px !important;
        }
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
}
.upload-file-list {
    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        color: #606266;
        &:hover {
            background: #fafafa;
            color: #409eff;
        }
        .icon {
        }
    }
}
</style>
<script>
import { mapActions, mapState } from 'vuex';
import uploadComponents from '../../components/uploadComponents';
import API from '@/api/index';

export default {
    computed: {
        ...mapState(['upload']),
    },
    components: { uploadComponents },
    data() {
        return {
            imgVisible: false,
            preview: '',
            smallIconFile: [],
            largeIconFile: [],
            ruleForm: {
                name: '',
                appId: '',
                mainUrl: '',
                remark: '',
                smallIcon: '',
                userGuide: '',
            },
            rules: {
                name: [{ required: true, message: '系统名称不能为空', trigger: 'blur' }],
                appId: [{ required: true, message: '接入应用不能为空', trigger: 'change' }],
                mainUrl: [{ required: true, message: '模块URL不能为空', trigger: 'blur' }],
                remark: [{ required: true, message: '系统介绍内容不能为空', trigger: 'blur' }],
                // userGuide: [{ required: true, validator: this.validateUserGuide, trigger: 'change' }],
            },
            fileList: [], //
            manualFileList: [],
            options: [],
            percent: null,
            isView: false,
            token: sessionStorage.getItem('token'),
            defaultProps: {
                label: 'name',
                disabled: 'other',
            },
            myResource: [], //树的回显数据
            selectOrg: {
                orgsid: [],
            },
            resourceList: [],
        };
    },
    created() {
        // this.getResourceList();
        /*查找应用列表*/
        this._AJAX({
            url: 'webkit.appList',
            method: 'GET',
            data: {
                page: 1,
                rows: 10000,
            },
        }).then((res) => {
            if (res.code == 0) {
                let arr = [];
                let data = res.rows;
                data.forEach((item) => {
                    if (item.enabled) {
                        arr.push(item);
                    }
                });
                this.options = arr;
            }
        });
        if (this.$route.query.id) {
            this.loadData();
        }
        if (this.$route.query.view) {
            this.isView = true;
        }
    },
    methods: {
        ...mapActions(['LOADIMG', 'LOADOBJ', '_AJAX', 'MYPLATFORM']),
        ...mapActions('webkit', ['MODIFYAPP', 'ADDAPP', 'APPDETAIL']),
        /*
         * 获取系统所属权限树的数据
         * */
        getResourceList() {
            let filter = this.$route.query.view ? false : true;
            this._AJAX({
                url: 'webkit.displayChildrenResourceList',
                method: 'GET',
                data: {
                    filter: filter,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let resourceList = [],
                        resultObj;
                    resultObj = res.result;
                    let arr = Object.keys(resultObj);
                    arr.forEach((key) => {
                        let name = key.split('__')[1];
                        //处理树的禁用
                        resultObj[key].forEach((item) => {
                            this.treeIsDisabled(item, filter, name);
                        });
                        resourceList.push({
                            name: name,
                            children: resultObj[key],
                            index: '',
                            other: true,
                        });
                    });
                    this.resourceList = resourceList;
                }
            });
        },
        /*
         * 处理树的禁用
         * */
        treeIsDisabled(item, filter, name) {
            if (!filter) {
                item.other = true;
            }
            item.value = `${name}_${item.name}`;
            if (item.children && item.children.length > 0) {
                this.treeIsDisabled(item.children, filter, name);
            }
        },
        loadData() {
            this._AJAX({
                url: 'authorManage.find',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    /*图标回显*/
                    if (result.smallIcon) {
                        this.LOADOBJ(result.smallIcon).then((res) => {
                            if (res) {
                                let url =
                                    res.extName === 'svg'
                                        ? 'data:image/svg+xml;base64,' + res.contentBase64
                                        : 'data:image/*;base64,' + res.contentBase64;
                                this.fileList = [
                                    {
                                        lastModifiedDate: new Date(),
                                        name: 'small',
                                        // url: window.URL.createObjectURL(fileStream)
                                        url: url,
                                    },
                                ];
                            }
                        });
                    }
                    if (result.userGuide) {
                        let userUrl = API['global.viewName'] + result.userGuide + '.go';
                        this._AJAX({
                            url: userUrl,
                            method: 'GET',
                            data: {},
                        }).then((data) => {
                            this.manualFileList = [
                                {
                                    lastModifiedDate: new Date(),
                                    name: data.result,
                                    key: result.userGuide,
                                },
                            ];
                        });
                    }
                    this.ruleForm = result;
                    // this.myResource = [result.systemResource];
                }
            });
        },
        uploadSuccess(file) {
            this.fileList = file.fileList;
            this.ruleForm.smallIcon = file.res.result;
        },
        uploadImgSuccess(file) {
            this.fileList = file.fileList;
            this.ruleForm.smallIcon = file.res.result;
        },
        handleFilePreview(file) {
            if (file.key) {
                let url = `/file/pub/down/${file.key}.do`;
                // let url = `/file/pub/down/${file.key ? file.key : file.response.result}.do`;
                this.publics.exportFile(this, url, {});
            }
        },
        handleFileRemove(file, fileList) {
            this.manualFileList = fileList;
            this.ruleForm.userGuide = '';
                    },
        handleFileSuccess(data) {
            this.manualFileList = [data.file];
            this.ruleForm.userGuide = data.res.result;
        },
        uploadDialogSubmit(data) {
            this.ruleForm = Object.assign(this.ruleForm, { visibleRange: data });
        },
        validateUserGuide(rule, value, callback) {
            if (this.manualFileList && this.manualFileList.length > 0) {
                callback();
            } else {
                callback(new Error(' '));
                this.$AudaqueToast.error({
                    template: `请上传用户手册`,
                    methods: {
                        okEvent() {},
                    },
                });
            }
        },
        treeCheckChange(data, checked, indeterminate) {
            // 获取当前选择的id在数组中的索引
            let checkedKeys = this.$refs.tree.getCheckedKeys();
            checkedKeys.splice(
                checkedKeys.findIndex((item) => item === data.value),
                1
            );
            this.selectOrg.orgsid = checkedKeys;
            const indexs = this.selectOrg.orgsid.indexOf(data.value);
            // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
            if (indexs < 0 && this.selectOrg.orgsid.length >= 1 && checked) {
                this.$message({
                    message: '只能选择一个选项！',
                    type: 'error',
                    showClose: true,
                });
                // 设置已选择的节点为false 很重要
                this.$refs.tree.setChecked(data, false);
            } else if (this.selectOrg.orgsid.length === 0 && checked) {
                // 发现数组为空 并且是已选择
                // 防止数组有值，首先清空，再push
                this.selectOrg.orgsid = [];
                this.selectOrg.orgsid.push(data.value);
            } else if (indexs >= 0 && this.selectOrg.orgsid.length === 1 && !checked) {
                // 再次直接进行赋值为空操作
                this.selectOrg.orgsid = [];
            }
        },
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // let treeData = this.$refs.tree.getCheckedKeys();
                    // if (!treeData || treeData.length === 0) {
                    //     return this.$AudaqueToast.error({
                    //         template: `系统所属权限不能为空`,
                    //         methods: {
                    //             okEvent() {},
                    //         },
                    //     });
                    // }
                    let _this = this;
                    // let params = { ...this.ruleForm, systemResource: treeData[0] ? treeData[0] : null };
                    let params = { ...this.ruleForm };
                    _this.$store.commit('SHOW_LOADING', true);
                    if (this.$route.query.id) {
                        this._AJAX({
                            url: 'authorManage.modify',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `修改成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                        /*获得系统列表*/
                                        _this.MYPLATFORM({ page: 1, row: 1000 });
                                    },
                                },
                            });
                        });
                    } else {
                        this._AJAX({
                            url: 'authorManage.add',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: `新增成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                        /*获得系统列表*/
                                        _this.MYPLATFORM({ page: 1, row: 1000 });
                                    },
                                },
                            });
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
