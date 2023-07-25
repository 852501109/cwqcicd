// 表单属性【右面板】
export const formConf = {
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
};

// 输入型组件 【左面板】
export const inputComponents = [
    {
        // 组件的自定义配置
        __config__: {
            label: '单行文本',
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: 'el-input',
            tagIcon: 'input',
            defaultValue: undefined,
            required: false,
            layout: 'colFormItem',
            span: 24,
            // 正则校验规则
            regList: [],
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        // 组件的插槽属性
        __slot__: {
            prepend: '',
            append: '',
        },
        // 其余的为可直接写在组件标签上的属性
        placeholder: '请输入',
        style: { width: '100%' },
        clearable: true,
        'prefix-icon': '',
        'suffix-icon': '',
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
    },
    {
        __config__: {
            label: '多行文本',
            labelWidth: null,
            showLabel: true,
            tag: 'el-input',
            tagIcon: 'textarea',
            defaultValue: undefined,
            required: false,
            layout: 'colFormItem',
            span: 24,
            regList: [],
            changeTag: true,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        type: 'textarea',
        placeholder: '请输入',
        autosize: {
            minRows: 4,
            maxRows: 4,
        },
        style: { width: '100%' },
        maxlength: null,
        'show-word-limit': false,
        readonly: false,
        disabled: false,
    },
    // {
    //     __config__: {
    //         label: '密码',
    //         showLabel: true,
    //         labelWidth: null,
    //         changeTag: true,
    //         tag: 'el-input',
    //         tagIcon: 'password',
    //         defaultValue: undefined,
    //         layout: 'colFormItem',
    //         span: 24,
    //         required: false,
    //         regList: [],
    //         showItem: true,
    //isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
    //     },
    //     __slot__: {
    //         prepend: '',
    //         append: '',
    //     },
    //     placeholder: '请输入',
    //     'show-password': true,
    //     style: { width: '100%' },
    //     clearable: true,
    //     'prefix-icon': '',
    //     'suffix-icon': '',
    //     maxlength: null,
    //     'show-word-limit': false,
    //     readonly: false,
    //     disabled: false,
    // },
    {
        __config__: {
            label: '计数器',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tag: 'el-input-number',
            tagIcon: 'number',
            defaultValue: undefined,
            span: 24,
            layout: 'colFormItem',
            required: false,
            regList: [],
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        placeholder: '',
        min: undefined,
        max: undefined,
        step: 1,
        'step-strictly': false,
        precision: undefined,
        'controls-position': '',
        disabled: false,
    },
    /*  {
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
            required: false,
            regList: [],
            document: 'http://tinymce.ax-z.cn',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        placeholder: '请输入',
        height: 300, // 编辑器高度
        branding: false, // 隐藏右下角品牌烙印
    },*/
];

// 选择型组件 【左面板】
export const selectComponents = [
    {
        __config__: {
            label: '下拉选择',
            showLabel: true,
            labelWidth: null,
            tag: 'el-select',
            tagIcon: 'select',
            layout: 'colFormItem',
            span: 24,
            required: false,
            regList: [],
            changeTag: true,
            dataConsumer: 'options',
            dataType: 'static',
            url: '',
            method: 'get',
            dataPath: 'result',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        options: [],
        props: {
            props: {
                label: 'name',
                value: 'id',
            },
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
        placeholder: '请选择',
        style: { width: '100%' },
        clearable: true,
        disabled: false,
        filterable: false,
        multiple: false,
    },
    {
        __config__: {
            label: '级联选择',
            url: '',
            method: 'get',
            dataPath: 'list',
            dataConsumer: 'options',
            showLabel: true,
            labelWidth: null,
            tag: 'el-cascader',
            tagIcon: 'cascader',
            layout: 'colFormItem',
            defaultValue: [],
            dataType: 'dynamic',
            span: 24,
            required: false,
            regList: [],
            changeTag: true,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        options: [
            {
                id: 1,
                value: 1,
                label: '选项1',
                children: [
                    {
                        id: 2,
                        value: 2,
                        label: '选项1-1',
                    },
                ],
            },
        ],
        placeholder: '请选择',
        style: { width: '100%' },
        props: {
            props: {
                multiple: false,
                label: 'label',
                value: 'value',
                children: 'children',
            },
        },
        'show-all-levels': true,
        disabled: false,
        clearable: true,
        filterable: false,
        separator: '/',
    },
    {
        __config__: {
            label: '单选框组',
            labelWidth: null,
            showLabel: true,
            tag: 'el-radio-group',
            tagIcon: 'radio',
            changeTag: true,
            defaultValue: undefined,
            layout: 'colFormItem',
            span: 24,
            optionType: 'default',
            regList: [],
            required: false,
            border: false,
            dataConsumer: 'options',
            dataType: 'static',
            url: '',
            method: 'get',
            dataPath: 'result',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
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
        props: {
            props: {
                label: 'name',
                value: 'id',
            },
        },
        __slot__: {},
        style: {},
        size: 'medium',
        disabled: false,
    },
    {
        __config__: {
            label: '多选框组',
            tag: 'el-checkbox-group',
            tagIcon: 'checkbox',
            defaultValue: [],
            span: 24,
            showLabel: true,
            labelWidth: null,
            layout: 'colFormItem',
            optionType: 'default',
            required: false,
            regList: [],
            changeTag: true,
            border: false,
            dataConsumer: 'options',
            dataType: 'static',
            url: '',
            method: 'get',
            dataPath: 'result',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
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
        props: {
            props: {
                label: 'name',
                value: 'id',
            },
        },
        __slot__: {},
        style: {},
        size: 'medium',
        min: null,
        max: null,
        disabled: false,
        multiple: true, //多选
    },
    {
        __config__: {
            label: '开关',
            tag: 'el-switch',
            tagIcon: 'switch',
            defaultValue: 0,
            span: 24,
            showLabel: true,
            labelWidth: null,
            layout: 'colFormItem',
            required: false,
            regList: [],
            changeTag: true,
            showItem: true,
            activeName: '开启', //打开按钮的翻译
            inactiveName: '关闭', //关闭按钮的翻译
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        style: {},
        disabled: false,
        'active-text': '',
        'inactive-text': '',
        'active-color': null,
        'inactive-color': null,
        'active-value': 1,
        'inactive-value': 0,
    },
    {
        __config__: {
            label: '滑块',
            tag: 'el-slider',
            tagIcon: 'slider',
            defaultValue: null,
            span: 24,
            showLabel: true,
            layout: 'colFormItem',
            labelWidth: null,
            required: false,
            regList: [],
            changeTag: true,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        disabled: false,
        min: 0,
        max: 100,
        step: 1,
        'show-stops': false,
        range: false,
    },
    {
        __config__: {
            label: '时间选择',
            tag: 'el-time-picker',
            tagIcon: 'time',
            defaultValue: null,
            span: 24,
            showLabel: true,
            layout: 'colFormItem',
            labelWidth: null,
            required: false,
            regList: [],
            changeTag: true,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        placeholder: '请选择',
        style: { width: '100%' },
        disabled: false,
        clearable: true,
        'picker-options': {
            selectableRange: '00:00:00-23:59:59',
        },
        format: 'HH:mm:ss',
        'value-format': 'HH:mm:ss',
    },
    // {
    //     __config__: {
    //         label: '时间范围',
    //         tag: 'el-time-picker',
    //         tagIcon: 'time-range',
    //         span: 24,
    //         showLabel: true,
    //         labelWidth: null,
    //         layout: 'colFormItem',
    //         defaultValue: null,
    //         required: false,
    //         regList: [],
    //         changeTag: true,
    //         showItem: true,
    //         isRange: true, //涉及到时间范围的需要保持两个字段。根据此字段来判断
    //     },
    //     style: { width: '100%' },
    //     disabled: false,
    //     clearable: true,
    //     'is-range': true,
    //     'range-separator': '至',
    //     'start-placeholder': '开始时间',
    //     'end-placeholder': '结束时间',
    //     // format: 'HH:mm:ss',
    //     'value-format': 'HH:mm:ss',
    // },
    {
        __config__: {
            label: '日期选择',
            tag: 'el-date-picker',
            tagIcon: 'date',
            defaultValue: null,
            showLabel: true,
            labelWidth: null,
            span: 24,
            layout: 'colFormItem',
            required: false,
            regList: [],
            changeTag: true,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        placeholder: '请选择',
        type: 'date',
        style: { width: '100%' },
        disabled: false,
        clearable: true,
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd',
        readonly: false,
    },
    {
        __config__: {
            label: '日期范围',
            tag: 'el-date-picker',
            tagIcon: 'date-range',
            defaultValue: null,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: false,
            layout: 'colFormItem',
            regList: [],
            changeTag: true,
            showItem: true,
            isRange: true, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        style: { width: '100%' },
        type: 'daterange',
        'range-separator': '至',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        disabled: false,
        clearable: true,
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd',
        readonly: false,
    },
    // {
    //     __config__: {
    //         label: '评分',
    //         tag: 'el-rate',
    //         tagIcon: 'rate',
    //         defaultValue: 0,
    //         span: 24,
    //         showLabel: true,
    //         labelWidth: null,
    //         layout: 'colFormItem',
    //         required: false,
    //         regList: [],
    //         changeTag: true,
    //isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
    //showItem:true
    //     },
    //     style: {},
    //     max: 5,
    //     'allow-half': false,
    //     'show-text': false,
    //     'show-score': false,
    //     disabled: false,
    // },
    // {
    //     __config__: {
    //         label: '颜色选择',
    //         tag: 'el-color-picker',
    //         tagIcon: 'color',
    //         span: 24,
    //         defaultValue: null,
    //         showLabel: true,
    //         labelWidth: null,
    //         layout: 'colFormItem',
    //         required: false,
    //         regList: [],
    //         changeTag: true,
    //showItem:true
    //isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
    //     },
    //     'show-alpha': false,
    //     'color-format': '',
    //     disabled: false,
    //     size: 'medium',
    // },
    {
        __config__: {
            label: '上传',
            tag: 'el-upload',
            tagIcon: 'upload',
            layout: 'colFormItem',
            defaultValue: null,
            showLabel: true,
            labelWidth: null,
            span: 24,
            showTip: false,
            buttonText: '点击上传',
            regList: [],
            changeTag: true,
            fileSize: 2,
            sizeUnit: 'MB',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        __slot__: {
            'list-type': true,
        },
        data: {},
        action: window.location.origin + '/webkit/form/data/file/upload',
        disabled: false,
        // accept: '',
        headers: {
            //请求头
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': sessionStorage.getItem('token'),
        },
        name: 'files',
        'auto-upload': true,
        // 'list-type': 'text',
        multiple: false,
        'file-list': [],
        'on-success': 'uploadSuccess',
        'on-error': 'uploadError',
        'on-remove': 'uploadRemove',
        'on-preview': 'uploadpreview',
        'before-upload': 'uploadBeforeAvatar',
    },
    {
        __config__: {
            layout: 'colFormItem',
            tag: 'el-tree',
            tagIcon: 'el-tree',
            label: '树形控件',
            showLabel: true,
            labelWidth: null,
            defaultValue: undefined,
            dataConsumer: 'data',
            dataType: 'static',
            url: '',
            method: 'get',
            dataPath: 'result',
            isResetChecked: false, //是否清空所选的
            isSingleChoice: false, //是否单选
            required: false,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        ref: 'myTree',
        'show-checkbox': true,
        /*懒加载*/
        // lazy: false,
        'node-key': 'id',
        'check-strictly': false,
        'default-expanded-keys': [],
        'default-checked-keys': [],
        __slot__: {},
        style: { width: '100%' },
        data: [],
        props: {
            props: {
                children: 'children',
                label: 'name',
                value: 'id',
            },
        },
        on: {
            'node-click': 'treeNodeClick',
            'check-change': 'treeCheckClick',
        },
    },
];

// 布局型组件 【左面板】
export const layoutComponents = [
    {
        __config__: {
            layout: 'rowFormItem',
            tagIcon: 'row',
            tag: 'row',
            span: 24,
            label: '行容器',
            layoutTree: true,
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        type: 'default',
        justify: 'start',
        align: 'top',
    },
    {
        __config__: {
            label: '按钮',
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            tag: 'el-button',
            tagIcon: 'button',
            span: 24,
            layout: 'colFormItem',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        __slot__: {
            default: '主要按钮',
        },
        type: 'primary',
        icon: 'el-icon-search',
        round: false,
        size: 'medium',
        plain: false,
        circle: false,
        disabled: false,
    },
    {
        __config__: {
            layout: 'colFormItem',
            tagIcon: 'table',
            tag: 'table-component',
            span: 24,
            formId: 101,
            renderKey: 1595761764203,
            componentName: 'row101',
            showItem: true,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
            showLabel: true,
            changeTag: true,
            labelWidth: null,
            label: '表格',
            dataType: 'dynamic',
            method: 'get',
            //请求的参数
            parameter: [
                { label: 'page', value: 1 }, //当前页
                { label: 'rows', value: 10 }, //每页多少条
            ],
            dataPath: 'rows',
            dataConsumer: 'data',
            url: '',
        },
        option: {
            isSelection: false, //是否显示复选框
        },
        headerList: [],
        data: {},
        total: 0, //总数
        // directives: [
        //     {
        //         name: 'loading',
        //         value: true,
        //     },
        // ],
        border: true,
        type: 'default',
        justify: 'start',
        align: 'top',
        on: {
            'size-change': 'tableSizeChange', //表格分页切换  一页多少条
            'current-change': 'tableCurrentChange', //表格分页切换  跳转到那页
        },
    },
    // {
    //     __config__: {
    //         layout: 'colFormItem',
    //         tag: 'adq-tabs',
    //         tagIcon: 'adq-tabs',
    //         label: 'Tabs 标签页',
    //         showLabel: false,
    //         changeTag: true,
    //         defaultValue: undefined,
    //isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
    //     },
    //     options: [
    //         { label: '标签1', name: '1', content: [] },
    //         { label: '标签2', name: '2', content: [] },
    //         { label: '标签3', name: '3', content: [] },
    //     ],
    //     type: '',
    //     'tab-position': 'top',
    //     closable: false,
    //     on: {
    //         'tab-remove': 'removeTab',
    //     },
    // },
];

/*自定义组件*/
export const customizeComponents = [
    {
        __config__: {
            label: '审核状态',
            showLabel: true,
            labelWidth: null,
            tag: 'el-select',
            tagIcon: 'select',
            layout: 'colFormItem',
            span: 24,
            required: false,
            regList: [],
            changeTag: true,
            dataConsumer: 'options',
            dataType: 'static',
            url: '',
            method: 'get',
            dataPath: 'list',
            showItem: false,
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
            formId: 111,
            renderKey: '1111608604949866',
        },
        options: [
            {
                label: '待提交',
                value: 0,
            },
            {
                label: '处理中',
                value: 1,
            },
            {
                label: '通过',
                value: 2,
            },
            {
                label: '驳回',
                value: 3,
            },
            {
                label: '撤回',
                value: 4,
            },
            {
                label: '不通过',
                value: 5,
            },
            {
                label: '中止',
                value: 6,
            },
        ],
        props: {
            props: {
                label: 'label',
                value: 'value',
            },
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
        placeholder: '请选择',
        style: {
            width: '100%',
        },
        clearable: true,
        disabled: true,
        filterable: false,
        multiple: false,
        __vModel__: 'actStatus',
    },
    {
        __config__: {
            layout: 'colFormItem',
            tag: 'el-tree',
            tagIcon: 'el-tree',
            label: '部门',
            showLabel: true,
            labelWidth: null,
            dataConsumer: 'data',
            dataType: 'dynamic',
            url: window.location.origin + '/webkit/org/findRootDept.do?level=9',
            method: 'get',
            dataPath: 'result',
            isResetChecked: false,
            isSingleChoice: false,
            required: false,
            showItem: true,
            span: 24,
            formId: 1609913741134,
            renderKey: '16099137411341609913752019',
            isRange: false, //涉及到时间范围的需要保持两个字段。根据此字段来判断
        },
        ref: 'myTree',
        'show-checkbox': true,
        'node-key': 'id',
        'check-strictly': false,
        'default-expanded-keys': [],
        'default-checked-keys': [],
        __slot__: {},
        style: {
            width: '100%',
        },
        data: [],
        props: {
            props: {
                children: 'children',
                label: 'name',
                value: 'id',
            },
        },
        on: {
            'node-click': 'treeNodeClick',
            'check-change': 'treeCheckClick',
        },
        __vModel__: 'tree',
    },
];
