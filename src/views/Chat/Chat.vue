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
          :localInfo="localInfo"
          @showMoreBtn="showMoreBtn"
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
          :serverMsg="serverMsg"
          :localInfo="localInfo"
          :clearDialog="clearDialog"
          :showMoreMsg="showMoreMsg"
          :adminUser="adminUser"
          :historyId="historyId"
          :checked="checked"
          @chebox="chebox"
        />
        <div class="disUser" v-show="disUser"></div>
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
      serverMsg: [],
      clearDialog: false,
      checked: true,
      showMoreMsg: true,
      nowSwitch: 0,
      localInfo: {
        toChatId: "",
        token: getToken("token"),
        deviceId: getLocal("UUID"),
        platformCode: "dcw",
        tokenType: 1,
      },
      redImg: require("./../../../static/images/envelope.svg"),
      adminUser: false,
      userList: [],
      historyId: "",
      disUser: false,
    };
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
          console.log(
            "<--【连线成功】------加入群組聊天室------【成功】------聊天室人員已列表加載-->"
          );
          if (val.username === "guest") {
            this.showMoreMsg = false;
            this.disUser = true;
          }
          this.localInfo.toChatId = val.chatRoomId;
 
          this.concats = val.roomMemberList.sort((a, b) => {
            return b.isAdmin - a.isAdmin;
          });
          this.$nextTick(() => {
            setTimeout(() => {
              // 過濾 socket 斷線不重新Show提示
              this.concats.forEach((el) => {
                this.userList.push(el.username);
                if(el.username === getLocal("username") && el.banTime === null){
                  this.disUser = false;
                } else if(el.username === getLocal("username") && el.banTime !== null){
                  this.disUser = true;
                }
              });

              this.roomName = this.userList.filter((el) => {
                return el === val.username;
              });
              if (this.roomName.length === 1) {
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
              
              //最高使用者
              this.joinUser = getLocal('username')
              this.roomUser = this.concats.filter((el) => {
                return el.username === this.joinUser
              });
              this.adminUser = true && this.roomUser[0].isAdmin;
            });
          });
          break;
        case "SRV_LEAVE_ROOM":
          console.log("<--【中断连线】------使用者加入或离开聊天室-->");
          this.concats = val.roomMemberList;

          // 斷線移除此人
          this.userList = this.userList.filter((el) => {
            return el !== val.username;
          });

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

    // 收取 socket 回來訊息 (全局訊息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_RECENT_CHAT":
          console.log("<--【连线成功】------写入登入者资讯-->");
          break;
        case "SRV_ROOM_SEND":
          console.log("<--【连线成功】------群组内所有人讯息-->");
        case "SRV_ROOM_RED":
          this.concats.forEach((list) => {
            if (userInfo.fromChatId === list.username) return (userInfo.banTime = list.banTime);
          });
          let srvRoomMsg = {
            banTime: userInfo.banTime,
            chatType: userInfo.chatType,
            toChatId: userInfo.toChatId,
            platformCode: userInfo.platformCode,
            historyId: userInfo.historyId,
            message: {
              time: userInfo.sendTime,
              content: this.redImgIcon(userInfo)
            },
            username: userInfo.fromChatId,
          };
          this.serverMsg.push(srvRoomMsg);
          break;
        case "SRV_ROOM_HISTORY_RSP":
          console.log("<--【连线成功】------已提取历史讯息-->");
          let history = userInfo.historyMessage.list;
          let historyPageSize = userInfo.historyMessage.pageSize;
          this.historyId = history.length < 0 ? history[0].historyId : "";

          if (history.length !== historyPageSize) this.showMoreMsg = false;

          history.forEach((el) => {
            this.concats.forEach((list) => {
              if (el.fromChatId === list.username) return (el.banTime = list.banTime);
            });
            let historyMsg = {
              banTime: el.banTime,
              chatType: el.chatType,
              toChatId: el.toChatId,
              platformCode: el.platformCode,
              historyId: el.historyId,
              message: {
                time: el.sendTime,
                content:
                  el.chatType === "SRV_ROOM_RED"
                    ? `<img class="red" src=${this.redImg}>`
                    : el.text,
              },
              username: el.fromChatId,
            };
            this.serverMsg.unshift(historyMsg);
          });
          break;
        case "CLI_ROOM_BAN":
        case "SRV_ROOM_LIFT_BAN":
        case "SRV_ROOM_BAN":
          
          this.concats.filter((el) => {
            if (el.username === userInfo.banUser) {
              el.banTime = userInfo.banTime
              if(el.banTime !== null){
                // let banTime = new Date(el.banTime);
                // let nowTime = new Date();
                // var s1 = nowTime.getTime(),s2 = banTime.getTime();
                // var total = (s2 - s1)/1000;
                // var day = parseInt(total / (24*60*60));//计算整数天数
                // var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
                // console.log(` ${Math.ceil(afterDay)}`)
                if(userInfo.chatType === "CLI_ROOM_BAN"){
                  this.untieTime = userInfo.minute*60*1000
                  this.concats.filter((el) =>{
                    setTimeout(() => {
                      if(el.username === userInfo.banUser) return el.banTime = null
                    },this.untieTime);
                  })
                }
              }
            }
          });
          this.serverMsg.forEach((el) => {
            if (el.username === userInfo.banUser) {
              return (el.banTime = userInfo.banTime)
            }
          });
          if (userInfo.chatType === "SRV_ROOM_BAN" && userInfo.banUser === getLocal("username")){
            this.disUser = true;
          } else if (userInfo.chatType === "SRV_ROOM_LIFT_BAN" &&userInfo.banUser === getLocal("username")){
            this.disUser = false;
          }
            
          break;
      }
    },
    showMoreBtn(val) {
      this.showMoreMsg = val;
    },
    /**清除聊天室內容**/
    clearChat() {
      this.clearDialog = false;
      this.serverMsg = [];
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
  background-image: url("/static/images/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
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
</style>
