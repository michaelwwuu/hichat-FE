<template>
  <div style="flex:1; overflow-y: auto;">
    <div class="home-content">
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

      <div class="setting-disable" @click="loginOutDialogShow = true">
        <div class="setting-button-left">
          <img src="./../../../../static/images/logout.png" alt="" />
          <span>登出</span>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="loginOutDialogShow"
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
        <el-button class="border-red" @click="loginOutDialogShow = false"
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
          path: "/PasswordMange",
        },
        {
          name: "封锁名单",
          icon: require("./../../../../static/images/blockade_green.png"),
          path: "/BlockMange",
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
          path: "/About",
        },
      ],
      notification: true,
      loginOutDialogShow: false,
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.getUserData();
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
        if (res.data.icon === undefined)
          res.data.icon = require("./../../../../static/images/image_user_defult.png");
        this.userData = res.data;
      });
    },
    loginOut() {
      this.$router.push({ path: "/login" });
      // localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userData");
      localStorage.removeItem("groupData");
      localStorage.removeItem("fromChatId");
      localStorage.removeItem("groupUserList");
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
      text-align: center;
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
      width: 20em;
      span {
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
      }
    }
  }
  a {
    text-decoration: none;
  }
  .setting-disable {
    margin: 0;
    span {
      color: #ee5253 !important;
    }
  }
  .mt10 {
    margin-top: 1em;
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
