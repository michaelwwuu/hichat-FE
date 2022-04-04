<template>
  <div id="app" :class="[
      { 'hichat-pc': device === 'pc' },
      { 'hichat-moblie': device === 'moblie' },
    ]"
    >
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>    
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>    
  </div>
</template>

<script>
import Push from 'push.js'
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
      navigator.userAgent.match(/Windows Phone/i) || 
      navigator.userAgent.match(/Macintosh/i)
    ) {
      this.device = "moblie";
    } else {
      this.device = "pc";
    }
    localStorage.setItem("device", this.device)
    
    document.body.addEventListener('touchmove', (e) => {
      if (e._isScroller) return;
      e.preventDefault()
    }, {
      passive: false
    })
  },
  mounted() {
    if(this.device === "moblie") this.safariHacks();
    this.pushMessage()
  },
  methods: {
    safariHacks() {
      let windowsVH = window.innerHeight / 100;
      document.querySelector('.hichat-moblie').style.setProperty('--vh', windowsVH + 'px');
      window.addEventListener('resize', function() {
          document.querySelector('.hichat-moblie').style.setProperty('--vh', windowsVH + 'px');
      });
    },
    pushMessage(){
      Push.Permission.request();
      Push.create("Hello world!", {
        body: "How's it hangin'?",
        icon: '/icon.png',
        timeout: 4000,
        onClick: function (even) {
          console.log(even)
            window.focus();
            this.close();
        }
      });
    }
  },
};
</script>


<style lang="scss">
html,body {
  height: 100vh;
  min-height: -webkit-fill-available; 
  overflow: hidden;
  background-color: #eaf5fa;
}
#app {
  max-width: 100vw;
  height: 100vh;
  min-height: -webkit-fill-available; 
  overflow: hidden;
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
