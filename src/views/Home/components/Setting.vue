<template>
  <div>
    <div class="home-header">
      <div class="home-user" @click="centerDialogVisible = true"></div>
      <span class="home-header-title">設定</span>
      <div class="home-add-user" @click="goEditUserPage(userData)"></div>
    </div>
    <div class="address-content">
      <div class="user-data">
        <span><img :src="userData.icon" alt="" /></span>
        <span>{{ userData.nickname }}</span>
        <span class="user-data-id"> ID : {{ userData.username }}</span>
      </div>
      <div
        class="setting-button"
        v-for="(item, index) in settingData"
        :key="index"
        :class="{ 'mt10': item.name === '提醒' || item.name === '关于HiChat'}"
        @click="developmentMessage(item.name)"
      >
        <router-link :to="item.path" >
          <div class="setting-button-left">
            <img :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div class="setting-button-right" >
            <span v-if="item.name === '提醒'">开启</span>
            <span v-if="item.name === '语言'">简体中文</span>
            <img src="./../../../../static/images/next.png" alt="" />
          </div>
        </router-link>
      </div>

      <router-link :to="'/login'">
        <div class="setting-disable" >
          <div class="setting-button-left">
            <img src="./../../../../static/images/logout.png" alt="" />
            <span>登出</span>
          </div>
        </div>
      </router-link>
      
    </div>
    <el-dialog
      title="我的帐号"
      :visible.sync="centerDialogVisible"
      width="100%"
      center>
      <div class="qrcode-box">
        <vue-qr ref="Qrcode" :correctLevel="3" :autoColor="false" colorDark="#333333" :text="qrCodeConfig.text"  :download="downloadFilename" :size="100" :margin="0" :logoSrc="qrCodeConfig.logo" :logoCornerRadius="2" :logoMargin="1"></vue-qr>
      </div>
      <span class="qrcode-box-text">嗨聊用户扫描此二维码后，可将您加入好友！</span>
      <span slot="footer" class="dialog-footer">
        <img src="./../../../../static/images/scan.png" alt="">
        <img src="./../../../../static/images/share.png" alt="" @click="copyUrl">
        <img src="./../../../../static/images/download.png" alt="" @click="downloadImg">
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo } from "@/api";
import VueQr from 'vue-qr'
import urlCopy from "@/utils/urlCopy.js";
import { developmentMessage } from "@/assets/tools";


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
          path: "/About",
        },
      ],
      notification: true,
      userData: {},
      centerDialogVisible : false,
      qrCodeConfig:{
        text:`https://test.hichat.tools/fe/#/AddUser?username=${localStorage.getItem('username')}&id=${localStorage.getItem('id')}`,
        logo:require("./../../../../static/images/material_ic_logo.png"),
      },
      downloadFilename:'',
      developmentMessage:developmentMessage
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    copyUrl(){
      let url = this.qrCodeConfig.text;
      urlCopy(url);
    },
    downloadImg () {
      const iconUrl = this.$refs.Qrcode.$el.src
      let a = document.createElement('a')
      let event = new MouseEvent('click')
      a.download = '二维码'
      a.href = iconUrl
      a.dispatchEvent(event)
    },
    getUserData() {
      getUserInfo().then((res) => {
        this.userData = res.data;
        this.userData.nickname =  res.data.nickname.replace(/\["|"]/g, '' )
        if (this.userData.icon === undefined)
          this.userData.icon = require("./../../../../static/images/image_user_defult.png");
      });
    },
    goEditUserPage(userData){
      localStorage.setItem('accountMsg', JSON.stringify(userData))
      this.$router.push({ name:'EditUser'}); 
    },
  },
  components: {
    VueQr,
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
    img{
      border-radius: 10px;
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
      }
    }
    .setting-button-right {
      display: flex;
      align-items: center;
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
      span {
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
      }
    }
    
  }
  a{
    text-decoration: none;
  }
  .setting-disable {
    margin: 0;
    span {
      color: #ee5253 !important;
    }
  }
  .mt10{
    margin-top: 1em;
  }
}
/deep/.el-dialog__wrapper{
  overflow: hidden;
  .el-dialog{
    margin: 0 auto;
    border-radius: 20px 20px 0 0;
    position: absolute;
    bottom: 0;
    .el-dialog__header{
      .el-dialog__title{
        color: #10686e;
        font-weight: 600;
      }
      .el-dialog__headerbtn{
        left: 20px;
        .el-dialog__close{
          color: #F60;

        } 
      }
    }
    .el-dialog__body{
      text-align: center;
      .qrcode-box{
        width: 15em;
        height: 15em;
        border: 2px solid #333;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          height: 14em;
        }
        // &::after{
        //   content: '';
        //   display: block;
        //   width: 2.5em;
        //   height: 2.5em;
        //   background-color: #FFF;
        //   background-image: url('./../../../../static/images/material_ic_logo.png');
        //   background-repeat: no-repeat;
        //   background-position: center;
        //   background-size: 70%;
        //   position: absolute;
        //   margin: 0 auto;
        //   border-radius:10px;
        // }
      }
      .qrcode-box-text{
        color: #0c0d0d;
        font-weight: 600;
        margin-top: 2em;
        display: block;
      }
    }
    .el-dialog__footer{
      padding: 20px 30px 20px 30px;
      .dialog-footer{
        display: flex;
        justify-content: space-between;
        img{
          height: 1em;
        }
      }
    }
  }
}
</style>
