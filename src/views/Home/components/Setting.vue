<template>
  <div>
    <div class="home-header">
      <div class="home-user"></div>
      <span class="home-header-title">設定</span>
      <div class="home-add-user"></div>
    </div>
    <div class="address-content">
      <div class="user-data">
        <span><img :src="userData.avatarImg" alt=""></span>
        <span>{{userData.username}}</span>
        <span class="user-data-id">{{userData.id}}</span>
      </div>
      <div class="setting-button" v-for="(item,index) in settingData" :key="index">
        <router-link :to="item.path">
          <div class="setting-button-left">
            <img :src="item.icon" alt="">
            <span>{{item.name}}</span>        
          </div>
          <img src="./../../../../static/images/next.png" alt=""> 
        </router-link>
        
      </div>

      <div class="setting-notification">
        <div class="setting-button-left">
          <img src="./../../../../static/images/notification.png" alt="">
          <span>提醒通知</span>        
        </div>
        <el-switch
          v-model="notification"
          active-color="#fd5f3f"
          inactive-color="#666666">
        </el-switch>
      </div>

      <div class="setting-disable">
        <div class="setting-button-left">
          <img src="./../../../../static/images/blockade.png" alt="">
          <span>封锁联络人</span>        
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
      settingData:[
        {
          name:"传送讯息",
          icon:require("./../../../../static/images/chat_icon.png"),
          path:"",
        },
        {
          name:"在对话中搜寻",
          icon:require("./../../../../static/images/search_icon.png"),
          path:"",
        },
        {
          name:"查看相片和影片",
          icon:require("./../../../../static/images/image_icon.png"),
          path:"",
        }
      ],
      notification:true,
      userData:{},
    }
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    getUserData(){
      getUserInfo().then((res)=>{
        this.userData = res.data
        if(this.userData.avatarImg === undefined) this.userData.avatarImg = require("./../../../../static/images/image_user_defult.png")
      })
    }
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
  .home-add-user{
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
.address-content{
  .user-data{
    margin: 2.5em auto;
    .user-data-id{
      margin: -3.5em 0 -5em 0;
      font-size: 13px;
      color: #b3b3b3;
    }
    span{
      display: block;
      text-align: center;
      height:4.5em;
      font-weight: 600;
      img{
        height:4em;
      }
    }
  }
  .setting-button{
    padding:0.5em 0 0.5em 0.5em;
    background-color: #FFF;
    &::after{
      content: "";
      display: block;
      border-bottom: 1px solid #b3b3b3;
      width: 100%;
      margin-left: 10px;
      position: relative;
      top:9px;
    }
    a{
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding:0.5em 0.7em 0.5em 0;
      margin-left: 10px;
    }
    img{
      height:1.2em;
    }
    .setting-button-left{
      display: flex;
      align-items: center;
      span{
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
        font-weight: 600;
      }
    }
  }
  .setting-notification,.setting-disable{
    padding:1em 0.5em 1em 0.5em;
    background-color: #FFF;
    margin:1em 0;
    display: flex;
    justify-content: space-between;
    align-content: center;
    img{
      height:1.2em;
    }
    .setting-button-left{
      display: flex;
      align-items: center;
      margin-left: 10px;
      span{
        margin-left: 1em;
        font-size: 15px;
        color: #333333;
        font-weight: 600;
      }
    }
  }
  .setting-disable{
    span{
      color: #ee5253 !important;
    }
  }
}  
</style>
