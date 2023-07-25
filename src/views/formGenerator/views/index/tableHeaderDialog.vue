<template>
    <div>
        <el-dialog
            v-bind="$attrs"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            v-on="$listeners"
            @open="onOpen"
            @close="onClose"
        >
            <el-row :gutter="0">
                <el-form ref="elForm" :model="ruleForm" :rules="rules" size="small" label-width="0px">
                    <el-form-item label=" ">
                        <el-button
                            class="add-table-header-btn"
                            @click="publics.addLine(ruleForm.tableHeaderData, false)"
                            >添加表头</el-button
                        >
                        <el-table
                            tooltip-effect="light"
                            class="add-header-table"
                            highlight-current-row
                            stripe
                            :data="ruleForm.tableHeaderData"
                            border
                        >
                            <el-table-column show-overflow-tooltip type="index" align="center" width="50" label="序号">
                            </el-table-column>
                            <el-table-column
                                show-overflow-tooltip
                                label="字段名"
                                align="center"
                                prop="label"
                                :render-header="renderHeader"
                            >
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'tableHeaderData.' + scope.$index + '.label'"
                                        :rules="rules.label"
                                    >
                                        <el-input
                                            clearable
                                            placeholder="请输入字段名"
                                            v-model.trim="scope.row.label"
                                        ></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column
                                show-overflow-tooltip
                                label="字段值"
                                align="center"
                                prop="prop"
                                :render-header="renderHeader"
                            >
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'tableHeaderData.' + scope.$index + '.prop'"
                                        :rules="rules.prop"
                                    >
                                        <el-input
                                            clearable
                                            placeholder="请输入字段值"
                                            v-model.trim="scope.row.prop"
                                        ></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="类型" align="center" prop="type">
                                <template slot-scope="scope">
                                    <el-form-item
                                        :prop="'tableHeaderData.' + scope.$index + '.type'"
                                        :rules="rules.type"
                                    >
                                        <el-select v-model="scope.row.type" placeholder="请选择" clearable>
                                            <el-option
                                                v-for="(item, index) in fieldTypeList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="操作" width="200" align="center">
                                <template slot-scope="scope">
                                    <span
                                        title="删除"
                                        :class="['iconfont', 'iconShape1', 'operate']"
                                        @click="
                                            publics.removeLine(ruleForm.tableHeaderData, [
                                                ruleForm.tableHeaderData[scope.$index],
                                            ])
                                        "
                                    ></span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </el-row>
            <div slot="footer">
                <el-button type="primary" @click="handelConfirm"> 确定 </el-button>
                <el-button @click="close"> 取消 </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'tableHeaderDialog',
    components: {},
    inheritAttrs: false,
    props: ['activeData'],
    data() {
        return {
            ruleForm: {
                tableHeaderData: [],
            },
            rules: {
                label: [
                    {
                        required: true,
                        message: '请输入字段名',
                        trigger: 'blur',
                    },
                ],
                prop: [
                    {
                        required: true,
                        message: '请输入字段值',
                        trigger: 'blur',
                    },
                ],
            },
            fieldTypeList: [
                { label: '日期类型', value: 'date' },
                { label: '其他', value: 'other' },
            ],
        };
    },
    computed: {},
    created() {},
    mounted() {
        this.ruleForm.tableHeaderData = JSON.parse(JSON.stringify(this.activeData.headerList));
        if (this.ruleForm.tableHeaderData) {
            this.ruleForm.tableHeaderData.forEach((item) => {
                item.index = Math.random(); //增加一个唯一值删除用
            });
        }
    },
    methods: {
        renderHeader(h, { column, $index }) {
            return (
                <span>
                    <span> {column.label}</span>
                    <span style={{ color: 'red' }}>*</span>
                </span>
            );
        },
        onOpen() {},
        onClose() {},
        close() {
            this.ruleForm.tableHeaderData = [];
            this.$emit('update:visible', false);
        },
        handelConfirm() {
            this.$refs.elForm.validate((valid) => {
                if (!valid) return;
                let params = JSON.parse(JSON.stringify(this.ruleForm.tableHeaderData));
                // params.forEach((item) => {
                //     item.__config__ = {
                //         layout: 'raw',
                //         tag: 'el-table-column',
                //         renderKey: Math.random(),
                //     };
                // });
                this.$emit('commit', params);
                this.close();
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.add-table-header-btn {
    margin-bottom: 10px;
}
/deep/.add-header-table {
    .el-form-item {
        margin-bottom: 0;
    }
    .el-form-item.is-error .el-input__inner {
        border-color: #f56c6c !important;
    }
}
</style>
