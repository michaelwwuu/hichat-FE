<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title"></span>
      <div class="home-add-user"></div>
    </div>
    <div class="address-content">
      <div class="user-data">
        <span><img :src="userData.icon" alt=""></span>
        <span>{{userData.name}}</span>
        <span class="user-data-id"> ID : {{ userData.username }}</span>
      </div>

      <div class="setting-button" v-for="(item,index) in settingData" :key="index" @click="developmentMessage(item)">
        <span @click="goChatRoom(userData,item.path)">
          <div class="setting-button-left">
            <img :src="item.icon" alt="">
            <span>{{item.name}}</span>        
          </div>
          <img src="./../../../static/images/next.png" alt=""> 
        </span>
      </div>

      <div class="setting-notification" @click="developmentMessage('提醒通知')">
        <div class="setting-button-left">
          <img src="./../../../static/images/notification.png" alt="">
          <span>提醒通知</span>        
        </div>
        <el-switch
          v-model="notification"
          active-color="#fd5f3f"
          inactive-color="#666666">
        </el-switch>
      </div>

      <div class="setting-disable" @click="developmentMessage('封锁联络人')">
        <div class="setting-button-left">
          <img src="./../../../static/images/blockade.png" alt="">
          <span>封锁联络人</span>        
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";

export default {
  name: "ContactPage",
  data() {
    return {
      userData:{},
      settingData:[
        {
          name:"传送讯息",
          icon:require("./../../../static/images/chat_icon.png"),
          path:"ChatMsg",
        },
        {
          name:"在对话中搜寻",
          icon:require("./../../../static/images/search.png"),
          path:"",
        },
        {
          name:"查看相片和影片",
          icon:require("./../../../static/images/image_icon.png"),
          path:"",
        }
      ],
      notification:true,
      developmentMessage:developmentMessage
    }
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem('userData'))
  },
  methods: {
    goChatRoom(data,path){
      this.$router.push({ name:path,params:data}); 
    },
    back(){
      this.$router.back(-1)
    }
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper{
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
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
      background-image: url("./../../../static/images/edit.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .address-content{
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
      span{
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
}
</style>
