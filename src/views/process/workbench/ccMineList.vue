<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :title="$route.meta.pageName">
                <!--                <i class="iconfont icondaochu2 audaque-rect-icon" @click="exportFile">导出 </i>-->
                <i class="iconfont iconshaixuan audaque-rect-icon" @click="isSearch = !isSearch">筛选查询 </i>
            </audaque-table-title>
        </template>
        <template slot="search">
            <audaque-table-search @close="isSearch = false" v-show="isSearch" @search="search(1)" @reset="search(0)">
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
                <audaque-table-search-item title="申请标题">
                    <el-input clearable class="autoSize f14" v-model.trim="param.title"></el-input>
                </audaque-table-search-item>
                <audaque-table-search-item title="状态">
                    <el-select v-model="param.status" placeholder="请选择" clearable>
                        <el-option label="草稿" :value="0"></el-option>
                        <el-option label="处理中" :value="1"></el-option>
                        <el-option label="结束" :value="2"></el-option>
                    </el-select>
                </audaque-table-search-item>
                <audaque-table-search-item title="发起时间" class="search-time-line">
                    <el-date-picker
                        class="search-date"
                        v-model="applicationTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
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
                <el-table-column show-overflow-tooltip prop="categoryName" label="业务名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="processName" label="流程名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="formName" label="表单名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="title" label="申请标题"></el-table-column>
                <el-table-column show-overflow-tooltip prop="applyTime" label="发起时间">
                    <template #default="scope">{{ scope.row.applyTime | audaqueDatetime }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="workTime" label="已流转(天)"> </el-table-column>
                <el-table-column show-overflow-tooltip prop="status" label="状态">
                    <template #default="scope">{{ statusNS[scope.row.status] }}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" label="操作">
                    <template slot-scope="scope">
                        <span
                            class="iconfont iconchakan11 operate"
                            title="查看"
                            @click="views(scope.row, 'view')"
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
            <!--导出预留的节点-->
            <a id="exportExcel" style="display: none"></a>
        </template>
    </audaque-table-list-page>
</template>

