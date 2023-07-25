<template>
  <div>
    <a ref="capitals" target="_blank" :href="modelUrl"></a>
  </div>
</template>
<script>
export default {
  name: "model",
  data() {
    return {
      modelUrl: window.modelManageUrl
    }
  },
  methods: {
    redirctPage() {
      this.$refs.capitals.click();
    },
  },
  mounted() {
    this.redirctPage();
  }
}
</script>
