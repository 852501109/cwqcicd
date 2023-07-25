<template>
    <div :class="['title', 'iconfont', icon ? icon :'', none]"> <!--icon-ai-list-->
        <i class="leftBorder"></i>
        <div class="text">{{title}}</div>
        <div class="titleIcon">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'TableTitle',
        data(){
            return {
            }
        },
        props:{
            title:{
                type: String,
                default:''
            },
            icon: {
                type: String,
                default:''
            },
            none: String
        }
    }
</script>
<style lang="scss" scoped>
.title{
    display: flex;
    width: 100%;
    font-size: 14px;
    padding: 0 0 0 16px;
    color: #717783;
    line-height: 50px;
    height: 50px;
    align-items: center;
    border-bottom:1px solid #f0f0f0;
    // line-height: 45px;
    .text{
        line-height: 20px;
        font-size: 16px;
        font-weight:normal;
        color: #333333;
    }
    & div:nth-child(3){
        flex:1;
        text-align: right;
        // padding-right:20px;
    }
    .leftBorder{
        width:3px;
        height:16px;
        background:#4885D6;
        margin-right:5px;
        line-height:16px;
    }
    i{
        &.iconfont.rect-icon:nth-child(n+2)::after{
            content: '';
            position: absolute;
            height: 20px;
            border-left: 1px solid #e6e6e6;
            left: 0;
            top: 4px;
        }
    }
    .react-active{
        color:#4885d6;
    }
}
.top{
    border-top: none;
}
</style>
