<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="流程模型">
                <i v-if="permitList.modelNew" class="iconfont iconxinzeng2 audaque-rect-icon" @click="infoEdit('add')">
                    新增</i
                >
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="流程名称">
                    <el-input class="autoSize f14" v-model.trim="param.name" clearable></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="业务名称">
                    <el-select v-model="param.categoryId" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in categoryOptions"
                            :key="'option-' + item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="状态">
                    <el-select v-model="param.status" placeholder="请选择" clearable>
                        <el-option label="未发布" :value="0"></el-option>
                        <el-option label="已发布" :value="1"></el-option>
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
                <el-table-column show-overflow-tooltip prop="name" label="流程名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="modelKey" label="流程key"></el-table-column>
                <el-table-column show-overflow-tooltip prop="categoryName" label="业务名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="version" label="当前启用版本">
                    <template slot-scope="scope">
                        {{
                            scope.row.version != null
                                ? scope.row.version === 0
                                    ? '无'
                                    : 'v.' + scope.row.version
                                : '-'
                        }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="diagramName" label="图片名称">
                    <template slot-scope="scope">
                        <span style="cursor: pointer; color: #5394eb" @click="loadImg(scope.row)">{{
                            scope.row.diagramName
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.updateTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="status" label="状态">
                    <template slot-scope="scope">
                        {{
                            scope.row.status != null || scope.row.status != 3
                                ? scope.row.status === 0
                                    ? '未发布'
                                    : '已发布'
                                : '-'
                        }}
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--prop="actStatus"-->
                <!--label="审核状态"-->
                <!--&gt;-->
                <!--<template slot-scope="scope">-->
                <!--{{scope.row.categoryId === 3 ? '-' : scope.row.actStatus}}-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip prop="description" label="备注"></el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="220px">
                    <template slot-scope="scope">
                        <!--<span v-if="scope.row.actStatus.indexOf('审核') == -1 && scope.row.status !=1 || scope.row.status === '-'"-->
                        <span
                            v-if="(permitList.modelNew && scope.row.status != 1) || scope.row.status === '-'"
                            class="iconfont iconFill"
                            @click="infoEdit('edit', scope.row)"
                            title="编辑"
                        ></span>
                        <span
                            v-if="permitList.modelNew"
                            class="iconfont iconchakan11"
                            @click="infoEdit('view', scope.row)"
                            title="查看"
                        ></span>
                        <span
                            v-if="permitList.modelDesign"
                            class="iconfont iconliuchengsheji operate"
                            title="设计流程"
                            @click="designFlow(scope.row)"
                        ></span>
                        <span
                            class="iconfont iconbushu operate"
                            title="版本部署"
                            v-if="permitList.modelDeploy && scope.row.modelId"
                            @click="versionDeploy(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.processList"
                            class="iconfont iconbanbenguanli operate"
                            title="版本管理"
                            @click="versioManageMent(scope.row)"
                        ></span>
                        <!--<span v-if="scope.row.categoryId !=3" class="iconfont iconjianyishupc-icon1024_shenhe operate"-->
                        <!--title="审核"-->
                        <!--@click="release(scope.row)"></span>-->
                        <!--<span-->
                        <!--v-if="scope.row.actStatus.indexOf('审核') == -1 && scope.row.status !=1 || scope.row.status === '-'"-->
                        <!--class="iconfont iconchexiao operate"-->
                        <!--title="撤销"-->
                        <!--@click="revoke(scope.row)"></span>-->
                        <span
                            :class="['iconfont operate', scope.row.status === 0 ? 'iconpublish' : 'iconquxiaofabu']"
                            v-if="permitList.processStatus && (scope.row.procDefId || scope.row.categoryId != 3)"
                            :title="scope.row.status === 0 ? '发布' : '取消发布'"
                            @click="isActivate(scope.row)"
                        >
                        </span>
                        <!--<span v-if="scope.row.actStatus.indexOf('审核') == -1 && scope.row.status !=1 || scope.row.status === '-'"-->
                        <template v-if="permitList.modelImport">
                            <el-upload
                                ref="uploadFile"
                                style="display: inline-block"
                                class="upload-file"
                                :action="action"
                                :data="{ categoryId: scope.row.categoryId }"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                :headers="publics.ajaxHeaders()"
                            >
                                <span class="iconfont icondaoru1 operate" title="导入流程"></span>
                            </el-upload>
                        </template>
                        <span
                            v-if="(permitList.modelDel && scope.row.status != 1) || scope.row.status === '-'"
                            class="iconfont iconShape1 operate"
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
            title="新增"
            :visible.sync="idVisibleDialog"
            width="500"
            :close-on-click-modal="false"
            class="data-permission"
        >
            <process-config-public
                ref="processConfig"
                v-if="idVisibleDialog"
                opt-type="add"
                @is-close-dialog="isCloseDialog"
                :proc-def-id="procDefId"
            >
            </process-config-public>
            <span slot="footer" class="dialog-footer">
                <el-button @click="idVisibleDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import API from '@/api/index';
import processConfigPublic from './processConfigPublic';
import request from '../../../api/ajax';

export default {
    data() {
        return {
            isSearch: false,
            param: {
                name: null,
                categoryName: null,
                status: null,
                page: 1,
                rows: 10,
            },
            tableList: {
                rows: [],
                total: 0,
            },
            idVisibleDialog: false,
            procDefId: null,
            action: API['activiti.models.import'],
            token: sessionStorage.getItem('token'),
            categoryOptions: [],
        };
    },
    mixins: [adqSearchMixin],
    created() {
        this.loadTypes();
        this.loadData();
    },
    components: { processConfigPublic },
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
                url: 'activiti.models.list',
                method: 'GET',
                data: this.param,
            }).then((res) => {
                if (res.code == 0) {
                    this.tableList = res.result;
                }
            });
        },
        /*请求业务名称列表*/
        loadTypes() {
            this._AJAX({
                url: 'sys.category.list',
                method: 'GET',
                data: { page: 1, rows: 9999 },
            }).then((res) => {
                this.categoryOptions = res.result.rows;
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
                    this.applicationTime = null;
                });
            }
            this.loadData();
        },
        infoEdit(type, row) {
            this.$router.push({
                path: '/process/workflow/processConfigEdit',
                query: {
                    optType: type,
                    // procDefId: row ? row.procDefId : null,
                    id: row ? row.id : null,
                },
            });
        },
        /*发布*/
        release(row) {
            let _this = this;
            this._AJAX({
                url: 'activiti.process.audit',
                method: 'POST',
                data: { procDefId: row.procDefId },
            })
                .then((res) => {
                    if (res.code == 0) {
                        this.$AudaqueToast.tip({
                            template: `操作成功`,
                            methods: {
                                okEvent() {
                                    _this.loadData();
                                },
                            },
                        });
                    }
                })
                .catch(() => {});
        },
        /*设计流程*/
        designFlow(row) {
            // if (row.modelId) {
            this.$router.push({
                path: '/process/index',
                query: {
                    modelId: row ? row.modelId : null,
                    name: row ? row.name : null,
                    modelKey: row ? row.modelKey : null,
                },
            });
            // } else {
            //     this._AJAX({
            //         url: 'activiti.models.create',
            //         method: 'GET',
            //         data: { modelInfoId: row.id },
            //     }).then((res) => {
            //         if (res.code === 0) {
            //             this.$router.push({
            //                 path: '/process/index',
            //                 query: {
            //                     modelId: res.result,
            //                 },
            //             });
            //         }
            //     });
            // }
        },
        /*撤销*/
        revoke(row) {
            let _this = this;
            this._AJAX({
                url: 'activiti.biz.proc.cancel',
                method: 'POST',
                data: {
                    procInstId: row.procInstId,
                    bizCode: row.businessKey,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `操作成功`,
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        /*预览*/
        loadImg(row) {
            let _this = this;
            this.$AudaqueToast.dialog({
                title: '流程',
                width: '1000px',
                data: {
                    // pic: API['activiti.models.img'] + '?procDefId=' + row.procDefId + '&t=' + Date.now(),
                    pic: null,
                },
                mounted() {
                    _this
                        ._AJAX({
                            url: 'activiti.models.img',
                            method: 'GET',
                            responseType: 'blob',
                            data: {
                                procDefId: row.procDefId,
                            },
                        })
                        .then((data) => {
                            let blob = new Blob([data]); // 返回的文件流数据
                            let url = window.URL.createObjectURL(blob); // 将他转化为路径
                            this.pic = url;
                        });
                },
                template: `
                        <div style="text-align:center;">
                            <img :src="pic" style="min-height:250px"/>
                        </div>

                    `,
            });
        },
        /*版本管理*/
        versioManageMent(row) {
            this.$router.push({
                path: '/process/workflow/versionManagement',
                query: {
                    procDefKey: row ? row.procDefKey : null,
                    categoryId: row.categoryId,
                },
            });
        },
        /*激活、未激活*/
        isActivate(row) {
            let _this = this;
            let status = row.status === 1 ? 0 : 1;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'activiti.process.status',
                method: 'POST',
                data: {
                    status: status,
                    procDefId: row.procDefId,
                },
            })
                .then((res) => {
                    if (res.code == 0) {
                        this.$AudaqueToast.tip({
                            template: '操作成功',
                            methods: {
                                okEvent() {
                                    _this.loadData();
                                },
                            },
                        });
                    }
                })
                .catch(() => {});
        },

        del(row) {
            let _this = this;
            let param = row.modelId ? row.modelId : row.id;
            this.$AudaqueToast.warn({
                template: `确定删除？`,
                methods: {
                    okEvent() {
                        let url = API['activiti.models.delete'] + '/' + param;
                        _this.$store.commit('SHOW_LOADING', true);
                        _this
                            ._AJAX({
                                url: url,
                                method: 'GET',
                                data: {},
                            })
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `删除成功`,
                                    methods: {
                                        okEvent() {
                                            _this.loadData();
                                        },
                                    },
                                });
                            });
                    },
                },
            });
        },
        /*版本部署*/
        versionDeploy(row) {
            let _this = this;
            let url = API['activiti.models.deploy'] + '/' + row.id;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: url,
                method: 'POST',
                data: {},
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `部署成功`,
                        methods: {
                            okEvent() {
                                _this.loadData();
                            },
                        },
                    });
                }
            });
        },
        submitForm() {
            this.$refs.processConfig.submitForm();
        },
        isCloseDialog() {
            this.idVisibleDialog = false;
            this.loadData();
        },
        uploadSuccess(response, file, fileList) {
            if (response.code === 0) {
                let _this = this;
                this.$AudaqueToast.tip({
                    template: `导入成功`,
                    methods: {
                        okEvent() {
                            _this.loadData();
                        },
                    },
                });
                this.$refs.uploadFile.clearFiles();
            } else {
                this.$AudaqueToast.error({
                    template: response.msg,
                    methods: {
                        okEvent() {},
                    },
                });
            }
        },
        uploadError(err, file, fileList) {
            this.$AudaqueToast.error({
                template: `导入失败`,
                methods: {
                    okEvent() {},
                },
            });
        },
    },
};
</script>
<style lang="scss" scoped>
/deep/.upload-file {
    .el-upload-list {
        display: none;
    }
}
</style>
