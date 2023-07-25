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

        <div class="msg-list-item">
            <div class="title">发送情况详情</div>
            <el-tabs v-model="activeName" @tab-click="handleTabPaneClick">
                <!--过滤掉邮箱【不展示邮箱详情】-->
                <template v-for="(item, index) in channelType">
                    <el-tab-pane v-if="item != 2" :key="index" :label="channelListObj[item]" :name="item + ''">
                    </el-tab-pane>
                </template>
            </el-tabs>

            <el-table
                v-if="activeName == 1"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="receiverTableTypeList"
                border
            >
                <el-table-column show-overflow-tooltip type="index" label="序号" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="username" label="接收人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="readFlag" label="是否已读">
                    <template slot-scope="scope">
                        <span v-if="scope.row.readFlag === 1" style="color: #f56c6c">已读</span>
                        <span v-else>未读</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="readTime" label="已读时间">
                    <template slot-scope="scope">
                        {{ publics.formatTime(scope.row.readTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
            </el-table>
            <!--过滤掉邮箱【不展示邮箱详情】-->
            <!--<el-table
                v-if="activeName == 2"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="receiverTableTypeList"
                border
            >
                <el-table-column show-overflow-tooltip type="index" label="序号" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="username" label="接收人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="sendStatus" label="发送状态">
                    <template>
                        {{ translation(sendStatusList, ruleForm.sendStatus) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="sendTime" label="发送时间">
                    <template>
                        {{ publics.formatTime(ruleForm.sendTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
            </el-table>-->
            <el-table
                v-if="activeName == 3"
                tooltip-effect="light"
                class="el-table-common__list"
                highlight-current-row
                stripe
                :data="receiverTableTypeList"
                border
            >
                <el-table-column show-overflow-tooltip type="index" label="序号" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="username" label="接收人"></el-table-column>
                <el-table-column show-overflow-tooltip prop="sendStatus" label="发送状态">
                    <template>
                        {{ translation(sendStatusList, ruleForm.sendStatus) }}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="sendTime" label="发送时间">
                    <template>
                        {{ publics.formatTime(ruleForm.sendTime, 'Y-M-D h:m:s') }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
    .msg-list-item {
        .title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }
}
</style>
<script>
import { mapActions } from 'vuex';
import {
    msgTypeList,
    msgNoticeTypeList,
    levelList,
    sendStatusList,
    handleStatusList,
    channelList,
} from './newsSearchJs';
export default {
    data() {
        return {
            msgTypeList,
            msgNoticeTypeList,
            levelList,
            sendStatusList,
            handleStatusList,
            channelList,
            formTitle:
                this.$route.query.optType === 'edit'
                    ? '编辑消息管理'
                    : this.$route.query.optType === 'view'
                    ? '查看消息管理'
                    : '新增消息管理',
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
            receiverTableList: [],
            receiverTableTypeList: [],
            activeName: '1',
            channelType: [],
            channelListObj: {},
        };
    },
    created() {
        /*tabs页的翻译*/
        channelList.forEach((item) => {
            this.channelListObj[item.value] = item.label;
        });
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
                url: 'sys.message.id',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                    needSendList: 1,
                },
            }).then((res) => {
                if (res.code == 0) {
                    this.ruleForm = res.result;
                    this.receiverTableList = res.result.sendList || [];
                    this.channelType = (res.result.channelType && res.result.channelType.split(',')) || [];
                    this.activeName = this.channelType[0];
                    this.loadReceiverTableList();
                }
            });
        },
        /*处理 发送情况详情 数据根据渠道类型展示*/
        loadReceiverTableList() {
            this.receiverTableTypeList = [];
            this.receiverTableList.map((item) => {
                if (item.channelType == this.activeName) {
                    this.receiverTableTypeList.push(item);
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
        handleTabPaneClick(tab, event) {
            this.loadReceiverTableList();
        },
    },
};
</script>
