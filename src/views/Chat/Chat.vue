<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <span class="title">聊天室</span>
          <span>
            <font-awesome-icon icon="fire" style="color:#F00"/>
            <span style="color:#d3d3d3;margin-left:5px; font-size:16px;">{{num.length > 99999 ?'9999++': num.length}}</span>
          </span>
        </el-header>
        <message-pabel
          :isShowMoreMsg="isShowMoreMsg"
          :messageData="messageData"
          :userInfoData="userInfoData"
          :chatListData="chatListData"
        />
        <message-input :userInfoData="userInfoData" :isGuest="isGuest"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { userinfo,login } from "_api/index.js";
import { mapState, mapMutations } from "vuex";
import MessagePabel from "@/components/message-pabel";
import MessageInput from "@/components/message-input";
import { getLocal } from "_util/utils.js";
export default {
  name: "Chat",
  data() {
    return {
      // 登入資訊
      loginForm: {
        isGuest:this.$route.query.isGuest,
        username: this.$route.query.id,
        chatRoomId: this.$route.query.chatRoomId,
        sign:"",
        platformCode:"manycaiSport", 
      },
      num:[],
      userListId:[],
      chatListData:[],
      messageData: [],
      userInfoData: {
        toChatId: '',
        token: '',
        deviceId: '',
        platformCode: "manycaiSport",
        tokenType: 1,
        username: '',
      },
      isShowMoreMsg: true,
      isGuest: true,
      userName: getLocal('username'),
    };
  },
  created() {
    this.userLogin()
    this.getUserInfo(this.loginForm.username)

  },
  mounted() {
    Socket.$on("message", this.handleGetMessage);
        
    window.addEventListener("beforeunload", this.closeWebsocket); 
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    this.closeWebsocket();
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.closeWebsocket);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  watch: {
    wsRes(val) {
      let chatType = val.chatType;
      switch (chatType) {
        case "SRV_ROOM_SEND":

          break;
        case "SRV_LEAVE_ROOM":
          break;
      }
    }, 
    messageData(val){
      const set = new Set();
      this.num = val.filter((item)=>{
        return !set.has(item.historyId) ? set.add(item.historyId) : false
      })
    }
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    // 生成 deviceId 32 编码
    getUUID() {
      let number = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
      localStorage.setItem("UUID", "hiWeb" + number);
      return "hiWeb" + number
    },
    getUserInfo(userId){
      let params = [...new Set(userId)]
      userinfo(params).then((res) => {
        if (res.code === 200) {
          this.chatListData = res.data  
          // localStorage.setItem("chatListData",JSON.stringify(res.data))
          this.chatListData.forEach((name)=>{
             this.messageData.forEach((res)=>{
               if(res.username === JSON.stringify(name.id)){
                res.nickname = name.nickname
                res.username = name.username
              }
              if(res.fromChatId === localStorage.getItem("username")){
                res.typeStyle = "userIdStyle"
              }  
             })
          })
        } 
      })
    },
    userLogin(){
      this.loginForm.sign = this.$md5(`code=manycaiSport&username=${ this.loginForm.username }&key=3b6a4512ba3b42f0a1cd2e8b71c06a59`)
      let params = this.loginForm
      login(params).then((res) => {
        if (res.code === 200) {
          this.userInfoData.deviceId = this.getUUID()
          this.userInfoData.token = res.data.tokenHead + res.data.token
          this.isGuest = res.data.isGuest
          this.userInfoData.username = res.data.username
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('isGuest', res.data.username);
          localStorage.setItem('token',res.data.tokenHead + res.data.token);
          localStorage.setItem('chatRoomId',this.loginForm.chatRoomId);
          Socket.connect()
        }
      })
      
    },    
    // 訊息統一格式
    messageList(data,chatType) {
      this.chatRoomMsg = {
        chatType: data.chatType,
        chatRoomId: data.toChatId,
        platformCode: data.platformCode,
        historyId: data.historyId,
        message: {
          time: data.sendTime,
          content: data.text = data.chatType === "SRV_JOIN_ROOM" && data.username !== "guest" ? "進入聊天室": data.text
        },
        fromChatId:data.fromChatId,
        username: data.fromChatId = data.username === "guest" ? data.username : data.fromChatId,
        nickname: data.nickname = data.chatType === "SRV_JOIN_ROOM" ? data.username : data.nickname,
        typeStyle:data.typeStyle = data.chatType !== "SRV_JOIN_ROOM" && data.fromChatId === localStorage.getItem("username") ? "userIdStyle" :""
      };
      if(chatType === "SRV_ROOM_HISTORY_RSP"){
        if(data.toChatId === localStorage.getItem("roomId")){
          this.messageData.unshift(this.chatRoomMsg);
        }
      }else if (chatType === "SRV_JOIN_ROOM"){
        if(data.chatRoomId === localStorage.getItem("roomId")){
          this.messageData.push(this.chatRoomMsg);
        }
      } else if(chatType === "SRV_ROOM_SEND"){
        if(data.toChatId === localStorage.getItem("roomId")){
          this.messageData.push(this.chatRoomMsg);
        }
      }
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        // 加入房间成功
        case "SRV_JOIN_ROOM":
          this.userInfoData.toChatId = userInfo.chatRoomId
          userInfo.username = userInfo.username
          userInfo.roomMemberList.forEach((list)=>{
            this.userListId.push(list.username)
          })
          if(userInfo.username !== "guest"){
            this.getUserInfo(this.userListId)
          }
          console.log(userInfo)
          if(localStorage.getItem("roomId") === null){
            localStorage.setItem("roomId",userInfo.chatRoomId)
          }
          this.messageList(userInfo,"SRV_JOIN_ROOM")
        // 发送讯息成功
        case "SRV_ROOM_SEND":
          this.chatListData.forEach((userList)=>{
            if(userInfo.fromChatId === JSON.stringify(userList.id)){
              userInfo.nickname = userList.nickname
            }
          })
          this.messageList(userInfo,"SRV_ROOM_SEND")
          break;
        // 历史讯息
        case "SRV_ROOM_HISTORY_RSP":
          let historyMsgList = userInfo.historyMessage;
          let historyPageSize = userInfo.pageSize;
          if (historyMsgList.length < historyPageSize) this.isShowMoreMsg = false;
          historyMsgList.forEach((el) => {
            console.log()
            this.messageList(el,"SRV_ROOM_HISTORY_RSP")
          });
          
          const set = new Set();
          this.newList = historyMsgList.filter((item) =>
            !set.has(item.fromChatId) ? set.add(item.fromChatId) : false
          );
          this.newList.forEach(num => this.userListId.push(num.fromChatId));
          this.getUserInfo(this.userListId,"SRV_ROOM_HISTORY_RSP")
          break;  
      }
    },
    // 关闭socket
    closeWebsocket() {
      Socket.onClose();
      window.location.reload();
    },
  },
  components: {
    MessagePabel,
    MessageInput,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 99%;
    max-width: 500px;
    margin: 10px auto;
    .el-aside,
    .el-main {
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      /deep/.el-row {
        float: right;
        .el-button {
          background-image: linear-gradient(#579fff, #3481e8);
          color: #ffffff;
        }
        .el-checkbox__inner {
          border-radius: 0;
          border: 1px solid #dcdfe6;
          &::after {
            border: 1px solid #4fba00;
            border-left: 0;
            border-top: 0;
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #ffffff;
        }
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-aside {
      border-radius: 6px 0px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
    }
    .el-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 55px;
      // background-image: linear-gradient(#579fff, #3481e8);
      overflow: hidden;
      border-bottom: 1px solid #dddddd;
      img {
        position: relative;
        top: 7px;
      }
      .title {
        display: inline-block;
        font-size: 18px;
        letter-spacing: 1px;
        color: #FF0000;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 

  // border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background-image: linear-gradient(180deg,rgb(138, 138, 138), rgb(138, 138, 138));
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-image: linear-gradient(180deg,rgb(138, 138, 138), rgb(138, 138, 138));

}
</style>
