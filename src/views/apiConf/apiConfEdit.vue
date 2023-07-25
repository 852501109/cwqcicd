<!-- 类别编辑-->
<template>
    <audaque-detail-form-page @submit-click="submit" :title="operateName" :opt-type="optType" class="user-edit">
        <template>
            <el-form
                ref="ruleform"
                :model="form"
                label-width="120px"
                :rules="rules"
                :disabled="optType === 'view'"
                class="form-item"
            >
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="接口名称" prop="name">
                            <el-input
                                v-model.trim="form.name"
                                :maxlength="userMaxLength"
                                show-word-limit
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="接口说明">
                            <el-input
                                type="textarea"
                                v-model="form.remark"
                                :maxlength="255"
                                show-word-limit
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="接口地址" prop="apiUrl">
                            <el-input
                                v-model.trim="form.apiUrl"
                                :maxlength="500"
                                show-word-limit
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="请求方式" prop="requestType">
                            <el-select
                                v-model.trim="form.requestType"
                                @change="requestTypeChange"
                                filterable
                                maxlength="100"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in requestTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="返回数据格式" prop="responseType">
                            <el-select v-model.trim="form.responseType" filterable maxlength="100" placeholder="请选择">
                                <el-option
                                    v-for="item in responseTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="请求头参数">
                            <table class="custom_table custom_table1">
                                <thead>
                                    <tr>
                                        <th>参数名</th>
                                        <th>类型</th>
                                        <th>必填</th>
                                        <th>描述</th>
                                        <th>默认值</th>
                                        <th>
                                            <el-button
                                                type="primary"
                                                icon="el-icon-plus"
                                                size="mini"
                                                circle
                                                @click="addRequestHeaderParams"
                                            ></el-button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, n) in requestHeadParamList" :key="n">
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramName"
                                                placeholder="请输入"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.dataType" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in dataTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.notNull" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in notNullOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramDesc"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.defaultValue"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <i
                                                class="el-icon-remove"
                                                :style="{ color: optType === 'view' ? '#f08383' : '#f00' }"
                                                @click="removeRequestHeaderParams(n)"
                                                :disabled="optType === 'view'"
                                            ></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="requestParamName">
                            <table
                                class="custom_table"
                                :class="[form.requestType === 'POST' ? 'custom_table2' : 'custom_table1']"
                            >
                                <thead>
                                    <tr>
                                        <th>参数名</th>
                                        <th>类型</th>
                                        <th>必填</th>
                                        <th v-if="form.requestType === 'POST'">业务参数</th>
                                        <th>描述</th>
                                        <th>默认值</th>
                                        <th>
                                            <el-button
                                                type="primary"
                                                icon="el-icon-plus"
                                                size="mini"
                                                circle
                                                @click="addRequestBodyParams"
                                            ></el-button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, n) in requestBodyParamList" :key="n">
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramName"
                                                placeholder="请输入"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.dataType" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in dataTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.notNull" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in notNullOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td v-if="form.requestType === 'POST'">
                                            <el-checkbox
                                                v-model="i.bussinessParam"
                                                @change="(val) => bussinessParamChange(val, i)"
                                            ></el-checkbox>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramDesc"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.defaultValue"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <i
                                                class="el-icon-remove"
                                                :style="{ color: optType === 'view' ? '#f08383' : '#f00' }"
                                                @click="removeResponseHeaderParams(n)"
                                                :disabled="optType === 'view'"
                                            ></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="hasBussinessParamSelected && form.requestType === 'POST'">
                    <el-col :span="24">
                        <el-form-item label="业务参数">
                            <table class="custom_table custom_table1">
                                <thead>
                                    <tr>
                                        <th>参数名</th>
                                        <th>类型</th>
                                        <th>必填</th>
                                        <th>描述</th>
                                        <th>默认值</th>
                                        <th>
                                            <el-button
                                                type="primary"
                                                icon="el-icon-plus"
                                                size="mini"
                                                circle
                                                @click="addBussinessParams"
                                            ></el-button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, n) in bussinessParamList" :key="n">
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramName"
                                                placeholder="请输入"
                                                maxlength="100"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.dataType" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in dataTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.notNull" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in notNullOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramDesc"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.defaultValue"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <i
                                                class="el-icon-remove"
                                                :style="{ color: optType === 'view' ? '#f08383' : '#f00' }"
                                                @click="removeBussinessParams(n)"
                                            ></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="返回数据体">
                            <table class="custom_table custom_table3">
                                <thead>
                                    <tr>
                                        <th>参数名英文</th>
                                        <th>接口参数名</th>
                                        <th>类型</th>
                                        <th>
                                            <el-button
                                                type="primary"
                                                icon="el-icon-plus"
                                                size="mini"
                                                circle
                                                @click="addResponseBody"
                                            ></el-button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, n) in responseBodyList" :key="n">
                                        <td>
                                            <el-input
                                                @input="(val) => enEvent(val, i)"
                                                v-model.trim="i.paramName"
                                                placeholder="请输入"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-input
                                                v-model.trim="i.paramCnName"
                                                placeholder="请输入"
                                                maxlength="50"
                                                show-word-limit
                                            ></el-input>
                                        </td>
                                        <td>
                                            <el-select v-model.trim="i.dataType" filterable placeholder="请选择">
                                                <el-option
                                                    v-for="item in dataTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                >
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <i
                                                class="el-icon-remove"
                                                :style="{ color: optType === 'view' ? '#f08383' : '#f00' }"
                                                @click="removeResponseBody(n)"
                                            ></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="创建人" prop="createUserName">
                            <el-input v-model.trim="form.createUserName" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="创建时间" prop="createTime">
                            <el-input v-model.trim="form.createTime" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="更新人" prop="updateUserName">
                            <el-input v-model.trim="form.updateUserName" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="optType === 'view'">
                    <el-col :span="23">
                        <el-form-item label="更新时间" prop="updateTime">
                            <el-input v-model.trim="form.updateTime" maxlength="100" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </audaque-detail-form-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            userMaxLength: 50,
            optType: this.$route.query.optType,
            optId: this.$route.query.id,
            form: {
                id: null,
                name: '',
                remark: '',
                apiUrl: '',
                requestType: 'POST',
                responseType: '',
            },
            rules: {
                requestType: [{ required: true, message: '请求方式不能为空' }],
                responseType: [{ required: true, message: '返回数据格式不能为空' }],
                name: [{ required: true, message: '接口名称不能为空' }],
                apiUrl: [{ required: true, validator: this.validateHttpUrl, trigger: 'blur' }],
            },
            requestTypeOptions: [
                { label: 'POST', value: 'POST' },
                { label: 'GET', value: 'GET' },
            ],
            responseTypeOptions: [
                { label: 'JSON', value: 'JSON' },
                { label: 'XML', value: 'XML' },
            ],
            dataTypeOptions: [
                { label: 'String', value: 'String' },
                { label: 'Number', value: 'Number' },
                { label: 'Object', value: 'Object' },
                { label: 'Array', value: 'Array' },
            ],
            notNullOptions: [
                { label: '是', value: 1 },
                { label: '否', value: 0 },
            ],
            requestHeadParamList: [],
            requestBodyParamList: [],
            bussinessParamList: [
                {
                    type: 3,
                    paramName: '',
                    dataType: '',
                    notNull: '',
                    paramDesc: '',
                    defaultValue: '',
                    bussinessParam: 1,
                },
            ],
            responseBodyList: [],
        };
    },
    watch: {},
    computed: {
        ...mapState('webkit', ['apiDetail']),
        hasBussinessParamSelected() {
            return this.requestBodyParamList.find((item) => item.bussinessParam);
        },
        requestParamName() {
            let name = '';
            if (this.form.requestType === 'POST') name = '请求体参数';
            else if (this.form.requestType === 'GET') name = 'param参数';
            else name = '请求体参数';
            return name;
        },
    },
    created() {
        if (this.optType === 'view') {
            this.operateName = '查看配置';
        } else if (this.optType === 'edit') {
            this.operateName = '编辑配置';
        } else {
            this.operateName = '新增配置';
        }
        if (this.optType !== 'add') {
            this.queryDetail();
        }
    },

    methods: {
        ...mapActions('webkit', ['ADD_API_CONF', 'ADD_API_EDIT', 'QUERY_API_DETAIL']),
        async queryDetail() {
            let params = { id: this.optId };
            await this.QUERY_API_DETAIL(params).then(() => {
                const {
                    id,
                    name,
                    remark,
                    apiUrl,
                    requestType,
                    responseType,
                    apiPropertyList,
                    createUser,
                    createTime,
                    updateUser,
                    createUserName,
                    updateUserName,
                    updateTime,
                } = this.apiDetail;
                this.form.id = id;
                this.form.name = name;
                this.form.remark = remark;
                this.form.apiUrl = apiUrl;
                this.form.requestType = requestType;
                this.form.responseType = responseType;
                this.requestHeadParamList = apiPropertyList.filter((item) => item.type === 1);
                this.requestBodyParamList = apiPropertyList.filter((item) => item.type === 2);
                if (this.optType === 'view') {
                    this.form.createUser = createUser;
                    this.form.createTime = createTime;
                    this.form.updateUser = updateUser;
                    this.form.updateTime = updateTime;
                    this.form.createUserName = createUserName;
                    this.form.updateUserName = updateUserName;
                }
                if (requestType === 'POST') {
                    if (apiPropertyList.filter((item) => item.type === 3).length > 0) {
                        this.requestBodyParamList.forEach((item) => {
                            item.bussinessParam = item.bussinessParam === 1;
                        });
                        this.bussinessParamList = apiPropertyList.filter((item) => item.type === 3);
                    }
                }

                this.responseBodyList = apiPropertyList.filter((item) => item.type === 4);
            });
        },
        enEvent(val, item) {
            item.paramName = val.replace(/[\u4E00-\u9FA5]+/g, '');
        },
        // 业务参数选中触发
        bussinessParamChange(value, item) {
            if (!value) return;
            this.requestBodyParamList.forEach((current) => {
                current.bussinessParam = false;
            });
            item.bussinessParam = true;
        },
        // 请求方式改变事件
        requestTypeChange(value) {
            console.log(value);
        },
        validateHttpUrl(rule, value, callback) {
            if (value === '') {
                callback(new Error('接口地址不能为空'));
            } else if (value && !this.checkURL(value)) {
                callback(new Error('请输入正确的接口地址'));
            } else {
                callback();
            }
        },
        checkURL(sUrl) {
            var sRegex = /^(https?):\/\/(([a-z0-9]([a-z0-9\-]*[a-z0-9])?\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:(\d{1,5}))?([\/?#][^\s]*)?$/;
            //re.test()
            if (sRegex.test(sUrl)) {
                return true;
            }
            return false;
        },
        addRequestHeaderParams() {
            this.requestHeadParamList.push({
                type: 1,
                paramName: '',
                dataType: '',
                notNull: '',
                paramDesc: '',
                defaultValue: '',
            });
        },
        removeRequestHeaderParams(n) {
            this.requestHeadParamList.splice(n, 1);
        },
        addRequestBodyParams() {
            this.requestBodyParamList.push({
                type: 2,
                paramName: '',
                dataType: '',
                notNull: '',
                bussinessParam: false,
                paramDesc: '',
                defaultValue: '',
            });
        },
        removeResponseHeaderParams(n) {
            if (this.optType === 'view') return;
            this.requestBodyParamList.splice(n, 1);
        },
        addBussinessParams() {
            this.bussinessParamList.push({
                type: 3,
                paramName: '',
                dataType: '',
                notNull: '',
                paramDesc: '',
                defaultValue: '',
                bussinessParam: 1,
            });
        },
        removeBussinessParams(n) {
            if (this.optType === 'view') return;
            this.bussinessParamList.splice(n, 1);
        },
        addResponseBody() {
            this.responseBodyList.push({
                type: 4,
                paramName: '',
                paramCnName: '',
                dataType: '',
            });
        },
        removeResponseBody(n) {
            if (this.optType === 'view') return;
            this.responseBodyList.splice(n, 1);
        },
        isRepeat(value) {
            return Array.from(new Set(value)).length < value.length;
        },
        deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        submit() {
            this.$refs.ruleform.validate((valid) => {
                if (valid) {
                    // 判断请求头参数是否有填写不完整的项
                    if (
                        this.requestHeadParamList.find(
                            (item) => !item.paramName || !item.dataType || item.notNull === ''
                        )
                    ) {
                        this.$message.error('请求头参数有未完善项');
                        return;
                    }
                    // 判断请求头参数名是否重复
                    if (this.isRepeat(this.requestHeadParamList.map((item) => item.paramName))) {
                        this.$message.error('请求头参数名重复');
                        return;
                    }
                    // 判断请求体参数是否有填写不完整的项
                    if (
                        this.requestBodyParamList.find(
                            (item) => !item.paramName || !item.dataType || item.notNull === ''
                        )
                    ) {
                        this.$message.error('请求体参数有未完善项');
                        return;
                    }
                    // 判断请求体参数名是否重复
                    if (this.isRepeat(this.requestBodyParamList.map((item) => item.paramName))) {
                        this.$message.error('请求体参数名重复');
                        return;
                    }

                    // 如果请求体勾选了业务参数，那业务参数就要校验至少一条、完整性、重复性
                    if (this.requestBodyParamList.find((item) => item.bussinessParam)) {
                        // 判断业务参数至少一条
                        if (this.bussinessParamList.length === 0) {
                            this.$message.error('业务参数至少一条');
                            return;
                        }
                        // 判断业务参数是否有填写不完整的项
                        if (
                            this.bussinessParamList.find(
                                (item) => !item.paramName || !item.dataType || item.notNull === ''
                            )
                        ) {
                            this.$message.error('业务参数有未完善项');
                            return;
                        }
                        // 判断业务参数名是否重复
                        if (this.isRepeat(this.bussinessParamList.map((item) => item.paramName))) {
                            this.$message.error('业务参数参数名重复');
                            return;
                        }
                    }
                    // 返回数据体至少填写一条
                    if (this.responseBodyList.length === 0) {
                        this.$message.error('返回数据体至少填写一条');
                        return;
                    }
                    // 判断返回数据是否有填写不完整的项
                    if (this.responseBodyList.find((item) => !item.paramName || !item.paramCnName || !item.dataType)) {
                        this.$message.error('返回数据体有未完善项');
                        return;
                    }
                    // 判断返回数据参数名是否重复
                    if (this.isRepeat(this.responseBodyList.map((item) => item.paramName))) {
                        this.$message.error('返回数据体参数名重复');
                        return;
                    }
                    // 校验通过，开始制作参数
                    const data = this.deepClone(this.form);
                    data.apiPropertyList = [].concat(
                        this.requestHeadParamList,
                        this.requestBodyParamList,
                        this.responseBodyList
                    );

                    if (
                        this.form.requestType === 'POST' &&
                        this.requestBodyParamList.find((item) => item.bussinessParam)
                    ) {
                        data.apiPropertyList = this.deepClone(data.apiPropertyList.concat(this.bussinessParamList));
                    }
                    data.apiPropertyList
                        .filter((item) => item.type === 2)
                        .forEach((item) => {
                            if (this.form.requestType === 'POST') item.bussinessParam = item.bussinessParam ? 1 : 0;
                            else item.bussinessParam = null;
                        });
                    data.apiPropertyList
                        .filter((item) => item.type === 4)
                        .forEach((item) => {
                            item.paramDesc = item.paramCnName;
                        });

                    let _this = this;
                    _this.$store.commit('SHOW_LOADING', true);
                    if (this.optType === 'edit') {
                        data.id = this.optId;
                        this.ADD_API_EDIT(data)
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `修改成功，由于您修改了接口的配置，请到接口查询配置中重新配置`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                _this.$store.commit('SHOW_LOADING', false);
                                _this.$AudaqueToast.error({
                                    template: err.msg,
                                });
                            });
                    } else {
                        //add
                        this.ADD_API_CONF(data)
                            .then((res) => {
                                this.$AudaqueToast.tip({
                                    template: `添加成功`,
                                    methods: {
                                        okEvent() {
                                            _this.$router.go(-1);
                                        },
                                    },
                                });
                            })
                            .catch((err) => {
                                _this.$store.commit('SHOW_LOADING', false);
                                _this.$AudaqueToast.error({
                                    template: err.msg,
                                });
                            });
                    }
                }
            });
        },
        handleSql(sql) {
            return sql
                .replace('select', '*S*')
                .replace('where', '*W*')
                .replace('from', '*F*')
                .replace('and', '*A*')
                .replace('limit', '*L*');
        },
    },
};
</script>

