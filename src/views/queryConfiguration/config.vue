<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title title="报表配置">
                <i
                    v-if="permitList.addReportConfig"
                    class="iconfont iconxinzeng2 audaque-rect-icon"
                    @click="operation(null, 'add')"
                    >新增</i
                >
                <em class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </em>
            </audaque-table-title>
        </template>
        <template>
            <el-dialog title="" :visible.sync="dialogVisible" width="80%">
                <modal></modal>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="selectedDialogVisible = true">已选</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="" :visible.sync="selectedDialogVisible" width="80%">
                <el-table highlight-current-row :data="selectedList" :border="true" style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        :index="
                            (index) => {
                                return $utils._indexMethod(index, userListForm.page, userListForm.rows);
                            }
                        "
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="用户账户">
                        <template slot-scope="scope">{{ scope.row.account }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="用户名称">
                        <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="手机">
                        <template slot-scope="scope">{{ scope.row.phone }}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="操作">
                        <template slot-scope="scope">
                            <span title="移除" class="iconfont iconShape1 operate"></span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </template>
        <template slot="search">
            <audaque-table-search
                @close="isSearch = false"
                v-show="isSearch"
                @search="REPORT_CONFIG_LIST_PARAMS(0)"
                @reset="REPORT_CONFIG_LIST_PARAMS(1)"
            >
                <audaque-table-search-item title="报表名称">
                    <el-input
                        class="autoSize f14"
                        v-model.trim="param.reportName"
                        placeholder="请输入报表名称"
                        maxlength="50"
                        clearable
                    ></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="报表类别">
                    <el-select v-model.trim="param.categoryId" maxlength="100" placeholder="请选择报表类别">
                        <el-option
                            v-for="item in this.reportCategoryAll"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="报表状态">
                    <el-select v-model.trim="param.state" maxlength="100" placeholder="请选择报表状态">
                        <el-option v-for="item in this.states" :key="item.val" :label="item.name" :value="item.val">
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
                :data="reportConfigList.rows"
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
                    align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="reportName"
                    label="报表名称"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="categoryName"
                    label="报表类别"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="mo'de" label="配置方式">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mode == '1' ? '手动配置' : 'SQL语句' }}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="state" label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.state == 1 ? '启用' : '禁用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createUserName"
                    label="创建人"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createTime"
                    label="创建时间"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" prop="sortNum" label="排序号"></el-table-column>
                <!-- <el-table-column
                    show-overflow-tooltip
                    label="操作"
                    v-if="permitList.queryReportConfig || permitList.editReportConfig || permitList.deleteReportConfig"
                    align="center"
                    width="220"
                >
                    <template slot-scope="scope">
                        <span
                            title="查看"
                            class="iconfont iconchakan11 operate"
                            @click="operation(scope.row.id, 'view')"
                            v-if="permitList.queryReportConfig"
                        ></span>
                        <span
                            class="iconfont iconziyuan3 operate"
                            @click="operation(scope.row.id, 'edit')" 
                            title="编辑"
                            v-if="permitList.editReportConfig && scope.row.state === 0"
                        ></span>
                        <span
                            title="禁用"
                            class="iconfont iconjinyong1 operate"
                            @click="changeState(scope.row.id, 0)"
                            v-if="permitList.changeReportConfigState && scope.row.state "
                        >
                        </span>
                        <span
                            title="启用"
                            class="iconfont iconqiyong2 operate"
                            @click="changeState(scope.row.id, 1)"
                            v-if="permitList.changeReportConfigState && !scope.row.state"
                        >
                        </span>
                        <span
                            title="删除"
                            class="iconfont iconShape1 operate"
                            @click="deleteOne(scope.row.id)"
                            v-if="permitList.deleteReportConfig && scope.row.state === 0"
                        ></span>
                    </template>
                </el-table-column> -->
                <el-table-column show-overflow-tooltip label="操作" align="center" width="220">
                    <template slot-scope="scope">
                        <span
                            title="查看"
                            class="iconfont iconchakan11 operate"
                            @click="operation(scope.row.id, 'view')"
                        ></span>
                        <span
                            class="iconfont iconziyuan3 operate"
                            @click="operation(scope.row.id, 'edit')"
                            title="编辑"
                        ></span>
                        <span title="禁用" class="iconfont iconjinyong1 operate" @click="changeState(scope.row.id, 0)">
                        </span>
                        <span title="启用" class="iconfont iconqiyong2 operate" @click="changeState(scope.row.id, 1)">
                        </span>
                        <span title="删除" class="iconfont iconShape1 operate" @click="deleteOne(scope.row.id)"></span>
                        <span title="授权" class="iconfont icon-shouquan operate" @click="auth(scope.row.id)"></span>
                    </template>
                </el-table-column>
            </el-table>
            <adq-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="param.page"
                :total="reportConfigList.total"
                :page-size="param.rows"
            ></adq-pagination>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import modal from './modal.vue';
