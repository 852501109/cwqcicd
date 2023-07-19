<template>
  <div class="geo">
    <!-- <van-button type="primary" @click="getGeo">获取定位</van-button>
    <div>当前经纬度： {{ state.position }}</div>
    <van-button type="primary" @click="geo.openMap(state.position)">打开地图</van-button> -->
    <img class="banner" src="@/assets/img/banner.png" />
    <div class="nav">
      <div @click="$router.push('/filingsMotorVehicleSelf')"
        ><div class="img"><img src="@/assets/img/v2_rxdas8.png" /></div><div>车牌丢失报备</div></div
      >
      <div @click="$router.push('/lostLicensePlateReturn')"
        ><div class="img"><img src="@/assets/img/v2_rxdar0.png" /></div>遗失车牌归还</div
      >
    </div>
  </div>
  <van-overlay :show="isMap"> </van-overlay>
  <div class="footer">本服务由胶州市大数据局提供</div>
</template>

<script setup lang="ts">
  const isMap = ref(false);
</script>
<style lang="less" scoped>
  .footer {
    position: fixed;
    bottom: 70px;
    width: 100%;
    font-weight: bold;
    text-align: center;
  }
  .banner {
    width: 100%;
  }
  .flex-container() {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .nav {
    > div:nth-child(1) {
      background: linear-gradient(to right, #ffa075, #ff6b89);
      img {
        width: 60px;
      }
    }
    > div:nth-child(2) {
      background: linear-gradient(to right, #038dd0, #7bcff6);
      img {
        width: 115px;
      }
    }
    > div {
      .flex-container();
      padding-right: 120px;
      width: 90%;
      height: 150px;
      margin: 0 auto;
      margin-top: 50px;
      border-radius: 20px;
      font-size: 40px;
      font-weight: 500;
      .img {
        background: #fff;
        width: 100px;
        height: 100px;
        line-height: 100px;
        border-radius: 100px;
        .flex-container();
      }
    }
  }
</style>
