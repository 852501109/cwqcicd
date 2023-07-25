<template>
    <div class="title">
        <div class="left">{{title}}</div>
        <div class="center"></div>
        <div class="right">
            <i class="iconfont iconfanhui" @click="$router.go(-1)"></i>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'EditTab',
        data(){
            return {
            }
        },
        props:{
            title:{
                type: String,
                default:''
            }
        }
    }
</script>
<style lang="scss" scoped>
.title{
    display: flex;
    width: 100%;
    font-size: 14px;
    text-align: left;
    //padding:  0 15px;
    background-color: #f7f7f8;
    border: 1px solid #E1dfdc;
    border-bottom: none;
    line-height: 42px;
    & div:nth-child(2){
        flex:1;
        text-align: right;
    }
    .left{
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }
    .center{
        border-bottom: 1px solid #E1dfdc;
    }
    .right{
        padding-right: 20px;
        border-bottom: 1px solid #E1dfdc;
        .iconfont{
            font-size: 18px;
        }
    }
}
</style>
