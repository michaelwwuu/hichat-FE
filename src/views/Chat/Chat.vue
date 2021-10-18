<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="290px">
        <el-header height="55px">
          <img src="./../../../static/images/user-group.svg" alt="" />
          <span class="title"
            >聊天室人數
            <img
              class="online-img"
              src="./../../../static/images/online.svg"
              alt=""
            />{{ concats.length }}</span
          >
        </el-header>
        <message-group
          :concats="concats"
          :isAdmin="isAdmin"
          @handleGetMessage="handleGetMessage"
        />
      </el-aside>
      <el-main>
        <el-header height="55px">
          <el-row>
            <el-button
              size="mini"
              style="margin-right: 15px"
              @click="clearDialog = true"
              >清频</el-button
            >
            <el-checkbox v-model="isChecked">滚动</el-checkbox>
          </el-row>
        </el-header>
        <message-pabel
          :isAdmin="isAdmin"
          :isChecked="isChecked"
          :clearDialog="clearDialog"
          :messageData="messageData"
          :userInfoData="userInfoData"
          :isShowMoreMsg="isShowMoreMsg"
          @isShowMoreBtn="isShowMoreBtn"
          @checkBox="checkBox"
        />
        <div class="disUser" v-show="banUserInputMask"></div>
        <message-input :userInfoData="userInfoData" />

      </el-main>
    </el-container>
    <el-dialog
      title="聊天室清除"
      :visible.sync="clearDialog"
      width="30%"
      center
    >
      <span>確定要清除聊天室</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="clearChatScreen">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import MessageGroup from "@/components/message-group";
