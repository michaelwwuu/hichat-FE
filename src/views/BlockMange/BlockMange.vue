<template>
  <div class="home-wrapper">
    <div class="home-header">
      <router-link :to="'/Setting'">
        <div class="home-user"></div>
      </router-link>
      <span class="home-header-title">封锁名单</span>
      <div class="home-add-user"></div>
    </div>
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <router-link :to="'/Setting'">
              <div class="home-user"></div>
            </router-link>
            <span class="home-header-title">封锁名单</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in newContactDataList"
              :label="item.memberId"
              :key="index"
              :disabled="item.disabled"
              :class="{'hidden':item.disabled}"
            >
              <div class="address-box">
                <el-image :src="item.icon" />
                <div class="msg-box">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="home-footer-btn">
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="addMemberSubmitBtn"
            >邀请联络人</el-button
          >
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "BlockMange",
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
  }

}
</style>
