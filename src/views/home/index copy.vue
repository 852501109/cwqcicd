<template>
    <div class="homePage" :style="{ padding: isShowIframe ? '0' : '25px 20px' }">
        <template v-if="isShowIframe">
            <iframe
                name="containerIframe"
                id="containerframe"
                :src="systemSrc"
                frameborder="0"
                width="100%"
                height="100%"
                scrolling="auto"
            ></iframe>
        </template>
        <template v-else>
            <!-- 租户切换 -->
            <div v-if="tenantMode && layoutTheme === 5 && tenantList.length > 0" class="tenant-layout">
                <span class="title-box">切换租户</span>
                <el-select style="width: 50%" v-model="defTenant" @change="onChangeTenant" placeholder="请选择租户">
                    <el-option v-for="item in tenantList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <!--公告-->
            <div class="home-main">
                <div class="advert-top" v-if="publishedAnnouncementList && publishedAnnouncementList.total > 0">
                    <div class="ico-horn">
                        <!-- 喇叭图标 -->
                        <span class="iconfont icongonggao"></span>
                    </div>
                    <!--                <div class="right-btn" v-if="publishedAnnouncementList.total > 5">-->
                    <!--                    <span class="view-all" @click="viewAll">查看更多</span>-->
                    <!--                </div>-->
                    <!-- 滚动文字区域 -->
                    <div class="marquee-wrap">
                        <ul class="marquee-box" id="marquee-box">
                            <!-- 给第一个设置Id 方便计算文字宽度 -->
                            <template v-for="(item, index) in publishedAnnouncementList.rows">
                                <li
                                    class="marquee-list"
                                    :id="index == 1 ? 'marquee' : ''"
                                    :key="index"
                                    v-if="index < 5"
                                    @click="clickTableRow(item)"
                                >
                                    <span class="title"
                                        >{{ item.title }}【{{
                                            publics.formatTime(item.publishTime, 'Y-M-D h:m:s')
                                        }}】</span
                                    >
                                    <!--                            <span class="date"></span>-->
                                </li>
                            </template>
                        </ul>
                    </div>
                </div>
                <ul class="item-box">
                    <li class="item-list" v-for="item in platFormList" :key="item.id">
                        <div class="title">
                            <span class="main-title">{{ item.name }}</span>
                            <span class="title-info">{{ item.remark }}</span>
                        </div>
                        <div class="item-info">
                            <ul class="item-info-list">
                                <li v-for="(item1, index) in item.systems" :key="item1.id" @click="targetUrl(item1)">
                                    <el-tooltip placement="bottom" popper-class="my-popper-cls">
                                        <div slot="content">
                                            <span>{{ item1.remark }}</span>
                                            <div>
                                                <el-button class="tooltip-btn" @click="dowmFile(item1.userGuide)"
                                                    >下载用户手册
                                                </el-button>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="item-icon">
                                                <img
                                                    v-if="item1.imgurl"
                                                    width="44"
                                                    height="44"
                                                    :src="item1.imgurl"
                                                    alt=""
                                                />
                                                <!--占位-->
                                                <span
                                                    v-else
                                                    style="display: inline-block; width: 44px; height: 44px"
                                                ></span>
                                            </div>
                                            <div class="item-info-list-name">{{ item1.name }}</div>
                                        </div>
                                    </el-tooltip>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div ref="downDiv" style="display: none"></div>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
    data() {
        return {
            layoutTheme: window.layoutTheme, //主布局框架样式
            defTenant: '', //租户id
            tenantList: [], //租户列表
            BlobArray: [],
            timer: null,
            clientHeight: null, //可是范围的高度
            systemSrc: null,
            isShowIframe: false,
        };
    },
    watch: {
        platFormList(data) {
            data.forEach((item, index) => {
                item.systems.forEach((item1, i) => {
                    if (item1.smallIcon) {
                        this.LOADOBJ(item1.smallIcon).then((res) => {
                            let url =
                                res.extName === 'svg'
                                    ? 'data:image/svg+xml;base64,' + res.contentBase64
                                    : 'data:image/*;base64,' + res.contentBase64;
                            // item1.imgurl = url;
                            this.$set(this.platFormList[index].systems[i], 'imgurl', url);
                            // this.$forceUpdate();
                        });
                    } else {
                        item1.imgurl = require('@/assets/images/caseSystem.png');
                    }
                });
            });
            // this.$forceUpdate();
        },
        jumpUrl(val) {
            this.externalSystem();
        },
    },
    created() {
        /*当用户没有权限时重新去登录。登录后跳转回原来的页面而不是首页*/
        let WEBKIT_MODULE = localStorage.getItem('WEBKIT_MODULE');
        if (WEBKIT_MODULE) {
            localStorage.removeItem('WEBKIT_MODULE');
            this.$router.push({
                path: WEBKIT_MODULE,
            });
        }
        /*获得系统列表*/
        this.MYPLATFORM({ page: 1, row: 10000 });
        this.GET_ACCOUNT_INFO()
            .then((res) => {
                if (res.result.pwdExpired) {
                    this.$AudaqueToast.tip({
                        template: res.result.pwdExpired,
                        methods: {
                            okEvent() {},
                        },
                    });
                }
            })
            .catch((err) => {});
        this.handleTenant();
        this.externalSystem();
    },
    mounted() {
        // window.onresize = () => {
        //     this.getClientHeight();
        // };
        // this.getClientHeight();
        setTimeout(() => {
            this.runMarquee();
        }, 1000);
    },
    computed: {
        ...mapState('webkit', ['userInfo', 'tenantMode', 'myAppList', 'largeImgUrlList']),
        ...mapState('home', ['jumpUrl']),
        ...mapState('webkit', ['userInfo', 'tenantMode', 'myAppList', 'largeImgUrlList']),
        ...mapState('home', ['jumpUrl']),
        ...mapState(['platFormList']),
        ...mapState('news', ['isUpdateAnnouncement', 'publishedAnnouncementList', 'unreadAnnouncementTotal']),
    },
    methods: {
        ...mapMutations('webkit', ['SETIMGURL', 'SETLARGEURL']),
        ...mapActions('webkit', ['myApp', 'GET_ACCOUNT_INFO', 'getBaseInfo', 'modifyBaseInfo']),
        ...mapActions('user', ['LOGOUT']),
        ...mapActions(['LOADIMG', 'MYPLATFORM', 'LOADOBJ']),
        // ...mapActions('news', ['GET_PUBLISHED_ANNOUNCEMENT_LIST']),
        /*
         * 获取可视范围的高度
         * */
        getClientHeight() {
            this.clientHeight = document.documentElement.clientHeight;
        },

        handleTenant() {
            this.getBaseInfo().then((data) => {
                //租户列表
                this.tenantList = data.tenantList || [];
                this.defTenant = data.myUser.defTenant;
            });
        },

        onChangeTenant(val) {
            this.requestChangeTenant(val);
        },

        /**
         * 切换租户
         */
        requestChangeTenant(val) {
            const data = {
                defTenant: val,
                name: this.userInfo.myUser.name, //姓名
                email: this.userInfo.myUser.email, //邮箱
                phone: this.userInfo.myUser.phone,
            };
            let _this = this;
            this.modifyBaseInfo(data).then(() => {
                this.$AudaqueToast.tip({
                    template: '操作成功，重新登录后生效',
                    methods: {
                        okEvent() {
                            _this.LOGOUT();
                        },
                    },
                });
            });
        },

        /*
         * 点击左上角图标跳转到外部系统的处理
         * */
        externalSystem() {
            if (this.$route.query.jumpWay && this.$route.query.jumpWay == 3 && this.jumpUrl) {
                this.systemSrc = this.jumpUrl;
                this.isShowIframe = true;
            }
        },

        clickTableRow(row) {
            this.$router.push({
                path: '/index/announcementEdit',
                query: { id: row.id, uuidCode: row.uuidCode },
            });
        },
        /*下载用户手册*/
        dowmFile(key) {
            if (key) {
                let downFile = document.createElement('iframe');
                downFile.src = window.urlConfig + '/file/down/' + key + '.go';
                this.$refs.downDiv.append(downFile);
            }
        },
        targetUrl(item) {
            //子系统的跳转方式
            if (window.jumpWay === 2) {
                window.location.href = item.mainUrl;
            } else if (window.jumpWay === 3) {
                //外部系统
                if (item.appType == 2) {
                    //iframe内嵌的方式
                    this.isShowIframe = true;
                    this.systemSrc = item.mainUrl;
                } else {
                    // 内部系统
                    window.location.href = item.mainUrl;
                }
            } else {
                window.open(item.mainUrl, '_blank');
            }
        },
        /*查看更多公告*/
        viewAll() {
            this.$router.push({
                path: '/index/announcementList',
                query: {},
            });
        },
        /*公告轮播*/
        runMarquee() {
            if (!document.getElementById('marquee')) {
                return false;
            }
            // 获取文字 计算后宽度
            let width = document.getElementById('marquee-box').getBoundingClientRect().width,
                marquee = document.getElementById('marquee-box'),
                disx = 0; // 位移距离
            //设置位移
            setInterval(() => {
                disx--; // disx-=1; 滚动步长
                if (-disx >= width) {
                    disx = 40; // 如果位移超过文字宽度，则回到起点  marquee-list的margin值
                }
                // marquee.style.transform = 'translateX(' + disx + 'px)'
                marquee.style.left = disx + 'px';
            }, 30); //滚动速度
        },
    },
};
</script>
<style scoped lang="scss">
.homePage {
    padding: 25px 20px;
    height: 100%;
    .tenant-layout {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .title-box {
            font-size: 14px;
            padding-right: 8px;
        }
    }
    .home-main {
        .item-box {
            padding: 0;
            margin: 0;
            .item-list {
                margin-bottom: 30px;
                .title {
                    height: 50px;
                    line-height: 50px;
                    padding: 0 20px;
                    background: #f7f9fc;
                    display: flex;
                    .main-title {
                        font-size: 16px;
                        color: #333;
                        margin-right: 40px;
                        font-weight: bold;
                        white-space: nowrap;
                    }
                    .title-info {
                        font-size: 14px;
                        color: #a8a9ac;
                        line-height: 20px;
                        align-items: center;
                        justify-content: center;
                        display: flex;
                    }
                }
                .item-info {
                    background: #fff;
                    border-radius: 0 0 4px 4px;
                    margin-bottom: 20px;
                    .item-info-list {
                        padding: 0;
                        margin: 0;
                        height: 100%;
                        display: flex;
                        flex: 1;
                        justify-content: flex-start;
                        align-items: center;
                        flex-wrap: wrap; //换行
                        > li {
                            display: inline-block;
                            text-align: center;
                            padding: 30px 20px 0 20px;
                            margin-bottom: 30px;
                            cursor: pointer;
                            min-width: 175px;
                            .item-icon {
                                margin-bottom: 13px;
                            }
                            .item-info-list-name {
                                color: #484e5c;
                                font-size: 14px;
                                font-weight: 600;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
/*公告*/
.advert-top {
    position: relative;
    display: flex;
    width: 100%;
    height: 32px;
    margin-bottom: 10px;
    background: #fff;
    box-shadow: 0 1px 14px 0 rgba(213, 219, 236, 0.5);
    color: #ed6a0c;
    font-size: 13px;
    align-items: center;
    .ico-horn {
        display: flex;
        width: 40px;
        height: 100%;
        justify-content: center;
        align-items: center;
        .iconfont {
            font-size: 18px;
        }
    }
    .right-btn {
        position: absolute;
        right: 0;
        z-index: 99;
        background: #fff;
        padding: 0 20px;
        height: 100%;
        .view-all {
            display: inline-block;
            width: 60px;
            height: 20px;
            margin-top: 6px;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            color: #ed6a0c;
            border: 1px solid #ed6a0c;
            border-radius: 2px;
            cursor: pointer;
        }
    }
    .marquee-wrap {
        position: relative;
        display: flex;
        overflow: hidden;
        width: 100%;
        height: 100%;
        .marquee-box {
            position: absolute;
            top: 50%;
            display: flex;
            white-space: nowrap;
            transform: translateY(-50%);
            .marquee-list {
                cursor: pointer;
                margin-right: 10px;
                span {
                    padding: 0 15px;
                }
            }
        }
    }
}

/*修改悬浮窗的样式*/
.my-popper-cls {
    /*max-width: 260px;*/
    &.is-dark {
        background: #ffffff;
        box-shadow: 0 2px 2px 0 #e2eaf1;
        font-size: 14px;
        color: #666666;
        padding: 10px 20px;
        letter-spacing: 0;
        line-height: 20px;
    }
    .tooltip-btn {
        margin-top: 20px;
        width: 100%;
        background: #53a7f8;
        height: 38px;
        border-radius: 0;
        & > span {
            font-size: 14px;
            color: #fff !important;
        }
    }
    .popper__arrow,
    .popper__arrow::after,
    .popper__arrow {
        /*border-bottom-color: #ffffff !important;*/
        /*border-top-color: #ffffff !important;*/
        /*border-right-color: #f6f6f6 !important;*/
        box-shadow: 0 2px 10px 0 #e2eaf1;
    }
}
</style>
