<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <div class="user-data">
      <el-image
        v-if="userData.icon !== undefined"
        :src="userData.icon"
        :preview-src-list="[userData.icon]"
      />
      <div>
        <span>{{ userData.nickname }}</span>
        <span class="user-data-id">
          ID :
          <span class="user-paste" @click="copyPaste(userData.username)">{{
            userData.username
          }}</span></span
        >
      </div>
    </div>
    <template v-if="device === 'moblie'">
      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        :class="{ mt10: item.name === '提醒' || item.name === '关于HiChat' }"
        @click="developmentMessage(item.name)"
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

      <div class="setting-button" @click="logoutDialogShow = true">
        <a>
          <div class="setting-button-left">
            <img src="./../../../../static/images/logout.png" alt="" />
            <span class="red-text">登出</span>
          </div>
        </a>
      </div>
    </template>
    <template v-else>
      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        :class="[
          { no_bor_mb10: item.name === '封锁名单'},
          { bor_mt10: item.name === '提醒'},
          { hidden: item.name === '关于HiChat'}
          ]
        "
        @click="developmentMessage(item.name)"
      >
        <router-link :to="item.path">
          <div class="setting-button-left">
            <img :src="item.pcIcon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div class="setting-button-right">
            <img src="./../../../../static/images/next.png" alt="" />
          </div>
        </router-link>
      </div>
    </template>
    <el-dialog
      :visible.sync="logoutDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
      append-to-body
    >
      <div class="loginOut-box">
        <div><img src="./../../../../static/images/warn.png" alt="" /></div>
        <span>确认要登出嗎？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="logoutDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="loginOut">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo } from "@/api";
import { developmentMessage } from "@/assets/tools";

export default {
  name: "Setting",
  data() {
    return {
      userData: {},
      settingData: [
        {
          name: "密码管理",
          icon: require("./../../../../static/images/safe.png"),
          pcIcon: require("./../../../../static/images/pc/shield.png"),
          path: "/PasswordMange",
        },
        {
          name: "封锁名单",
          icon: require("./../../../../static/images/blockade_green.png"),
          pcIcon: require("./../../../../static/images/pc/slash.png"),
          path: "/BlockMange",
        },
        {
          name: "提醒",
          icon: require("./../../../../static/images/notification.png"),
          pcIcon: require("./../../../../static/images/pc/bell.png"),
          path: "",
        },
        {
          name: "相片和影片",
          icon: require("./../../../../static/images/image_icon.png"),
          pcIcon: require("./../../../../static/images/pc/image.png"),
          path: "",
        },
        {
          name: "语言",
          icon: require("./../../../../static/images/lang_icon.png"),
          pcIcon: require("./../../../../static/images/pc/globe.png"),
          path: "",
        },
        {
          name: "关于HiChat",
          icon: require("./../../../../static/images/about.png"),
          path: "/About",
        },
      ],

      notification: true,
      logoutDialogShow: false,
      developmentMessage: developmentMessage,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    if(localStorage.getItem("myUserList") === null) {
      this.getUserData();
    }else{
      this.userData = JSON.parse(localStorage.getItem("myUserList"))
    }
    if(this.device === 'pc'){
      this.editMyList = {
        icon:"",
        name: "編輯個人資料",
        path: "/EditUser",
        pcIcon: require("./../../../../static/images/pc/edit.png"),
      }
      this.settingData.unshift(this.editMyList)
    }
  },
  methods: {
    copyPaste(data) {
      let url = document.createElement("input");
      document.body.appendChild(url);
      url.value = data;
      url.select();
      document.execCommand("copy");
      document.body.removeChild(url);
      this.$message({
        message: `ID : ${data} 复制成功`,
        type: "success",
        duration: 1000,
      });
    },
    getUserData() {
      getUserInfo().then((res) => {
        if (res.data.icon === undefined){
          res.data.icon = require("./../../../../static/images/image_user_defult.png");
        }
        this.userData = res.data;
        localStorage.setItem("myUserList", JSON.stringify(this.userData));
      });
    },
    loginOut() {
      this.$router.push({ path: "/login" });
      localStorage.removeItem("token");
      localStorage.removeItem("myUserList");
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.home-content {
  .user-data {
    .user-data-id {
      margin: -3.5em 0 -5em 0;
      font-size: 13px;
      color: #b3b3b3;
    }
    .user-paste {
      width: 1em;
      display: contents;
    }
    span {
      display: block;
      height: 4.5em;
      font-weight: 600;
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
      width: 20em;
      span {
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
      }
    }
    .setting-button-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 10em;
      span {
        margin-right: 1em;
        font-size: 15px;
        color: #b3b3b3;
      }
    }
  }
  .setting-notification {
    padding: 1em 0.5em;
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
      width: 20em;
      span {
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
      }
    }
  }
  .red-text {
    color: #ee5253 !important;
  }
  .mt10 {
    margin-top: 1em;
  }
  .hidden{
    display: none;  
  }
  .bor_mt10{
    padding: 1em 0 0.5em 0.5em;
    border-top:3px solid #b3b3b377;
  }
  .no_bor_mb10{
    padding: 0.5em 0 1em 0.5em;
    &::after{
      border-bottom: 0;
    }  
  }
}
.el-dialog-loginOut {
  overflow: auto;
  /deep/.el-dialog {
    margin: 0 auto 50px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    box-sizing: border-box;
    width: 50%;
    .el-dialog__header {
      padding: 10px;
    }
    .el-dialog__body {
      text-align: center;
      padding: 25px 25px 15px;
      .loginOut-box {
        img {
          height: 5em;
          margin-bottom: 1.2em;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px;
      padding-top: 10px;
      text-align: right;
      box-sizing: border-box;
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        .el-button {
          width: 100%;
          border-radius: 8px;
        }
        .background-red {
          background-color: #ee5253;
          color: #fff;
        }
        .border-red {
          border: 1px solid #fe5f3f;
          color: #fe5f3f;
        }
      }
    }
  }
}
</style>
