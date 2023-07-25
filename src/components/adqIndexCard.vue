<template>
    <el-card class="box-card content-card">
        <div slot="header" class="clearfix content-title">
            <span>{{title}}</span>
            <a v-if="url!=''" class="content-view iconfont iconmore operate" @click="gotoUrl"></a>
        </div>
        <div class="item content-value">
            {{value}}
        </div>
        <div class="content-corner">
            <span class="item content-corner-title">{{cornerTitle}}</span>
            <span class="item content-corner-value">{{cornerValue}}</span>
        </div>
    </el-card>
</template>
<script>
    export default {
        name: 'AdqIndexCard',
        data() {
            return {
            }
        },
        props:{
            title:{
                type: String,
                default:''
            },
            url:{
                type: String,
                default:''
            },
            value:{
                type: String,
                default:''
            },
            cornerTitle:{
                type: String,
                default:''
            },
            cornerValue:{
                type: String,
                default:''
            },
            none: String
        },
        methods: {
            gotoUrl() {
                this.$router.push(this.url);
            },
        },
    }
</script>
<style lang="scss" scoped>
    .content-title {
        font-size: 17px;
        font-family: 微软雅黑;
        font-weight: bold;
    }

    .content-view {
        float: right;
        font-size: 13px;
    }

    .content-value {
        font-size: 50px;
        font-family: lets-go-digital;
        text-align: center;
    }

    .content-corner {
        text-align: right;
    }

    .content-corner-title {
        font-size: 15px;
        font-family: 微软雅黑;
    }

    .content-corner-value {
        font-size: 25px;
        font-family: lets-go-digital;
        font-weight: bold;
        padding: 0 8px;
    }

    .content-card {
        margin: 2% 2%;
    }

    .item {
        margin-bottom: 20px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
</style>
