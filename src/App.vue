<template>
  <div id="app">
    <sport-chat-room></sport-chat-room>
  </div>
</template>

<script>
import sportChatRoom from "./views/Chat/Chat.vue";
export default {
  name: "App",
  components: {
    sportChatRoom,
  },
};
</script>


<style lang="scss">
#app {
  max-width: 100vw;
  height: 100vh;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑","Regular", Arial, sans-serif;
}
</style>
