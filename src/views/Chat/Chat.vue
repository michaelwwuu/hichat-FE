<template>
  <div class="wrapper">
    <el-container v-show="topMsgShow">
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header class="PC-header" height="70px">
          <div class="home-header-pc">
            <span class="home-photo-link" @click="infoMsgShow">
              <div class="home-user-photo">
                <img :src="noIconShow(groupUser)" />
              </div>
              <span>{{
                groupUser.groupName === undefined
                  ? groupData.groupName
                  : groupUser.groupName
              }}</span>
            </span>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link">
                <div class="home-user-more"></div>
              </div>
              <el-dropdown-menu slot="dropdown" class="chat-more">
                <el-dropdown-item>
                  <div
                    class="logout-btn"
                    v-if="groupUser.isAdmin"
                    @click="changeGroupAdminShow"
                  >
                    <img src="./../../../static/images/pc/key.png" alt="" />
                    <span>转移管理者权限</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="logout-btn" @click="leaveGroupDialogShow = true">
                    <img src="./../../../static/images/pc/trash.png" alt="" />
                    <span style="color: #ee5253">退出群组</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main
          v-loading="loading"
          element-loading-text="讯息加载中"
          element-loading-background="rgba(255, 255, 255, 0.5)"
        >        
          <!-- 置頂訊息 -->
          <div class="top-msg" v-if="pinMsg !==''">
            <div class="top-msg-left">
              <img src="./../../../static/images/pin.png" alt="">
              <span v-if="pinDataList[0].chatType === 'SRV_USER_IMAGE'">
                <img :src="isBase64(pinMsg)" alt="">
              </span>
              <span v-else>{{ isBase64(pinMsg) }}</span>
            </div>
            <img class="top-msg-right" src="./../../../static/images/next.png" alt="" @click="goTopMsgShow"/>
          </div>
          <message-pabel
            :messageData="messageData"
            :userInfoData="userInfoData"
            @deleteMsgHistoryData="deleteMsgData"
            @resetPinMsg="resetPinMsg"
          />
          <div
            class="reply-message"
            v-if="
              replyMsg.clickType === 'replyMsg' ||
              replyMsg.clickType === 'editMsg'
            "
          >
            <img
              :src="noIconShow(replyMsg)"
              alt=""
              style="height: 2.5em; width: 2.5em; border-radius: 5px"
            />
            <div class="reply-message-box">
              <span>{{ replyMsg.name }}</span>
              <span v-if="replyMsg.chatType === 'SRV_GROUP_SEND'">{{
                replyMsg.innerText.length > 110
                  ? replyMsg.innerText.substr(0, 110) + " ..."
                  : replyMsg.innerText
              }}</span>
              <span
                v-else-if="replyMsg.chatType === 'SRV_GROUP_IMAGE'"
                class="replyMsg-Img"
              >
                <img :src="replyMsg.innerText" alt="" />
              </span>
              <span v-else-if="replyMsg.chatType === 'SRV_GROUP_AUDIO'"
                >回復語音訊息</span
              >
            </div>
            <div class="reply-close-btn" @click="closeReplyMessage">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <message-input :userInfoData="userInfoData" :groupData="groupUser" />
        </el-main>
      </el-main>
    </el-container>
    <el-container v-show="!topMsgShow">
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header class="PC-header" height="70px">
          <div class="home-header-pc">
            <span
              class="home-photo-link"
              @click="setTopMsgShow(true)"
            >
              <span style="padding-right: 10px" 
                ><img
                  src="./../../../static/images/pc/arrow-left.png"
                  alt=""
              /></span>
              <span>{{ isBase64(pinMsg) }}</span>
            </span>
            <el-dropdown trigger="click">
              <div class="el-dropdown-link">
                <div class="home-user-more"></div>
              </div>
              <el-dropdown-menu slot="dropdown" class="chat-more">
                <el-dropdown-item>
                  <div
                    class="logout-btn"
                    v-if="groupUser.isAdmin"
                    @click="changeGroupAdminShow"
                  >
                    <img src="./../../../static/images/pc/key.png" alt="" />
                    <span>转移管理者权限</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="logout-btn" @click="leaveGroupDialogShow = true">
                    <img src="./../../../static/images/pc/trash.png" alt="" />
                    <span style="color: #ee5253">退出群组</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <message-pin
          :userInfoData="userInfoData"
          @resetPinMsg="resetPinMsg"
        />
        <div class="top-msg-bottom" @click="untopMsgAction">
          <span>取消所有置顶讯息(共 {{ pinDataList.length }} 則)</span>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="退出群組"
      :visible.sync="leaveGroupDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span v-if="groupUser.isAdmin">
          <span>管理者退出將解散群組</span>
          <span>确认是否退出？</span>
        </span>
        <span v-else>确认是否退出群組？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-gray" @click="leaveGroupDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="submitBtn">确认</el-button>
      </span>
    </el-dialog>
    <audio
      id="notify-receive-audio"
      muted="muted"
      src="./../../../static/wav/receive.mp3"
    ></audio>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { Decrypt } from "@/utils/AESUtils.js";
