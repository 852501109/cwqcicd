<template>
    <div class="process-item">
        <div class="process-box" id="processBox">
            <img src="../../assets/images/demo/process-iocn.png" alt="" class="process-bg">
            <div class="icon-list" :style="{top:icon_1_top,left:icon_1_left}">
                <img src="../../assets/images/demo/process-iocn-1.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="icon-list" :style="{top:icon_2_top,left:icon_2_left}">
                <img src="../../assets/images/demo/process-iocn-2.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="icon-list" :style="{top:icon_3_top,left:icon_3_left}">
                <img src="../../assets/images/demo/process-iocn-3.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="icon-list" :style="{top:icon_4_top,left:icon_4_left}">
                <img src="../../assets/images/demo/process-iocn-4.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="icon-list" :style="{top:icon_5_top,left:icon_5_left}">
                <img src="../../assets/images/demo/process-iocn-5.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="icon-list" :style="{top:icon_6_top,left:icon_6_left}">
                <img src="../../assets/images/demo/process-iocn-6.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
            <div class="icon-list" :style="{top:icon_7_top,left:icon_7_left}">
                <img src="../../assets/images/demo/process-iocn-7.png" alt=""
                     :style="{transform:'scale('+imgProportion+')'}">
                <div class="prover-item">
                    <ul class="prover-item-list">
                        <li>元数据</li>
                        <li>数据标准</li>
                        <li>数据质量</li>
                        <li>数据安全</li>
                    </ul>
                    <div class="arrow"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                imgProportion: 1,
                icon_1_top: null,
                icon_1_left: null,
                icon_2_top: null,
                icon_2_left: null,
                icon_3_top: null,
                icon_3_left: null,
                icon_4_top: null,
                icon_4_left: null,
                icon_5_top: null,
                icon_5_left: null,
                icon_6_top: null,
                icon_6_left: null,
                icon_7_top: null,
                icon_7_left: null,
            }
        },
        created() {
            window.addEventListener('resize', this.loadImgWidth)
        },
        mounted() {
            this.loadImgWidth();
        },
        destroyed(){/*销毁*/
            window.removeEventListener('resize',this.loadImgWidth)
        },
        methods: {
            loadImgWidth() {
                let _this = this;
                let img = new Image();
                img.src = require('@/assets/images/demo/process-iocn-1.png');
                img.onload = function () {
                    let W = document.getElementById('processBox').offsetWidth;//外框的宽度
                    let H = document.getElementById('processBox').offsetHeight;//外框的高度
                    _this.imgProportion = (W / 1084) > 1 ? 1 : (W / 1084);//图标的缩放比

                    let img_1_w = img.width;
                    let img_1_h = img.height;
                    _this.icon_1_top = H / 2 - img_1_h / 2 + 'px';
                    _this.icon_1_left = W / 2 - img_1_w / 2 + 'px';

                    _this.icon_2_top = -img_1_h / 2 + 'px';
                    _this.icon_2_left = W / 4 - img_1_w / 2 + 'px';

                    _this.icon_3_top = -img_1_h / 2 + 'px';
                    _this.icon_3_left = 3 * W / 4 - img_1_w / 2 + 'px';

                    _this.icon_4_top = H / 2 - img_1_w / 2 - 50 + 'px';
                    _this.icon_4_left = W - img_1_w / 2 - 50 + 'px';

                    _this.icon_5_top = H - img_1_h / 2 - 70 + 'px';
                    _this.icon_5_left = 3 * W / 4 - img_1_w / 2 + 'px';

                    _this.icon_6_top = H - img_1_h / 2 - 70 + 'px';
                    _this.icon_6_left = W / 4 - img_1_w / 2 + 'px';

                    _this.icon_7_top = H / 2 - img_1_h / 2 - 50 + 'px';
                    _this.icon_7_left = -img_1_w / 2 + 50 + 'px';
                    _this.$forceUpdate();
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .process-item {
        display: flex;
        justify-content: center;
        align-items: center;
        .process-box {
            width: 65%;
            height: 70%;
            max-height: 700px;
            max-width: 1250px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .process-bg {
                width: 100%;
                height: 100%;
            }
            .icon-list {
                cursor: pointer;
                position: absolute;
                transition: all .6s;
                .prover-item {
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    z-index: 999;
                    width: auto;
                    background: #fff;
                    box-shadow: 0 2px 10px 0 #D2E9FF;
                    border-radius: 6px;
                    padding: 10px 20px;
                    .prover-item-list {
                        margin: 0;
                        padding: 0;
                        li {
                            line-height: 20px;
                            padding: 5px 0;
                        }
                    }
                    .arrow {
                        left: -20px;
                        top: 20%;
                        width: 0;
                        height: 0;
                        border: 10px solid;
                        border-color: transparent #fff transparent transparent;
                        position: absolute;
                    }
                }
                &:hover {
                    transform: scale(1.1);
                    .prover-item {
                        display: block;
                    }
                }
            }

        }
    }
</style>