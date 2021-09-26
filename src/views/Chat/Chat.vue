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
        <message-group :concats="concats" />
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
          :nowSwitchId="nowSwitchId"
          :checked="checked"
          @message="message" />
        <message-input
          :concats="concats"
          :localInfo="localInfo"
        />
      </el-main>
      <footer class="footer">
        <a href="https://xiaobaicai.fun/" target="_blank">WeiLin</a> &copy; 2020
      </footer>
      <audio id="notify-audio" src="./../../../static/wav/tim.wav"></audio>
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
import { mapState,mapMutations } from "vuex";
import MessageGroup from "@/components/message-group";
import MessagePabel from "@/components/message-pabel";
import MessageInput from "@/components/message-input";
import { getLocal,getToken } from "_util/utils.js";
export default {
  name: "Chat",
  data() {
    return {
      concats: [],
      serverMsg:[],
      clearDialog: false,
      checked: true,
      nowSwitch: 0,
      nowSwitchId: 'group',
      localInfo: {},
      toChatId: getLocal('toChatId'),
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    window.addEventListener('beforeunload', this.webSocketConnet)
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    this.closeWebsocket()
  },
  destroyed(){
    window.removeEventListener('beforeunload', this.webSocketConnet)
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  watch: {
    wsRes(val) {
      const StatusCode = val;  
      if(StatusCode.chatType === "SRV_JOIN_ROOM"){
        console.log('<--【连线成功】------加入群組聊天室------【成功】------聊天室人員已列表加載-->')
        this.concats = StatusCode.roomMemberList
        this.$notify({
          title: `通知`,
          dangerouslyUseHTMLString: true,
          message: `
            <div class="notify-content" style="font-size:16px; font-weight:600">
              <strong class="notify-title">'欢迎:)'</strong>
              <span><strong>【${StatusCode.fromChatId}】进入聊天室 </strong</span>
            </div>
          `
        })
      }
    },
  },
  mounted() {
    if (getToken("token") === ''){
      this.goBack();
    } else{
      Socket.connect();
    }
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
    webSocketConnet() {
      this.closeWebsocket()
    },
    //TODO 關閉socket
    closeWebsocket(){
      Socket.onclose()
    },
    // 收取 socket 回來訊息 (全局訊息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));

      let userInfo = JSON.parse(msg)
      switch (userInfo.chatType) {
        case "SRV_RECENT_CHAT":
          console.log('<--【连线成功】------写入登入者资讯-->')
          this.localInfo = {
            toChatId:getLocal('toChatId'),
            token:getToken("token"),
            deviceId:getLocal('UUID'),
            fromChatId: userInfo.toChatId,
          };
          break;
        case "SRV_ROOM_SEND":
          console.log('<--【连线成功】------群组内所有人讯息-->',userInfo)
          let srvRoomMsg = {
            chatType: userInfo.chatType,
            fromId: userInfo.fromChatId,
            gotoId: userInfo.toChatId,
            message: { 
              time: +new Date(), 
              content: userInfo.text, 
              textContent: userInfo.text 
            },
            userName: userInfo.fromChatId,
          };
          this.serverMsg.push(srvRoomMsg)
          break;
        default:
          break;
      }
    },
    /**接收消息-父件需用到資料時**/
    message(response) {
      console.log(response)
      let chatType = response.chatType
      if(chatType === "CLI_ROOM_SEND") this.serverMsg.push(response)
    },
    /**清除聊天室內容**/
    clearChat() {
      this.clearDialog = false;
      this.serverMsg = []
    },
    /**回上一頁**/
    goBack() {
      localStorage.clear();
      this.$$route.push({ path: "/Login" });
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
