<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :title="searchList.type == 1 ? '待办列表' : '消息列表'"> </audaque-table-title>
        </template>
        <template>
            <el-table
                :data="dataList"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                border
            >
                <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
                <el-table-column prop="tableName" label="类别" align="center" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.type == 1 ? '待办' : '消息' }}
                    </template>
                </el-table-column>
                <el-table-column prop="editting" align="left" label="内容">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.state == 0"
                            @click="clickContent(scope.row)"
                            style="color: #428bca; cursor: pointer"
                            class="iconfont iconweidu"
                            >{{ scope.row.title }}</span
                        >
                        <span
                            v-else
                            style="cursor: pointer"
                            @click="clickContent(scope.row)"
                            class="iconfont iconxinfengdakai"
                            >{{ scope.row.title }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" align="center" width="250" label="创建时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.createTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </audaque-table-list-page>
    <!--<div class="home-main">-->
    <!--<table-title :title="searchList.type == 1 ? '待办列表' : '消息列表'"></table-title>-->
    <!--<el-table-->
    <!--:data="dataList"-->
    <!--border-->
    <!--style="width: 100%">-->
    <!--<el-table-column-->
    <!--type="index"-->
    <!--label="序号"-->
    <!--align="center"-->
    <!--width="60">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="tableName"-->
    <!--label="类别"-->
    <!--align="center"-->
    <!--width="150">-->
    <!--<template slot-scope="scope">-->
    <!--{{scope.row.type == 1 ? '待办' : '消息'}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="editting"-->
    <!--align="left"-->
    <!--label="内容">-->
    <!--<template slot-scope="scope">-->
    <!--<span v-if="scope.row.state == 0" @click="clickContent(scope.row)"-->
    <!--style="color: #428bca; cursor: pointer;"-->
    <!--class="iconfont iconweidu">{{scope.row.title}}</span>-->
    <!--<span v-else style="cursor: pointer;" @click="clickContent(scope.row)"-->
    <!--class="iconfont iconxinfengdakai">{{scope.row.title}}</span>-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="createTime"-->
    <!--align="center"-->
    <!--width="250"-->
    <!--label="创建时间">-->
    <!--<template slot-scope="scope">-->
    <!--{{publics.formatTime(scope.row.createTime,'Y-M-D h:m:s')}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--</el-table>-->
    <!--</div>-->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TableTitle from '@/components/TableTitle';

export default {
    data() {
        return {
            messageType: null,
            messageInfoTotal: null,
            searchList: {
                type: '',
                state: 1,
                page: 1,
                rows: 10,
            },
            dataList: [],
        };
    },
    watch: {
        $route(to, form) {
            this.searchList.type = this.$route.query.type;
            this.getDataList();
        },
        messageInfoList(data) {
            this.getDataList();
        },
    },
    created() {
        this.searchList.type = this.$route.query.type;
        this.getDataList();
    },

    mounted() {},
    computed: {
        ...mapState('user', ['messageInfoList']),
    },
    components: { TableTitle },
    methods: {
        ...mapActions('user', ['GET_MESSAGE_INFO_LIST', 'UPDATE_MESSAGE_STGATE', 'GET_NEWS_NUM']),
        getDataList() {
            if (this.searchList.type == 1 && this.messageInfoList) {
                //待办
                this.dataList = this.messageInfoList.taskEvent;
                this.messageInfoTotal = this.messageInfoList.taskEvent.length;
            } else if (this.searchList.type == 2 && this.messageInfoList) {
                //消息
                this.dataList = this.messageInfoList.msgEvent;
                this.messageInfoTotal = this.messageInfoList.msgEvent.length;
            }
        },
        clickContent(row) {
            if (row.url) {
                this.$router.push({
                    path: '/',
                    query: { recordId: '' },
                });
            }
            // if (row.target == 1 && row.type == 2) {
            //     this.$router.push({
            //         path: '/structured/structApproveManage',
            //         query: {recordId: row.targetId}
            //     })
            // }
            // if (row.target == 2 && row.type == 2) {
            //     this.$router.push({
            //         path: '/structured/structReportManage',
            //         query: {templateId: row.targetId}
            //     })
            // }
            // if (row.target == 3 && row.type == 2) {
            //     this.$router.push({
            //         path: '/unstructured/unstructReportManage',
            //         query: {resourceId: row.targetId}
            //     })
            // }
        },
        handleSizeChange(val) {
            this.searchList.rows = val;
            this.getDataList();
        },
        handleCurrentChange(val) {
            this.searchList.page = val;
            this.getDataList();
        },
    },
};
</script>
<style lang="scss" scoped></style>