<script>
import adqSearchMixin from '@/mixins/adqSearchMixin';
import { mapActions } from 'vuex';
import workflowTypes, { status } from './workflowTypes';
import XLSX from 'xlsx';
export default {
    data() {
        return {
            isSearch: false,
            param: {
                page: 1,
                rows: 10,
                title: null,
                categoryId: null,
                status: null,
            },
            tableList: {
                rows: [],
                total: 0,
            },
            workflowTypes,
            statusNS: status,
            categoryOptions: [],
            activeData: {},
            applicationTime: '',
            elExport: '', //导出el
            exportTotalList: [],
        };
    },
    created() {
        this.loadData();
        this.loadBusinessName();
    },
    mixins: [adqSearchMixin],
    mounted() {
        this.elExport = document.getElementById('exportExcel');
    },
    methods: {
        ...mapActions(['_AJAX']),
        /*初始化数据*/
        loadData() {
            this.parameterEchoMixin(); //根据store中的参数回显
            //要存储在store中的对象，key存的是什么，回显的时候显示的就是什么(注意key的命名)
            this.adqSearchListMixin = {
                param: this.param,
                applicationTime: this.applicationTime,
            };
            let params = Object.assign({}, this.param);
            params.applyTimeStart = this.applicationTime ? this.applicationTime[0] : null;
            params.applyTimeEnd = this.applicationTime ? this.applicationTime[1] : null;
            this._AJAX({
                url: 'activiti.biz.cc.list',
                method: 'GET',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.tableList = res.result;
                }
            });
        },
        /*获得业务名称列表*/
        loadBusinessName() {
            this._AJAX({
                url: 'sys.category.list',
                method: 'GET',
                data: { page: 1, rows: 9999 },
            }).then((res) => {
                this.categoryOptions = res.result.rows;
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
        /*查看*/
        views(row) {
            this.$router.push({
                path: '/process/workbench/myWorkflowEdit',
                query: {
                    formId: row.formId,
                    bizCode: row.bizCode,
                    tableName: row.tableName,
                    optType: 'view',
                },
            });
        },
        /*导出*/
        exportFile() {
            //生成列名
            let rows = [
                { key: 'categoryName', label: '业务名称' },
                { key: 'processName', label: '流程名称' },
                { key: 'formName', label: '表单名称' },
                { key: 'title', label: '申请标题' },
                { key: 'applyTime', label: '发起时间' },
                { key: 'workTime', label: '已流转(天)' },
                { key: 'status', label: '状态' },
            ];
            if (this.tableList.total > 0) {
                let data = [{}];
                this.exportData(() => {
                    rows.forEach((item) => {
                        data[0][item.key] = item.label;
                    });
                    /*翻译*/
                    this.exportTotalList.map((item) => {
                        item.applyTime = this.publics.formatTime(item.applyTime, 'Y-M-D h:m:s');
                        item.status = this.statusNS[item.status];
                    });
                    data = data.concat(this.exportTotalList);
                    // console.table(data);
                    this.exportExcel(data, '抄送我的');
                });
            } else {
                this.$AudaqueToast.error({
                    template: `无可导出的内容`,
                });
            }
        },
        /*导出时请求所有的数据*/
        exportData(cb) {
            let params = Object.assign({}, this.param);
            params.applyTimeStart = this.applicationTime ? this.applicationTime[0] : null;
            params.applyTimeEnd = this.applicationTime ? this.applicationTime[1] : null;
            params.rows = this.tableList.total;
            this._AJAX({
                url: 'activiti.biz.cc.list',
                method: 'GET',
                data: params,
            }).then((res) => {
                if (res.code == 0) {
                    this.exportTotalList = res.result.rows;
                    cb();
                } else {
                    this.$AudaqueToast.error({
                        template: `导出失败`,
                    });
                }
            });
        },
        /*导出为excel格式*/
        exportExcel(json, downName, type) {
            //获取列名
            let keyMap = [];
            for (let k in json[0]) {
                keyMap.push(k);
            }

            //用来保存转换好的json
            let tmpdata = [];
            json.map((v, i) =>
                keyMap.map((k, j) =>
                    Object.assign(
                        {},
                        {
                            v: v[k],
                            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1),
                        }
                    )
                )
            )
                .reduce((prev, next) => prev.concat(next))
                .forEach(function (v) {
                    tmpdata[v.position] = {
                        v: v.v,
                    };
                });

            let outputPos = Object.keys(tmpdata); //设置区域，比如表格从A1到D10
            let tmpWB = {
                SheetNames: ['mySheet'], // 保存的表标题
                Sheets: {
                    mySheet: Object.assign(
                        {},
                        tmpdata, //内容
                        {
                            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1], //设置填充区域
                        }
                    ),
                },
            };

            //创建二进制对象写入转换好的字节流
            let tmpDown = new Blob(
                [
                    this.s2ab(
                        XLSX.write(
                            tmpWB,
                            { bookType: type === undefined ? 'xlsx' : type, bookSST: false, type: 'binary' } //这里的数据是用来定义导出的格式类型
                        )
                    ),
                ],
                {
                    type: '',
                }
            );

            this.elExport.download = downName + '.xlsx'; //下载名称
            this.elExport.href = URL.createObjectURL(tmpDown); //绑定a标签到新创建对象超链接
            this.elExport.click(); //模拟点击实现下载

            //释放，用 URL.revokeObjectURL() 释放
            setTimeout(() => URL.revokeObjectURL(tmpDown), 100);
        },
        //将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
        getCharCol(n) {
            let s = '';
            let m = 0;
            while (n > 0) {
                m = (n % 26) + 1;
                s = String.fromCharCode(m + 64) + s;
                n = (n - m) / 26;
            }
            return s;
        },
        //字符串转字符流
        s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i !== s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        },
    },
};
</script>
