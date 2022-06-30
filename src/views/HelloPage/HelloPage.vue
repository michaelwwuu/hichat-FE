<template>
  <div class="hello-page">
    <div class="hello-page-logo">
      <div><img src="./../../../static/images/ic_logo.png" alt="" /></div>
      <!-- <div><img src="./../../../static/images/ic_text.png" alt="" /></div> -->
      <div>欢迎使用嗨聊</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloPage",
  data() {
    return {};
  },
  created() {
    this.$nextTick(() =>
      setTimeout(() => {
        if (localStorage.getItem("token")) {
          this.$router.push({ path: "/Home" });
        } else {
          this.$router.push({ path: "/Login" });
        }
      }, 2500)
    );
  },
};
</script>

<style lang="scss" scoped>
.hello-page {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  display: flex;
  align-items: center;
  .hello-page-logo {
    width: 100%;
    text-align: center;
    div {
      margin-bottom: 10px;
      &:nth-child(1) {
        img {
          height: 5em;
        }
      }
      &:nth-child(2) {
        img {
          height: 2em;
        }
      }
      &:nth-child(3) {
        margin-top: 2.5em;
        color: #b3b3b3;
        font-weight: 600;
        letter-spacing: 3px;
      }
    }
  }
}
</style>