export default {
    data() {
        return {
            isSearch: false,
            dialogVisible: true,
            selectedDialogVisible: false,
            selectedList: [],
            total: 1,
            param: {
                page: 1,
                rows: 10,
                reportName: '',
                categoryId: '',
                state: '',
            },
            states: [
                {
                    val: 1,
                    name: '启用',
                },
                {
                    val: 0,
                    name: '禁用',
                },
            ],
        };
    },
    components: { modal },
    computed: {
        ...mapState('webkit', ['reportConfigList', 'reportCategoryAll']),
    },
    methods: {
        ...mapActions('webkit', [
            'REPORT_CONFIG_LIST',
            'CHANGE_REPORT_CONFIG_STATE',
            'DELETE_REPORT_CONFIG',
            'QUERY_REPORT_CATEGORY_All',
        ]),
        initData() {
            let params = this.param;
            this.REPORT_CONFIG_LIST(params);
        },
        async queryReportCategoryAll() {
            await this.QUERY_REPORT_CATEGORY_All();
        },
        operation(id, optType) {
            this.$router.push({
                path: '/reportConfig/configEdit',
                query: {
                    id: id,
                    optType: optType,
                },
            });
        },
        changeState(id, state) {
            let _this = this;
            let params = { id: id, state: state };
            this.CHANGE_REPORT_CONFIG_STATE(params)
                .then((res) => {
                    let template = '启用成功';
                    if (state == 1) {
                        template = '启用成功';
                    } else {
                        template = '禁用成功';
                    }
                    this.$AudaqueToast.tip({
                        template: template,
                        methods: {
                            okEvent() {
                                _this.initData();
                            },
                        },
                    });
                })
                .catch((err) => (this.loading = false));
        },
        auth(id) {
            this.dialogVisible = true;
        },
        deleteOne(id) {
            let _this = this;
            this.$AudaqueToast.warn({
                template: `确认删除？`,
                methods: {
                    okEvent() {
                        let params = { id: id };
                        _this.DELETE_REPORT_CONFIG(params).then((res) => {
                            _this.$AudaqueToast.tip({
                                template: `删除成功`,
                                methods: {
                                    okEvent() {
                                        _this.REPORT_CONFIG_LIST();
                                    },
                                },
                            });
                        });
                    },
                    cancelEvent() {
                        _this.$store.commit('SHOW_LOADING', false);
                    },
                },
            });
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
        REPORT_CONFIG_LIST_PARAMS(num) {
            this.param.page = 1;
            if (num > 0) {
                this.publics.resetFun(this.param, () => {
                    this.param.rows = 10;
                });
            }
            this.initData();
        },
    },
    created() {
        this.initData();
        this.queryReportCategoryAll();
    },
};
</script>
<style lang="scss" scoped>
@import '../../styles/audaquefont/iconfont.css';
.search-date {
    width: 100% !important;
}
</style>
