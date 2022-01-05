<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <template>
          <el-header height="120px">
            <div>
              <div class="home-header">
                <div class="home-user" @click="centerDialogVisible = true"></div>
                <span class="home-header-title">通讯录</span>
                <router-link :to="'/AddUser'">
                  <div class="home-add-user"></div>
                </router-link>
              </div>
            </div>
            <div class="home-search">
              <el-input
                placeholder="输入欲搜寻的联络人"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </el-header>
        </template>
        <template>
          <el-header height="120px" style="background-color: #eaf5fa; z-index:9;">
            <div class="home-header">
              <div class="home-user"></div>
              <span class="home-header-title">HiChat</span>
              <router-link :to="'/AddGroup'">
                <div class="home-add-user"></div>
              </router-link>
            </div> 
            <div class="home-search">
              <el-input
                placeholder="搜索"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </el-header>
        </template>
        <template>
          <el-header height="55px">
            <div class="home-header">
              <div class="home-user" @click="centerDialogVisible = true"></div>
              <span class="home-header-title">设定</span>
              <router-link :to="'/EditUser'"
                ><div class="home-add-user" style="background-color: #fff; background-image: url('./../../../static/images/edit.png')"></div
              ></router-link>
            </div>
          </el-header>
        </template>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <div class="home-footer">
          <div
            class="home-footer-btn"
            v-for="(item, index) in routerNav"
            :key="index"
            @click="changeImg(index)"
          >
            <router-link :to="item.path">
              <span><img alt="" :src="item.icon" v-show="index !== num" /></span>
              <span><img alt="" :src="item.active" v-show="index === num" /></span>
              <span>{{ item.name }}</span>
            </router-link>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      routerNav: [
        {
          icon: require("./../../../static/images/address.png"),
          active: require("./../../../static/images/address_hover.png"),
          path: "/Address",
          name: "通讯录",
        },
        {
          icon: require("./../../../static/images/chat.png"),
          active: require("./../../../static/images/chat_hover.png"),
          path: "/HiChat",
          name: "聊天",
        },
        {
          icon: require("./../../../static/images/setting.png"),
          active: require("./../../../static/images/setting_hover.png"),
          path: "/Setting",
          name: "设定",
        },
      ],
      num: 0,
    };
  },
  created() {
    this.num =
      this.$route.fullPath === "/HiChat"
        ? 1
        : this.$route.fullPath === "/Setting"
        ? 2
        : 0;
    // alert(document.body.clientHeight)
  },
  methods: {
    changeImg(index) {
      this.num = index;
    },
  },
};
</script>

<style lang="scss" scoped>
  .home-add-user {
    background-color: #fff;
    background-image: url("./../../../static/images/edit.png");
  }
.home-wrapper {
  /deep/.home-header {
    position: fixed;
    width: -webkit-fill-available;
    background-color: #eaf5fa;
    z-index: 9;
  }
  /deep/.home-search {
    position: fixed;
    margin:1em;
    // top: 3em;
    background-color: #eaf5fa;
    z-index: 9;
  }
  .el-container{
    /deep/.el-main{
      .el-header{
        border-right: none;
      }
    }
  }
}

</style>
