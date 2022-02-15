<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-header :height="device === 'moblie' ?'55px':'70px'" :class="{'PC-header':device === 'pc'}">
          <template v-if="device === 'moblie'">
            <div class="home-header">
              <span
                class="home-user-link"
                :style="!chatUser.isContact ? 'position:none;' : ''"
              >
                <router-link :to="'/HiChat'">
                  <div class="home-user"></div>
                </router-link>
              </span>
              <span class="home-header-title">{{ chatUser.name }}</span>
              <div v-if="chatUser.isContact" class="home-user-search"></div>
              <span class="home-photo-link">
                <router-link :to="'/ContactPage'" v-if="chatUser.isContact">
                  <div class="home-user-photo">
                    <img :src="noIconShow(chatUser)" />
                  </div>
                </router-link>
                <div class="home-user-photo" v-else>
                  <img :src="noIconShow(chatUser)" />
                </div>
              </span>
            </div>
          </template>
    
          <template v-else>
            <div class="home-header-pc">
              <span class="home-photo-link" @click="infoMsgShow">
                <div class="home-user-photo">
                  <img :src="noIconShow(JSON.stringify(chatUser) === '{}'?userData : chatUser)" />  
                </div>
                <span>{{ chatUser.name === undefined ? userData.name: chatUser.name}}</span>
              </span>
              <template v-if="chatUser.isContact">
                <div class="home-user-search"></div>
                <el-dropdown trigger="click" >
                  <div class="el-dropdown-link">
                    <div class="home-user-more"></div>
                  </div>
                  <el-dropdown-menu slot="dropdown" class="chat-more">
                    <el-dropdown-item >
                      <div class="logout-btn" @click="isBlockDialogShow = true">
                        <img src="./../../../static/images/pc/slash.png" alt="" />
                        <span>{{ chatUser.isBlock ? "解除封锁" : "封锁联络人" }}</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div class="logout-btn" @click="isDeleteContactDialogShow = true">
                        <img src="./../../../static/images/pc/trash.png" alt="" />
                        <span style="color:#ee5253">删除联络人</span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-else>
                <div class="contact-box">
                  <ul>
                    <li @click="deleteRecent(chatUser)"><img src="./.../../../../../static/images/pc/trash.png" alt="">删除</li>
                    <li @click="isBlockDialogShow = true">
                      <img src="./.../../../../../static/images/pc/slash-red.png" alt="">
                      {{ chatUser.isBlock ? "解除封锁" : "封锁" }}
                    </li>
                    <li @click="addUser(chatUser)"><img src="./.../../../../../static/images/pc/user-plus-block.png" alt="">加入联络人</li>
                  </ul>
                </div>
              </template>

            </div>
          </template>
        </el-header>
        <div class="contact-box" v-if="!chatUser.isContact && device === 'moblie'">
          <ul>
            <li @click="isBlockDialogShow = true">
              {{ chatUser.isBlock ? "解除封锁" : "封锁" }}
            </li>
            <li @click="deleteRecent(chatUser)">删除</li>
            <li @click="addUser(chatUser)">加入联络人</li>
          </ul>
        </div>
        <message-pabel
          :messageData="messageData"
          :userInfoData="userInfoData"
        />
        <div class="disabled-user" v-if="chatUser.isBlock">
          <span>該用戶已被封鎖</span>
        </div>
        <message-input
          :userInfoData="userInfoData"
          :userData="chatUser"
          v-else
        />
      </el-main>
    </el-container>
    <el-dialog
      :title="device === 'pc'?`${ chatUser.isBlock ? '解除封锁' : '封锁'
          }联络人`:''"
      :visible.sync="isBlockDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'"><img src="./../../../static/images/warn.png" alt="" /></div>
        <span
          >确认是否{{ chatUser.isBlock ? `解除封锁${device === 'pc'?'好友':''}` : `封锁${device === 'pc'?'好友':''}`
          }} {{ chatUser.name }}？</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :class="device === 'moblie'? 'border-red':'background-gray'" @click="isBlockDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="blockSubmitBtn(chatUser)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="device === 'pc'?'加入联络人':''"
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'"><img src="./../../../static/images/success.png" alt="" /></div>
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
    <el-dialog
      title="刪除联络人"
      :visible.sync="isDeleteContactDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <span
          >确认是否删除好友 {{ chatUser.name }}？</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-gray" @click="isDeleteContactDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="deleteSubmitBtn(chatUser)"
          >确认</el-button
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
  deleteContactUser,
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
      isDeleteContactDialogShow: false,
      successDialogShow: false,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.setChatUser(this.userData)
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  mounted() {
    if(this.device === "moblie") this.getChatHistoryMessage();
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
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
      setInfoMsg:"ws/setInfoMsg",
      setChatUser:"ws/setChatUser",
      setHichatNav:"ws/setHichatNav",
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
        this.chatUser.toChatId === undefined
          ? "u" + this.chatUser.contactId
          : this.chatUser.toChatId;
      historyMessageData.targetId = "";
      historyMessageData.pageSize = 1000;
      Socket.send(historyMessageData);
    },
    infoMsgShow(){
      let infoMsg = { infoMsgShow:true,infoMsgNav:'ContactPage',infoMsgChat:true }
      this.setInfoMsg(infoMsg)
    },
    // 已讀
    readMsgShow(data) {
      let sendReadMessageData = this.userInfoData;
      sendReadMessageData.chatType = "CLI_MSG_READ";
      sendReadMessageData.id = Math.random();
      sendReadMessageData.targetId = data.historyId;
      sendReadMessageData.toChatId = data.toChatId;
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
          this.readMsgShow(userInfo);
          break;
        // 历史讯息
        case "SRV_HISTORY_RSP":
          this.messageData = []
          let historyMsgList = userInfo.historyMessage.list;
          historyMsgList.forEach((el) => {
            this.messageList(el);
            this.messageData.unshift(this.chatRoomMsg);
          });
          if(historyMsgList.length > 0) this.readMsgShow(historyMsgList[0]);
          break;
        // 已讀
        case "SRV_MSG_READ":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) res.isRead = true;
          });
          break;
        // 撈取歷史訊息
        case "SRV_RECENT_CHAT":
          if(this.device === "moblie") this.getChatHistoryMessage();
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
            data.isContact = true;
            this.setChatUser(data)
            if(this.device === "pc") {
              let navType = { type:"address", num: 1 };
              this.getHiChatDataList()
              this.setHichatNav(navType);
            }
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
      if (data.isBlock) {
        let blockIdList = [data.toChatId.replace("u", "")];
        unBlockContactUser({ blockIdList })
          .then((res) => {
            if (res.code === 200) {
              data.isBlock = false;
              this.isBlockDialogShow = false;
              this.setChatUser(data)
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
              data.isBlock = true;
              this.isBlockDialogShow = false;
              this.setChatUser(data)
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
    deleteSubmitBtn(data){
      let contactId = data.toChatId.replace("u", "");
      deleteContactUser(contactId)
        .then((res) => {
          if (res.code === 200) {
            this.isDeleteContactDialogShow = false;
            data.isContact = false;
            this.getHiChatDataList()
            this.setChatUser(data)
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
          return false;
        });
    },
    getHiChatDataList() {
      let chatMsgKey = {
        chatType: "CLI_RECENT_CHAT",
        id: Math.random(),
        tokenType: 0,
        deviceId: localStorage.getItem("UUID"),
        token: localStorage.getItem("token"),
      };
      Socket.send(chatMsgKey);
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
    .PC-header {
      position: relative;
      padding: 0;
      background-color: #FFFFFF;
      display: flex;
      .home-header-pc {
        margin: 1em;
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
        .home-user-search,
        .home-user-more {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-size:70%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search {
          position: absolute;
          right: 70px;
          background-image: url("./../../../static/images/pc/search.png");
          cursor: pointer;
        }
        .home-user-more {
          background-image: url("./../../../static/images/pc/more.png");
          cursor: pointer;
        }
        .home-photo-link {
          position: absolute;
          left: 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .home-user-photo {
            text-align: center;
            overflow: hidden;
            img {
              top: 0;
              height: 2em;
              border-radius: 6px;
            }
          }
          span{
            font-size: 15px;
            padding-left: 10px;
            font-weight: 600;
          }
        }
        .contact-box{
          position: absolute;
          right: 0;
          width: 600px;
          ul{
            justify-content: flex-end;
            li{
              margin-left: 5em;
              cursor: pointer;
              img{
                height: 1.2em;
                right: 5px;
                top: 4px !important;
              }
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
