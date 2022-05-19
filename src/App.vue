<template>
  <div id="app" class="hichat-moblie">
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
      navigator.userAgent.match(/Windows Phone/i) ||
      navigator.userAgent.match(/Macintosh/i)
    ) {
      this.device = "moblie";
    } else {
      this.device = "pc";
    }
    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (e._isScroller) return;
        e.preventDefault();
      },
      {
        passive: false,
      }
    );
  },
  mounted() {
    this.safariHacks();
  },
  methods: {
    safariHacks() {
      let windowsVH = window.innerHeight / 100;
      document
        .querySelector(".hichat-moblie")
        .style.setProperty("--vh", windowsVH + "px");
      window.addEventListener("resize", function () {
        document
          .querySelector(".hichat-moblie")
          .style.setProperty("--vh", windowsVH + "px");
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