import { groupListMember, leaveGroup,pinList,unpinHistory } from "@/api";
import { mapState, mapMutations } from "vuex";
import { getLocal, getToken } from "_util/utils.js";
import MessagePabel from "@/components/message-group-moblie";
import MessageInput from "@/components/message-group-input-moblie";
import MessagePin from "@/components/message-group-pin";

export default {
  name: "ChatGroupMsg",
  data() {
    return {
      concats: [],
      messageData: [],
      newMessageData: [],
      userInfoData: {
        token: getToken("token"),
        deviceId: getLocal("UUID"),
        tokenType: 0,
      },
      pinMsg:"",
      groupData: {},
      readMsgData: [],
      contactList: [],
      leaveGroupDialogShow: false,
      loading: false,
      pinDataList:[],
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    if (this.groupData !== null) this.setChatGroup(this.groupData);
    Socket.$on("message", this.handleGetMessage);
    this.getPinList()
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      replyMsg: (state) => state.ws.replyMsg,
      calloutShow: (state) => state.ws.calloutShow,
      topMsgShow: (state) => state.ws.topMsgShow,
      contactListData: (state) => state.ws.contactListData,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setChatGroup: "ws/setChatGroup",
      setHichatNav: "ws/setHichatNav",
      setTopMsgShow:"ws/setTopMsgShow",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setContactListData: "ws/setContactListData",
    }),
    resetPinMsg(){
     this.getPinList()
    },    
    goTopMsgShow(){
      this.setTopMsgShow(false)
    }, 
    untopMsgAction() {
      let param = {
        toChatId: this.groupData.toChatId,
      };
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.setTopMsgShow(true);
        }
      });
    },     
    deleteMsgData(data) {
      this.messageData = this.messageData.filter((item) => {
        return item.historyId !== data.historyId;
      });
      this.getHiChatDataList();
    },
    noIconShow(iconData) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require("./../../../static/images/image_group_defult.png");
      } else {
        return iconData.icon;
      }
    },
    closeReplyMessage() {
      this.setReplyMsg({
        name: "",
        icon: "",
        chatType: "",
        clickType: "",
        innerText: "",
        replyHistoryId: "",
      });
      this.setEditMsg({ innerText: "" });
    },
    changeGroupAdminShow() {
      this.setMsgInfoPage({ pageShow: false, type: "AdminChange" });
      this.infoMsgShow();
    },
    infoMsgShow() {
      this.setMsgInfoPage({ pageShow: true, type: "" });
      this.setInfoMsg({
        infoMsgShow: true,
        infoMsgNav: "GroupPage",
        infoMsgChat: true,
      });
    },
    getPinList() {
      let toChatId = this.groupData.toChatId;
      pinList({ toChatId }).then((res) => {
        if (res.code === 200) {
          this.pinDataList = res.data;
          if (this.pinDataList[0].chatType === "SRV_GROUP_AUDIO") {
            this.pinMsg = "語音訊息";
          } else {
            this.pinMsg = this.pinDataList[0].chat.text;
          }
          this.messageData.forEach((data) => {
            this.pinDataList.forEach((list) => {
              if (data.historyId === list.historyId) {
                data.isPing = true;
              }
            });
          });
        }
      });
    },    
    getGroupListMember() {
      let groupId = this.groupData.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          if (item.icon === undefined) {
            item.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.setContactListData(this.contactList);
      });
    },
    // 訊息統一格式
    messageList(data) {
      this.groupListData = JSON.parse(localStorage.getItem("groupListMember"));
      this.groupListData.forEach((item) => {
        if (data.chat.fromChatId === "u" + item.memberId) {
          data.chat.icon = item.icon;
          data.chat.name = item.name;
          data.chat.username = item.username;
        } else if (
          data.chat.icon === undefined &&
          data.chat.name === undefined
        ) {
          data.chat.icon = require("./../../../static/images/image_user_defult.png");
          data.chat.name = "无此成员";
        }
        if (
          data.replyChat !== null &&
          data.replyChat.fromChatId === "u" + item.memberId
        ) {
          data.replyChat.icon = item.icon;
          data.replyChat.nickName = item.name;
        }
      });
      this.chatRoomMsg = {
        chatType: data.chat.chatType,
        historyId: data.chat.historyId,
        message: {
          time: data.chat.sendTime,
          content: this.isBase64(data.chat.text),
        },
        isRead: data.isRead,
        userChatId: data.chat.fromChatId,
        toChatId: data.chat.toChatId,
        icon: data.chat.icon,
        name: data.chat.name,
        username: data.chat.username,
        newContent: data.chat.newContent,
        isRplay: data.replyChat === null ? null : data.replyChat,
        isPing:false
      };
      
    },
    //判斷是否base64
    isBase64(data) {
      var base64Rejex =
        /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
      if (!base64Rejex.test(data)) {
        return data;
      }
      try {
        return Decrypt(data, this.aesKey, this.aesIv);
      } catch (err) {
        return data;
      }
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
    audioAction() {
      let audioEl = document.getElementById("notify-receive-audio");
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            audioEl.src = ""; // 移除src, 防止之后播放空白音频
            setTimeout(() => {
              // 用setTimeout模拟一个2秒的延迟
              audioEl.src = require("./../../../static/wav/receive.mp3");
            }, 150);
          })
          .catch((error) => {
            audioEl.pause();
          });
      }
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      // this.groupListData = JSON.parse(localStorage.getItem("groupListMember"));
      switch (userInfo.chatType) {
        // 发送影片照片讯息成功
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          if (this.groupUser.toChatId === userInfo.toChatId) {
            this.base64Msg = this.isBase64(userInfo.chat.text);
            userInfo.chat.newContent = this.base64Msg.split(" ");
            // this.groupListData.forEach((item) => {
            //   if (userInfo.chat.fromChatId === "u" + item.memberId) {
            //     userInfo.chat.icon = item.icon;
            //     userInfo.chat.name = item.name;
            //     userInfo.chat.username = item.username;
            //   } else if (
            //     userInfo.chat.icon === undefined &&
            //     userInfo.chat.name === undefined
            //   ) {
            //     userInfo.chat.icon = require("./../../../static/images/image_user_defult.png");
            //     userInfo.chat.name = "无此成员";
            //   }
            //   if (
            //     userInfo.replyChat !== null &&
            //     userInfo.replyChat.fromChatId === "u" + item.memberId
            //   ) {
            //     userInfo.replyChat.icon = item.icon;
            //     userInfo.replyChat.nickName = item.name;
            //   }
            // });
            this.messageList(userInfo);
            this.messageData.push(this.chatRoomMsg);
            this.getHiChatDataList();
            if (this.hichatNav.num === 1) this.readMsgShow(userInfo);
            if(userInfo.chat.fromChatId !== "u" + localStorage.getItem("id")){
              this.audioAction();
            }
          }
          break;
        // 历史讯息
        case "SRV_GROUP_HISTORY_RSP":
          this.messageData = [];
          this.pinMsg = ""
          this.getPinList()
          let historyMsgList = userInfo.historyMessage.list;
          this.loading = true;
          let timeOut = historyMsgList.length * 40;

          this.$nextTick(() => {
            setTimeout(() => {
              historyMsgList.forEach((el) => {
                this.base64Msg = this.isBase64(el.chat.text);
                el.chat.newContent = this.base64Msg.split(" ");
              //   this.groupListData.forEach((item) => {
              //   if (el.chat.fromChatId === "u" + item.memberId) {
              //     el.chat.icon = item.icon;
              //     el.chat.name = item.name;
              //     el.chat.username = item.username;
              //   } else if (
              //     el.chat.icon === undefined &&
              //     el.chat.name === undefined
              //   ) {
              //     el.chat.icon = require("./../../../static/images/image_user_defult.png");
              //     el.chat.name = "无此成员";
              //   }
              //   if (
              //     el.replyChat !== null &&
              //     el.replyChat.fromChatId === "u" + item.memberId
              //   ) {
              //     el.replyChat.icon = item.icon;
              //     el.replyChat.nickName = item.name;
              //   }
              // });
                this.messageList(el);
                this.messageData.unshift(this.chatRoomMsg);
              });
              if (historyMsgList.length > 0) {
                this.readMsgShow(historyMsgList[0]);
              }
              this.loading = false;
              this.getHiChatDataList();
            }, timeOut);
          });
          break;
        // 已讀
        case "SRV_MSG_READ":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) res.isRead = true;
          });
          this.getHiChatDataList();
          break;
        // 編輯訊息
        case "SRV_CHAT_EDIT":
          this.messageData = this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) {
              res.message.content = userInfo.chat.text;
              res.newContent = userInfo.chat.text.split(" ");
            }
          });
          this.getHiChatDataList();
          break;
        // 刪除訊息
        case "SRV_CHAT_DEL":
          this.messageData.forEach((res, index) => {
            if (res.historyId === userInfo.targetId) {
              this.messageData.splice(index, 1);
            }
          });
          this.getHiChatDataList();
          break;

      }
    },

    submitBtn() {
      let groupId = this.groupUser.groupId;
      leaveGroup({ groupId })
        .then((res) => {
          if (res.code === 200) {
            this.leaveGroupDialogShow = false;
            this.setHichatNav({ type: "group", num: 1 });
            this.setChatGroup({});
            this.getHiChatDataList();
          }
        })
        .catch((err) => {
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
  },
  components: {
    MessagePabel,
    MessageInput,
    MessagePin
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eef7fb;
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
      background-color: #ffffff;
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
          background-size: 70%;
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
          left: 20px;
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
              width: inherit;
            }
          }
          span {
            font-size: 15px;
            padding-left: 10px;
            font-weight: 600;
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
        width: 55vw;
        margin: 0 auto;
        font-weight: 550;
        li {
          &:nth-child(1) {
            color: #ee5253;
          }
          &:nth-child(2) {
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
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}
.top-msg-bottom {
  height: 59px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
}
.reply-message {
  height: 50px;
  background-color: rgba(225, 225, 225, 0.85);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  // justify-content: center;
  align-items: center;
  padding: 10px;
  .reply-message-box {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    span {
      line-height: 20px;
      color: #363636;
      width: 90em;
      word-wrap: break-word;
    }
    .replyMsg-Img {
      img {
        height: 2em;
        border-radius: 5px;
      }
    }
  }
  .reply-close-btn {
    position: absolute;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
  }
  /deep/.el-avatar {
    overflow: initial;
    img {
      border-radius: 4px;
      width: -webkit-fill-available;
    }
  }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}
.top-msg {
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.01em solid rgba(0, 0, 0, 0.05);
  .top-msg-left{
    display: flex;
    align-items: center;
    img {
      height: 1.5em;
    }
  }
  .top-msg-right{
    height: 1.2em;
    cursor: pointer;
  }
}
</style>
