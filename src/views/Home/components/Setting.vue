<template>
  <div>
    <div class="home-header">
      <div class="home-user"></div>
      <span class="home-header-title">設定</span>
      <div class="home-add-user"></div>
    </div>
    <div class="address-content">
      <div class="user-data">
        <span><img :src="userData.avatarImg" alt="" /></span>
        <span>{{ userData.username }}</span>
        <span class="user-data-id">{{ userData.id }}</span>
      </div>
      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        :class="{ 'mt10': item.name === '提醒' || item.name === '关于HiChat'}"
      >
        <router-link :to="item.path">
          <div class="setting-button-left">
            <img :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div class="setting-button-right">
            <span v-if="item.name === '提醒'">开启</span>
            <span v-if="item.name === '语言'">简体中文</span>
            <img src="./../../../../static/images/next.png" alt="" />
          </div>
          
        </router-link>
      </div>

      <div class="setting-disable">
        <div class="setting-button-left">
          <img src="./../../../../static/images/logout.png" alt="" />
          <span>登出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/api";

export default {
  name: "Setting",
  data() {
    return {
      settingData: [
        {
          name: "密码管理",
          icon: require("./../../../../static/images/safe.png"),
          path: "",
        },
        {
          name: "封鎖名單",
          icon: require("./../../../../static/images/blockade_green.png"),
          path: "",
        },
        {
          name: "提醒",
          icon: require("./../../../../static/images/notification.png"),
          path: "",
        },
        {
          name: "相片和影片",
          icon: require("./../../../../static/images/image_icon.png"),
          path: "",
        },
        {
          name: "语言",
          icon: require("./../../../../static/images/lang_icon.png"),
          path: "",
        },
        {
          name: "关于HiChat",
          icon: require("./../../../../static/images/about.png"),
          path: "",
        },
      ],
      notification: true,
      userData: {},
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      getUserInfo().then((res) => {
        this.userData = res.data;
        if (this.userData.avatarImg === undefined)
          this.userData.avatarImg = require("./../../../../static/images/image_user_defult.png");
      });
    },
  },
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
  .home-add-user {
    width: 2em;
    height: 2em;
    border-radius: 10px;
    background-color: #fff;
    background-image: url("./../../../../static/images/edit.png");
    background-size: 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.address-content {
  .user-data {
    margin: 2.5em auto;
    .user-data-id {
      margin: -3.5em 0 -5em 0;
      font-size: 13px;
      color: #b3b3b3;
    }
    span {
      display: block;
      text-align: center;
      height: 4.5em;
      font-weight: 600;
      img {
        height: 4em;
      }
    }
  }
  .setting-button {
    padding: 0.5em 0 0.5em 0.5em;
    background-color: #fff;
    &::after {
      content: "";
      display: block;
      border-bottom: 1px solid #b3b3b3;
      width: 100%;
      margin-left: 10px;
      position: relative;
      top: 9px;
    }
    a {
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 0.5em 0.7em 0.5em 0;
      margin-left: 10px;
    }
    img {
      height: 1.2em;
    }
    .setting-button-left {
      display: flex;
      align-items: center;
      span {
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
        font-weight: 600;
      }
    }
    .setting-button-right {
      display: flex;
      align-items: center;
      span {
        margin-right: 1em;
        font-size: 15px;
        color: #b3b3b3;
        font-weight: 600;
      }
    }
  }
  .setting-notification,
  .setting-disable {
    padding: 1em 0.5em 1em 0.5em;
    background-color: #fff;
    margin: 1em 0;
    display: flex;
    justify-content: space-between;
    align-content: center;
    img {
      height: 1.2em;
    }
    .setting-button-left {
      display: flex;
      align-items: center;
      margin-left: 10px;
      span {
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
        font-weight: 600;
      }
    }
  }
  .setting-disable {
    span {
      color: #ee5253 !important;
    }
  }
  .mt10{
    margin-top: 1em;
  }
}
</style>
