<template>
  <div id="app" :class="[
      { 'hichat-pc': device === 'pc' },
      { 'hichat-moblie': device === 'moblie' },
    ]">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>	
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>	
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.device = "moblie";
    } else {
      this.device = "pc";
      this.$confirm('PC 版本開發中', '提示', {
        showConfirmButton:false,
        showCancelButton:false,
        type: 'warning',
        center: true
      })
    }
  },
};
</script>


<style lang="scss">
#app {
  max-width: 100vw;
  // min-height: 100vh;
  // min-height: webkit-fill-available;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑","Regular", Arial, sans-serif;
}
.el-notification__content {
  margin-top: 20px;
  p {
    display: flex;
  }
  .notify-image {
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }
  .notify-content {
    .notify-title {
      display: block;
      margin-bottom: 2px;
    }
  }
}

</style>
