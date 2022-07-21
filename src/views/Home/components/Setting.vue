<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <div class="user-data">
      <div class="icon_promotion-img" v-if="device === 'pc'" @click="promotionDialogShow = true">
        <img src="./../../../../static/images/icon_share.png" alt="">
      </div>
      <el-image
        v-if="myUserInfo.icon !== undefined"
        :src="myUserInfo.icon"
        :preview-src-list="[myUserInfo.icon]"
      />
      <div>
        <span>{{ myUserInfo.nickname }}</span>
        <span class="user-data-id">
          ID :
          <span class="user-paste" @click="copyPaste(myUserInfo.username)">{{
            myUserInfo.username
          }}</span></span
        >
      </div>
    </div>
    <template v-if="device === 'moblie'">
      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        :class="{
          mt10:
            item.name === '相片和影片' ||
            item.name === '关于嗨聊' ||
            item.name === '提醒' 
        }"
        @click="developmentMessage(item.name)"
      >
        <router-link :to="item.path">
          <div class="setting-button-left">
            <img :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div class="setting-button-right">
            <span v-if="item.name === '提醒'"></span>
            <span v-if="item.name === '语言'">简体中文</span>
            <img src="./../../../../static/images/next.png" alt="" />
          </div>
        </router-link>
      </div>

      <div class="setting-button mt10" @click="logoutDialogShow = true">
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
          { no_bor_mb10: item.name === '封锁名单' },
          { bor_mt10: item.name === '提醒' },
          { hidden: item.name === '关于嗨聊' },
        ]"
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
      :close-on-click-modal="false"
      center
      append-to-body
    >
      <div class="loginOut-box">
        <div><img src="./../../../../static/images/warn.svg" alt="" /></div>
        <span>确认要登出嗎？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="logoutDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="loginOut">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="promotionDialogShow"
      class="el-promotion-dialog"
      width="80%"
      :show-close="false"
      :modal="false"
      center
    > 
      <div class="qrcode-box">
        <vue-qr
          ref="Qrcode"
          :correctLevel="3"
          :autoColor="false"
          colorDark="#333333"
          :text="promoteCodeConfig.text"
          :logoSrc="promoteCodeConfig.logo"
          :size="1000"
          :margin="0"
          :logoCornerRadius="0"
          :logoMargin="1"
        ></vue-qr>
      </div>
      <div class="promote-box-text">快来注册并下载嗨聊吧！</div>
      <div
        class="promote-box-text2"
        >
        <span>{{ promoteCodeConfig.text }}</span></div
      >
      <span slot="footer" class="dialog-footer">
        <el-button class="orange" @click="copyUrl">
          <img src="./../../../../static/images/copy.png" alt="">
          复制推广链接</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { getToken } from "_util/utils.js";

import VueQr from "vue-qr";
import urlCopy from "@/utils/urlCopy.js";
import { logout } from "@/api";
import { Decrypt,Encrypt} from "@/utils/AESUtils.js";

import { mapState } from "vuex";
import { developmentMessage } from "@/assets/tools";

export default {
  name: "Setting",
  data() {
    return {
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
          path: "/Notify",
        },
        // {
        //   name: "相片和影片",
        //   icon: require("./../../../../static/images/image_icon.png"),
        //   pcIcon: require("./../../../../static/images/pc/image.png"),
        //   path: "",
        // },
        // {
        //   name: "语言",
        //   icon: require("./../../../../static/images/lang_icon.png"),
        //   pcIcon: require("./../../../../static/images/pc/globe.png"),
        //   path: "",
        // },
        {
          name: "关于嗨聊",
          icon: require("./../../../../static/images/about.png"),
          path: "/About",
        },
      ],
      promoteCodeConfig: {
        text: "",
        logo: require("./../../../../static/images/material_ic_logo.png"),
      },      
      notification: true,
      logoutDialogShow: false,
      promotionDialogShow:false,
      developmentMessage: developmentMessage,
      device: localStorage.getItem("device"),

      //推廣 key iv
      promoteKey: "142c7ec1b64ae0c6",
      promoteIv: "0000000000000000",
    };
  },
  computed: {
    ...mapState({
      myUserInfo: (state) => state.ws.myUserInfo,
    }),
  },
  created() {
    if (this.device === "pc") {
      this.editMyList = {
        icon: "",
        name: "编辑个人资料",
        path: "/EditUser",
        pcIcon: require("./../../../../static/images/pc/edit.png"),
      };
      this.settingData.unshift(this.editMyList);
      this.settingData.forEach((el) => {
        if (el.name === "密码管理") el.path = "/PasswordEdit";
      });
    }
    this.promoteCodeConfig.text = `${
      location.origin
    }/pub/#/signUp?${encodeURIComponent(
      Encrypt(
        `agentId=${localStorage.getItem("id")}`,
        this.promoteKey,
        this.promoteIv
      )
    )}`; 
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  methods: {
    copyUrl() {
      let url = this.promoteCodeConfig.text;
      urlCopy(url);
    },
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
    // loginOut() {
    //   logout().then((res) => {
    //     if(res.code === 200 && res.message === "登出成功"){
    //       this.$router.push({ path: "/login" });
    //       localStorage.removeItem("id");
    //       localStorage.removeItem("token");
    //       localStorage.removeItem("myUserInfo");
    //       localStorage.removeItem("myUserList");
    //       window.location.reload();
    //     }
    //   })
    //   .catch((err)=>{
    //     return false
    //   })
    // },
    loginOut() {
      this.$router.push({ path: "/login" });
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("myUserInfo");
      localStorage.removeItem("myUserList");
      window.location.reload();
    },  
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          this.getHiChatDataList();
          break;
      }
    },
    getHiChatDataList() {
      let chatMsgKey = {
        chatType: "CLI_RECENT_CHAT",
        id: Math.random(),
        tokenType: 0,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      Socket.send(chatMsgKey);
    },        
  },
  components: {
    VueQr,
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
    .icon_promotion-img{
      text-align: left;
      position: relative;
      top: 15px;
      left: 15px;
      cursor: pointer;
      img{
        height: 1.5em;
      }
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
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  .hidden {
    display: none;
  }
  .bor_mt10 {
    padding: 1em 0 0.5em 0.5em;
    border-top: 3px solid rgba(0, 0, 0, 0.05);
  }
  .no_bor_mb10 {
    padding: 0.5em 0 1em 0.5em;
    &::after {
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
.hichat-pc{
  .el-promotion-dialog {
    /deep/.el-dialog{
      width: 420px !important;
      box-shadow: none;
    }
    /deep/.el-dialog__header{
      padding:0;
      border-bottom: 0;
    }
    /deep/.el-dialog__body{
      padding: 15px 0px !important;
      border-bottom: 0;
      .qrcode-box{
        width: 25em;
        height: 25em;
        border: 20px solid rgba(0, 0, 0, 0.05);
        img{
          height: 23em;
        }
      }
      .promote-box-text{
        margin-top: 1em;
        font-size: 20px;
        font-weight: 300;
      }
      .promote-box-text2{
        color:rgba(0, 0, 0, 0.4);
        padding:0 50px;        
      }
    }
    /deep/.el-dialog__footer {
      padding: 10px 0 !important;
      
      .dialog-footer{
        justify-content: center;
        img{
          height: 1.5em;
          padding-right: 10px;
        }
        .el-button {
          width: 90% !important;
          padding: 15px !important;
          font-size: 15px;
          &:nth-child(1){
            border-radius: 10px !important;  
          }        
          span{
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .orange {
          background-color: #fe5f3f !important;
          color: #fff;
        }
      }
      
      
    }
  }
}
</style>
