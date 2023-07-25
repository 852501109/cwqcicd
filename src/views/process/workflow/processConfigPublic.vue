<template>
    <div class="process-config-edit">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" :disabled="isView">
            <el-form-item label="流程名称" prop="name">
                <el-input v-model.trim="ruleForm.name" maxlength="24" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="业务名称" prop="categoryId">
                <el-select
                    v-model="ruleForm.categoryId"
                    placeholder="请选择"
                    :disabled="optType === 'edit'"
                    @change="changeName"
                >
                    <el-option :label="item.name" :value="item.id" v-for="item in typeList" :key="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="可见范围" prop="dep">
                <span slot="label"><span style="color: #f56c6c">*</span> 可见范围</span>
                <adq-tree
                    ref="tree"
                    :defaultCheckedKeys="defaultCheckedKeys"
                    :check-strictly="true"
                    @check-change="treeCheckChange"
                    @modify-checked-keys="modifyCheckedKeys"
                >
                </adq-tree>
            </el-form-item>
            <el-form-item label="备注" prop="description">
                <el-input
                    class="news-type-sys-introduction"
                    type="textarea"
                    autosize
                    placeholder=""
                    maxlength="100"
                    show-word-limit
                    v-model.trim="ruleForm.description"
                >
                </el-input>
            </el-form-item>
            <!--:data="formList.slice((formSearch.page - 1) * formSearch.rows, formSearch.page * formSearch.rows)"-->
            <el-form-item label="绑定表单" prop="formIds">
                <el-table
                    tooltip-effect="light"
                    class="el-table-common__list"
                    highlight-current-row
                    stripe
                    :data="formList"
                    border
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        type="index"
                        label="序号"
                        :index="
                            (index) => {
                                return $utils._indexMethod(index, formSearch.page, formSearch.rows);
                            }
                        "
                    >
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="formName" label="表单名称"></el-table-column>
                    <el-table-column show-overflow-tooltip label="操作" width="220px">
                        <template slot-scope="scope">
                            <span
                                class="iconfont iconchakan11 operate"
                                title="预览表单"
                                @click="viewForm(scope.row)"
                            ></span>
                        </template>
                    </el-table-column>
                </el-table>
                <!--<adq-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="formSearch.page"
                    :page-size="formSearch.rows"
                    :total="formList.length || 0"
                ></adq-pagination>-->
            </el-form-item>
        </el-form>
        <el-dialog
            title="预览表单"
            :visible.sync="isShowDialog"
            width="500"
            :close-on-click-modal="false"
            @close="$refs.formParser.resetForm()"
            class="data-permission"
        >
            <form-parser
                v-if="Object.keys(formConf).length > 0 && isShowDialog"
                ref="formParser"
                :key="key2"
                :formConf="formConf"
                :isDisabled="true"
            ></form-parser>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="scss" scoped>
.process-config-edit {
    /deep/ .news-type-sys-introduction {
        min-height: 90px !important;
        height: auto !important;
        /deep/ .el-textarea__inner {
            min-height: 90px !important;
        }
    }
}
</style>
<script>
import { mapActions } from 'vuex';
import adqTree from '@/components/adqTree';

