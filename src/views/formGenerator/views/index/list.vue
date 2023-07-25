<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="表单列表">
                <i v-if="permitList.formNew" class="iconfont iconxinzeng2 audaque-rect-icon" @click="infoEdit()">
                    新增</i
                >
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="表单名称">
                    <el-input class="autoSize f14" clearable v-model.trim="param.formName"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="表单编码">
                    <el-input class="autoSize f14" clearable v-model.trim="param.formCode"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="数据库表名称">
                    <el-input class="autoSize f14" clearable v-model.trim="param.tableName"></el-input>
                </audaque-table-search-item>
            </audaque-table-search>
        </template>
        <template>
            <el-table
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="tableList.rows"
                border
            >
                <el-table-column
                    show-overflow-tooltip
                    type="index"
                    label="序号"
                    :index="
                        (index) => {
                            return $utils._indexMethod(index, param.page, param.rows);
                        }
                    "
                    width="50"
                ></el-table-column>

                <el-table-column show-overflow-tooltip prop="formName" label="表单名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="formCode" label="表单编码"></el-table-column>
                <el-table-column show-overflow-tooltip prop="formDesc" label="表单备注"></el-table-column>
                <el-table-column show-overflow-tooltip prop="tableName" label="数据库表名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.formUpdate"
                            class="iconfont iconFill"
                            title="编辑"
                            @click="edit(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.formId || permitList.formUpdate"
                            class="iconfont iconshejibiaodan"
                            title="设计表单"
                            @click="addForm(scope.row)"
                        ></span>
                        <!--  <span
                            v-if="permitList.formDateList"
                            class="iconfont icongongzuotai-biaodanshuju"
                            title="表单数据"
                            @click="setFormData(scope.row)"
                        ></span>-->
                        <span
                            v-if="permitList.formDel"
                            class="iconfont iconShape1"
                            title="删除"
                            @click="del(scope.row)"
                        ></span>
                    </template>
                </el-table-column>

                <template slot="empty">
                    <audaque-table-empty
                        @fetch="loadData()"
                        :tableFetchStatus="$store.state.tableFetchStatus"
                        :is-new="false"
                    ></audaque-table-empty>
                </template>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :page-size="param.rows"
                :total="tableList.total"
            ></adq-pagination>
        </template>
        <el-dialog
            :title="formType === 'add' ? '新增' : '编辑'"
            :visible.sync="isVisibleDialog"
            width="500"
            :close-on-click-modal="false"
            @close="closeDialog"
            class="form-parser-dialog"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
                <el-form-item label="数据类型" prop="type">
                    <el-radio-group v-model="ruleForm.type" :disabled="formType != 'add'">
                        <el-radio :label="1">表数据</el-radio>
                        <!--                        <el-radio :label="2">接口数据</el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="表单名称" prop="formName">
                    <el-input
                        v-model.trim="ruleForm.formName"
                        maxlength="24"
                        show-word-limit
                        placeholder="请输入表单名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="表单编码" prop="formCode">
                    <el-input
                        v-model.trim="ruleForm.formCode"
                        :disabled="formType != 'add'"
                        maxlength="24"
                        show-word-limit
                        placeholder="请输入表单编码"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="数据库表名称" prop="tableName" v-if="ruleForm.type === 1">
                    <el-input
                        v-model.trim="ruleForm.tableName"
                        :disabled="formType != 'add'"
                        maxlength="64"
                        show-word-limit
                        placeholder="数据库表中必须包含id、uuid、act_status字段"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="表单备注" prop="formDesc">
                    <el-input
                        v-model.trim="ruleForm.formDesc"
                        type="textarea"
                        maxlength="256"
                        show-word-limit
                        placeholder="请输入表单备注"
                        clearable
                    ></el-input>
                </el-form-item>
                <template v-if="ruleForm.type === 2">
                    <el-form-item label="新增接口" prop="apiDataAdd">
                        <el-input
                            v-model.trim="ruleForm.apiDataAdd"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单信息新增接口"
                            clearable
                        >
                            <template slot="prepend">POST</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="详情接口" prop="apiDataSelectOne">
                        <el-input
                            v-model.trim="ruleForm.apiDataSelectOne"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单信息详情接口"
                            clearable
                        >
                            <template slot="prepend">GET</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="查询接口" prop="apiDataSelect">
                        <el-input
                            v-model.trim="ruleForm.apiDataSelect"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单信息查询接口"
                            clearable
                        >
                            <template slot="prepend">GET</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="更新接口" prop="apiDataUpdate">
                        <el-input
                            v-model.trim="ruleForm.apiDataUpdate"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单信息更新接口"
                            clearable
                        >
                            <template slot="prepend">POST</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="删除接口" prop="apiDataUpdate">
                        <el-input
                            v-model.trim="ruleForm.apiDataDelete"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单信息删除接口"
                            clearable
                        >
                            <template slot="prepend">GET</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="文件上传接口" prop="apiDataUpload">
                        <el-input
                            v-model.trim="ruleForm.apiDataUpload"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单文件上传接口"
                            clearable
                        >
                            <template slot="prepend">GET</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="文件下载接口" prop="apiDataDownload">
                        <el-input
                            v-model.trim="ruleForm.apiDataDownload"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入表单文件下载接口"
                            clearable
                        >
                            <template slot="prepend">GET</template>
                        </el-input>
                    </el-form-item>
                </template>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isVisibleDialog = !isVisibleDialog">取消</el-button>
                <el-button @click="submitForm" :loading="isLoading">确定</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import API from '@/api/index';
