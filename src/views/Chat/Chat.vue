<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <span class="title">聊天室</span>
          <span>
            <font-awesome-icon icon="fire" style="color:#F00"/>
            <span style="color:#d3d3d3;margin-left:5px;">{{messageData.length > 99999 ?'9999++':messageData.length}}</span>
          </span>
        </el-header>
        <message-pabel
          :isShowMoreMsg="isShowMoreMsg"
          :messageData="messageData"
          :userInfoData="userInfoData"
        />
        <message-input :userInfoData="userInfoData" />
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
      chatListData:[],
      concats: [],
      messageData: [],
      userMemberList: [],
      userInfoData: {
        toChatId: '',
        token: '',
        deviceId: '',
        platformCode: "manycaiSport",
        tokenType: 1,
      },
      hotNum:99999999,
      isChecked: true,
      isAdmin: false,
      clearDialog: false,
      isShowMoreMsg: true,
      banUserInputMask: false,
      isGuest: getLocal('isGuest'),
      userName: getLocal('username'),
    };
  },
  created() {
    this.userLogin()
    // this.getUserInfo()
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
        case "SRV_JOIN_ROOM":
          this.$nextTick(() => {
            setTimeout(() => {
              // 過濾 socket 斷線不重新Show提示
              this.concats.forEach((el) => {
                this.userMemberList.push(el.username);
              });
              // 新陣列 統計自己進入次數 長度大於一就不 Show 提示
              this.userMemberList = Array.from(new Set(this.userMemberList))
            });
          });  
          break;
        case "SRV_LEAVE_ROOM":
          // 斷線移除此人
          this.userMemberList = this.userMemberList.filter(el => el !== val.username);
          break;
      }
    }, 
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
      let params = userId
      userinfo(params).then((res) => {
        if (res.code === 200) {
          this.chatListData = res.data      
        }
      })
    },
    userLogin(){
      this.loginForm.sign = this.$md5(`code=manycaiSport&username=${ this.loginForm.username }&key=3b6a4512ba3b42f0a1cd2e8b71c06a59`)
      let params = this.loginForm
      login(params).then((res) => {
        if (res.code === 200) {
          if(res.data.isGuest) {
            this.isShowMoreMsg = false
            this.banUserInputMask = true
          }
          this.userInfoData.deviceId = this.getUUID()
          this.userInfoData.token = res.data.tokenHead + res.data.token
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('isGuest', res.data.isGuest);
          localStorage.setItem('token',res.data.tokenHead + res.data.token);
          localStorage.setItem('chatRoomId',this.loginForm.chatRoomId);
          Socket.connect()
        }
      })
    },    
    // 訊息統一格式
    messageList(data) {
      this.chatRoomMsg = {
        chatType: data.chatType,
        chatRoomId: data.toChatId,
        platformCode: data.platformCode,
        historyId: data.historyId,
        message: {
          time: data.sendTime,
          content: data.text
        },
        fromChatId:data.fromChatId,
        username: data.username,
      };
    },

    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      let userId = []
      switch (userInfo.chatType) {
        // 加入房间成功
        case "SRV_JOIN_ROOM":
          this.userInfoData.toChatId = userInfo.chatRoomId
          userInfo.roomMemberList.forEach((list)=>{
            userId.push(list.username)
            this.chatListData.forEach((userList)=>{
              if(list.username === JSON.stringify(userList.id)){
                return list.username = userList.nickname
              }
            })
          })
          this.getUserInfo(userId)
          this.$nextTick(()=>{
            setTimeout(() => {
              this.chatListData.forEach((userList)=>{
                if(userInfo.username === JSON.stringify(userList.id)){
                  return userInfo.username = userList.nickname
                }
              })
              this.messageList(userInfo)
              this.messageData.push(this.chatRoomMsg);
            }, 1000);
          })
        // 离开房间成功
        case "SRV_LEAVE_ROOM": 
          // 房主排序第一
          this.concats = userInfo.roomMemberList.sort((a, b) => b.isAdmin - a.isAdmin);
          this.$nextTick(() => {
            setTimeout(() => {
              if(this.isGuest !== false) {
                this.chatAdminUser = this.concats.filter(el => el.username === this.userName)
                // this.isAdmin = true && this.chatAdminUser[0].isAdmin;
              }
            })
          })
          break
        // 发送讯息成功
        case "SRV_ROOM_SEND":
          this.chatListData.forEach((userList)=>{
            if(userInfo.fromChatId === JSON.stringify(userList.id)){
              return userInfo.username = userList.nickname
            }
          })
          this.messageList(userInfo)
          this.messageData.push(this.chatRoomMsg);
          break;
        // 历史讯息
        case "SRV_ROOM_HISTORY_RSP":
          let historyMsgList = userInfo.historyMessage;
          let historyPageSize = userInfo.pageSize;
          if (historyMsgList.length !== historyPageSize) this.isShowMoreMsg = false;
          historyMsgList.forEach((el) => {
            userId.push(el.fromChatId)
            this.chatListData.forEach((userList)=>{
              if(el.fromChatId === JSON.stringify(userList.id)){
                return el.username = userList.nickname
              }
            })
            this.messageList(el)
            this.messageData.unshift(this.chatRoomMsg);
          });
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
        font-size: 16px;
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
