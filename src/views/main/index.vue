<!--
* @description
* @fileName index.vue
* @author chenwenquan
* @date 2023/07/25 10:18:03
!-->
<template>
    <div class="main-page">
        <div class="header">
            <div class="search">
                <div>
                    <el-input
                        placeholder="请输入内容"
                        v-model="searchInput"
                        place-holder="多个关键字以空格区分，未用空格区分将视为单个词汇进行搜索"
                    >
                        <el-button slot="prepend" icon="el-icon-search"></el-button>
                        <el-button slot="append" type="primary" @click="filterData">查询一下</el-button>
                    </el-input>
                </div>
            </div>
        </div>
        <div class="content">
            <div
                class="table_menu_item"
                v-for="(i, n) in tableMenu"
                :key="'table_menu_item' + n"
                @click="handleTableItem(i)"
            >
                <div class="title">{{ i.name }}</div>
                <div>
                    <span>数据总量：</span><span>{{ i.dataNum }}</span>
                </div>
                <div>
                    <span>数据更新时间：</span><span>{{ i.lastUpdateTime }}</span>
                </div>
            </div>
            <div class="api_menu_item" v-for="(i, n) in apiMenu" :key="'api_menu_item' + n" @click="handleMenuItem(i)">
                <div class="title">{{ i.name }}</div>
                <div>
                    <span>接口来源：</span><span>{{ i.source }}</span>
                </div>
                <div>
                    <span>创建时间：</span><span>{{ i.apiCreateTime }}</span>
                </div>
                <div>
                    <span>接口状态：</span><span>{{ i.state }}</span>
                </div>
            </div>
            <el-empty
                style="margin: 0 auto"
                description="暂无数据"
                v-if="tableMenu.length === 0 && apiMenu.length === 0"
            ></el-empty>
        </div>
        <div class="fixbar">
            <div>
                <i class="el-icon-phone"></i>
                <div>
                    <el-popover placement="left" title="人工支持电话" width="200" trigger="hover" content="13312131102">
                        <div slot="reference">人工支持</div>
                    </el-popover>
                </div>
            </div>
            <div>
                <i class="el-icon-question"></i>
                <div>常见问题</div>
            </div>
            <div @click="toTop">
                <i class="el-icon-top"></i>
                <div>返回顶部</div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    name: 'mainPage',
    created() {
        this._AJAX({
            url: 'common.buildOperatorMenu',
            method: 'GET',
            data: {},
        }).then((res) => {
            if (res.success) {
                this.tableMenuOrigin = res.result.tableMenu;
                this.apiMenuOrigin = res.result.apiMenu;
                this.tableMenu = res.result.tableMenu;
                this.apiMenu = res.result.apiMenu;
            }
        });
        window.onresize = function () {
            getRem(1920, 16);
        };
        this.getRem(1920, 16);
    },

    data() {
        return {
            searchInput: '',
            tableMenu: [],
            tableMenuOrigin: [],
            apiMenu: [],
            apiMenuOrigin: [],
        };
    },
    beforeDestroy() {
        var html = document.getElementsByTagName('html')[0];
        html.removeAttribute('style');
    },
    methods: {
        ...mapActions(['_AJAX']),
        filterData() {
            if (this.searchInput === '') {
                this.tableMenu = this.tableMenuOrigin;
                this.apiMenu = this.apiMenuOrigin;
            } else {
                this.tableMenu = this.tableMenuOrigin.filter((item) => item.name.includes(this.searchInput));
                this.apiMenu = this.apiMenuOrigin.filter((item) => item.name.includes(this.searchInput));
            }
        },
        handleTableItem(item) {
            window.open(`http://${window.location.host}${process.env.VUE_APP_BASE_URL}/#${item.url}`);
        },
        handleMenuItem(item) {
            window.open(`http://${window.location.host}${process.env.VUE_APP_BASE_URL}/#${item.url}`);
        },
        getRem(design_w, unit) {
            var html = document.getElementsByTagName('html')[0];
            var real_w = document.documentElement.clientWidth;
            // html.style.fontSize = (real_w / design_w) * unit + 'px';
            html.setAttribute('style', `font-size:${(real_w / design_w) * unit}px!important;`);
        },
        toTop() {
            document.querySelector('.main-page').scrollTop = 0;
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin flex($direction: row, $justify-content: flex-start, $align-items: flex-start, $flex-wrap: nowrap) {
    box-sizing: border-box;
    display: flex;
    flex-direction: $direction;
    justify-content: $justify-content;
    align-items: $align-items;
    margin: 0 auto;
    flex-wrap: $flex-wrap;
}
.fixbar {
    @include flex(column, center, center, wrap);
    text-align: center;
    position: fixed;
    right: 5rem;
    bottom: 12rem;
    border: 1px solid #98aad1;
    border-radius: 5px;
    padding: 5px;
    > div {
        @include flex(column, center, center, wrap);
        min-height: 4rem;
        font-size: 0.8rem;
        cursor: pointer;
        i {
            font-size: 1.3rem;
            margin-bottom: 0.2rem;
            color: #3570e9;
        }
    }
}
.main-page {
    width: 100vw;
    overflow: auto;

    .content {
        @include flex(row, flex-start, flex-start, wrap);
        width: 70%;
        min-height: 15vh;
        margin: 0 auto;
        margin-top: 2vh;
        border-radius: 10px;
        background: #fff;
        .api_menu_item,
        .table_menu_item {
            @include flex(column, space-evenly, flex-start, wrap);
            width: 17%;
            height: 17vh;
            border-radius: 10px;
            color: #fff;
            padding: 1vh;
            margin: 1vh 2vh;
            text-align: left;
            cursor: pointer;
            .title {
                font-size: 1.2rem;
                font-weight: bold;
                color: #fff;
            }
            :not(.title) {
                font-size: 0.8rem;
                font-weight: bold;
                color: #fff;
            }
        }
        .api_menu_item {
            background: linear-gradient(to right, #4e7ff9, #87aefc);
        }
        .table_menu_item {
            background: linear-gradient(to right, #fbb43b, #f9cd8c);
        }
    }
    .search {
        position: absolute;
        top: 10vh;
        z-index: 9;
        width: 100%;
        @include flex(row, center, center);
        > div {
            width: 50%;
        }
    }
    .header-right-item {
        float: right;
        padding: 20px;
        /deep/.announcement {
            position: relative;
            top: 9px;
            margin-right: 15px;
            cursor: pointer;
            .el-badge__content.is-fixed {
                top: -6px;
                z-index: 9;
            }

            .swing {
                display: inline-block;
                animation: swing 2s 0.5s linear infinite;
                -webkit-animation: swing 2.5s 0.5s linear infinite;
                -moz-animation: swing 2.5s 0.5s linear infinite;
                -o-animation: swing 2.5s 0.5s linear infinite;
            }
            @keyframes swing {
                0% {
                    transform: rotate(25deg);
                }
                20% {
                    transform: rotate(-20deg);
                }
                30% {
                    transform: rotate(15deg);
                }
                40% {
                    transform: rotate(-15deg);
                }
                50%,
                100% {
                    transform: rotate(0deg);
                }
            }
        }
        .header-dropdown {
            padding: 0 10px;
            cursor: pointer;

            img {
                width: 30px;
                height: 30px;
                margin-right: 5px;
                vertical-align: middle;
                border-radius: 100%;
            }
        }
    }
}
.el-popover {
    .announcement-list-item {
        margin: -12px;
        padding: 12px 0;
        li {
            padding: 5px 12px;
            cursor: pointer;
            .title {
                margin-right: 30px;
            }
            .date {
                float: right;
            }
            &:hover {
                background: #f4f5f6;
            }
            &.haveRead {
                color: #c0c4cc;
            }
        }
    }
    .operating-line {
        margin-top: 10px;
    }
}
.tenant-name-item {
    display: inline-block;
    vertical-align: top;
    margin-top: 11px;
    margin-right: 20px;
    font-size: 12px;
    .tenant-name-title {
        font-size: 12px;
        font-weight: bold;
    }
}
/deep/.audaque-more-menu__product-list ul {
    background-color: #282b30;
}
/deep/.audaque-menu {
    width: 100px !important;
    .audaque-menu__item {
        height: 45px !important;
        background: #1b1f25;
        .audaque-menu-content {
            flex-direction: row;
            justify-content: flex-start;
            width: 100%;
            padding-left: 7px;
            span {
                padding-left: 7px;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.newPwd-item {
    .el-form-item__content {
        position: relative;
    }
    .pas-hint {
        position: absolute;
        left: 0;
        bottom: -10px;
        line-height: 0;
        font-size: 12px;
    }
}
</style>