export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
            },
            tableList: {
                rows: [],
                total: 0,
            },

            isVisibleDialog: false,
            theadList: [],
            ruleForm: {
                type: 1,
            },
            rules: {
                formName: { required: true, message: '请输入表单名称', trigger: 'blur' },
                formCode: { required: true, message: '请输入表单编码', trigger: 'blur' },
                tableName: { required: true, message: '请输入数据库表名称', trigger: 'blur' },
                type: { required: true, message: '请选择数据类型', trigger: 'change' },
            },
            formType: 'add',
            isLoading: false,
        };
    },
    created() {
        this.loadData();
    },
    mixins: [adqSearchMixin],
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
            };
            this._AJAX({
                url: 'form.design.list',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                this.tableList = res.result;
            });
        },
        handleSizeChange(rows) {
            this.param.rows = rows;
            this.param.page = 1;
            this.loadData();
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.loadData();
        },
        search(type) {
            this.param.page = 1;
            if (type == 0) {
                //置空
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                });
            }
            this.loadData();
        },
        /*新增*/
        infoEdit() {
            this.isVisibleDialog = true;
            this.formType = 'add';
            this.$set(this.ruleForm, 'type', 1);
        },
        edit(row) {
            this.formType = 'edit';
            this.ruleForm = Object.assign({}, row);
            if (this.ruleForm.tableName && this.ruleForm.tableName.length > 0) {
                /*数据类型的回显*/
                this.$set(this.ruleForm, 'type', 1);
            } else {
                this.$set(this.ruleForm, 'type', 2);
            }
            this.isVisibleDialog = true;
        },
        submitForm(data) {
            let _t = this;
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$store.commit('SHOW_LOADING', true);
                    _t.isLoading = true;
                    if (this.formType === 'add') {
                        this._AJAX({
                            url: 'form.design.new',
                            method: 'POST',
                            data: this.ruleForm,
                        })
                            .then((res) => {
                                _t.isLoading = false;
                                if (res.code === 0) {
                                    this.$AudaqueToast.tip({
                                        template: `新增成功`,
                                        methods: {
                                            okEvent() {
                                                _t.loadData();
                                                _t.isVisibleDialog = false;
                                            },
                                        },
                                    });
                                }
                            })
                            .catch(() => {
                                _t.isLoading = false;
                            });
                    } else {
                        this._AJAX({
                            url: 'form.design.update',
                            method: 'POST',
                            data: this.ruleForm,
                        })
                            .then((res) => {
                                _t.isLoading = false;
                                if (res.code === 0) {
                                    this.$AudaqueToast.tip({
                                        template: `编辑成功`,
                                        methods: {
                                            okEvent() {
                                                _t.loadData();
                                                _t.isVisibleDialog = false;
                                            },
                                        },
                                    });
                                }
                            })
                            .catch((err) => {
                                _t.isLoading = false;
                            });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm() {},
        closeDialog() {
            this.ruleForm = {};
            this.$refs.ruleForm.resetFields();
        },
        del(row) {
            let _t = this;
            let url = API['form.design.del'] + '/' + row.id;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: url,
                method: 'GET',
                data: {},
            }).then((res) => {
                this.$AudaqueToast.warn({
                    template: `确认删除？`,
                    methods: {
                        okEvent() {
                            _t.$AudaqueToast.tip({
                                template: `删除成功`,
                                methods: {
                                    okEvent() {
                                        _t.loadData();
                                    },
                                },
                            });
                        },
                    },
                });
            });
        },
        addForm(row) {
            this.$router.push({
                path: '/process/form/design',
                query: {
                    formId: row.id,
                    tableName: row.tableName,
                    formCode: row.formCode,
                },
            });
        },
        setFormData(row) {
            this.$router.push({
                path: '/process/form/dataList',
                query: {
                    tableName: row.tableName,
                    formId: row.id,
                    formCode: row.formCode,
                },
            });
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/.form-parser-dialog {
    .el-input-group__prepend {
        width: 80px;
    }
}
</style>
