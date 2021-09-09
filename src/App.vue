<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapMutations } from "vuex";
export default {
  name: "App",
  created() {
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    handleGetMessage(msg) {
      // 一些全局的動作可以放在這裡
      this.setWsRes(JSON.parse(msg));
    }
  }
};
</script>


<style lang="scss" scoped>
#app {
  max-width: 100vw;
  height: 100vh;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
