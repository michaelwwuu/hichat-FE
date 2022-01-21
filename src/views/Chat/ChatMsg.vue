<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <span
              class="home-user-link"
              :style="!userData.isContact ? 'position:none;' : ''"
            >
              <router-link :to="'/HiChat'">
                <div class="home-user"></div>
              </router-link>
            </span>
            <span class="home-header-title">{{ userData.name }}</span>
            <div v-if="userData.isContact" class="home-user-search"></div>
            <span class="home-photo-link">
              <router-link :to="'/ContactPage'" v-if="userData.isContact">
                <div class="home-user-photo">
                  <img
                    :src="
                      userData.icon === undefined ||
                      userData.icon === null ||
                      userData.icon === ''
                        ? require('./../../../static/images/image_user_defult.png')
                        : userData.icon
                    "
                  />
                </div>
              </router-link>
              <div class="home-user-photo" v-else>
                <img :src="noIconShow(userData)" />
              </div>
            </span>
          </div>
        </el-header>
        <div class="contact-box" v-if="!userData.isContact">
          <ul>
            <li @click="isBlockDialogShow = true">
              {{ userData.isBlock ? "解除封锁" : "封锁" }}
            </li>
            <li @click="deleteRecent(userData)">删除</li>
            <li @click="addUser(userData)">加入联络人</li>
          </ul>
        </div>
        <message-pabel
          :messageData="messageData"
          :userInfoData="userInfoData"
        />
        <div class="disabled-user" v-if="userData.isBlock">
          <span>該用戶已被封鎖</span>
        </div>
        <message-input
          :userInfoData="userInfoData"
          :userData="userData"
          v-else
        />
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="isBlockDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span
          >确认是否{{ userData.isBlock ? "解除封锁" : "封锁"
          }}{{ userData.name }}？</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="isBlockDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="blockSubmitBtn(userData)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>加入成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="successDialogShow = false"
          >確認</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>刪除成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="$router.push({ path: '/Address' })"
          >確認</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import {
  addContactUser,
  addBlockContactUser,
  unBlockContactUser,
  deleteRecentChat,
} from "@/api";
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
      noIcon: require("./../../../static/images/image_user_defult.png"),
      deleteDialogShow:false,
      isBlockDialogShow: false,
      successDialogShow: false,
    };
  },
  watch:{

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
    noIconShow(iconData) {
      if (
        iconData.icon === undefined ||
        iconData.icon === null ||
        iconData.icon === ""
      ) {
        return this.noIcon;
      } else {
        return iconData.icon;
      }
    },
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
          if(userInfo.isRead){
            this.readMsgData.push(userInfo.historyId)
            this.readMsgShow();
          }
          break;
        // 历史讯息
        case "SRV_HISTORY_RSP":
          let historyMsgList = userInfo.historyMessage.list;
          historyMsgList.forEach((el) => {
            if (
              el.chat.fromChatId !== "u" + localStorage.getItem("id") &&
              !el.isRead
            )
            this.readMsgData.push(el.chat.historyId);
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
      addContactUser(parmas)
        .then((res) => {
          if (res.code === 200) {
            this.successDialogShow = true;
            this.userData.isContact = true;
            localStorage.setItem("userData", JSON.stringify(this.userData));
          } else {
            this.$message({ message: res.message, type: "error" });
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
          return false;
        });
    },
    deleteRecent(data) {
      let parmas = {
        fullDelete: false,
        historyId: "",
        toChatId: data.toChatId,
      };
      deleteRecentChat(parmas)
        .then((res) => {
          if (res.code === 200) {
            this.deleteDialogShow = true;
            localStorage.removeItem("userData");
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
    blockSubmitBtn(data) {
      if (this.userData.isBlock) {
        let blockIdList = [this.userData.toChatId.replace("u", "")];
        unBlockContactUser({ blockIdList })
          .then((res) => {
            if (res.code === 200) {
              this.userData.isBlock = false;
              this.isBlockDialogShow = false;
              localStorage.setItem("userData", JSON.stringify(this.userData));
            }
          })
          .catch((err) => {
            this.$message({ message: err, type: "error" });
            return false;
          });
      } else {
        let blockId = data.toChatId.replace("u", "");
        addBlockContactUser({ blockId })
          .then((res) => {
            if (res.code === 200) {
              this.userData.isBlock = true;
              this.isBlockDialogShow = false;
              localStorage.setItem("userData", JSON.stringify(this.userData));
            } else {
              this.$message({ message: res.message, type: "error" });
            }
          })
          .catch((err) => {
            this.$message({ message: err, type: "error" });
            return false;
          });
      }
    },
    back() {
      this.$router.back(-1);
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
  // min-height: 100vh;
  // min-height: webkit-fill-available;
  overflow: hidden;
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
      position: relative;
      padding: 0;
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
          // background-color: #fff;
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
            overflow: hidden;
            img {
              top: 0;
              height: 2em;
              border-radius: 6px;
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
    .contact-box {
      background-color: #ffffff;
      width: 100vw;
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 3em;
        width: 85%;
        margin: 0 auto;
        font-weight: 550;
        li {
          &:nth-child(1) {
            color: #ee5253;
          }
          &:nth-child(2) {
            color: #ee5253;
          }
          &:nth-child(3) {
            color: #363636;
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
.disabled-user {
  height: 50px;
  background-color: rgba(225, 225, 225, 0.85);
  border-top: 1px solid #dddddd;
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/deep/.el-dialog-loginOut {
  overflow: auto;
  .el-dialog {
    position: relative;
    margin: 0 auto 50px;
    background: #ffffff;
    border-radius: 10px;
    box-sizing: border-box;
    width: 50%;
    .el-dialog__header {
      padding: 10px;
    }
    .el-dialog__body {
      text-align: center;
      padding: 25px 25px 15px;
      .loginOut-box {
        img {
          height: 5em;
          margin-bottom: 1.2em;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px;
      padding-top: 10px;
      text-align: right;
      box-sizing: border-box;
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        .el-button {
          width: 100%;
          border-radius: 8px;
        }
        .background-red {
          background-color: #ee5253;
          color: #fff;
        }
        .background-orange {
          background-color: #fe5f3f;
          color: #fff;
        }
        .border-red {
          border: 1px solid #fe5f3f;
          color: #fe5f3f;
        }
      }
    }
  }
}
</style>
