<template>
    <div class="iframe-item">
        <div v-html="htmls"></div>
    </div>
</template>
<style lang="scss" scoped>
    .iframe-item {
        padding: 15px;
    }
</style>
<script>
    import axios from 'axios'

    export default {
        // 使用时请使用 :url.sync=""传值
        props: {
            url: {
                required: true
            }
        },
        data() {
            return {
                htmls: ''
            }
        },
        watch: {
            url(value) {
                this.load(value)
            }
        },
        mounted() {
            this.load(this.url)
        },
        methods: {
            load(url) {
                if (url && url.length > 0) {
                    let param = {accept: 'text/html, text/plain'};
                    axios.get(url, param).then((response) => {
                        // 处理HTML显示
                        this.htmls = response.data;
                    }).catch(() => {
                        this.htmls = '';
                        this.$AudaqueToast.warn({
                            template: `加载失败`,
                            methods: {
                                okEvent() {
                                }
                            }
                        });
                    })
                }
            }
        }
    }
</script>