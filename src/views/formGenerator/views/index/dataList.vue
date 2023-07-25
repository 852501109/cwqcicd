<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="表单数据">
                <i class="iconfont iconfanhui1 audaque-rect-icon" @click="$router.go(-1)"> 返回</i>
                <i
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="infoEdit()"
                    v-if="permitList.formDateNew && (formInfo.tableName || formInfo.apiDataAdd)"
                >
                    新增</i
                >
                <!--                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>-->
            </audaque-table-title>
        </template>
        <template slot="search"></template>
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

                <el-table-column
                    v-for="(item, index) in theadList"
                    :key="index"
                    show-overflow-tooltip
                    :prop="item.value"
                    :label="item.label"
                >
                    <template slot-scope="scope">
                        <!--针对时间和日期的翻译-->
                        <template v-if="item.tag === 'el-date-picker' || item.tag === 'el-time-picker'">
                            <!--日期和时间范围-->
                            <template v-if="item.formJson.__config__.isRange">
                                <template v-if="item.tag === 'el-time-picker'">
                                    {{ scope.row[item.value] }} - {{ scope.row[item.formJson.__vModel_1__] }}
                                </template>
                                <template v-else>
                                    {{ $utils.timeToDate(scope.row[item.value], false) }} -
                                    {{ $utils.timeToDate(scope.row[item.formJson.__vModel_1__], false) }}
                                </template>
                            </template>
                            <!---->
                            <template v-else>
                                <template v-if="item.tag === 'el-time-picker'">
                                    {{ scope.row[item.value] }}
                                </template>
                                <template v-else>
                                    {{ $utils.timeToDate(scope.row[item.value], false) }}
                                </template>
                            </template>
                        </template>
                        <div
                            v-else-if="
                                item.tag === 'el-tree' ||
                                item.tag === 'el-select' ||
                                item.tag === 'el-cascader' ||
                                item.tag === 'el-checkbox-group' ||
                                item.tag === 'el-radio-group'
                            "
                        >
                            <span v-text="selectComponentsList(scope.row[item.value], item.value)"></span>
                        </div>
                        <!--开关组件-->
                        <template v-else-if="item.tag === 'el-switch'">
                            {{ viewSwitchName(item, scope.row[item.value]) }}
                        </template>
                        <!--其他控件-->
                        <div v-else>
                            <span v-if="item.formJson.__config__.dataType === 'dynamic'">{{
                                dictionary[item.value][scope.row[item.value]]
                            }}</span>
                            <span v-else>{{ scope.row[item.value] }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.formDateUpdate"
                            class="iconfont iconFill"
                            title="编辑"
                            @click="edit(scope.row)"
                        ></span>
                        <span
                            class="iconfont iconShape1"
                            title="删除"
                            v-if="
                                permitList.formDateDel &&
                                (!scope.row.actStatus || scope.row.actStatus == 0) &&
                                (formInfo.tableName || formInfo.apiDataDelete)
                            "
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
            :title="dialogTitle"
            :visible.sync="isVisibleDialog"
            width="500"
            :close-on-click-modal="false"
            class="form-parser-dialog"
            @close="$refs.formParser.resetForm()"
        >
            <form-parser
                v-if="isVisibleDialog"
                ref="formParser"
                :key="key2"
                :formConf="formConf"
                @submit="submitForm"
                @reset="resetForm"
            ></form-parser>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isVisibleDialog = !isVisibleDialog">取消</el-button>
                <el-button @click="$refs.formParser.submitForm()" :loading="isSHowButtonLoading">提交</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';
import { fetchDynamicData } from '@/components/form/formPublic';
import API from '@/api/index';
import { fillFormData } from '@/components/form/formPublic';

export default {
    data() {
        return {
            key2: +new Date(),
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
            activeData: {},
            formConf: {},
            formInfo: {},
            formModel: {},
            theadList: [],
            dialogTitle: '新增',
            dialogType: 'add',
            tableName: this.$route.query.tableName,
            formId: this.$route.query.formId,
            formCode: this.$route.query.formCode,
            loadNum: 0,
            dictionary: {}, //存储远端数据的翻译
        };
    },
    created() {
        this.loadData();
    },
    watch: {
        dictionary(val) {
            // console.log(val);
        },
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            let _this = this;
            if (this.formId) {
                let url = API['form.design.select'] + '/' + this.formId;
                this._AJAX({
                    url: url,
                    method: 'GET',
                    data: {},
                }).then((res) => {
                    this.formInfo = res.result;
                    if (!res.result.formJson) {
                        return;
                    }
                    let formJson = JSON.parse(res.result.formJson);
                    this.formConf = formJson;
                    if (this.loadNum === 0) {
                        /*请求表头*/
                        this.fieldTranslation(formJson.fields);
                        let data = this.formConf.fields[0].__config__.children
                            ? this.formConf.fields[0].__config__.children
                            : this.formConf.fields;
                        data.forEach((item) => {
                            /*排除掉上传组件、表格组件  不需展示*/
                            if (item.__config__.tag != 'el-upload' && item.__config__.tag != 'table-component') {
                                let obj = {};
                                obj.label = item.__config__.label;
                                obj.value = item.__vModel__;
                                obj.tag = item.__config__.tag; //类型
                                obj.formJson = item;
                                this.theadList.push(obj);
                            }
                        });
                        ++this.loadNum;
                    }
                    let params = Object.assign({ tableName: this.tableName, formCode: this.formCode }, this.param);
                    setTimeout(() => {
                        this._AJAX({
                            url: 'form.data.list',
                            method: 'GET',
                            data: params,
                        }).then((res1) => {
                            this.tableList = res1.result;
                        });
                    }, 200);
                });
            }
        },
        /*涉及到远端数据的需要翻译的*/
        fieldTranslation(fields) {
            let _t = this;
            fields.forEach((item) => {
                if (item.__config__.tag === 'table-component') return; //排除表格组件不显示  不然会报错
                if (item.__config__.children) {
                    /*针对不同结构的数据*/
                    this.fieldTranslation(item.__config__.children);
                } else {
                    if (item.__config__.dataType === 'dynamic') {
                        //从远端拿数据的
                        fetchDynamicData({
                            method: item.__config__.method,
                            url: item.__config__.url,
                            // params:{deptId:1}
                        }).then((resp) => {
                            _t.$set(_t.dictionary, item.__vModel__, {}); //创建以item.__vModel__为key的空对象存放
                            if (item.__config__.tag === 'el-tree' || item.__config__.tag === 'el-cascader') {
                                /*树形结构/级联的数据需要递归翻译*/
                                if (
                                    Object.prototype.toString.call(resp[item.__config__.dataPath]).slice(8, -1) ===
                                    'Object'
                                ) {
                                    _t.TreeTranslation([resp[item.__config__.dataPath]], item);
                                } else {
                                    _t.TreeTranslation(resp[item.__config__.dataPath], item);
                                }
                            } else {
                                resp[item.__config__.dataPath].forEach((data) => {
                                    let key = data[item.props.props.value];
                                    _t.$set(_t.dictionary[item.__vModel__], key, data[item.props.props.label]);
                                });
                            }
                        });
                    } else {
                        _t.$set(_t.dictionary, item.__vModel__, {}); //创建以item.__vModel__为key的空对象存放
                        if (
                            Object.prototype.toString.call(item[item.__config__.dataConsumer]).slice(8, -1) === 'Object'
                        ) {
                            _t.TreeTranslation([item[item.__config__.dataConsumer]], item);
                        } else {
                            _t.TreeTranslation(item[item.__config__.dataConsumer], item);
                        }
                    }
                }
            });
        },

        TreeTranslation(data, conf) {
            data &&
                data.forEach((item) => {
                    if (item[conf.props.props.children] && item[conf.props.props.children].length > 0) {
                        /*下拉框、单选框组、对选框组在静态数据时key、value是固定的value和label所以在这里得区分这三类组件*/
                        if (
                            conf.__config__.tag === 'el-select' ||
                            conf.__config__.tag === 'el-checkbox-group' ||
                            conf.__config__.tag === 'el-radio-group'
                        ) {
                            let key = item.value;
                            this.$set(this.dictionary[conf.__vModel__], key, item.label);
                            this.TreeTranslation(item.children, conf);
                        } else {
                            let key = item[conf.props.props.value];
                            this.$set(this.dictionary[conf.__vModel__], key, item[conf.props.props.label]);
                            this.TreeTranslation(item[conf.props.props.children], conf);
                        }
                    } else {
                        /*下拉框、单选框组、对选框组在静态数据时key、value是固定的value和label所以在这里得区分这三类组件*/
                        if (
                            conf.__config__.tag === 'el-select' ||
                            conf.__config__.tag === 'el-checkbox-group' ||
                            conf.__config__.tag === 'el-radio-group'
                        ) {
                            let key = item.value;
                            this.$set(this.dictionary[conf.__vModel__], key, item.label);
                        } else {
                            let key = item[conf.props.props.value];
                            this.$set(this.dictionary[conf.__vModel__], key, item[conf.props.props.label]);
                        }
                    }
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
        /*选择性组件的翻译
         * str  可能是字符串 也可能是数组经过JSON.stringify转化成的字符串因此在翻译的时候需要区分
         * */
        selectComponentsList(str, keys) {
            if (!str) {
                return '-';
            }
            if (/[，,]/g.test(str)) {
                let strArr = str.indexOf(']') > 0 ? JSON.parse(str) : str.split(','); //判断是数组  ]
                for (let i = 0; i < strArr.length; i++) {
                    let item = strArr[i];
                    strArr[i] = this.dictionary[keys][item];
                }
                return strArr.join(',');
            } else {
                return this.dictionary[keys][str];
            }
        },
        /*开关组件的翻译*/
        viewSwitchName(item, value) {
            if (item && value != undefined && value != null) {
                if (item.formJson['active-value']) {
                }
                let nameList = {};
                nameList[item.formJson['active-value']] = item.formJson.__config__.activeName || '开启'; //开启
                nameList[item.formJson['inactive-value']] = item.formJson.__config__.inactiveName || '关闭'; //关闭
                return nameList[value];
            } else {
                return '-';
            }
        },
        /*下拉框的翻译*/
        selectList(item, value) {
            if (!value) {
                return '-';
            }
            let objList = {};
            item.formJson.options &&
                item.formJson.options.forEach((list) => {
                    objList[list[item.formJson.props.props.value]] = list[item.formJson.props.props.label];
                });
            /*是否多选*/
            if (/[，,]/g.test(value)) {
                let strArr = value.split(',');
                for (let i = 0; i < strArr.length; i++) {
                    let item = strArr[i];
                    strArr[i] = objList[item];
                }
                return strArr.join(',');
            } else {
                return objList[value];
            }
        },
        submitForm(data) {
            let _this = this;
            // this.loadTreeFormVal(this.formConf.fields, data);
            let dataMap = null;
            if (this.dialogType === 'add') {
                dataMap = Object.assign({}, data);
            } else {
                dataMap = Object.assign(data, { id: this.activeData.id, uuid: this.activeData.uuid });
            }
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: this.dialogType === 'add' ? 'form.data.new' : 'form.data.update',
                method: 'POST',
                data: {
                    tableName: this.tableName ? this.tableName : null,
                    dataMap: dataMap,
                    rowId:
                        this.dialogType === 'edit'
                            ? this.activeData.uuid
                                ? this.activeData.uuid
                                : this.activeData.id
                            : null,
                    formCode: this.formCode,
                },
            }).then((res) => {
                this.$AudaqueToast.tip({
                    template: this.dialogType === 'add' ? `新增成功` : `编辑成功`,
                    methods: {
                        okEvent() {
                            _this.isVisibleDialog = false;
                            _this.loadData();
                        },
                    },
                });
            });
        },
        resetForm() {},
        /*新增*/
        infoEdit() {
            this.dialogTitle = '新增';
            this.dialogType = 'add';
            this.isVisibleDialog = true;
        },
        edit(row) {
            this._AJAX({
                url: 'form.data.select',
                method: 'GET',
                data: {
                    rowId: row.uuid ? row.uuid : row.id,
                    tableName: row.uuid ? this.tableName : null,
                    formCode: this.formCode,
                },
            }).then((res) => {
                this.formModel = res.result;
                fillFormData.call(this, this.formConf.fields, res.result, this.formConf);

                // 更新表单
                this.key2 = +new Date();
                this.dialogTitle = '编辑';
                this.dialogType = 'edit';
                this.isVisibleDialog = true;
                this.activeData = res.result;
            });
        },
        del(row) {
            let _t = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _t.$store.commit('SHOW_LOADING', true);
                        _t._AJAX({
                            url: 'form.data.delete',
                            method: 'GET',
                            data: {
                                rowId: row.uuid ? row.uuid : row.id,
                                tableName: row.uuid ? _t.tableName : null,
                                formCode: _t.formCode,
                            },
                        }).then((res) => {
                            _t.$AudaqueToast.tip({
                                template: `删除成功`,
                                methods: {
                                    okEvent() {
                                        _t.loadData();
                                    },
                                },
                            });
                        });
                    },
                },
            });
        },
    },
};
</script>
