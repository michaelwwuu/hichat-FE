<template>
  <div>
    <div class="home-header">
      <div class="home-user"></div>
      <span class="home-header-title">HiChat</span>
      <div class="home-add-user"></div>
    </div>
    <div class="home-search">
      <el-input
        placeholder="搜索"
        prefix-icon="el-icon-search"
        v-model="searchKey">
      </el-input>
    </div>
    <div class="home-content">
      <div class="address-box" v-for="(item,index) in hiChatDataList" :key="index" @click="goChatRoom(item)">
        <img :src="item.icon" alt="">
        <div class="msg-box">
          <span>{{item.name}}</span>
          <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'">{{item.lastChat.text}}</span>
          <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'">传送了语音</span>
          <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'">传送了图片</span>
        </div>
        <span class="time">
          {{$root.formatTimeDay(item.lastChat.sendTime)}}
          <div class="el-badge-box"><el-badge :value="item.unreadCount" class="item" v-if="item.unreadCount !== 0"></el-badge></div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";

export default {
  name: "HiChat",
  data() {
    return {
      searchKey:"",
      hiChatDataList:[],
      newMsgDataList:[],
    }
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  mounted() {
    this.getHiChatDataList()
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    getHiChatDataList(){
      let chatMsgKey = {
        chatType: "CLI_RECENT_CHAT",
        id:Math.random(),
        tokenType: 0,
        deviceId: localStorage.getItem('UUID'),
        token: localStorage.getItem('token'),
      }
      Socket.send(chatMsgKey)
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg){
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        //成功收到
        case "SRV_RECENT_CHAT":
          this.hiChatDataList = userInfo.recentChat
          this.hiChatDataList.forEach((res)=>{
            if(res.icon === null) res.icon = require("./../../../../static/images/image_user_defult.png")
          })
          break
        case "SRV_USER_IMAGE":  
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
          this.getHiChatDataList()
           break
       }
    },
    goChatRoom(data){
      localStorage.setItem('userData',JSON.stringify(data))
      this.$router.push({ name: "ChatMsg" });
    }
  }   
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
      // background-color: #fff;
      // background-image: url("./../../../../static/images/add_chat.png");
      // background-size: 50%;
      // background-position: center;
      // background-repeat: no-repeat;
    }
  }
  .home-search{
    margin: 1em;
    /deep/.el-input{
      .el-input__inner{
        background-color: #e9e8e8;
        color: #666666;
      }
      .el-input__prefix{
        color: #666666;
      }
      ::placeholder { /* CSS 3 標準 */
        color: #666666;  
      }
    }
    
  }
  .home-content{
    overflow: hidden;
    position: relative;
    .address-box{
      background-color: #FFFFFF;
      padding: 0.8em 1em;
      display: flex;
      align-items: center;
      .msg-box{
        span{
          display: block;
          padding-left: 1em;
          font-size:16px;
          &:nth-child(1){
            margin-bottom: 7px;
          }
          &:nth-child(2){
            font-size: 14px;
            opacity: 0.5;
            &::after{
              content: "";
              display: block;
              position: absolute;
              margin-top: 1em;
              width:100%;
              border-bottom: 0.02em solid #b3b3b3;
            }
          }

        }
      }  
      .time{
        position: absolute;
        right: 1.5em;
        font-size: 14px;
        .el-badge-box{
          height: 25px;
          .el-badge{
            display: block;
            top: 5px;
          }
        }
      }    
      img{
        width:3em;
        height: 3em;
        border-radius: 10px;
      }
    }
  }
 
</style>
