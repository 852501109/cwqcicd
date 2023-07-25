<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="版本管理">
                <i class="iconfont iconfanhui1 audaque-rect-icon" @click="$router.go(-1)"> 返回</i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
                <audaque-table-search-item title="流程名称">
                    <el-input class="autoSize f14" v-model.trim="param.name"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="类型">
                    <el-select v-model="param.categoryId" placeholder="请选择">
                        <el-option :label="item.name" :value="item.type" v-for="item in typeList" :key="item.type">
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
                <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="procDefKey" label="流程Key"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="categoryName" label="业务名称"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="version" label="版本">
                    <template slot-scope="scope">
                        {{ scope.row.version ? 'V.' + scope.row.version : '-' }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="diagramName" label="图片名称">
                    <template slot-scope="scope">
                        <span style="cursor: pointer; color: #5394eb" @click="preview(scope.row)">{{
                            scope.row.diagramName
                        }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--prop="description"-->
                <!--label="备注"-->
                <!--&gt;</el-table-column>-->
                <el-table-column show-overflow-tooltip prop="latest" label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.latest === 1 ? '启用' : '禁用' }}
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                <!--show-overflow-tooltip-->
                <!--prop="actStatus"-->
                <!--label="审核状态"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <el-table-column show-overflow-tooltip prop="deploymentTime" label="部署时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作" width="220px">
                    <template slot-scope="scope">
                        <span
                            v-if="permitList.processNode"
                            class="iconfont iconchakan11"
                            title="查看"
                            @click="config(scope.row, 'view')"
                        ></span>
                        <span
                            v-if="permitList.processNode && scope.row.latest === 0"
                            class="iconfont iconliuchengpeizhi"
                            @click="config(scope.row, 'add')"
                            title="流程节点配置"
                        ></span>
                        <a
                            v-if="permitList.processStatus && scope.row.latest === 1"
                            title="禁用"
                            @click="disableSource(scope.row)"
                        >
                            <i class="iconfont iconjinyong1"></i>
                        </a>
                        <a
                            v-if="permitList.processStatus && scope.row.latest === 0"
                            title="启用"
                            @click="disableSource(scope.row)"
                        >
                            <i class="iconfont iconqiyong2"></i>
                        </a>
                        <span
                            v-if="permitList.modelDel && scope.row.latest === 0"
                            title="删除"
                            class="iconfont iconShape1"
                            @click="del(scope.row)"
                        ></span>
                        <span
                            v-if="permitList.modelExport"
                            class="iconfont icondaochu2 operate"
                            title="导出流程"
                            @click="exportFile(scope.row)"
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
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';
import API from '@/api/index';
export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                name: null,
                categoryId: null,
                procDefKey: this.$route.query.procDefKey ? this.$route.query.procDefKey : '-',
            },
            tableList: {
                rows: [],
                total: 0,
            },
            typeList: [],
            action: API['activiti.models.import'],
            categoryId: this.$route.query.categoryId,
            token: sessionStorage.getItem('token'),
        };
    },
    created() {
        /*类型列表*/
        this._AJAX({
            url: 'sys.category.list',
            method: 'GET',
            data: { page: 1, rows: 99999 },
        }).then((res) => {
            this.typeList = res.result.rows;
        });
        this.loadData();
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            let params = Object.assign({}, this.param);
            // params.latest = 1;
            this._AJAX({
                url: 'activiti.process.list',
                method: 'GET',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.tableList = res.result;
                }
            });
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
                    this.applicationTime = null;
                });
            }
            this.loadData();
        },
        designFlow(row) {
            this.$router.push({
                path: '/process/index',
                query: {
                    modelId: row ? row.id : null,
                },
            });
        },
        /*流程节点配置*/
        config(row, type) {
            this.$router.push({
                path: '/process/workflow/procesNodeConfig',
                query: {
                    optType: type,
                    procDefId: row ? row.procDefId : null,
                },
            });
        },
        disableSource(row) {
            const _this = this;
            this.$store.commit('SHOW_LOADING', true);
            this._AJAX({
                url: 'activiti.process.update',
                method: 'POST',
                data: {
                    id: row.id,
                    latest: row.latest === 1 ? 0 : 1,
                },
            }).then((res) => {
                this.$AudaqueToast.tip({
                    template: row.latest === 1 ? '禁用成功' : '启用成功',
                    methods: {
                        okEvent() {
                            _this.loadData();
                        },
                    },
                });
            });
        },
        del(row) {
            let _this = this;
            let url = API['activiti.process.del'] + '/' + row.deploymentId;
            this.$AudaqueToast.warn({
                template: '确定删除',
                methods: {
                    okEvent() {
                        _this.$store.commit('SHOW_LOADING', true);
                        _this
                            ._AJAX({
                                url: url,
                                method: 'GET',
                                data: {},
                            })
                            .then((res) => {
                                _this.$AudaqueToast.tip({
                                    template: '删除成功',
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
        /*预览*/
        preview(row) {
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

        /*版本部署*/
        versionDeploy(row) {
            let url = API['activiti.models.deploy'] + '/' + row.id;
            this._AJAX({
                url: url,
                method: 'POST',
                data: {},
            }).then((res) => {
                if (res.code == 0) {
                    this.$AudaqueToast.tip({
                        template: `部署成功`,
                        methods: {
                            okEvent() {},
                        },
                    });
                }
            });
        },
        /*导出*/
        exportFile(row) {
            this.publics.exportFile(this, '/activiti/models/export', { modelId: row.modelId });
        },
    },
};
</script>
