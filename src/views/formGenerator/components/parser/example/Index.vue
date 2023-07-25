<template>
    <div class="test-form">
        <parser :form-conf="dataList" @submit="sumbitForm1" />
        <!--<el-button @click="change">-->
        <!--change-->
        <!--</el-button>-->
    </div>
</template>

<script>
import Parser from '../Parser';

// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'

export default {
    components: {
        Parser,
    },
    props: {
        dataList: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            key2: +new Date(),
            formConf: {
                fields: [
                    {
                        __config__: {
                            label: '姓名',
                            labelWidth: null,
                            showLabel: true,
                            changeTag: true,
                            tag: 'el-input',
                            tagIcon: 'input',
                            required: true,
                            layout: 'colFormItem',
                            span: 24,
                            document: 'https://element.eleme.cn/#/zh-CN/component/input',
                            regList: [],
                            formId: 110,
                            renderKey: '1101604314182792',
                        },
                        __slot__: {
                            prepend: '',
                            append: '',
                        },
                        placeholder: '请输入姓名',
                        style: {
                            width: '100%',
                        },
                        clearable: true,
                        'prefix-icon': '',
                        'suffix-icon': '',
                        maxlength: null,
                        'show-word-limit': false,
                        readonly: false,
                        disabled: false,
                        __vModel__: 'name',
                    },
                    {
                        __config__: {
                            label: '下拉选择',
                            showLabel: true,
                            labelWidth: null,
                            tag: 'el-select',
                            tagIcon: 'select',
                            layout: 'colFormItem',
                            span: 24,
                            required: true,
                            regList: [],
                            changeTag: true,
                            document: 'https://element.eleme.cn/#/zh-CN/component/select',
                            formId: 113,
                            renderKey: '1131604314192571',
                        },
                        __slot__: {
                            options: [
                                {
                                    label: '选项一',
                                    value: 1,
                                },
                                {
                                    label: '选项二',
                                    value: 2,
                                },
                            ],
                        },
                        placeholder: '请选择下拉选择',
                        style: {
                            width: '100%',
                        },
                        clearable: true,
                        disabled: false,
                        filterable: false,
                        multiple: false,
                        __vModel__: 'select',
                    },
                    {
                        __config__: {
                            label: '多行文本',
                            labelWidth: null,
                            showLabel: true,
                            tag: 'el-input',
                            tagIcon: 'textarea',
                            required: true,
                            layout: 'colFormItem',
                            span: 24,
                            regList: [],
                            changeTag: true,
                            document: 'https://element.eleme.cn/#/zh-CN/component/input',
                            formId: 111,
                            renderKey: '1111604314187791',
                        },
                        type: 'textarea',
                        placeholder: '请输入多行文本',
                        autosize: {
                            minRows: 4,
                            maxRows: 4,
                        },
                        style: {
                            width: '100%',
                        },
                        maxlength: null,
                        'show-word-limit': false,
                        readonly: false,
                        disabled: false,
                        __vModel__: 'content',
                    },
                    {
                        __config__: {
                            label: '单选框组',
                            labelWidth: null,
                            showLabel: true,
                            tag: 'el-radio-group',
                            tagIcon: 'radio',
                            changeTag: true,
                            layout: 'colFormItem',
                            span: 24,
                            optionType: 'default',
                            regList: [],
                            required: true,
                            border: false,
                            document: 'https://element.eleme.cn/#/zh-CN/component/radio',
                            formId: 114,
                            renderKey: '1141604314200817',
                        },
                        __slot__: {
                            options: [
                                {
                                    label: '男',
                                    value: 1,
                                },
                                {
                                    label: '女',
                                    value: 2,
                                },
                            ],
                        },
                        style: {},
                        size: 'medium',
                        disabled: false,
                        __vModel__: 'radia',
                    },
                    {
                        __config__: {
                            label: '编辑器',
                            showLabel: true,
                            changeTag: true,
                            labelWidth: null,
                            tag: 'tinymce',
                            tagIcon: 'rich-text',
                            defaultValue: null,
                            span: 24,
                            layout: 'colFormItem',
                            required: true,
                            regList: [],
                            document: 'http://tinymce.ax-z.cn',
                            formId: 112,
                            renderKey: 1604314331352,
                        },
                        placeholder: '请输入编辑器',
                        height: 300,
                        branding: false,
                        __vModel__: 'desc',
                    },
                ],
                formRef: 'elForm',
                formModel: 'formData',
                size: 'medium',
                labelPosition: 'right',
                labelWidth: 100,
                formRules: 'rules',
                gutter: 15,
                disabled: false,
                span: 24,
                formBtns: true,
            },
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        // 表单数据回填，模拟异步请求场景
        setTimeout(() => {
            // 请求回来的表单数据
            const data = {
                mobile: '18836662555',
            };
            // 回填数据
            this.fillFormData(this.formConf, data);
            // 更新表单
            this.key2 = +new Date();
        }, 2000);
    },
    methods: {
        fillFormData(form, data) {
            form.fields.forEach((item) => {
                const val = data[item.__vModel__];
                if (val) {
                    item.__config__.defaultValue = val;
                }
            });
        },
        change() {
            this.key2 = +new Date();
            const t = this.formConf;
            this.formConf = this.formConf2;
            this.formConf2 = t;
        },
        sumbitForm1(data) {
            console.log(JSON.stringify(data));
        },
        sumbitForm2(data) {},
    },
};
</script>

<style lang="scss" scoped>
/*.test-form {*/
/*margin: 15px auto;*/
/*width: 800px;*/
/*padding: 15px;*/
/*}*/
</style>
