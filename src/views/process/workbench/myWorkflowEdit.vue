<template>
    <audaque-detail-form-page class="workflow-review-edit" title="查看我的工单" :opt-type="$route.query.optType">
        <el-tabs tab-position="left" v-model="activeName">
            <el-tab-pane label="基本信息" name="0">
                <el-form
                    :model="userInfoForm"
                    :rules="userInfoRules"
                    ref="userInfoForm"
                    id="updateNode0"
                    label-width="110px"
                >
                    <el-col :span="12">
                        <el-form-item label="流程类型" prop="categoryName">
                            <el-input disabled v-model.trim="userInfoForm.categoryName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流程名称" prop="processName">
                            <el-input disabled v-model.trim="userInfoForm.processName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请标题" prop="title">
                            <el-input disabled v-model.trim="userInfoForm.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间" prop="applyTime">
                            <div class="form-border">
                                {{ publics.formatTime(userInfoForm.applyTime, 'Y-M-D h:m:s') }}
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="已流转(天)" prop="workTime">
                            <el-input disabled v-model.trim="userInfoForm.workTime"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <div class="form-border">{{ statusNS[userInfoForm.status] }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="抄送人"
                            prop="ccInfo"
                            v-if="userInfoForm.ccInfo && userInfoForm.ccInfo.length > 0"
                        >
                            <div class="form-border">
                                {{ userInfoForm.ccInfo.join(',') }}
                                <!--                                <span v-for="item in userInfoForm.ccInfo" :key="item.id">{{ item.username }},</span>-->
                            </div>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="表单信息" name="1">
                <template v-if="isShowFormItem">
                    <form-parser
                        id="updateNode1"
                        v-if="Object.keys(formConf).length > 0"
                        ref="formParser"
                        :key="key2"
                        :formConf="formConf"
                        :isDisabled="true"
                    ></form-parser>
                </template>
                <div v-else class="air-item">暂无表单信息!</div>
            </el-tab-pane>
            <el-tab-pane label="审核历史" name="2">
                <process-info-component
                    id="updateNode2"
                    v-if="activeName === '2'"
                    :procInstId="userInfoForm.procInstId"
                    :procDefId="userInfoForm.procDefId"
                ></process-info-component>
            </el-tab-pane>
        </el-tabs>
       <!-- <template slot="bottom">
            <el-button type="primary" @click="handleDown">导出流程信息</el-button>
        </template>
        &lt;!&ndash;隐藏的节点做导出Pdf用&ndash;&gt;
        <div id="copyFormNode" style="position: absolute; width: 100%; right: 99999px; top: 99999px"></div>-->
    </audaque-detail-form-page>
</template>
<script>
import { mapActions } from 'vuex';
import processInfoComponent from '../modules/processInfoComponent';
import API from '@/api/index';
import { status } from './workflowTypes';
import { fillFormData } from '@/components/form/formPublic';
import htmlToPdf from '@/utils/modules/htmlToPdf';

export default {
    data() {
        return {
            bizCode: this.$route.query.bizCode,
            formId: this.$route.query.formId,
            tableName: this.$route.query.tableName,
            optType: this.$route.query.optType,
            nodeData: [],
            activeNodeData: {},
            activeNodeVariables: {},
            operationData: [],
            key2: +new Date(),
            formConf: {},
            activeName: '0',
            userInfoForm: {},
            userInfoRules: {},
            statusNS: status,
            isShowFormItem: true,
            tabsNames: {
                0: '基本信息',
                1: '表单信息',
                2: '审核历史',
            },
        };
    },
    computed: {},
    components: {
        processInfoComponent,
    },
    created() {
        this.init();
    },
    methods: {
        ...mapActions(['_AJAX']),
        init() {
            if (!this.formId) {
                /*隐藏表单信息*/
                this.isShowFormItem = false;
                this.loadUserInfo();
                return false;
            } else {
                this.isShowFormItem = true;
                let url = API['form.design.select'] + '/' + this.formId;
                /*请求表单信息*/
                this._AJAX({
                    url: url,
                    method: 'GET',
                    data: {},
                }).then((res) => {
                    this.formConf = JSON.parse(res.result.formJson);
                });
                this.loadUserInfo();
            }
        },
        /*请求 基本信息*/
        loadUserInfo() {
            this._AJAX({
                url: window.urlConfig + `/activiti/biz/select/${this.bizCode}`,
                method: 'GET',
                data: {},
            }).then((res) => {
                if (res.code === 0) {
                    this.userInfoForm = res.result;
                    /*处理抄送人字段*/
                    if (this.userInfoForm.ccInfo) {
                        this.userInfoForm.ccInfo = this.userInfoForm.ccInfo.map((item) => {
                            return item.username;
                        });
                    } else {
                        this.userInfoForm.ccInfo = [];
                    }
                    /*表单信息的回显*/
                    if (res.result.dataMapStr) {
                        fillFormData.call(this, this.formConf.fields, JSON.parse(res.result.dataMapStr), this.formConf);

                        //更新表单;
                        this.key2 = +new Date();
                    }
                }
            });
        },
        /*将页面导出为pdf*/
        handleDown() {
            htmlToPdf.loadNode(
                document.querySelector('#updateNode' + this.activeName),
                this.userInfoForm.title + '_' + this.tabsNames[this.activeName]
            );
        },
    },
};
</script>
<style scoped lang="scss">
/deep/ .el-tabs {
    height: 100% !important;
    .el-tabs__content {
        height: 100%;
        overflow: auto;
    }
    .el-tab-pane {
        display: flex;
        flex-direction: column;
        height: 100%;
        .operation-item {
            height: 100%;
            text-align: left !important;
            .el-form-item__label {
                padding: 0;
                font-weight: 600;
            }
        }
    }
    .air-item {
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
    }
}
.form-border {
    background-color: #f5f7fa;
    color: #c0c4cc;
    padding: 5px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    word-break: break-all;
    line-height: 25px;
}
/deep/#copyFormNode .tinymce-editor,
/deep/#copyFormNode .el-textarea {
    border: 1px solid #ccc;
    padding: 10px;
}
/deep/.download-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding: 0 0 15px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}
</style>
