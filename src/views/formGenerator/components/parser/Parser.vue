<script>
import { deepClone } from '~/utils/index';
import render from '~/components/render/render.js';
import { fetchDynamicData, loadItemFormVal, resetForm, loadTableData } from '@/components/form/formPublic';

const ruleTrigger = {
    'el-input': 'blur',
    'el-input-number': 'blur',
    'el-select': 'change',
    'el-radio-group': 'change',
    'el-checkbox-group': 'change',
    'el-cascader': 'change',
    'el-time-picker': 'change',
    'el-date-picker': 'change',
    'el-rate': 'change',
    'el-tree': ['change', 'focus'],
    'el-upload': 'change',
};

const layouts = {
    colFormItem(h, scheme) {
        /*针对富文本的处理*/
        // if (scheme.__config__.tag === 'tinymce') {
        //     scheme.disabled = this.isDisabled;
        // }
        const config = scheme.__config__;
        const child = renderChildren.apply(this, arguments);
        const listeners = buildListeners.call(this, scheme);

        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
        if (config.showLabel === false) labelWidth = '0';
        //!config.showItem && !this.isDisabled  针对在新增不需要显示在查看和列表需要显示字段的处理  （审核状态）
        return (
            <div>
                {!config.showItem ? (
                    ''
                ) : (
                    <el-col span={config.span}>
                        <el-form-item
                            label-width={labelWidth}
                            prop={scheme.__vModel__}
                            required={config.required}
                            label={config.showLabel ? config.label : ''}
                        >
                            <render ref={scheme.ref ? 'render_' + scheme.ref : ''} conf={scheme} {...{ on: listeners }}>
                                {child}
                            </render>
                        </el-form-item>
                    </el-col>
                )}
            </div>
        );
    },
    rowFormItem(h, scheme) {
        let child = renderChildren.apply(this, arguments);
        if (scheme.type === 'flex') {
            child = (
                <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
                    {child}
                </el-row>
            );
        }
        return (
            <el-col span={scheme.span}>
                <el-row gutter={scheme.gutter}>{child}</el-row>
            </el-col>
        );
    },
    raw(h, currentItem, index, list) {
        const config = currentItem.__config__;
        const child = renderChildren.apply(this, arguments);
        return (
            <render
                key={config.renderKey}
                conf={currentItem}
                onInput={(event) => {
                    this.$set(config, 'defaultValue', event);
                }}
            >
                {child}
            </render>
        );
    },
};

function renderFrom(h) {
    const { formConfCopy } = this;
    return (
        <el-row gutter={formConfCopy.gutter}>
            <el-form
                class="parse-form-item"
                size={formConfCopy.size}
                label-position={formConfCopy.labelPosition}
                // disabled={formConfCopy.disabled}
                disabled={this.isDisabled}
                label-width={`${formConfCopy.labelWidth}px`}
                ref={formConfCopy.formRef}
                // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
                props={{ model: this[formConfCopy.formModel] }}
                rules={this[formConfCopy.formRules]}
            >
                {renderFormItem.call(this, h, formConfCopy.fields)}
                {formConfCopy.formBtns && formBtns.call(this, h)}
            </el-form>
        </el-row>
    );
}

function formBtns(h) {
    return '';
    // return <el-col>
    //   <el-form-item size="large">
    //     <el-button type="primary" onClick={this.submitForm}>提交</el-button>
    //     <el-button onClick={this.resetForm}>重置</el-button>
    //   </el-form-item>
    // </el-col>
}

function renderFormItem(h, elementList) {
    return elementList.map((scheme) => {
        if (this.isDisabled) scheme.disabled = true; //在查看状态下各组件都不可编辑
        const config = scheme.__config__;
        const layout = layouts[config.layout];
        if (layout) {
            return layout.call(this, h, scheme);
        }
        throw new Error(`没有与${config.layout}匹配的layout`);
    });
}

function renderChildren(h, scheme) {
    const config = scheme.__config__;
    if (!Array.isArray(config.children)) return null;
    return renderFormItem.call(this, h, config.children);
}

function setValue(event, config, scheme) {
    this.$set(config, 'defaultValue', event);
    this.$set(this[this.formConf.formModel], scheme.__vModel__, event);
}

