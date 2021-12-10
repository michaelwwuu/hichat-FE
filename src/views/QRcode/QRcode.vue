<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title">掃碼QRcode</span>
      <div class="home-add-user"></div>
    </div>
    <div class="scroll-container">
      <Scaner
        v-on:code-scanned="codeScanned"
        v-on:error-captured="errorCaptured"
        :stop-on-scanned="true"
        :draw-on-found="true"
        :responsive="false"
      />
    </div>
  </div>
</template>

<script>
import Scaner from "./../../components/Scaner.vue";

export default {
  name: "Scan",
  components: {
    Scaner,
  },
  data() {
    return {
      errorMessage: "",
      scanned: "",
    };
  },
  methods: {
    back() {
      this.$router.back(-1);
    },
    codeScanned(code) {
      this.scanned = code;
      window.location.replace(code);
    },
    errorCaptured(error) {
      switch (error.name) {
        case "NotAllowedError":
          this.errorMessage = "Camera permission denied.";
          break;
        case "NotFoundError":
          this.errorMessage = "There is no connected camera.";
          break;
        case "NotSupportedError":
          this.errorMessage =
            "Seems like this page is served in non-secure context.";
          break;
        case "NotReadableError":
          this.errorMessage =
            "Couldn't access your camera. Is it already in use?";
          break;
        case "OverconstrainedError":
          this.errorMessage = "Constraints don't match any installed camera.";
          break;
        default:
          this.errorMessage = "UNKNOWN ERROR: " + error.message;
      }
      this.$message({ message: "相机调用失败", type: "error" });
    },
  },
  mounted() {
    var str = navigator.userAgent.toLowerCase();
    var ver = str.match(/cpu iphone os (.*?) like mac os/);
    if (ver && ver[1].replace(/_/g, ".") < "10.3.3")
      this.$message({ message: "相机调用失败", type: "error" });
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  position: fixed;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .home-header-title {
      margin: 0 auto;
      color: #10686e;
      font-weight: 600;
    }
    .home-add-user {
      width: 2em;
      height: 2em;
    }
  }
}
</style>