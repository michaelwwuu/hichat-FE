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
  /deep/.home-header {
    position: fixed;
    width: -webkit-fill-available;
    background-color: #eaf5fa;
    z-index: 9;
  }
  /deep/.home-search {
    position: fixed;
    width: -webkit-fill-available;
    top: 3em;
    background-color: #eaf5fa;
    z-index: 9;
  }
}
</style>