import MessagePabel from "@/components/message-pabel";
import MessageInput from "@/components/message-input";
import { getLocal, getToken } from "_util/utils.js";
export default {
  name: "Chat",
  data() {
    return {
      concats: [],
      messageData: [],
      userMemberList: [],
      userInfoData: {
        toChatId: getLocal("chatRoomId"),
        token: getToken("token"),
        deviceId: getLocal("UUID"),
        platformCode: "dcw",
        tokenType: 1,
      },
      isChecked: true,
      isAdmin: false,
      clearDialog: false,
      isShowMoreMsg: true,
      banUserInputMask: false,
      redEnvelopeImg: require("./../../../static/images/envelope.svg"),
      isGuest:getLocal('isGuest'),
    };
  },
  mounted() {
    if(!getToken("token")) return this.$router.push({ path: "/Login" });  
    if(this.isGuest) {
      this.isShowMoreMsg = false
      this.banUserInputMask = true
    }
  },
  created() {
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
                // 封禁人員 自動解開
                this.banUserMsg(el)
              });
              // 新陣列 統計自己進入次數 長度大於一就不 Show 提示
              this.statisticalData = this.userMemberList.filter(el => el === val.username);
              if (this.statisticalData.length === 1) this.promptPopup(val)
              this.userMemberList = Array.from(new Set(this.userMemberList))
            });
          });  
          break;
        case "SRV_LEAVE_ROOM":
          // 斷線移除此人
          this.userMemberList = this.userMemberList.filter(el => el !== val.username);
          this.promptPopup(val)
          break;
      }
    }, 
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
   
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

    // 紅包
    redEnvelopeIcon(userInfo){
      if(userInfo.chatType === "SRV_ROOM_RED" && getLocal('username') !== "guest") {
        return `<img class="red" src=${this.redEnvelopeImg}>`
      } else if(getLocal('username') === "guest"){
        return '***'
      } else{
        return userInfo.text
      }
    },

    // 收取 socket 回來訊息 (全局訊息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_JOIN_ROOM":
        case "SRV_LEAVE_ROOM": 
          // 房主排序第一
          this.concats = userInfo.roomMemberList.sort((a, b) => b.isAdmin - a.isAdmin);
          this.$nextTick(() => {
            setTimeout(() => {
              if(!getLocal('isGuest')){
                this.chatAdminUser = this.concats.filter(el => el.username === getLocal("username"))
                this.isAdmin = true && this.chatAdminUser[0].isAdmin;
              }
            })
          })
          break
        case "SRV_ROOM_SEND":
        case "SRV_ROOM_RED":
          this.concats.forEach((res) => {
            if (userInfo.fromChatId === res.username) return (userInfo.banRemainTime = res.banRemainTime);
          });
          this.messageList(userInfo)
          this.messageData.push(this.chatRoomMsg);
          break;
        case "SRV_ROOM_BAN":
        case "SRV_ROOM_LIFT_BAN":
          this.concats.forEach(el => this.banUserInput(el,userInfo));
          this.messageData.forEach(el => this.banUserInput(el,userInfo));
          break;
        case "SRV_ROOM_HISTORY_RSP":
          let historyMsgList = userInfo.historyMessage;
          let historyPageSize = userInfo.pageSize;
          if (historyMsgList.length !== historyPageSize) this.isShowMoreMsg = false;
          historyMsgList.forEach((el) => {
            this.concats.forEach((res) => {
              if (el.fromChatId === res.username) return (el.banRemainTime = res.banRemainTime);
            });
            this.banUserMsg(el)
            this.messageList(el)
            this.messageData.unshift(this.chatRoomMsg);
          });
          break;  
      }
    },

    // 通知加入
    promptPopup(data){
      this.$notify({
        title: `通知`,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="notify-content" style="font-size:16px; font-weight:600">
            <strong class="notify-title">${data.chatType === 'SRV_JOIN_ROOM' ? '欢迎':''}:)</strong>
            <span><strong>【${data.username}】${data.chatType === 'SRV_JOIN_ROOM' ? '进入':'离开'}聊天室</strong</span>
          </div>
        `,
      });
    },


    // 封禁列表 訊息內
    banUserMsg(el){
      let banUserTime = el.banRemainTime > 49392123903 ? 49392123903: el.banRemainTime 
      setTimeout(() => {
        return el.banRemainTime = null
      },banUserTime);
      if(el.username === getLocal('username')){
        if(el.banRemainTime !== null){
          this.banUserInputMask = true;
          setTimeout(() => {
            return this.banUserInputMask = false;
          },banUserTime)
        }else if(el.banRemainTime === null){
          this.banUserInputMask = false;
        }
      }
    },

    // 封禁列表 輸入框
    banUserInput(el,userInfo){
      let banUserTime = userInfo.banRemainTime > 49392123903 ? 49392123903: userInfo.banRemainTime;
      if (el.username === userInfo.banUser) {
        el.banRemainTime = userInfo.banRemainTime
        setTimeout(() => {
          return el.banRemainTime = null
        },banUserTime);
      }
      
      let chatType = userInfo.chatType
      if(userInfo.banUser === getLocal("username")){
        if(chatType === "SRV_ROOM_BAN"){
          this.banUserInputMask = true;
          setTimeout(() => {
            return this.banUserInputMask = false;
          },banUserTime);
        }else if(chatType === "SRV_ROOM_LIFT_BAN"){
          this.banUserInputMask = false;
        }
      }

    },

    // 歷史訊息查看按鈕
    isShowMoreBtn(val) {
      this.isChecked = val;
      this.isShowMoreMsg = val;
    },

    // 清除聊天室內容
    clearChatScreen() {
      this.clearDialog = false;
      this.messageData = [];
    },

    // 頁面滾動事件
    checkBox(val) {
      this.isChecked = val;
    },

    // 關閉socket
    closeWebsocket() {
      Socket.onClose();
      window.location.reload();
    },
  },
  components: {
    MessageGroup,
    MessagePabel,
    MessageInput,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  .search {
    display: inline-flex;
    align-content: center;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
  }
  .search-list {
    display: inline-flex;
    align-content: center;
    align-items: center;
    position: fixed;
    top: 45px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    height: 6%;
    margin: 30px auto;
    div {
      margin-left: 10px;
    }
  }
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
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
    .el-main {
      border-radius: 0px 6px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
    }
    .el-header {
      position: relative;
      line-height: 55px;
      background-image: linear-gradient(#579fff, #3481e8);
      overflow: hidden;
      border-right: 1px solid #ffffff;
      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
  }
  .disUser {
    background: #0000007d;
    height: 144px;
    position: relative;
    margin-bottom: -145px;
    cursor: not-allowed;
    z-index: 9999;
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
