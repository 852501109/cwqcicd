<template>
    <div class="container">
        <!--左侧组件列表-->
        <div class="left-board">
            <div class="logo-wrapper"></div>
            <el-scrollbar class="left-scrollbar">
                <div class="components-list">
                    <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                        <div class="components-title">{{ item.title }}</div>
                        <draggable
                            class="components-draggable"
                            :list="item.list"
                            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                            :clone="cloneComponent"
                            draggable=".components-item"
                            :sort="false"
                            @end="onEnd"
                        >
                            <div
                                v-for="(element, index) in item.list"
                                :key="index"
                                class="components-item"
                                @click="addComponent(element)"
                            >
                                <div class="components-body">{{ element.__config__.label }}</div>
                            </div>
                        </draggable>
                        <div v-if="listIndex < 3" class="split"></div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="center-board">
            <!--二级头部导航-->
            <div class="action-bar">
                <el-button icon="el-icon-view" type="text" @click="view"> 预览</el-button>
                <el-button icon="el-icon-view" type="text" @click="showJson"> 查看json</el-button>
                <!--<el-button icon="el-icon-download" type="text" @click="download">-->
                <!--导出vue文件-->
                <!--</el-button>-->
                <!--<el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">-->
                <!--复制代码-->
                <!--</el-button>-->
                <el-button
                    v-if="permitList.formUpdate"
                    class="copy-btn-main"
                    icon="el-icon-document-copy"
                    type="text"
                    @click="save"
                >
                    保存
                </el-button>
                <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty"> 清空</el-button>
                <el-button class="delete-btn" icon="el-icon-close" type="text" @click="$router.go(-1)">
                    关闭
                </el-button>
            </div>
            <!--选中组件的展示-->
            <el-scrollbar class="center-scrollbar">
                <el-row class="center-board-row" :gutter="formConf.gutter">
                    <el-form
                        class="parse-form-item"
                        :size="formConf.size"
                        :label-position="formConf.labelPosition"
                        :disabled="formConf.disabled"
                        :label-width="formConf.labelWidth + 'px'"
                    >
                        <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                            <draggable-item
                                v-for="(item, index) in drawingList"
                                :key="item.renderKey"
                                :drawing-list="drawingList"
                                :current-item="item"
                                :index="index"
                                :active-id="activeId"
                                :form-conf="formConf"
                                @activeItem="activeFormItem"
                                @copyItem="drawingItemCopy"
                                @deleteItem="drawingItemDelete"
                            />
                        </draggable>
                        <div v-show="!drawingList.length" class="empty-info">从左侧拖入或点选组件进行表单设计</div>
                    </el-form>
                </el-row>
            </el-scrollbar>
        </div>
        <!--右侧表单配置项-->
        <right-panel
            :active-data="activeData"
            :form-conf="formConf"
            :show-field="!!drawingList.length"
            :fieldList="fieldList"
            :formCode="formCode"
            @tag-change="tagChange"
            @fetch-data="fetchData"
        />

        <!--查看json-->
        <json-drawer
            size="60%"
            :visible.sync="jsonDrawerVisible"
            :json-str="JSON.stringify(formData)"
            @refresh="refreshJson"
        />
        <!--预览类型-->
        <code-type-dialog
            :visible.sync="dialogVisible"
            title="选择生成类型"
            :show-file-name="showFileName"
            @confirm="generate"
        />
        <input id="copyNode" type="hidden" />
        <el-dialog
            title="预览"
            :visible.sync="isVisibleDialog"
            :close-on-click-modal="false"
            class="form-parser-dialog"
        >
            <form-parser v-if="isVisibleDialog" ref="formParser" :formConf="formData"></form-parser>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import API from '@/api/index';
import draggable from 'vuedraggable';
import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';
import JsonDrawer from './JsonDrawer';
import RightPanel from './RightPanel';
import {
    inputComponents,
    selectComponents,
    layoutComponents,
    formConf,
    customizeComponents,
} from '~/components/generator/config';
import { beautifierConf, titleCase, deepClone } from '~/utils/index';
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from '~/components/generator/html';
import { delDynamicData, fetchDynamicData, loadTableData } from '@/components/form/formPublic';
import { makeUpJs } from '~/components/generator/js';
import { makeUpCss } from '~/components/generator/css';
import CodeTypeDialog from './CodeTypeDialog';
import DraggableItem from './DraggableItem';