function buildListeners(scheme) {
    const config = scheme.__config__;
    const methods = this.formConf.__methods__ || {};
    const listeners = {};

    // 给__methods__中的方法绑定this和event
    Object.keys(methods).forEach((key) => {
        listeners[key] = (event) => methods[key].call(this, event);
    });
    // 响应 render.js 中的 vModel $emit('input', val)
    listeners.input = (event) => setValue.call(this, event, config, scheme);

    return listeners;
}

export default {
    components: {
        render,
    },
    props: {
        formConf: {
            type: Object,
            required: true,
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        formConfCopy: {
            handler(val) {},
            deep: true,
        },
    },

    data() {
        const data = {
            formConfCopy: deepClone(this.formConf),
            [this.formConf.formModel]: {},
            [this.formConf.formRules]: {},
        };
        this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel]);
        this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules]);
        return data;
    },
    created() {
        this.formConfCopy && this.formConfCopy.fields && this.loadDynamicData(this.formConfCopy.fields);
    },
    mounted() {},
    methods: {
        initFormData(componentList, formData) {
            componentList.forEach((cur) => {
                const config = cur.__config__;
                if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue;
                if (config.children) this.initFormData(config.children, formData);
            });
        },
        buildRules(componentList, rules) {
            componentList.forEach((cur) => {
                const config = cur.__config__;
                if (Array.isArray(config.regList)) {
                    if (config.required) {
                        const required = { required: config.required, message: cur.placeholder };
                        if (Array.isArray(config.defaultValue)) {
                            required.type = 'array';
                            required.message = `请至少选择一个${config.label}`;
                        }
                        required.message === undefined && (required.message = `${config.label}不能为空`);
                        config.regList.push(required);
                    }
                    rules[cur.__vModel__] = config.regList.map((item) => {
                        try {
                            item.pattern && (item.pattern = this.evil(item.pattern));
                        } catch (ex) {}
                        item.trigger = ruleTrigger && ruleTrigger[config.tag];
                        return item;
                    });
                }
                if (config.children) this.buildRules(config.children, rules);
            });
        },

        evil(str) {
            var fn = Function;
            return new fn('return ' + str)();
        },

        /*请求远端的数据*/
        loadDynamicData(data) {
            data.forEach((item) => {
                if (item.__config__.children) {
                    this.loadDynamicData(item.__config__.children);
                } else {
                    if (item.__config__.dataType === 'dynamic') {
                        /*请求表格数据  特殊处理*/
                        if (item.__config__.tag === 'table-component') {
                            loadTableData.call(this, item);
                        } else {
                            fetchDynamicData({
                                method: item.__config__.method,
                                url: item.__config__.url,
                                // params:{deptId:1}
                            }).then((resp) => {
                                if (
                                    Object.prototype.toString.call(resp[item.__config__.dataPath]).slice(8, -1) ===
                                    'Object'
                                ) {
                                    this.$set(item, item.__config__.dataConsumer, [resp[item.__config__.dataPath]]);
                                } else {
                                    this.$set(item, item.__config__.dataConsumer, resp[item.__config__.dataPath]);
                                }
                            });
                        }
                    }
                }
            });
        },
        /*清空表单*/
        resetForm() {
            this.formConfCopy = deepClone(this.formConf);
            this.$refs[this.formConf.formRef].resetFields();
            resetForm.call(this, this.formConf.fields);
            this.$emit('reset', this.formConf.formRef);
        },
        /*点击提交按钮做的处理*/
        submitForm() {
            this.$refs[this.formConfCopy.formRef].validate((valid) => {
                if (!valid) return false;
                let formdata = this[this.formConfCopy.formModel],
                    _fileDeleteKeys = this.formConfCopy._fileDeleteKeys || [], //原来文件uuids;
                    fileDeleteKeys = []; //已经删除了的uuids
                loadItemFormVal.call(this, this.formConfCopy.fields, formdata, true); //获取现在文件

                let nowfileKeys = formdata.fileKeys ? formdata.fileKeys.split(',') : []; //现在文件的uuids

                //找出原来的被删除的
                _fileDeleteKeys.forEach((item) => {
                    if (!nowfileKeys.includes(item)) {
                        fileDeleteKeys.push(item);
                    }
                });

                // 触发sumit事件
                formdata.fileDeleteKeys = fileDeleteKeys.join(',');
                this.$emit('submit', formdata);
                return true;
            });
        },
    },
    render(h) {
        return renderFrom.call(this, h);
    },
};
</script>
