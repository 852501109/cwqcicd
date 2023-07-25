<template>
    <audaque-detail-form-page class="news-type-sys-edit" :title="formTitle" :opt-type="$route.query.optType">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :disabled="isView">
            <el-col :span="12">
                <el-form-item label="应用key" prop="appKey">
                    <el-input v-model.trim="ruleForm.appKey" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="应用名称" prop="appName">
                    <el-input v-model.trim="ruleForm.appName" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="标题" prop="title">
                    <el-input v-model.trim="ruleForm.title" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="摘要" prop="messageAbstract">
                    <el-input v-model.trim="ruleForm.messageAbstract" placeholder=""></el-input>
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
            <el-col :span="12" v-if="ruleForm.type === 3">
                <el-form-item label="办理状态" prop="handlerStatus">
                    <el-select v-model="ruleForm.handlerStatus">
                        <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="item in handleStatusList"
                            :key="item.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="办理人" prop="handlerUsername" v-if="handlerStatus == 3">
                    <el-input v-model.trim="ruleForm.handlerUsername" placeholder=""></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="通知对象" prop="receiveType">
                    <el-select v-model="ruleForm.receiveType">
                        <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="item in msgNoticeTypeList"
                            :key="item.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="紧急程度" prop="level">
                    <el-select v-model="ruleForm.level">
                        <el-option :label="item.label" :value="item.value" v-for="item in levelList" :key="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="内容" prop="content">
                    <div class="content-item" v-html="$audaquePreventXss(ruleForm.content, $xssWhitelist)"></div>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="原始内容" prop="originalParam">
                    <div class="content-item" v-html="$audaquePreventXss(ruleForm.originalParam, $xssWhitelist)"></div>
                </el-form-item>
            </el-col>
            <div class="clear"></div>
        </el-form>
    </audaque-detail-form-page>
</template>
<style lang="scss" scoped>
.news-type-sys-edit {
    /deep/ .news-type-sys-introduction {
        min-height: 90px !important;
        height: auto !important;
        /deep/ .el-textarea__inner {
            min-height: 90px !important;
        }
    }
    .content-item {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        /*color: #c0c4cc;*/
        padding: 15px;
        word-wrap: break-word;
        word-break: normal;
    }
}
</style>
<script>
import { mapActions } from 'vuex';
import { msgTypeList, msgNoticeTypeList, levelList, sendStatusList, handleStatusList } from './newsSearchJs';
export default {
    data() {
        return {
            msgTypeList,
            msgNoticeTypeList,
            levelList,
            sendStatusList,
            handleStatusList,
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑我的消息'
                    : this.$route.query.optType === 'view'
                    ? '查看我的消息'
                    : '新增我的消息',
            preview: '',
            ruleForm: {
                codeType: '',
                name: '',
                remark: '',
            },
            rules: {},
            isView: false,
            id: this.$route.query.id,
            handlerStatus: this.$route.query.type, //3  消息类型 为任务状态
        };
    },
    created() {
        if (this.$route.query.id) {
            this.loadData();
        }
        if (this.$route.query.optType === 'view') {
            this.isView = true;
        }
    },
    methods: {
        ...mapActions(['_AJAX']),
        loadData() {
            this._AJAX({
                url: 'sys.message.user.id',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                    needSendList: 2,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.ruleForm = res.result;
                    this.ruleForm.content = String(res.result.content)
                        .replace(/&(?!\w+;)/g, '&amp;')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#039;/g, '\'');
                }
            });
        },

        /*翻译*/
        translation(data, value) {
            if (value != null) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].value === value) {
                        return data[i].label;
                    }
                }
            } else {
                return '-';
            }
        },
    },
};
</script>
