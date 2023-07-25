<template>
    <el-select
        :value="value"
        :placeholder="placeholder"
        v-loadmore="loadUser"
        :filterable="filterable"
        :multiple="multiple"
        :clearable="clearable"
        :remote="remote"
        reserve-keyword
        :remote-method="loadUserList"
        :loading="loading"
        @input="change($event)"
        @visible-change="visibleChange"
        :disabled="disabled"
    >
        <el-option :label="item.name" :value="item.id" v-for="item in userList" :key="item.id">
            <span style="margin-right: 8px; float: left">{{ item.name }} </span>
            <!--            <span style="float: left; color: #999">( {{ item.account }} )</span>-->
            <span style="margin-left: 8px; float: right; color: #8492a6; font-size: 13px">
                <span v-html="$audaquePreventXss(dealWithDepName(item.depNames), $xssWhitelist)"></span>
            </span>
        </el-option>
    </el-select>
</template>
<script>
import { mapActions } from 'vuex';
import store from '@/store';
export default {
    name: 'adqUserListComponent',
    data() {
        return {
            loading: false,
            userList: [],
            userTotal: 0,
            // userParams: {
            //     page: 1,
            //     rows: 200,
            //     name: null,
            //     includeDep: true,
            // },
        };
    },
    props: {
        value: {
            type: [String, Array, Number],
        },
        placeholder: {
            default: '请选择',
            type: String,
        },
        disabled: {
            default: () => {
                return false;
            },
            type: Boolean,
        },
        /*是否可多选*/
        multiple: {
            default: () => {
                return true;
            },
            type: Boolean,
        },
        /*是否可清空*/
        clearable: {
            default: () => {
                return true;
            },
            type: Boolean,
        },
        /*是否可搜索*/
        filterable: {
            default: () => {
                return true;
            },
            type: Boolean,
        },
        /*是否为远程搜索	*/
        remote: {
            default: () => {
                return true;
            },
            type: Boolean,
        },
        userParams: {
            default: () => {
                return {
                    page: 1,
                    rows: 200,
                    name: null,
                    includeDep: true,
                };
            },
            type: Object,
        },
    },
    created() {},
    mounted() {
        this.loadUserList(null);
    },
    methods: {
        ...mapActions(['_AJAX']),
        change(val) {
            this.$emit('input', val);
        },
        visibleChange(isVisible) {
            if (!isVisible) {
                this.loadUserList(null);
            }
        },
        dealWithDepName(depNames) {
            let arr = [];
            if (/[，,]/g.test(depNames)) {
                arr = depNames.split(',');
                let allDepName = arr.join(''); //所有的部门
                let str = `<span title="${allDepName}">${arr.length > 2 ? arr[0] + '...' : arr[0]}</span>`;
                return str;
            } else {
                return `<span> ${depNames} </span>`;
            }
        },
        /*获得用户列表*/
        loadUserList(name) {
            /*用户列表*/
            this.userParams.name = name;
            this._AJAX({
                url: 'user.userList',
                method: 'GET',
                data: this.userParams,
            }).then((res) => {
                if (res.code == 0) {
                    this.userList = res.rows;
                    this.$emit('update:userList', this.userList);
                    this.userTotal = res.total;
                    store.state._userList = res.rows;
                }
            });
        },
        /*当用户选择下拉到滚动条底端时自动去请求数据*/
        loadUser() {
            let totalPage = Math.ceil(this.userTotal / this.userParams.rows); //后端限制一次最大只能请求200条数据  当超过时需要在下拉到底部重新请求
            if (this.userParams.page < totalPage) {
                ++this.userParams.page;
                this._AJAX({
                    url: 'user.userList',
                    method: 'GET',
                    data: this.userParams,
                }).then((res) => {
                    if (res.code == 0) {
                        this.userList = this.userList.concat(res.rows);
                    }
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.el-select-dropdown__item {
    display: inherit !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    display: none;
}
</style>
