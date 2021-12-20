<template>
  <div class="home-wrapper">
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
  },
  methods: {
    changeImg(index) {
      this.num = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow-x: hidden;
  overflow-y: auto;
  /deep/.home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    position: fixed;
    width: -webkit-fill-available;
    background-color: #eaf5fa;
    z-index: 9;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
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
      border-radius: 10px;
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  /deep/.home-search {
    margin: 1em;
    position: fixed;
    width: -webkit-fill-available;
    top: 3em;
    background-color: #eaf5fa;
    z-index: 9;
    .el-input {
      .el-input__inner {
        background-color: #e9e8e8;
        color: #666666;
      }
      .el-input__prefix {
        color: #666666;
      }
      ::placeholder {
        /* CSS 3 標準 */
        color: #666666;
      }
    }
  }
  /deep/.address-box {
    background-color: #ffffff;
    padding: 0.8em 1em;
    display: flex;
    align-items: center;
    .el-image {
      width: 3em;
      border-radius: 10px;
    }
  }
  /deep/.el-tabs{
    position: fixed;
    width: 100vw;
    top: 8em;
    background-color: #eaf5fa;
    z-index: 9;
    .el-tabs__header{
      position: fixed;
      width: 100vw;
      top: 7.5em;
      z-index: 9;
      background-color: #e2e0e0;
      display: flex;
      justify-content: space-evenly;
      margin: 0;
      .el-tabs__nav-wrap {
        &:after {
          content: "";
          display: none;
        }
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__item.is-active {
          color: #303133;
        }
        .el-tabs__nav {
          display: flex;
          justify-content: center;
          .el-tabs__item {
            font-size: 15px;
            padding: 0 10vw
          }
        }
      }
    }
    .el-tabs__content{
      position: relative;
      top: 2em;
      overflow-x: hidden;
      overflow-y: auto;
      height: 70vh;
      z-index: 8;
    }
  }  
  .home-footer {
    width: 100vw;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 0.5em 0;
    border-top: 0.01em solid #d9d9d9;
    -webkit-overflow-scrolling: none;
    z-index: 9;
    .home-footer-btn {
      text-align: center;
      font-size: 12px;
      padding: 0;
      margin: 0 auto;
      a {
        text-decoration: none;
        color: #999999;
      }
      span {
        display: block;
      }
      img {
        margin-bottom: 5px;
        height: 2.2em;
      }
      .router-link-exact-active {
        color: #fe5f3f;
      }
    }
  }
}

</style>
