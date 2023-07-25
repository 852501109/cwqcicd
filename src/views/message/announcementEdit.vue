<template>
    <audaque-table-list-page>
        <template slot="title">
            <audaque-table-title :title="$route.meta.pageName">
                <i class="iconfont iconfanhui1 audaque-rect-icon" @click="returnPrevPage"> 返回</i>
            </audaque-table-title>
        </template>
        <template>
            <div>
                <div class="title">{{ ruleForm.title }}</div>
                <div class="date-item">公告时间：{{ publics.formatTime(ruleForm.publishTime, 'Y-M-D h:m:s') }}</div>
                <div class="content-item" v-html="ruleForm.content"></div>
            </div>
        </template>
    </audaque-table-list-page>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            searchList: {
                page: 1,
                rows: 10,
                type: 1, //公告类型
                sendStatus: 1, //已发布
            },
            ruleForm: {},
        };
    },
    watch: {
        $route: {
            handler: function (val, oldVal) {
                this.initData();
            },
            deep: true,
        },
    },
    created() {
        this.initData();
    },
    mounted() {},
    methods: {
        ...mapActions(['_AJAX']),
        initData() {
            this._AJAX({
                url: 'sys.message.notice.id',
                method: 'GET',
                data: {
                    id: this.$route.query.id,
                    needSendList: 0,
                },
            }).then((res) => {
                if (res.code == 0) {
                    let result = res.result;
                    this.ruleForm = result;
                    /*设置为已读*/
                    this._AJAX({
                        url: 'sys.message.read',
                        method: 'GET',
                        data: {
                            messageCode: this.$route.query.uuidCode,
                            readFlag: 1,
                        },
                    }).then((res) => {
                        this.$store.state.news.isUpdateAnnouncement = new Date(); //更新头部导航请求公告列表信息
                    });
                }
            });
        },
        returnPrevPage() {
            this.$router.push({
                path: '/index/announcementList',
                query: {},
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.title {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    line-height: 30px;
}
.date-item {
    text-align: right;
    font-size: 14px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
}
.content-item {
    padding: 15px 0;
}
</style>