let tempActiveData;
let beautify = require('js-beautify');
export default {
    components: {
        draggable,
        JsonDrawer,
        RightPanel,
        CodeTypeDialog,
        DraggableItem,
    },
    data() {
        return {
            idGlobal: Date.now(),
            formConf,
            inputComponents,
            selectComponents,
            layoutComponents,
            customizeComponents,
            labelWidth: 100,
            drawingList: [],
            drawingData: {},
            activeId: Date.now(),
            drawerVisible: false,
            formData: {},
            dialogVisible: false,
            jsonDrawerVisible: false,
            generateConf: null,
            showFileName: false,
            activeData: {},
            leftComponents: [
                {
                    title: '输入型组件',
                    list: inputComponents,
                },
                {
                    title: '选择型组件',
                    list: selectComponents,
                },
                {
                    title: '布局型组件',
                    list: layoutComponents,
                },
                {
                    title: '自定义组件',
                    list: customizeComponents,
                },
            ],
            isVisibleDialog: false,
            formId: this.$route.query.formId,
            tableName: this.$route.query.tableName,
            formCode: this.$route.query.formCode, //涉及到文件的上传和下载需要用的上该字段。在上传时需要带该参数，下载也需要
            fieldList: [], //数据库字段列表
            fieldListS: [],
            fieldNameIsEmptyNum: 0, //字段名有几个是为空的  有为空的就不允许提交
        };
    },
    watch: {
        drawingList: {
            /*右侧选择字段名时已选择的就禁用*/
            handler(val) {
                this.fieldListS = [];
                if (val && val.length > 0) {
                    val.forEach((item) => {
                        if (item.__vModel__) {
                            this.fieldListS.push(item.__vModel__);
                        }
                        /*针对时间范围组件*/
                        if (item.__vModel_1__) {
                            this.fieldListS.push(item.__vModel_1__);
                        }
                    });
                    this.fieldList.forEach((item) => {
                        if (this.fieldListS.indexOf(item.columnName) != -1) {
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                }
            },
            deep: true,
        },
    },
    created() {
        /*获得数据库字段列表*/
        if (this.tableName) {
            this._AJAX({
                url: 'form.design.select.table',
                method: 'GET',
                data: {
                    tableName: this.tableName,
                },
            }).then((res) => {
                this.fieldList = res.result;
            });
        }
    },
    mounted() {
        /*回显表单列表*/
        if (this.formId) {
            let url = API['form.design.select'] + '/' + this.formId;
            this._AJAX({
                url: url,
                method: 'GET',
                data: {},
            }).then((res) => {
                let formJson = JSON.parse(res.result.formJson);
                this.drawingList = formJson.fields;
                this.formConf = formJson;
                this.activeFormItem(this.drawingList[0]);
            });
        }
        const clipboard = new ClipboardJS('#copyNode', {
            text: () => {
                const codeStr = this.generateCode();
                this.$notify({
                    title: '成功',
                    message: '代码已复制到剪切板，可粘贴。',
                    type: 'success',
                });
                return codeStr;
            },
        });
        clipboard.on('error', (e) => {
            this.$message.error('代码复制失败');
        });
    },
    methods: {
        ...mapActions(['_AJAX']),
        setObjectValueByStringKeys(obj, strKeys, val) {
            const arr = strKeys.split('.');
            arr.reduce((pre, item, i) => {
                if (arr.length === i + 1) {
                    pre[item] = val;
                } else if (Object.prototype.toString.call(pre[item]) !== '[Object Object]') {
                    pre[item] = {};
                }
                return pre[item];
            }, obj);
        },
        /*更新表单组件数据*/
        setRespData(component, respData) {
            const { dataPath, renderKey, dataConsumer } = component.__config__;
            if (!dataPath || !dataConsumer) return;
            let data = dataPath.split('.').reduce((pre, item) => pre[item], respData);
            if (Object.prototype.toString.call(data).slice(8, -1) === 'Object') {
                data = [data]; //转化为数组
            }
            this.setObjectValueByStringKeys(component, dataConsumer, data);
            const i = this.drawingList.findIndex((item) => item.__config__.renderKey === renderKey);
            if (i > -1) this.$set(this.drawingList, i, component);
        },
        /*表单组件请求动态数据*/
        fetchData(component) {
            const { dataType, method, url } = component.__config__;
            let _this = this;
            if (dataType === 'dynamic' && method && url) {
                this.setLoading(component, true);
                /*请求表格数据  特殊处理*/
                if (component.__config__.tag === 'table-component') {
                    loadTableData.call(this, component);
                } else {
                    fetchDynamicData({
                        method,
                        url,
                    }).then((resp) => {
                        _this.setLoading(component, false);
                        _this.setRespData(component, resp);
                    });
                }
            }
        },
        /*显示加载图标*/
        setLoading(component, val) {
            const { directives } = component;
            if (Array.isArray(directives)) {
                const t = directives.find((d) => d.name === 'loading');
                if (t) t.value = val;
            }
        },
        /*当前选中的组件*/
        activeFormItem(currentItem) {
            this.activeData = currentItem;
            this.activeId = currentItem.__config__.formId;
        },
        onEnd(obj) {
            if (obj.from !== obj.to) {
                this.fetchData(tempActiveData);
                this.activeData = tempActiveData;
                this.activeId = this.idGlobal;
            }
        },
        /*点击左侧组件列表添加组件*/
        addComponent(item) {
            const clone = this.cloneComponent(item);
            this.fetchData(clone);
            this.drawingList.push(clone);
            /*选中当前组件*/
            this.activeFormItem(clone);
        },
        /*复制一份数据*/
        cloneComponent(origin) {
            const clone = deepClone(origin);
            const config = clone.__config__;
            config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
            this.createIdAndKey(clone);
            clone.placeholder !== undefined && (clone.placeholder += config.label);
            tempActiveData = clone;
            return tempActiveData;
        },
        /*修改组件属性*/
        createIdAndKey(item) {
            const config = item.__config__;
            config.formId = ++this.idGlobal;
            config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
            if (config.layout === 'colFormItem') {
                item.__vModel__ = null;
                // item.__vModel__ = `field_${this.idGlobal}`;
            } else if (config.layout === 'rowFormItem') {
                config.componentName = `row${this.idGlobal}`;
                !Array.isArray(config.children) && (config.children = []);
                delete config.label; // rowFormItem无需配置label属性
            }
            if (Array.isArray(config.children)) {
                config.children = config.children.map((childItem) => this.createIdAndKey(childItem));
            }
            return item;
        },
        /*组装表单数据 提交用*/
        AssembleFormData() {
            this.formData = {
                fields: deepClone(this.drawingList),
                ...this.formConf,
            };
        },
        generate(data) {
            const func = this[`exec${titleCase(this.operationType)}`];
            this.generateConf = data;
            func && func(data);
        },
        execRun(data) {
            this.AssembleFormData();
            this.drawerVisible = true;
        },
        execDownload(data) {
            const codeStr = this.generateCode();
            const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, data.fileName);
        },
        execCopy(data) {
            document.getElementById('copyNode').click();
        },
        /*清空表单*/
        empty() {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确定要清空所有组件?`,
                methods: {
                    okEvent() {
                        _this.drawingList = [];
                        _this.$delete(_this.formConf, 'fields');
                        // this.formConf = [];
                    },
                },
            });
        },
        /*复制表单组件*/
        drawingItemCopy(item, list) {
            let clone = deepClone(item);
            clone = this.createIdAndKey(clone);
            list.push(clone);
            this.activeFormItem(clone);
        },
        /*删除表单组件*/
        drawingItemDelete(index, list) {
            list.splice(index, 1);
            this.$nextTick(() => {
                const len = this.drawingList.length;
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1]);
                }
            });
        },
        generateCode() {
            const { type } = this.generateConf;
            this.AssembleFormData();
            const script = vueScript(makeUpJs(this.formData, type));
            const html = vueTemplate(makeUpHtml(this.formData, type));
            const css = cssStyle(makeUpCss(this.formData));
            return beautify.html(html + script + css, beautifierConf.html);
        },
        showJson() {
            this.AssembleFormData();
            this.jsonDrawerVisible = true;
        },
        download() {
            this.dialogVisible = true;
            this.showFileName = true;
            this.operationType = 'download';
        },
        /*预览*/
        view() {
            this.AssembleFormData();
            this.isVisibleDialog = true;
        },
        /*运行*/
        run() {
            this.dialogVisible = true;
            this.showFileName = false;
            this.operationType = 'run';
        },
        /*复制*/
        copy() {
            this.dialogVisible = true;
            this.showFileName = false;
            this.operationType = 'copy';
        },
        //校验字段名是否为空
        checkFieldNameIsEmpty(fields) {
            for (let i = 0; i < fields.length; i++) {
                let item = fields[i];
                if (item.__config__.children) {
                    /*针对不同结构的数据*/
                    this.checkFieldNameIsEmpty(item.__config__.children);
                } else {
                    //排除行容器组件、表格组件
                    const shieldItem = ['row', 'el-button'];
                    if (!shieldItem.includes(item.__config__.tag)) {
                        if (!item.hasOwnProperty('__vModel__') || item.__vModel__ === null || item.__vModel__ === '') {
                            ++this.fieldNameIsEmptyNum;
                            this.$AudaqueToast.error({
                                template: `${item.__config__.label} 字段名不能为空`,
                                methods: {
                                    okEvent() {},
                                },
                            });
                            return;
                        }
                        /*时间范围组件分为两个字段提交 __vModel__ 、 __vModel_1__  特殊处理*/
                        if (
                            item.__config__.isRange &&
                            (!item.hasOwnProperty('__vModel_1__') ||
                                item.__vModel_1__ === null ||
                                item.__vModel_1__ === '')
                        ) {
                            ++this.fieldNameIsEmptyNum;
                            this.$AudaqueToast.error({
                                template: `${item.__config__.label} 字段名不能为空`,
                                methods: {
                                    okEvent() {},
                                },
                            });
                            return;
                        }
                    }
                }
            }
        },
        /*保存*/
        save() {
            this.fieldNameIsEmptyNum = 0; //初始化为0
            this.AssembleFormData();
            let fields = JSON.parse(JSON.stringify(this.formData.fields));
            delDynamicData(fields); //删除远端请求的数据
            let formData = Object.assign({}, this.formData);
            formData.fields = fields;
            formData.formCode = this.formCode;
            this.checkFieldNameIsEmpty(formData.fields); //校验组件的字段名是否为空
            //组件的用户名有为空的情况不允许提交
            if (this.fieldNameIsEmptyNum > 0) {
                return;
            }
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'form.design.update',
                method: 'POST',
                data: {
                    formJson: JSON.stringify(formData),
                    id: this.formId,
                },
            }).then((res) => {
                this.$AudaqueToast.tip({
                    template: `保存成功`,
                    methods: {
                        okEvent() {},
                    },
                });
            });
        },
        /*切换组件类型*/
        tagChange(newTag) {
            newTag = this.cloneComponent(newTag);
            const config = newTag.__config__;
            newTag.__vModel__ = this.activeData.__vModel__;
            config.formId = this.activeId;
            config.span = this.activeData.__config__.span;
            this.activeData.__config__.tag = config.tag;
            this.activeData.__config__.tagIcon = config.tagIcon;
            this.activeData.__config__.document = config.document;
            if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
                config.defaultValue = this.activeData.__config__.defaultValue;
            }
            Object.keys(newTag).forEach((key) => {
                if (this.activeData[key] !== undefined) {
                    newTag[key] = this.activeData[key];
                }
            });
            this.activeData = newTag;
            this.updateDrawingList(newTag, this.drawingList);
        },
        /*更新表单组件*/
        updateDrawingList(newTag, list) {
            const index = list.findIndex((item) => item.__config__.formId === this.activeId);
            if (index > -1) {
                list.splice(index, 1, newTag);
            } else {
                list.forEach((item) => {
                    if (Array.isArray(item.__config__.children))
                        this.updateDrawingList(newTag, item.__config__.children);
                });
            }
        },
        /*刷新json数据*/
        refreshJson(data) {
            this.drawingList = deepClone(data.fields);
            delete data.fields;
            this.formConf = data;
        },
    },
};
</script>

<style lang="scss">
@import '~/styles/home';
</style>
