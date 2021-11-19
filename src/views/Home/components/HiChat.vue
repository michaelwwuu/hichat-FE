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
      <div class="address-box" v-for="(item,index) in hiChatDataList" :key="index">
        <img :src="item.icon" alt="">
        <div class="msg-box">
          <span>{{item.name}}</span>
          <span>{{item.lastChat.text}}</span>
        </div>
        <span class="time">{{$root.formatTimeDay(item.lastChat.sendTime)}}</span>
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
      if(this.wsRes.recentChat !== undefined){
        this.hiChatDataList = this.wsRes.recentChat 
        this.hiChatDataList.forEach((res)=>{
          if(res.icon === null) res.icon = require("./../../../../static/images/image_user_defult.png")
        })
      }
    },
    // 訊息統一格式
    messageList(data) {
      this.chatRoomMsg = {
        banRemainTime: data.banRemainTime,
        chatType: data.chatType,
        chatRoomId: data.toChatId,
        platformCode: data.platformCode,
        historyId: data.historyId,
        message: {
          time: data.sendTime,
          content: this.redEnvelopeIcon(data)
        },
        username: data.fromChatId,
      };
    },

    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg){
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_RECENT_CHAT":
          this.hiChatDataList = userInfo.recentChat
          this.hiChatDataList.forEach((res)=>{
            if(res.icon === null) res.icon = require("./../../../../static/images/image_user_defult.png")
          })
          break
       }
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
      background-color: #fff;
      background-image: url("./../../../../static/images/add_chat.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
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
          font-size:14px;
          &:nth-child(1){
            margin-bottom: 7px;
          }
          &:nth-child(2){
            font-size: 12px;
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
        top: 1em;
        font-size: 12px;
      }    
      img{
        height:2em;
      }
    }
  }
 
</style>
