<template>
    <div class="">
        <div class="search-is-expand">
            <div class="search clearfix">
                <div class="search-condition" @click="isExpand=!isExpand"><i class="iconfont icon-sousuo"></i>查询条件</div>
                <div class="search-opear">
                    <span class="search-filter" @click="isExpand=!isExpand"><i class="iconfont icon-zhankai" :class="{'icon-shouqi':isExpand}"></i>{{isExpand?"展开":"收起"}}筛选</span>
                    <span style="margin-left:10px;">
                        <span :class="['query',is_query?'active':'normal']"
                              @click="seachBtn">查询</span><span :class="['rest',!is_query?'active':'normal']"
                                                               @click="resetBtn">重置</span>
                    </span>
                    <!--<el-button type="primary" @click="seachBtn">查询</el-button>-->
                    <!--<el-button type="primary" plain @click="resetBtn">重置</el-button>-->
                </div>
            </div>
            <div class="select-option" v-show="isExpand">
                <label>开始时间:</label>
                <el-date-picker style="width:215px;" format="yyyy-MM-dd HH:mm:ss"
                                v-model="param.beginTimeAfterStr" value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="选择日期">
                </el-date-picker>
                <label>结束时间:</label>
                <el-date-picker style="width:215px;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="param.beginTimeBeforeStr"
                                type="datetime"
                                placeholder="选择日期">
                </el-date-picker>
            </div>
        </div>
        <el-table tooltip-effect='light' highlight-current-row :data="execDetail.rows" border style="width: 100%"
                  :header-cell-style="{'background':'#f7f7f8','color':'#3a405b'}">
            <el-table-column show-overflow-tooltip  align="center" prop="beginTime"
                             :formatter="(row)=>{return $utils.timeToDate(row.beginTime)}" label="开始时间"></el-table-column>
            <el-table-column show-overflow-tooltip  align="center" prop="endTime"
                             :formatter="(row)=>{return $utils.timeToDate(row.endTime)}" label="结束时间"></el-table-column>
            <el-table-column show-overflow-tooltip  align="center" prop="exception"
                             :formatter="(row)=>{return !row.exception?'是':'否'}" label="是否成功"></el-table-column>
            <el-table-column show-overflow-tooltip  width="180" align="center" prop="input"
                             :formatter="(row)=>{return row.input?row.input:'-'}" label="输入"></el-table-column>
            <el-table-column show-overflow-tooltip  width="180" align="center" prop="output"
                             :formatter="(row)=>{return row.output?row.output:'-'}" label="输出"></el-table-column>
            <el-table-column show-overflow-tooltip  width="200" align="center" label="操作">
                <template slot-scope="scope">
                    <a v-if="scope.row.taskReportUrl && scope.row.endTime && !scope.row.exception" class="iconfont icon-tingzhi operate">查看报告</a>
                    <a v-else-if="scope.row.exception && scope.row.exception!=null" class="iconfont icon-bofang operate" @click="errorLog">错误日志</a>
                    <span v-else>-</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-botoom" v-if="execDetail.total>10">
            <span class="botoom-left">共计{{execDetail.total}}条记录每页显示 </span>
            <el-pagination class="botoom-right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="param.page" :page-sizes="$utils.pageShowSize(execDetail.total)" :page-size="param.rows" layout="sizes, prev, pager, next" :total="execDetail.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        data() {
            return {
                is_query: true,
                isExpand:false,
                param: {
                    beginTimeAfterStr:'',
                    beginTimeBeforeStr:'',
                    page: 1,
                    rows: 10,
                    groupId: this.$route.query.groupId,
                    taskId: this.$route.query.taskId
                }
            }
        },
        computed: {
            ...mapState('webkit',['execDetail'])
        },
        methods: {
            ...mapActions('webkit', ['EXECDETAIL', 'ERRORLOG']),
            handleSizeChange (rows) {
                this.param.rows = rows
                this.EXECDETAIL(this.param)
            },
            handleCurrentChange (page) {
                this.param.page = page
                this.EXECDETAIL(this.param)
            },
            seachBtn () {
                this.is_query = true
                this.EXECDETAIL(this.param)
            },
            resetBtn () {
                this.is_query = false
                this.param.page = 1
                this.param.beginTimeAfterStr = ''
                this.param.beginTimeBeforeStr = ''
                this.EXECDETAIL(this.param)
            },
            errorLog () {
                this.ERRORLOG({id:111})
            }
        },
        created () {
            this.EXECDETAIL(this.param)
        }
    }
</script>
<style lang="scss" scoped>
    .operate{color:#6ba9ec;}
    .search-is-expand{
        .search{
            overflow:hidden;background:#fff;height:56px;line-height:56px;border-bottom:1px solid #ebebeb;
            .search-condition{color:#3a405b;font-size:14px;float:left;
                i{margin:0 10px 0 20px;}
            }
            .search-opear{float:right;margin-right:20px;
                .search-filter{color:#3a405b;
                    i{margin-right:10px;}
                }
                .query {
                    padding: 6px 15px;
                    border: 1px solid #53a7f8;
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                }
                .rest {
                    padding: 6px 15px;
                    border: 1px solid #53a7f8;
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
                }
                .active {
                    background: #53a7f8;
                    color: #ffffff;
                }
                .normal {
                    background: #ffffff;
                    color: #53a7f8;
                }
            }
        }
        .select-option{
            height:80px;line-height:80px;background:#fff;
            label{margin:0 20px 0 45px;color:#3a405b;}
        }
        margin-bottom:20px;
    }
</style>
