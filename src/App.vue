<template>
  <div id="app" :class="[
      { 'hichat-pc': device === 'pc' },
      { 'hichat-moblie': device === 'moblie' },
    ]">
    <keep-alive>
      <router-view></router-view>	
    </keep-alive>
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
    }
    localStorage.setItem("device", this.device)
    // if (navigator.userAgent.toLocaleLowerCase().includes('iphone')) {
    //   // @ts-ignore
    //   this.intervalFlag = setInterval(() => {
    //     document.querySelector('body').scrollTop = 0;
    //   }, 200);
    // }
    // setTimeout(() => {
    //   if (navigator.userAgent.toLowerCase().includes('iphone')) {
    //     document.querySelector('#app').addEventListener('touchmove', (e) => {
    //       e.preventDefault();
    //     });
    //   }
    // }, 100);
  },
  mounted() {
    // // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    // let vh = window.innerHeight * 0.01
    // // Then we set the value in the --vh custom property to the root of the document 
    // document.documentElement.style.setProperty('--vh', `${vh}px`)
    // // alert(vh)
    // // We listen to the resize event
    // window.addEventListener('resize', () => {
    //   // We execute the same script as before
    //   let vh = window.innerHeight * 0.01
    //   // alert(vh)
    //   document.documentElement.style.setProperty('--vh', `${vh}px`)
    // })
    if(this.device === "moblie") this.safariHacks();
  },
  methods: {
    safariHacks() {
      let windowsVH = window.innerHeight / 100;
      document.querySelector('.hichat-moblie').style.setProperty('--vh', windowsVH + 'px');
      window.addEventListener('resize', function() {
          document.querySelector('.hichat-moblie').style.setProperty('--vh', windowsVH + 'px');
      });
    }
  },
};
</script>


<style lang="scss">
#app {
  max-width: 100vw;
  // height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  // height: calc(var(--vh, 1vh) * 100);
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
