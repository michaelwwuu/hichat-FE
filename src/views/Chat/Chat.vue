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
          :adminUser="adminUser"
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
            <el-checkbox v-model="checked">滚动</el-checkbox>
          </el-row>
        </el-header>
        <message-pabel
          :msgData="msgData"
          :localInfo="localInfo"
          :clearDialog="clearDialog"
          :showMoreMsg="showMoreMsg"
          :adminUser="adminUser"
          :historyId="historyId"
          @showMoreBtn="showMoreBtn"
          :checked="checked"
          @chebox="chebox"
        />
        <div class="disUser" v-show="banUserInputMask"></div>
        <message-input :localInfo="localInfo" />

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
        <el-button type="primary" @click="clearChat">确 定</el-button>
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
      msgData: [],
      userList: [],
      localInfo: {
        toChatId: getLocal("chatRoomId"),
        token: getToken("token"),
        deviceId: getLocal("UUID"),
        platformCode: "dcw",
        tokenType: 1,
      },
      redImg: require("./../../../static/images/envelope.svg"),
      historyId: "",      
      checked: true,
      banUserInputMask: false,
      adminUser: false,
      showMoreMsg: true,
      clearDialog: false,
    };
  },
  mounted() {
    if(!getToken("token")) return this.$router.push({ path: "/Login" });
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
          let HeartTeat ={ chatType: "CLI_HEARTBEAT"}
          setInterval(()=>{
            Socket.send(HeartTeat)
          },25000)
        
          if (val.username === "guest") {
            this.showMoreMsg = false;
            this.banUserInputMask = true;
          }

          //排序房主在第一
          this.concats = val.roomMemberList.sort((a, b) => {
            return b.isAdmin - a.isAdmin;
          });

          this.$nextTick(() => {
            setTimeout(() => {
              // 過濾 socket 斷線不重新Show提示
              this.concats.forEach((el) => {
                this.userList.push(el.username);
                // 封禁人員 自動解開
                this.banUserMsg(el)
              });

              // 新陣列 比對自己進入次數 長度大於一就不 Show 提示
              this.ownUser = this.userList.filter(el => el === val.username);
     
              if (this.ownUser.length === 1) {
                this.$notify({
                  title: `通知`,
                  dangerouslyUseHTMLString: true,
                  message: `
                    <div class="notify-content" style="font-size:16px; font-weight:600">
                      <strong class="notify-title">欢迎)</strong>
                      <span><strong>【${val.username}】进入聊天室</strong</span>
                    </div>
                  `,
                });
              }
              
              // 判斷房主
              this.roomUser = this.concats.filter(el => el.username === getLocal('username'));
              this.adminUser = true && this.roomUser[0].isAdmin;
            });
          });
          
          break;
        case "SRV_LEAVE_ROOM":
          this.concats = val.roomMemberList;
          // 斷線移除此人
          this.userList = this.userList.filter(el => el !== val.username);

          this.$notify({
            title: `通知`,
            dangerouslyUseHTMLString: true,
            message: `
              <div class="notify-content" style="font-size:16px; font-weight:600">
                <strong class="notify-title">:)</strong>
                <span><strong>【${val.username}】离开聊天室</strong</span>
              </div>
            `,
          });
          break;
      }
    }, 
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    //TODO 關閉socket
    closeWebsocket() {
      Socket.onClose();
      window.location.reload();
    },
    redImgIcon(userInfo){
      if(userInfo.chatType === "SRV_ROOM_RED" && getLocal('username') !== "guest") {
        return `<img class="red" src=${this.redImg}>`
      } else if(getLocal('username') === "guest"){
        return '***'
      } else{
        return userInfo.text
      }
    },
    msgList(data) {
      this.roomMsg = {
        banRemainTime: data.banRemainTime,
        chatType: data.chatType,
        chatRoomId: data.toChatId,
        platformCode: data.platformCode,
        historyId: data.historyId,
        message: {
          time: data.sendTime,
          content: this.redImgIcon(data)
        },
        username: data.fromChatId,
      };
    },
    banUserMsg(el){
      let untieTime = el.banRemainTime > 49392123903 ? 49392123903: el.banRemainTime 
      setTimeout(() => {
        return el.banRemainTime = null
      },untieTime);
      if (el.username === getLocal('username') && el.banRemainTime !== null){
        this.banUserInputMask = true;
        setTimeout(() => {
          return this.banUserInputMask = false;
        },untieTime)
      } else if (el.username === getLocal('username') && el.banRemainTime === null){
        this.banUserInputMask = false;
      }
    },
    banUserInput(el,userInfo){
      let untieTime = userInfo.banRemainTime > 49392123903 ? 49392123903: userInfo.banRemainTime;
      if (el.username === userInfo.banUser) {
        el.banRemainTime = userInfo.banRemainTime
        setTimeout(() => {
          return el.banRemainTime = null
        },untieTime);
      }
      if (userInfo.chatType === "SRV_ROOM_BAN" && userInfo.banUser === getLocal("username")){
        this.banUserInputMask = true;
        setTimeout(() => {
          return this.banUserInputMask = false;
        },untieTime);
      } else if (userInfo.chatType === "SRV_ROOM_LIFT_BAN" && userInfo.banUser === getLocal("username")){
        this.banUserInputMask = false;
      }
    },
    // 收取 socket 回來訊息 (全局訊息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_ROOM_SEND":
        case "SRV_ROOM_RED":
          this.concats.forEach((res) => {
            if (userInfo.fromChatId === res.username) return (userInfo.banRemainTime = res.banRemainTime);
          });
          this.msgList(userInfo)
          this.msgData.push(this.roomMsg);
          break;
        case "SRV_ROOM_HISTORY_RSP":
          let historymsgList = userInfo.historyMessage.list;
          let historyPageSize = userInfo.historyMessage.pageSize;
          this.historyId = historymsgList.length < 0 ? historymsgList[0].historyId : "";

          if (historymsgList.length !== historyPageSize) this.showMoreMsg = false;
          historymsgList.forEach((el) => {
            this.concats.forEach((res) => {
              if (el.fromChatId === res.username) return (el.banRemainTime = res.banRemainTime);
            });
            this.msgList(el)
            this.banUserMsg(el)
            this.msgData.unshift(this.roomMsg);
          });
          break;
        case "SRV_ROOM_LIFT_BAN":
        case "SRV_ROOM_BAN":
          this.concats.forEach(el => this.banUserInput(el,userInfo));
          this.msgData.forEach(el => this.banUserInput(el,userInfo));
          break;
      }
    },
    showMoreBtn(val) {
      this.showMoreMsg = val;
      this.checked = val;
    },
    /**清除聊天室內容**/
    clearChat() {
      this.clearDialog = false;
      this.msgData = [];
    },
    chebox(val) {
      this.checked = val;
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
