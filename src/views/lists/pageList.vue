<template>
    <div class="pageList-item">
        <ul class="item-ul">
            <li><span @click="initUrl('/static/servesVersion.html')">数据库版本更新信息</span></li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            iframeHtml: '',
        };
    },
    created() {},
    mounted() {},
    destroyed() {
        /*销毁*/
    },
    methods: {
        initUrl(url) {
            let routeUrl = this.$router.resolve({
                path: '/lists/pageListEdit',
                query: {
                    url: url,
                },
            });
            window.open(routeUrl.href, '_blank');
            this.isShowList = false;
            this.iframeHtml = url;
        },
    },
};
</script>
<style lang="scss" scoped>
.pageList-item {
    .item-ul {
        > li {
            > span {
                padding: 10px 0;
                cursor: pointer;
                font-size: 16px;
            }
            &::before {
                content: '';
                width: 40px;
                border-bottom: 1px dashed #ddd;
                display: inline-block;
                margin-right: 15px;
                margin-top: -20px; //修复li的上下边距
            }
            &:not(:first-child)::before {
                content: '';
                width: 40px;
                height: 40px;
                border-left: 1px dashed #ddd;
                border-bottom: 1px dashed #ddd;
                display: inline-block;
            }
            padding: 10px 0;
            &:hover {
                > span {
                    color: #2d78f4;
                }
            }
        }
    }
    .iframe-box {
        height: 100%;
        .retrun-cls {
            cursor: pointer;
            font-size: 18px;
            margin-right: 20px;
        }
    }
}
</style>
