<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300&display=swap');
#app {
  max-width: 100vw;
  height: 100vh;
  // font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
  //   "Microsoft YaHei", "微软雅黑","Regular", Arial, sans-serif;
  font-family: 'Noto Sans TC', sans-serif;
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
.home-footer{
  width: 100vw;
  background-color: #FFF;
  position:fixed;
  bottom:0;
  display: flex;
  justify-content: space-between;
  padding:0.5em 0;
  .home-footer-btn{
    text-align: center;
    font-size: 12px;
    padding: 0 4em;
    span{
      display:block;
    }
    img{
      margin-bottom: 5px;
      height:2.2em;
    }
  }
}
</style>
