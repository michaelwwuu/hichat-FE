<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <span class="home-user-link">
              <router-link :to="'/HiChat'">
                <div class="home-user"></div>
              </router-link>
            </span>
            <span class="home-header-title">{{ userData.name }}</span>
            <div class="home-user-search"></div>
            <span class="home-photo-link">
              <router-link :to="'/ContactPage'">
                <div class="home-user-photo">
                  <img
                    src="./../../../static/images/image_user_defult.png"
                    alt=""
                  />
                </div>
              </router-link>
            </span>
          </div>
          <div class="home-header">
            <div class="home-user"></div>
            <span class="home-header-title">{{ userData.name }}</span>
            <div class="home-user-search"></div>
          </div>
        </el-header>
        <div class="contact-box" v-if="!userData.isContact">
          <ul>
            <li>封锁</li>
            <li>删除</li>
            <li @click="addUser(userData)">加入联络人</li>
          </ul>
        </div>
        <message-pabel
          :messageData="messageData"
          :userInfoData="userInfoData"
        />
        <message-input :userInfoData="userInfoData" :userData="userData" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { addContactUser } from "@/api";
import { mapState, mapMutations } from "vuex";
import { getLocal, getToken } from "_util/utils.js";
import MessagePabel from "@/components/message-pabel-moblie";
import MessageInput from "@/components/message-input-moblie";


export default {
  name: "ChatMsg",
  data() {
    return {
      concats: [],
      messageData: [],
      userInfoData: {
        token: getToken("token"),
        deviceId: getLocal("UUID"),
        tokenType: 0,
      },
      userData: {},
      readMsgData: [],
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  mounted() {
    this.getChatHistoryMessage();
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),

    // 訊息統一格式
    messageList(data) {
      this.chatRoomMsg = {
        chatType: data.chat.chatType,
        historyId: data.chat.historyId,
        message: {
          time: data.chat.sendTime,
          content: data.chat.text,
        },
        isRead: data.isRead,
        userChatId: data.chat.fromChatId,
      };
    },

    // 獲取歷史訊息
    getChatHistoryMessage() {
      let historyMessageData = this.userInfoData;
      historyMessageData.chatType = "CLI_HISTORY_REQ";
      historyMessageData.id = Math.random();
      historyMessageData.toChatId =
        this.userData.toChatId === undefined
          ? "u" + this.userData.contactId
          : this.userData.toChatId;
      historyMessageData.targetId = "";
      historyMessageData.pageSize = 1000;
      Socket.send(historyMessageData);
    },

    // 已讀
    readMsgShow() {
      let sendReadMessageData = this.userInfoData;
      sendReadMessageData.chatType = "CLI_MSG_READ";
      sendReadMessageData.id = Math.random();
      sendReadMessageData.targetArray = this.readMsgData;
      Socket.send(sendReadMessageData);
    },

    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        // 发送影片照片讯息成功
        // 发送讯息成功
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
          this.messageList(userInfo);
          this.messageData.push(this.chatRoomMsg);
          this.readMsgData.push(userInfo.historyId);
          break;
        // 历史讯息
        case "SRV_HISTORY_RSP":
          let historyMsgList = userInfo.historyMessage.list;
          historyMsgList.forEach((el) => {
            if (el.chat.fromChatId !== 'u' + localStorage.getItem('id') && !el.isRead) this.readMsgData.push(el.chat.historyId);
            this.messageList(el);
            this.messageData.unshift(this.chatRoomMsg);
          });
          this.readMsgShow();
          break;
        // 已讀
        case "SRV_MSG_READ":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) res.isRead = true;
          });
          break;
        // 撈取歷史訊息
        case "SRV_RECENT_CHAT":
          this.getChatHistoryMessage();
          break;
      }
    },
    addUser(data) {
      let parmas = {
        contactId: data.toChatId.replace("u", ""),
        name: data.name,
      };
      addContactUser(parmas).then((res) => {
        if (res.code === 200) {
          this.userData.isContact = true
          localStorage.setItem("userData",JSON.stringify(this.userData))
        } else {
          this.$message({ message: res.message, type: "error" });
        }
      });
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
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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
      padding: 0;
      position: relative;
      overflow: hidden;
      border-right: 1px solid #ffffff;
      .home-header {
        margin: 1.5em 1em 1em 1em;
        display: flex;
        align-items: center;
        .home-user-link {
          position: absolute;
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
        }
        .home-header-title {
          margin: 0 auto;
          color: #10686e;
          font-weight: 600;
        }
        .home-user-photo,
        .home-user-search {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-color: #fff;
          background-size: 50%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search {
          margin-right: 10px;
          position: absolute;
          right: 50px;
          background-image: url("./../../../static/images/search_icon.png");
        }
        .home-photo-link {
          position: absolute;
          right: 14px;
          .home-user-photo {
            text-align: center;
            img {
              top: 0;
              height: 2em;
            }
          }
        }
      }
    
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
    .contact-box{
      background-color: #FFFFFF;
      width: 100vw;
      ul{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 3em;
        width: 80vw;
        margin: 0 auto; 
        font-weight: 550;
        li{
          &:nth-child(1),&:nth-child(2){
            color:#ee5253;
          }
          &:nth-child(3){
            color:#363636
          }
        }
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
</style>
