<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'"> </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back"></div>
            <span class="home-header-title">提醒</span>
          </div>
        </el-header>
        <div class="home-content">
          <div
            class="setting-notification"
          >
            <div class="setting-button-left">
              <span>通知</span>
            </div>
            <el-switch
              v-model="notification"
              active-color="#fd5f3f"
              inactive-color="#666666"
              disabled
            >
            </el-switch>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Notify",
  data() {
    return {
      notification:true,
      newNofiy:true,
      groupNofiy:true,
      audioNofiy:true,
      shockNofiy:true,
      soundNofiy:true,
      groupSoundNofiy:true,
      privateSoundNofiy:true,

      device: localStorage.getItem("device"),
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .home-user-pc {
    background-color: #fff;
    background-image: url("./../../../static/images/pc/arrow-left.png");
    cursor: pointer;
  }
}
.home-wrapper {
  .home-content {
    .setting-notification {
      padding: 1em;
      background-color: #fff;
      margin: 1em 0;
      display: flex;
      justify-content: space-between;
      align-content: center;
      border-bottom: 3px solid rgba(0, 0, 0, 0.05);
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 20em;
        span {
          margin-left: 0;
          font-size: 15px;
          color: #333333;
        }
      }
    }
   }
}
</style>