export default {
    name: 'processConfigPublic',
    props: {
        id: { type: String },
        optType: { type: String },
    },
    data() {
        return {
            preview: '',
            ruleForm: {
                name: null,
                roles: [],
                categoryId: null,
                dep: [],
                formIds: null,
                procCode: null,
            },
            rules: {
                name: [{ required: true, message: '流程名称不能为空', trigger: 'blur' }],
                categoryId: [{ required: true, message: '类型不能为空', trigger: 'change' }],
                // dep: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
                // formIds: [{ required: true, message: '请绑定表单', trigger: 'change' }],
            },
            isView: false,
            typeList: [],
            defaultCheckedKeys: [],
            formList: [],
            isShowDialog: false,
            formConf: {},
            key2: +new Date(),
            formSearch: {
                page: 1,
                rows: 10,
            },
        };
    },
    async created() {
        /*表单类型*/
        await this._AJAX({
            url: 'form.design.list',
            method: 'GET',
            data: {
                page: 1,
                rows: 10000,
                all: 1,
            },
        }).then((res) => {
            if (res.code == 0) {
                this.formList = res.result.rows;
            }
        });
        /*业务名称*/
        await this._AJAX({
            url: 'sys.category.list',
            method: 'GET',
            data: {
                page: 1,
                rows: 99999,
                exitProcess: this.optType === 'add' ? 1 : null,
            },
        }).then((res) => {
            if (res.code == 0) {
                this.typeList = res.result.rows;
            }
        });
        if (this.id) {
            await this.loadData();
        }
        if (this.optType === 'view') {
            this.isView = true;
        }
    },
    components: { adqTree },
    methods: {
        ...mapActions(['_AJAX']),
        loadData() {
            this._AJAX({
                url: 'activiti.process.select.id',
                method: 'GET',
                data: {
                    id: this.id,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.defaultCheckedKeys = result.dep ? result.dep.split(',').map(Number) : [];
                    result.roles = result.roles ? result.roles.split(',').map(Number) : [];
                    this.ruleForm = result;
                    /*绑定表单  列表的回显*/
                    this.formList = result.forms.concat(this.formList);
                    this.checkLinkData();
                    this.ruleForm.formIds = result.formIds;
                }
            });
        },
        /*显示勾选的行*/
        checkLinkData() {
            let result = Object.assign({}, this.ruleForm);
            result.formIds &&
                result.formIds.map((item) => {
                    result.forms.map((item1) => {
                        if (item === item1.id) {
                            this.$nextTick(() => {
                                this.$refs.multipleTable.toggleRowSelection(item1);
                            });
                        }
                    });
                });
        },
        handleSizeChange(rows) {
            this.formSearch.page = 1;
            this.formSearch.rows = rows;
            this.checkLinkData();
        },
        handleCurrentChange(page) {
            this.formSearch.page = page;
            this.checkLinkData();
        },

        treeCheckChange(Node, isCheck) {
            let dep = this.$refs.tree.$refs.adqTree.getCheckedKeys();
            this.$set(this.ruleForm, 'dep', dep);
        },
        modifyCheckedKeys(arr) {
            this.defaultCheckedKeys = arr;
        },

        changeName(val) {
            this.typeList.forEach((item) => {
                if (item.id === val) {
                    this.ruleForm.procCode = item.code;
                }
            });
        },
        handleSelectionChange(val) {
            this.ruleForm.formIds = val.map((item) => {
                return item.id;
            });
        },
        /*预览表单*/
        viewForm(row) {
            if (row.formJson) {
                this.formConf = JSON.parse(row.formJson);
                this.isShowDialog = true;
            } else {
                this.$AudaqueToast.error({
                    template: '无可预览的表单',
                    methods: {
                        okEvent() {},
                    },
                });
            }
        },

        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
                let _this = this;
                if (valid) {
                    let dep = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                    if (dep && dep.length > 0) {
                        let params = Object.assign({}, this.ruleForm);
                        params.dep = dep ? dep.join(',') : '';
                        params.roles = params.roles ? params.roles.join(',') : '';
                        params.latest = null;
                        this._AJAX({
                            url: this.optType === 'add' ? 'activiti.process.new' : 'activiti.process.update',
                            method: 'POST',
                            data: params,
                        }).then((res) => {
                            this.$AudaqueToast.tip({
                                template: this.optType === 'add' ? '新增成功' : '修改成功',
                                methods: {
                                    okEvent() {
                                        _this.$router.go(-1);
                                    },
                                },
                            });
                        });
                    } else {
                        this.$AudaqueToast.error({
                            template: `请选择可见范围`,
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
    },
};
</script>
