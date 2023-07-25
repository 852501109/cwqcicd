<template>
    <audaque-detail-form-page
        @submit-click="submitForm"
        :title="$route.query.id ? (isView ? '查看平台' : '编辑平台') : '新增平台'"
        :opt-type="$route.query.optType"
        class="system-config-edit"
    >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" :disabled="isView">
            <el-form-item label="平台名称" prop="name">
                <el-input v-model.trim="ruleForm.name" maxlength="24" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="平台介绍" prop="remark">
                <el-input
                    class="system-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    maxlength="100"
                    show-word-limit
                    v-model.trim="ruleForm.remark"
                >
                </el-input>
                <div class="clear"></div>
            </el-form-item>
            <!--<el-form-item label="平台图标">
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
            </el-form-item>-->
            <el-form-item label=" ">
                <div slot="label"><span style="color: #f56c6c">*</span>系统</div>
                <el-button class="add-system-btn" @click="publics.addLine(ruleForm.systems, false)">添加系统</el-button>
                <el-table
                    tooltip-effect="light"
                    class="el-table-common__list"
                    highlight-current-row
                    stripe
                    :data="ruleForm.systems"
                    border
                >
                    <el-table-column show-overflow-tooltip type="index" align="center" width="50" label="序号">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="系统名称" align="center" prop="id">
                        <template slot-scope="scope">
                            <el-form-item :prop="'systems.' + scope.$index + '.id'" :rules="rules.id">
                                <el-select
                                    v-model="scope.row.id"
                                    clearable
                                    placeholder=""
                                    filterable
                                    @change="
                                        (value) => {
                                            handleTableChange(value, scope.$index);
                                        }
                                    "
                                >
                                    <el-option
                                        v-for="(item, index) in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="操作" width="200" align="center" v-if="!isView">
                        <template slot-scope="scope">
                            <span
                                title="删除"
                                :class="['iconfont', 'iconShape1', 'operate']"
                                @click="publics.removeLine(ruleForm.systems, [ruleForm.systems[scope.$index]])"
                            ></span>
                            <!--<span title="排序" class="iconfont iconDesce" @click="sortFun(scope.row)"></span>-->
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </audaque-detail-form-page>
</template>
<style lang="scss" scoped>
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
    }
    /deep/ .add-system-btn {
    }
    .iconfont {
        font-size: 16px;
        color: #444f61;
        cursor: pointer;
        margin-left: 8px;
    }
}
</style>
<script>
import { mapActions, mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['upload']),
    },
    data() {
        return {
            imgVisible: false,
            preview: '',
            ruleForm: {
                name: '',
                remark: '',
                smallIcon: '',
                systems: [],
            },
            rules: {
                name: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
                remark: [{ required: true, message: '平台介绍不能为空', trigger: 'blur' }],
                id: [{ required: true, message: '请选择系统名称', trigger: 'change' }],
            },
            fileList: [], //
            options: [],
            isView: false,
        };
    },
    watch: {},
    async created() {
        /*系统列表*/
        await this._AJAX({
            url: 'authorManage.findOther',
            method: 'GET',
            data: { page: 1, rows: 10000 },
        }).then((res) => {
            if (res.code == 0) {
                this.options = res.result.rows;
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
        loadData() {
            this._AJAX({
                url: 'authorManage.platform.find',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    /*/!*图标回显*!/
                    if (result.smallIcon) {
                        this.LOADOBJ(result.smallIcon).then((res) => {
                            if (res) {
                                let url =
                                    res.extName === 'svg'
                                        ? 'data:image/svg+xml;base64,' + res.contentBase64
                                        : 'data:image/!*;base64,' + res.contentBase64;
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
                    }*/
                    if (result.systems && result.systems.length > 0) {
                        this.options = this.options.concat(result.systems);
                        this.ruleForm = result;
                    } else {
                        result.systems = [];
                        this.ruleForm = result;
                    }
                }
            });
        },
        handleClick() {},
        /*排序*/
        sortFun(row) {
            this._AJAX({
                url: 'authorManage.moveOrder',
                method: 'POST',
                data: {
                    id: row.id,
                    upOrDown: false, //true向上移动，false向下移动
                    step: 1, // 移动步骤，等于Integer.MAX_VALUE表示置顶或置底
                },
            }).then((res) => {
                if (res.code === 0) {
                    this.loadData();
                }
            });
        },
        uploadSuccess(file) {
            this.fileList = file.fileList;
            this.ruleForm.smallIcon = file.res.result;
        },
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                let _this = this;
                if (valid) {
                    let params = Object.assign({}, this.ruleForm);
                    if (params.systems.length > 0) {
                        params.systems.forEach((item, index) => {
                            delete item.index;
                            item.customOrder = ++index;
                        });
                        _this.$store.commit('SHOW_LOADING', true);
                        if (this.$route.query.id) {
                            this._AJAX({
                                url: 'authorManage.platform.modify',
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
                                url: 'authorManage.platform.add',
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
                        this.$AudaqueToast.warn({
                            template: `请添加系统`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        handleTableChange(value, index) {
            let i = 0;
            this.ruleForm.systems.forEach((item) => {
                if (item.id === value) i++;
                if (i > 1) {
                    let _this = this;
                    this.$AudaqueToast.warn({
                        template: `该系统已经存在请勿重复添加`,
                        methods: {
                            okEvent() {
                                _this.$set(_this.ruleForm.systems[index], 'id', '');
                            },
                        },
                    });
                }
            });
        },
    },
};
</script>
