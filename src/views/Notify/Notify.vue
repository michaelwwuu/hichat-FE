<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'">
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back"></div>
            <span class="home-header-title">提醒</span>
          </div>
        </el-header>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Notify",
  data() {
    return {
      device: localStorage.getItem("device"),
    };
  },
  mounted() {
  },  
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
</style>