<style lang="scss" scoped>
.user-edit {
    /deep/ .resource {
        border: 1px solid #e1dfdc;
        height: 5rem;
    }

    /deep/ .submit-wrap {
        text-align: center;
        margin-top: 0.2rem;
    }
    /deep/ .el-tree {
        height: 3.5rem;
        overflow-y: scroll;
    }
    .paf-title {
        cursor: pointer;
    }
    .agree {
        color: red;
    }
    .div-margin {
        line-height: 22px;
    }
    /deep/.form-item {
        width: 99%;
        padding-right: 0;
    }
}
.custom_table1 {
    thead {
        th:not(:nth-child(6)) {
            width: 16%;
        }
    }
    tbody {
        td:not(:nth-child(6)) {
            width: 16%;
        }
    }
}
.custom_table2 {
    thead {
        th:not(:nth-child(7)) {
            width: 13.33%;
        }
    }
    tbody {
        td:not(:nth-child(7)) {
            width: 13.33%;
        }
    }
}
.custom_table3 {
    thead {
        th:not(:nth-child(4)) {
            width: 26.66%;
        }
    }
    tbody {
        td:not(:nth-child(4)) {
            width: 26.66%;
        }
    }
}
.custom_table {
    border-collapse: collapse;
    width: 100%;
    text-align: center;
    thead {
        tr {
            background: #f9fafb;
        }
        th {
            // width: 14%;
            color: #666;
            font-size: 13px;
        }
    }
    tbody {
        td {
            // width: 14%;
        }
        tr {
            border: 1px solid #ebeef5;
            padding: 5px 0;
        }
        i {
            color: #f00;
            font-size: 30px;
            cursor: pointer;
        }
    }
}
</style>
