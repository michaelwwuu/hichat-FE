<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="70px">  
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">掃碼QRcode</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="scroll-container">
          <Scaner
            v-on:code-scanned="codeScanned"
            v-on:error-captured="errorCaptured"
            :stop-on-scanned="true"
            :draw-on-found="true"
            :responsive="false"
          />
        </div>
      </el-main>
    </el-container>
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
  position: fixed;
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }
}
</style>