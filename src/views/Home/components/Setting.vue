<template>
  <div>
    <div class="home-header">
      <div class="home-user"></div>
      <span class="home-header-title">設定</span>
      <div class="home-add-user"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Setting",
};
</script>

<style lang="scss" scoped>
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../../static/images/qrcode.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .home-header-title {
      margin: 0 auto;
      color: #10686e;
      font-weight: 600;
    }
    .home-add-user{
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../../static/images/add_user.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
</style>
