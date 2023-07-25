<template>
    <div class="pageList-item">
        <div class="iframe-box">
            <table-title title="">
                <span class="iconfont iconfanhui1 retrun-cls" title="返回" @click="$router.push('/lists/pageList')"></span>
            </table-title>
            <!--<iframe :src="iframeHtml" scrolling="no" style="width: 100%;height: 100%;border: none;"></iframe>-->
            <adq-html-panel :url.asyc="iframeHtml" style="height: 100%;"></adq-html-panel>
        </div>
    </div>
</template>

<script>
    import TableTitle from "@/components/TableTitle"

    export default {
        data() {
            return {
                isShowList: true,
                iframeHtml: ''
            }
        },
        components: {TableTitle},
        created() {
            this.iframeHtml = this.$route.query.url;
        },
        mounted() {
        },
        destroyed() {/*销毁*/
        },
        methods: {
            initUrl(url) {
                this.isShowList = false;
                this.iframeHtml = url;
            }
        }
    }
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