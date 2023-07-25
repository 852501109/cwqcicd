<template>
    <div class="goto-edit">
        <div class="goto-edit-main">
            <ul class="goto-edit-item">
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus"><i>*</i>业务分类：</label>
                    <div class="goto-edit-input">
                        <el-select :disabled="disabled2" v-model="groupId" placeholder="请选择" @change="changeGroup">
                            <!--<option value="">请选择</option>-->
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="(item,index) in cheduleGroups" :key="index"
                                       :label="item.groupName" :value="item.groupId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus"><i>*</i>任务名称：</label>
                    <div class="goto-edit-input">
                        <el-input v-if="id" disabled v-model.trim="taskName" placeholder="请输入内容"></el-input>
                        <el-select v-else :disabled="disabled" v-model="taskIds" multiple filterable @change="taskChange"
                                   allow-create default-first-option placeholder="请选择输入任务名称">
                            <el-option
                                v-for="item in tasks"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus"><i>*</i>执行次数：</label>
                    <div class="goto-edit-input">
                        <el-select v-model="param.singleUse" placeholder="请选择">
                            <el-option label="多次" value="false"></el-option>
                            <el-option label="一次" value="true"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus"><i>*</i>生效时间：</label>
                    <div class="goto-edit-input">
                        <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="param.beginTimeStr"
                            type="datetime"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </li>
                <li v-show="param.singleUse == 'false'">
                    <!--// 一次 不显示 null-->
                    <label class="goto-edit-bus">失效时间：</label>
                    <div class="goto-edit-input">
                        <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="param.endTimeStr"
                            type="datetime"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </li>
                <li v-show="param.singleUse == 'false'">
                    <!--// 一次  不显示 null-->
                    <label class="goto-edit-bus"><i>*</i>执行模式：</label>
                    <div class="goto-edit-input">
                        <el-select v-model="param.mode" placeholder="请选择">
                            <el-option v-for="item in modes" :key="item.key" :label="item.value" :value="item.key+''"></el-option>
                        </el-select>
                    </div>
                </li>
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus">参数：</label>
                    <div class="goto-edit-input">
                        <el-input v-model.trim="param.arguments" placeholder="请输入内容"></el-input>
                    </div>
                </li>
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus">查看进度：</label>
                    <div class="goto-edit-input" style="line-height:40px;">
                        {{progress}}
                    </div>
                </li>
                <li>
                    <!--// 一次-->
                    <label class="goto-edit-bus">备注：</label>
                    <div class="goto-edit-input">
                        <el-input v-model.trim="param.remark" placeholder="请输入内容"></el-input>
                    </div>
                </li>
            </ul>
            <div class="goto-edit-cron" v-if="param.singleUse == 'false'">
                <!--// 一次 不显示 null-->
                <label class="goto-edit-title"><i>*</i>Cron表达式：</label>
                <div class="goto-edit-content">
                    <cron v-model="param.cronExpression"></cron>

                </div>
            </div>
        </div>
        <div class="goto-edit-btn" :class="{'goto-edit-btn-hover':param.singleUse == 'true'}"><el-button style="margin-top:30px;" type="primary" @click="btnFun">提交</el-button></div>
    </div>
