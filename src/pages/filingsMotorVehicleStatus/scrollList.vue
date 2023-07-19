<template>
  <div class="title">
    <div class="list-item">
      <div>车牌号码</div>
      <div>是否已被领取</div>
      <div>发现时间</div>
    </div>
  </div>
  <div class="scroll-content" ref="scrollContent">
    <div v-for="(item, index) in items" :key="index" class="list-item">
      <div>{{ item.license }}</div>
      <div>
        <span :style="{ color: item.status === 1 ? '#07c160' : '#ff976a' }">{{
          item.status === 1 ? '已领取' : '未领取'
        }}</span>
      </div>
      <div>{{ item.createTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Ref } from 'vue';
  interface licenseInterface {
    license: string;
    status: number;
    createTime: string;
  }
  const items = ref<licenseInterface[]>([]);
  const interval = ref<NodeJS.Timer | null>(null);
  const scrollContent: Ref<HTMLElement | null> = ref(null);

  onMounted(() => {
    for (let i = 0; i < 100; i++) {
      items.value.push({ license: `鲁B**${i}`, status: 1, createTime: '2023年7月四号' });
    }
    interval.value = setInterval(() => {
      const dom = scrollContent.value;
      if (dom === null || dom.scrollTop === null || dom.scrollHeight === null) return;
      const atBottom = dom.scrollTop + dom.clientHeight >= dom.scrollHeight;
      if (!atBottom) dom.scrollTop += 1;
      else dom.scrollTop = 0;
    }, 25);
  });
  onBeforeUnmount(() => {
    if (interval.value) clearInterval(interval.value);
  });
</script>

<style scoped lang="less">
  .flex(@justify) {
    display: flex;
    justify-content: @justify;
    align-items: center;
  }
  .scroll-content {
    height: 55vh; /* 定义容器高度 */
    overflow: hidden; /* 隐藏滚动条 */
  }

  .list-item {
    height: 100px; /* 定义列表项高度 */
  }

  @keyframes scrollAnimation {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }
  .title {
    width: 100%;
    padding: 0 50px;
    .list-item {
      height: 100px;
      line-height: 100px;
    }
  }
  .list-item {
    .flex(space-between);
    text-align: center;
    > div:nth-child(1) {
      width: 20%;
    }
    > div:nth-child(2) {
      width: 40%;
    }
    > div:nth-child(3) {
      width: 40%;
    }
  }
</style>
