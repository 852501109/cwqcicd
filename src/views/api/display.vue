<template>
    <div
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.6)"
    >
        <el-empty v-if="!optId" height="1000" description="暂时没有配置相关的接口查询"></el-empty>
        <audaque-table-list-page v-else-if="optId">
            <template slot="title">
                <audaque-table-title :title="optModule">
                    <el-popover placement="top" width="180" v-model="visible">
                        <div class="download_range">
                            <div>最近:</div>
                            <el-select size="mini" v-model="nearlyTimes" placeholder="">
                                <el-option label="5次" :value="5"></el-option>
                                <el-option label="10次" :value="10"></el-option>
                            </el-select>
                        </div>
                        <div class="custom_footer">
                            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="exportFunHis">确定</el-button>
                        </div>
                        <i slot="reference" class="iconfont icondaochu1 audaque-rect-icon" title="导出历史查询"
                            >导出历史查询</i
                        >
                    </el-popover>
                    <i class="iconfont icondaochu1 audaque-rect-icon" title="导出EXCEL" @click="exportFun">导出</i>
                    <em class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </em>
                </audaque-table-title>
            </template>
            <template slot="search">
                <audaque-table-search
                    @close="isSearch = false"
                    v-show="isSearch"
                    @search="API_DISPLAY_LIST_PARAMS(0)"
                    @reset="API_DISPLAY_LIST_PARAMS(1)"
                >
                    <audaque-table-search-item
                        v-for="(query, index) in queryList"
                        :title="query.displayColName ? query.displayColName : query.columnComment"
                    >
                        <el-input
                            class="autoSize f14"
                            :placeholder="'请输入' + query.displayColName ? query.displayColName : query.columnComment"
                            v-model="query.value"
                            maxlength="50"
                            clearable
                        ></el-input>
                        <div v-if="query.pattern == 'upload'">
                            <div style="display: flex">
                                <i
                                    class="download-url iconfont icondaochu2 audaque-rect-icon"
                                    @click="exportTemplate('/common/queryTemplateDown.do', query.id)"
                                    >查询模板下载</i
                                >
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i
                                    title="导入查询条件"
                                    class="download-url iconfont icondaoru1 audaque-rect-icon import-template"
                                    @click="fileSelected(index)"
                                    >导入查询条件
                                    <input
                                        class="inputFile"
                                        @change="uploadFile($event, index, query.columnName)"
                                        type="file"
                                        :ref="`upload${index}`"
                                        accept=".xlsx"
                                    />
                                </i>
                            </div>
                            <div style="display: flex">
                                <i style="margin: 3px 10px; color: blue; font-size: 5px" v-if="sourceFileNameArr[index]"
                                    >{{ sourceFileNameArr[index] }}&nbsp;&nbsp;&nbsp;&nbsp;<a
                                        title="删除"
                                        class="iconfont iconShape1 operate"
                                        style="font-size: 13px"
                                        @click="clearQueryFile(index)"
                                    ></a
                                ></i>
                            </div>
                        </div>
                    </audaque-table-search-item>
                </audaque-table-search>
            </template>
            <template>
                <el-table
                    tooltip-effect="light"
                    class="el-table-common__list"
                    highlight-current-row
                    stripe
                    :data="apiDisplayList.rows"
                    v-loading="apiDisplyTableLoading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.6)"
                    ref="aaa"
                    empty-text="暂无数据"
                    border
                >
                    <el-table-column
                        show-overflow-tooltip
                        type="index"
                        label="序号"
                        v-if="isShowSeq"
                        :index="
                            (index) => {
                                return $utils._indexMethod(index, param.page, param.rows);
                            }
                        "
                        align="center"
                        width="50"
                    >
                    </el-table-column>
                    <el-table-column
                        :label="item.displayColName ? item.displayColName : item.columnComment"
                        align="center"
                        v-for="(item, index) in columnList"
                        :key="index"
                    >
                        <template slot-scope="scope">
                            <a v-if="item.columnClicked == 1" @click="openDetail(scope.row)">
                                {{ scope.row[item.columnName] }}&nbsp;&nbsp;<span
                                    class="iconfont iconchakan11 operate"
                                ></span>
                            </a>
                            <a v-else-if="item.columnDrilled == 1" @click="openDrill(scope.row)">
                                {{ scope.row[item.columnName] }}&nbsp;&nbsp;<span
                                    class="iconfont iconzuzhijigou operate"
                                ></span>
                            </a>
                            <span v-else>
                                {{ scope.row[item.columnName] }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <adq-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="param.page"
                    :total="apiDisplayList.total"
                    :page-size="param.rows"
                ></adq-pagination>
                <el-dialog title="详细信息" :visible.sync="dialogDetailVisible">
                    <el-form :model="detailData" :disabled="true" label-width="120px" class="form-item">
                        <el-row v-for="(item, index) in detailFieldList" :key="index">
                            <el-col :span="24">
                                <el-form-item :label="item.displayColName ? item.displayColName : item.columnComment">
                                    <el-input
                                        v-if="detailData[item.columnName] && detailData[item.columnName].length > 50"
                                        type="textarea"
                                        v-model="detailData[item.columnName]"
                                    >
                                    </el-input>
                                    <el-input v-else v-model="detailData[item.columnName]"> </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="dialogDetailVisible = false">关 闭</el-button>
                    </div>
                </el-dialog>
            </template>
        </audaque-table-list-page>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
    name: 'ApiDisplay',
    data() {
        return {
            isSearch: false,
            total: 1,
            visible: false,
            apiDisplyTableLoading: false,
            loading: false,
            nearlyTimes: 5,
            param: {
                page: 1,
                rows: 10,
            },
            data: [],
            columnList: [],
            detailFieldList: [],
            detailData: {},
            queryList: [],
            optId: this.$route.query.id,
            optFlag: 'init',
            optModule: this.$route.query.optModule,
            emptyDataText: '',
            fileUUIDArr: [],
            sourceFileNameArr: [],
            isShowSeq: false,
            dialogDetailVisible: false,
            loadingDisplay: false,
        };
    },
    computed: {
        ...mapState('webkit', ['apiDisplayList']),
    },

    methods: {
        ...mapMutations(['SET_STORE_SEARCH']),
        ...mapActions(['_AJAX']),
        ...mapActions('webkit', [
            'QUERY_API_PROPERTY_ALL',
            'QUERY_API_DISPLAY_LIST',
            'EXPORT_API_DATA',
            'EXPORT_API_DATA_HIS',
            'VALIDATE_API_EXPORT_EXCELHIS',
            'SET_API_DISPLAY_LIST',
        ]),
        initData() {
            let configId = this.optId;
            let queryParams = {};
            let tipMsg = [];
            (this.queryList || []).forEach((item) => {
                if (item.value) {
                    queryParams[item.columnName] = item.value;
                } else {
                    if (this.optFlag == 'query') {
                        if (item.pattern == 'upload' && !this.fileUUIDArr.length) {
                            tipMsg.push(item.displayColName);
                        }
                        if (item.pattern != 'upload') {
                            tipMsg.push(item.displayColName);
                        }
                    }
                }
            });

            if (this.optFlag == 'query' && tipMsg.length) {
                this.$AudaqueToast.warn({
                    template: '查询条件：' + tipMsg.join('、') + ' 不能为空',
                    methods: {
                        okEvent() {},
                    },
                });
                return;
            }

            let params = {
                configId: configId,
                params: queryParams,
                page: this.param.page,
                rows: this.param.rows,
                optFlag: this.optFlag,
                fileUIdList: this.fileUUIDArr,
            };
            if (this.optFlag == 'query') {
                this.apiDisplyTableLoading = true;
                this.QUERY_API_DISPLAY_LIST(params)
                    .then(() => {
                        this.apiDisplyTableLoading = false;
                    })
                    .catch(() => {
                        this.apiDisplyTableLoading = false;
                    });
            }
        },

        // 选择查询条件文件
        fileSelected(index) {
            this.$refs[`upload${index}`][0].click();
        },

        // 导入查询条件文件
        uploadFile(event, index, columnName) {
            const _this = this;
            this.formData = new FormData();
            this.formData.append('upFile', event.target.files[0]);
            this.formData.append('columnName', columnName);
            this.loading = true;
            this._AJAX({
                url: 'webkit.uploadQueryFile',
                data: this.formData,
                method: 'POST',
            })
                .then((res) => {
                    this.loading = false;
                    if (res.code === 0) {
                        //上传成功
                        this.$set(this.sourceFileNameArr, index, res.result.sourceFileName);
                        this.$set(this.fileUUIDArr, index, res.result.fileUUID);
                    } else {
                        this.$AudaqueToast.error({
                            template: `上传文件失败！`,
                            methods: {
                                okEvent() {},
                            },
                        });
                    }
                    //删除formData对象
                    this.delFormData(index);
                })
                .catch(() => {
                    this.loading = false;
                    //删除formData对象
                    this.delFormData(index);
                });
        },

        clearQueryFileAll() {
            let index = 0;
            (this.queryList || []).forEach((item) => {
                if (item.pattern == 'upload') {
                    this.clearQueryFile(index);
                }
                index++;
            });
        },

        clearQueryFile(index) {
            this.$set(this.sourceFileNameArr, index, null);
            this.$set(this.fileUUIDArr, index, null);
            this.delFormData(index);
        },

        /*删除formData对象*/
        delFormData(index) {
            this.$refs[`upload${index}`][0].value = null;
            if (this.formData) {
                for (var key of this.formData.keys()) {
                    this.formData.delete(key);
                }
            }
        },

        initColumn() {
            let configId = this.optId;
            let params = { apiQueryConfId: configId, type: 1 };
            return this.QUERY_API_PROPERTY_ALL(params).then((res) => {
                this.columnList = res;
                if (res.length > 0) {
                    this.isShowSeq = true;
                }

                let para = { apiQueryConfId: configId, type: 3 };
                this.QUERY_API_PROPERTY_ALL(para).then((res) => {
                    this.detailFieldList = res;
                });
            });
        },
        initQuery() {
            let configId = this.optId;
            let params = { apiQueryConfId: configId, type: 2 };
            return this.QUERY_API_PROPERTY_ALL(params).then((res) => {
                (res || []).forEach((item) => {
                    item.value = '';
                    this.queryList.push(item);
                });
            });
        },
        /*导出*/
        exportTemplate(api, propertyId) {
            this.publics.exportFile(this, api, { confId: this.optId, propertyId: propertyId, dataSource: 'api' });
        },
        exportFun() {
            let configId = this.optId;
            let queryParams = {};
            let tipMsg = [];
            (this.queryList || []).forEach((item) => {
                if (item.value) {
                    queryParams[item.columnName] = item.value;
                } else {
                    if (item.pattern == 'upload' && !this.fileUUIDArr.length) {
                        tipMsg.push(item.displayColName);
                    }
                    if (item.pattern != 'upload') {
                        tipMsg.push(item.displayColName);
                    }
                }
            });

            if (tipMsg.length) {
                this.$AudaqueToast.warn({
                    template: '查询条件：' + tipMsg.join('、') + ' 不能为空',
                    methods: {
                        okEvent() {},
                    },
                });
                return;
            }
            this.loading = true;
            let params = {
                configId: configId,
                params: queryParams,
                fileUIdList: this.fileUUIDArr,
            };
            this.EXPORT_API_DATA(params)
                .then((res) => {
                    this.download(res, 'xlsx');
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        exportFunHis() {
            this.loading = true;
            let configId = this.optId;
            let queryParams = {};
            let params = {
                configId: configId,
                params: queryParams,
                fileUIdList: this.fileUUIDArr,
                nearlyTimes: this.nearlyTimes,
            };
            this.$store.commit('SHOW_LOADING', true);
            this.VALIDATE_API_EXPORT_EXCELHIS(params)
                .then((ress) => {
                    this.EXPORT_API_DATA_HIS(params)
                        .then((res) => {
                            this.download(res, 'zip');
                            this.loading = false;
                            commit;
                        })
                        .catch((error) => {
                            this.loading = false;
                        });
                })
                .catch((error) => {
                    this.loading = false;
                });
        },
        download(data, extType) {
            const blob = new Blob([data]);
            if ('download' in document.createElement('a')) {
                const elink = document.createElement('a');
                elink.download = this.optModule + '-' + new Date().getTime() + '.' + extType;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href);
                document.body.removeChild(elink);
            } else {
                navigator.msSaveBlob(blob, fileName);
            }
            this.$store.commit('SHOW_LOADING', false);
        },
        openDetail(row) {
            this.detailData = row;
            this.dialogDetailVisible = true;
        },
        handleSizeChange(rows) {
            this.param.page = 1;
            this.param.rows = rows;
            this.initData();
        },
        handleCurrentChange(page) {
            this.param.page = page;
            this.initData();
        },
        API_DISPLAY_LIST_PARAMS(num) {
            this.param.page = 1;
            if (num > 0) {
                (this.queryList || []).forEach((item) => {
                    item.value = '';
                });
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                });
                this.optFlag = 'init';
                this.clearQueryFileAll();
                this.SET_API_DISPLAY_LIST({});
            } else {
                this.optFlag = 'query';
                this.initData();
            }
        },
        watchFn(nval) {
            this.optFlag = 'init';
            this.isSearch = false;
            this.queryList = [];
            (this.total = 1), (this.param.page = 1);
            (this.param.rows = 10), (this.optId = nval);
            if (this.optId) {
                this.loadingDisplay = true;
                this.SET_API_DISPLAY_LIST({})
                    .then(() => {
                        this.initColumn()
                            .then(() => {
                                this.initQuery()
                                    .then(() => {
                                        this.initData()
                                            .then(() => {
                                                this.loadingDisplay = false;
                                            })
                                            .catch(() => {
                                                this.loadingDisplay = false;
                                            });
                                    })
                                    .catch(() => {
                                        this.loadingDisplay = false;
                                    });
                            })
                            .catch(() => {
                                this.loadingDisplay = false;
                            });
                    })
                    .catch(() => {
                        this.loadingDisplay = false;
                    });
            }
        },
    },
    created() {
        this.SET_API_DISPLAY_LIST({});
    },
    mounted() {},
    watch: {
        '$route.query.id': {
            immediate: true,
            handler(nval, oval) {
                this.watchFn(nval);
            },
        },
        '$route.query.optModule'(nval, oval) {
            this.optModule = decodeURI(nval);
        },
        reportConfigMenuList: {
            handler() {
                if (!this.optId && this.reportConfigMenuList && this.reportConfigMenuList.length > 0) {
                    let mul = this.reportConfigMenuList[0].children[0];
                    this.$router.push({ path: mul.url, query: { id: mul.id, name: mul.name } });
                }
            },
        },
    },
};
</script>
<style lang="scss" scoped>
.search-date {
    width: 100% !important;
}

.download-url {
    margin: 10px -10px;
    text-decoration: none;
    cursor: pointer;
}

.import-template {
    position: relative;
}

.inputFile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
}
.download_range {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    > div:nth-child(1) {
        width: 80px;
        text-align: center;
    }
}
.custom_footer {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