</template>
<style lang="scss" scoped>
.goto-edit{background:#fff;
    .goto-edit-main{display: flex;
        .goto-edit-title,.goto-edit-bus{color:#3a405b;height:40px;line-height:40px;i{margin-right:5px;color:red;}}
        .goto-edit-item{margin:30px 40px 0 20px;
            li{display: flex;margin-top:30px;
                .goto-edit-bus{width:80px;text-align:right;}
                .goto-edit-input,.el-select,.el-input{width:520px;}
            }
        }
        .goto-edit-cron{display: flex;margin-top:60px;
            .goto-edit-cron{}
        }
    }
    .goto-edit-btn{width:100%;text-align: center;padding-bottom:100px;}
    .goto-edit-btn-hover{text-align: left;margin-left:300px;}
}
</style>
<script>
    import {mapState, mapActions} from 'vuex'
    import cron from '@/components/cron'
    let processArr = ['请选择业务分类', '该业务分类支持查看进度', '该业务分类不支持查看进度']
    export default {
        components: { cron },
        data(){
            return {
                tasks:[],
                disabled:true,
                disabled2: this.$route.query.id?true:false,
                progress:processArr[0],
                groupId:'',
                modes:[{key:1, value:'并行'},{key:2, value:'串行'},{key:3, value:'忽略'}],
                groupName:'',
                taskNames: [],
                taskIds: [],
                taskName:'',
                id:this.$route.query.id,
                param:{
                    arguments:'',
                    remark:'',
                    beginTimeStr: '',
                    endTimeStr:'',
                    mode:'',
                    singleUse:'false',
                    cronExpression:''
                }
            }
        },
        watch: {
            'param.singleUse':function (isDrag) {
                if(isDrag == 'true') {
                    this.param.endTimeStr = ''
                    this.param.cronExpression = ''
                    this.param.mode = ''
                }
            }
        },
        computed: {
            ...mapState('webkit', ['cheduleGroups'])
        },
        methods: {
            btnFun () {
                const _this = this;
                if(this.id){
                    let param = this.param
                    param['id'] = this.id
                    this.EDITJOB(param).then((res) => {
                        if(res.code == 0){
                            this.$AudaqueToast.tip({
                                template: `编辑成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.replace('/webkit/scheduleManage')
                                    }
                                }
                            });
                        }
                    })

                }else{
                    let param = this.param
                    param['groupId'] = this.groupId
                    param['groupName'] = this.groupName
                    param['taskNames'] = this.taskNames
                    param['taskIds'] = this.taskIds
                    this.ADDJOB(param).then((res) => {
                        if(res.code == 0){
                            this.$AudaqueToast.tip({
                                template: `添加成功`,
                                methods: {
                                    okEvent() {
                                        _this.$router.replace('/webkit/scheduleManage')
                                    }
                                }
                            });
                            this.$router.replace('/webkit/scheduleManage')
                        }
                    })
                }
            },
            taskChange () {
                this.taskNames = []
                this.taskIds.forEach((item) => {
                    this.tasks.forEach((item2) => {
                        if(item == item2.key){
                            this.taskNames.push(item2.value)
                        }
                    })
                })
            },
            changeGroup() {
                this.taskNames = []
                this.taskIds = []
                if(this.groupId == '') {
                    this.progress=processArr[0]
                }else{
                    this.cheduleGroups.forEach((item) => {
                        if(this.groupId == item.groupId){
                            this.modes = item.modes
                            this.param.mode = this.modes[0].key.toString()
                            this.groupName = item.groupName
                            if(item.supportProgress){
                                this.progress=processArr[1]
                            }else{
                                this.progress=processArr[2]
                            }
                        }
                    })

                }
                let param = {groupId:this.groupId}
                this.TASKLIST(param).then((res) => {
                    if(res.result && res.result.length>0){
                        this.disabled = false
                        this.tasks = res.result
                    }else{
                        this.disabled = true
                        this.tasks = []
                    }
                })
            },
            ...mapActions('webkit', ['GETEDITJOB', 'CHEDULEGROUPS', 'TASKLIST', 'ADDJOB', 'EDITJOB'])
        },
        created () {
            this.CHEDULEGROUPS()
            if(this.id){
                this.GETEDITJOB({id:this.id}).then((res) => {
                    if(res.code==0){
                        this.groupId = res.result.pi.groupId
                        let taskIds = res.result.jd.taskIds
                        this.taskIds = taskIds!=null?taskIds:[]
                        this.taskName = res.result.jd.taskName
                        this.param.arguments = res.result.jd.arguments
                        this.param.remark = res.result.jd.remark
                        this.modes = res.result.pi.modes
                        let beginTimeStr = res.result.jd.beginTime
                        let endTimeStr = res.result.jd.endTime
                        this.param.beginTimeStr = beginTimeStr!=null && beginTimeStr!=''? this.$utils.timeToDate(beginTimeStr):''
                        this.param.endTimeStr = endTimeStr!=null && endTimeStr!=''? this.$utils.timeToDate(endTimeStr):''
                        this.param.mode = res.result.jd.mode+''
                        this.param.singleUse = res.result.jd.singleUse+''
                        this.param.cronExpression = res.result.jd.cronExpression
                        if(res.result.pi.supportProgress) {this.progress=processArr[1]}
                        else{this.progress=processArr[2]}
                    }
                })
            }
        }
    }
</script>
