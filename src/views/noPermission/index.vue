<template>
    <div class="no-permission-item">
        <div class="content">
            <img src="../../assets/images/noPermission-bg.png" alt="" />
            <div class="title">你没有权限访问该页面</div>
            <div>
                <el-button class="btn goto-index-btn" @click="$router.push('/index')">首页</el-button>
                <el-button class="btn back" @click="$router.go(-2)">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'noPermission',
    data() {
        return {};
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
.no-permission-item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
        text-align: center;
        .title {
            font-size: 18px;
            color: #333;
            font-weight: bold;
            margin: 30px 0;
            font-family: PingFangSC-Medium;
        }
        .btn {
            width: 100px;
        }
        .goto-index-btn {
            background: #5394eb;
            color: #fff;
        }
        .back {
            border: 1px solid #5394eb;
            color: #5394eb;
        }
    }
}
</style>
