<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="模板管理">
                <i
                    v-if="permitList.templateAdd"
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="pageType('add')"
                >
                    新增</i
                >
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="模板编码">
                    <el-input class="autoSize f14" clearable v-model.trim="param.templateCode"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="模板标题">
                    <el-input class="autoSize f14" clearable v-model.trim="param.templateName"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="模板用途">
                    <el-select v-model="param.templateType" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in templateList"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
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
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="templateCode" label="模板编码"></el-table-column>
                <el-table-column show-overflow-tooltip prop="templateName" label="模板标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="templateContent" label="模板内容">
                    <!--<template slot-scope="scope">-->
                    <!--<span v-html="scope.row.templateContent"></span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="templateType" label="模板用途">
                    <template slot-scope="scope">
                        {{ templateObj[scope.row.templateType] }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间">
                    <template slot-scope="scope">{{
                        publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s')
                    }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间">
                    <template slot-scope="scope">{{
                        publics.formatTime(scope.row.updateTime, 'Y-M-D h:m:s')
                    }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.templateEdit"
                            class="iconfont iconFill"
                            @click="pageType('edit', scope.row)"
                            title="编辑"
                        ></span>
                        <span
                            v-if="permitList.templateId"
                            class="iconfont iconchakan11"
                            @click="pageType('view', scope.row)"
                            title="查看详情"
                        ></span>
                        <span v-if="permitList.templateDel" title="删除" @click="del(scope.row)"
                            ><i class="iconfont iconShape1"></i
                        ></span>
                        <span v-if="permitList.messageTemp" title="消息测试" @click="test(scope.row)"
                            ><i class="iconfont iconxiaoxiceshi"></i
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

        <el-dialog title="发送测试" :visible.sync="isDialog" width="400" :close-on-click-modal="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
                <el-form-item label="模板标题" prop="templateName">
                    <el-input placeholder="" v-model.trim="ruleForm.templateName" disabled> </el-input>
                </el-form-item>
                <el-form-item label="模板内容" prop="templateContent">
                    <tinymce disabled v-model="ruleForm.templateContent"></tinymce>
                </el-form-item>
                <el-col :span="24">
                    <el-form-item label="测试数据" prop="originalParam">
                        <el-input
                            class="news-type-sys-introduction"
                            type="textarea"
                            autosize
                            placeholder=""
                            show-word-limit
                            v-model.trim="ruleForm.originalParam"
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="摘要" prop="messageAbstract">
                        <el-input placeholder="" v-model.trim="ruleForm.messageAbstract"> </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应用key" prop="appKey">
                        <el-select v-model="ruleForm.appKey" clearable @change="changeAppKey">
                            <el-option v-for="item in sysList" :key="item.id" :label="item.appKey" :value="item.appKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应用名称" prop="appName">
                        <el-input placeholder="" v-model.trim="ruleForm.appName" readonly> </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="标题" prop="title">
                        <el-input placeholder="" v-model.trim="ruleForm.title"> </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="消息类型" prop="type">
                        <el-select v-model="ruleForm.type">
                            <el-option
                                :label="item.label"
                                :value="item.value"
                                v-for="item in msgTypeList"
                                :key="item.label"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="紧急程度" prop="level">
                        <el-select v-model="ruleForm.level">
                            <el-option
                                :label="item.label"
                                :value="item.value"
                                v-for="item in levelList"
                                :key="item.label"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="通知对象" prop="receiveType">
                        <el-select v-model="ruleForm.receiveType">
                            <el-option label="指定用户" :value="2"></el-option>
                            <el-option label="指定部门" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户" prop="receiveCode" v-if="ruleForm.receiveType === 2">
                        <adq-user-list-component
                            v-model="ruleForm.receiveCode"
                            :multiple="true"
                        ></adq-user-list-component>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门" prop="departmentIds" v-if="ruleForm.receiveType === 3">
                        <adq-tree ref="tree" :defaultCheckedKeys="defaultCheckedKeys" :check-strictly="true">
                        </adq-tree>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
                <el-col :span="12"></el-col>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isDialog = !isDialog">取消</el-button>
                <el-button @click="submitSendTest" :loading="isSHowButtonLoading">提交</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import adqTree from '@/components/adqTree';
import { msgTypeList, levelList } from './newsSearchJs';
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
            templateObj: {
                // 0: '短信',
                // 1: '邮件',
                // 2: '微信',
                3: '系统',
            },
            templateList: [
                // { label: '短信', value: 0 },
                // { label: '邮件', value: 1 },
                // { label: '微信', value: 2 },
                { label: '系统', value: 3 },
            ],
            isDialog: false,
            ruleForm: {},
            rules: {
                messageAbstract: { required: true, message: '请输入摘要', trigger: 'blur' },
                appName: { required: true, message: '请输入应用名称', trigger: 'change' },
                appKey: { required: true, message: '请选择应用key', trigger: 'change' },
                title: { required: true, message: '请输入标题', trigger: 'blur' },
                originalParam: { required: true, message: '请输入测试数据', trigger: 'blur' },
                receiveCode: { required: true, message: '请选择用户', trigger: 'change' },
                type: { required: true, message: '请选择消息类型', trigger: 'change' },
                receiveType: { required: true, message: '请选择通知对象', trigger: 'change' },
                level: { required: true, message: '请选择级别', trigger: 'change' },
            },
            userList: [],
            userTotal: 0,
            userParams: {
                page: 1,
                rows: 200,
                name: null,
            },
            defaultCheckedKeys: [],
            validateJsonClassObject: {
                pass: false,
                fail: false,
            }, // json的校验结果，并对相关dom元素绑定类名
            validateJsonResult: '', // 校验结果
            msgTypeList,
            levelList,
            sysList: [],
            appList: {},
        };
    },
    components: { adqTree },
    created() {
        this.loadData();
        /*请求系统列表*/
        this._AJAX({
            url: 'webkit.appList',
            method: 'GET',
            data: { page: 1, rows: 999999 },
        }).then((res) => {
            if (res.code === 0) {
                this.sysList = res.rows;
                res.rows.forEach((item) => {
                    this.appList[item.appKey] = item.appName;
                });
            }
        });
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
                url: 'sys.message.template.list',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.tableList = result;
                }
            });
        },
        /*选择应用key后自动回显应用名称*/
        changeAppKey(value) {
            this.$set(this.ruleForm, 'appName', this.appList[value]);
        },

        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
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
        /**/
        pageType(type, row) {
            this.$router.push({
                path: '/news/sysMessageTemplateListEdit',
                query: {
                    optType: type,
                    id: row ? row.id : null,
                },
            });
        },
        /*删除*/
        del(row) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        _this
                            ._AJAX({
                                url: 'sys.message.template.del',
                                method: 'GET',
                                data: { id: row.id },
                            })
                            .then((res) => {
                                if (res.code == 0) {
                                    _this.$AudaqueToast.tip({
                                        template: `删除成功`,
                                        methods: {
                                            okEvent() {
                                                _this.loadData();
                                            },
                                        },
                                    });
                                }
                            });
                    },
                },
            });
        },
        test(row) {
            this.ruleForm = row;
            this.$set(this.ruleForm, 'originalParam', row.templateTestJson); //模板格式的内容
            this.isDialog = true;
        },
        submitSendTest() {
            let _this = this,
                params = Object.assign({}, this.ruleForm);
            let dep = null;
            if (this.$refs.tree) {
                dep = this.$refs.tree.$refs.adqTree.getCheckedKeys();
                params.receiveCode = dep;
            }
            if (params.receiveCode && params.receiveCode.length > 0) {
                params.receiveCode = params.receiveCode.join(',');
            }
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this._AJAX({
                        url: 'sys.message.temp.add',
                        method: 'POST',
                        data: params,
                    }).then((res) => {
                        if (res.code == 0) {
                            _this.$AudaqueToast.tip({
                                template: `操作成功`,
                                methods: {
                                    okEvent() {
                                        _this.isDialog = false;
                                    },
                                },
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.news-type-sys-edit {
    /deep/ .news-type-sys-introduction {
        min-height: 90px !important;
        height: auto !important;
        /deep/ .el-textarea__inner {
            min-height: 90px !important;
        }
    }
}
</style>
