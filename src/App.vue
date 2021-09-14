<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};

</script>


<style lang="scss" scoped>
#app {
  max-width: 100vw;
  height: 100vh;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑","Regular", Arial, sans-serif;
}
</style>
