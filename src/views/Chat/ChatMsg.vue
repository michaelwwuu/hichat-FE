<template>
  <div class="wrapper">
    <el-container v-if="topMsgShow">
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header
          :height="device === 'moblie' ? '55px' : '70px'"
          :class="{ 'PC-header': device === 'pc' }"
        >
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
              <span
                class="home-photo-link"
                @click="chatUser.isContact ? infoMsgShow() : false"
              >
                <div class="home-user-photo">
                  <img
                    :src="
                      noIconShow(
                        JSON.stringify(chatUser) === '{}' ? userData : chatUser
                      )
                    "
                  />
                </div>
                <span>{{
                  chatUser.name === undefined ? userData.name : chatUser.name
                }}</span>
              </span>
              <template v-if="chatUser.isContact">
                <div
                  class="home-user-search"
                  :style="
                    chatUser.forChatId === chatUser.toChatId
                      ? 'right: 30px'
                      : ''
                  "
                ></div>
                <el-dropdown
                  trigger="click"
                  v-if="chatUser.forChatId !== chatUser.toChatId"
                >
                  <div class="el-dropdown-link">
                    <div class="home-user-more"></div>
                  </div>
                  <el-dropdown-menu slot="dropdown" class="chat-more">
                    <el-dropdown-item>
                      <div class="logout-btn">
                        <img
                          src="./../../../static/images/pc/bell-off.png"
                          alt=""
                        />
                        <span>關閉通知</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div class="logout-btn" @click="isBlockDialogShow = true">
                        <img
                          src="./../../../static/images/pc/slash.png"
                          alt=""
                        />
                        <span>{{
                          chatUser.isBlock ? "解除封锁" : "封锁联络人"
                        }}</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div
                        class="logout-btn"
                        @click="isDeleteContactDialogShow = true"
                      >
                        <img
                          src="./../../../static/images/pc/trash.png"
                          alt=""
                        />
                        <span style="color: #ee5253">删除联络人</span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-else>
                <div class="contact-box">
                  <ul>
                    <li @click="deleteDialogShow = true">
                      <img
                        src="./.../../../../../static/images/pc/trash.png"
                        alt=""
                      />删除
                    </li>
                    <li @click="isBlockDialogShow = true">
                      <img
                        src="./.../../../../../static/images/pc/slash-red.png"
                        alt=""
                      />
                      {{ chatUser.isBlock ? "解除封锁" : "封锁" }}
                    </li>
                    <li @click="addUser(chatUser)">
                      <img
                        src="./.../../../../../static/images/pc/user-plus-block.png"
                        alt=""
                      />加入联络人
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </template>
        </el-header>
        <div
          class="contact-box"
          v-if="!chatUser.isContact && device === 'moblie'"
        >
          <ul>
            <li @click="isBlockDialogShow = true">
              {{ chatUser.isBlock ? "解除封锁" : "封锁" }}
            </li>
            <li @click="deleteDialogShow = true">删除</li>
            <li @click="addUser(chatUser)">加入联络人</li>
          </ul>
        </div>
        <el-main
          v-loading="loading"
          element-loading-text="讯息加载中"
          element-loading-background="rgba(255, 255, 255, 0.5)"
        >
          <!-- 置頂訊息 -->
          <div class="top-msg" v-if="pinMsg !== ''">
            <div class="top-msg-left">
              <img src="./../../../static/images/pin.png" alt="" />
              <span v-if="pinDataList[0].chatType === 'SRV_USER_IMAGE'">
                <img :src="isBase64(pinMsg)" alt="">
              </span>
              <span v-else>{{ isBase64(pinMsg) }}</span>
            </div>
            <img
              class="top-msg-right"
              src="./../../../static/images/next.png"
              alt=""
              @click="goTopMsgShow"
            />
          </div>
          <message-pabel
            :timeOut="timeOut"
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
              <span v-if="replyMsg.chatType === 'SRV_USER_SEND'">{{
                replyMsg.innerText.length > 110
                  ? replyMsg.innerText.substr(0, 110) + " ..."
                  : replyMsg.innerText
              }}</span>
              <span
                v-else-if="replyMsg.chatType === 'SRV_USER_IMAGE'"
                class="replyMsg-Img"
              >
                <img :src="replyMsg.innerText" alt="" />
              </span>
              <span v-else-if="replyMsg.chatType === 'SRV_USER_AUDIO'"
                >回復語音訊息</span
              >
            </div>
            <div class="reply-close-btn" @click="closeReplyMessage">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="disabled-user" v-if="chatUser.isBlock">
            <span>該用戶已被封鎖</span>
          </div>
          <message-input
            :userInfoData="userInfoData"
            :userData="chatUser"
            v-else
          />
        </el-main>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header
          :height="device === 'moblie' ? '55px' : '70px'"
          :class="{ 'PC-header': device === 'pc' }"
        >
          <template v-if="device === 'moblie'">
            <div class="home-header">
              <span
                class="home-user-link"
                :style="!chatUser.isContact ? 'position:none;' : ''"
              >
                <div class="home-user" @click="setTopMsgShow(true)"></div>
              </span>
              <span class="home-header-title">置顶訊息</span>
            </div>
          </template>
          <template v-else>
            <div class="home-header-pc">
              <span class="home-photo-link" @click="setTopMsgShow(true)">
                <span style="padding-right: 10px"
                  ><img src="./../../../static/images/pc/arrow-left.png" alt=""
                /></span>
                <span>置顶訊息</span>
              </span>
            </div>
          </template>
        </el-header>
        <message-pin :userInfoData="userInfoData" @resetPinMsg="resetPinMsg" />
        <div class="top-msg-bottom" @click="untopMsgAction">
          <span>取消所有置顶讯息(共 {{ pinDataList.length }} 則)</span>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :title="
        device === 'pc' ? `${chatUser.isBlock ? '解除封锁' : '封锁'}联络人` : ''
      "
      :visible.sync="isBlockDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/warn.png" alt="" />
        </div>
        <span
          >确认是否{{
            chatUser.isBlock
              ? `解除封锁${device === "pc" ? "联络人" : ""}`
              : `封锁${device === "pc" ? "联络人" : ""}`
          }}
          {{ chatUser.name }}？</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :class="device === 'moblie' ? 'border-red' : 'background-gray'"
          @click="isBlockDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="blockSubmitBtn(chatUser)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="device === 'pc' ? '加入联络人' : ''"
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/success.png" alt="" />
        </div>
        <span>加入成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="successDialogShow = false"
          >確認</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="device === 'pc' ? '刪除陌生人' : ''"
      :visible.sync="deleteDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/success.png" alt="" />
        </div>
        <span>刪除成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="deleteRecent(chatUser)"
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
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>确认是否删除联络人 {{ chatUser.name }}？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="background-gray"
          @click="isDeleteContactDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="deleteSubmitBtn(chatUser)"
          >确认</el-button
        >
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
import {
  addContactUser,
  addBlockContactUser,
  unBlockContactUser,
  deleteRecentChat,
  deleteContactUser,
  getSearchById,
  pinList,
  unpinHistory,
} from "@/api";
import { Decrypt } from "@/utils/AESUtils.js";
import { mapState, mapMutations } from "vuex";
import { getLocal, getToken } from "_util/utils.js";
import MessagePabel from "@/components/message-pabel-moblie";
import MessageInput from "@/components/message-input-moblie";
import MessagePin from "@/components/message-pin";
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
      pinDataList: [],
      pinMsg: "",
      timeOut:0,
      loading: false,
      deleteDialogShow: false,
      successDialogShow: false,
      isBlockDialogShow: false,
      isDeleteContactDialogShow: false,
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  watch:{
    topMsgShow(val){
      val ? this.getChatHistoryMessage() : false
    }
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    if (this.userData !== null) {
      this.setChatUser(this.userData);
      if (this.device === "moblie") this.getChatHistoryMessage();
    }
    if (this.device === "moblie") this.getUserId(this.userData);
    Socket.$on("message", this.handleGetMessage);
    // this.getPinList();
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
      hichatNav: (state) => state.ws.hichatNav,
      replyMsg: (state) => state.ws.replyMsg,
      myUserInfo: (state) => state.ws.myUserInfo,
      topMsgShow: (state) => state.ws.topMsgShow,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setChatUser: "ws/setChatUser",
      setHichatNav: "ws/setHichatNav",
      setChatMsgData: "ws/setChatMsgData",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setTopMsgShow: "ws/setTopMsgShow",
    }),
    goTopMsgShow() {
      this.setTopMsgShow(false);
    },
    untopMsgAction() {
      let param = {
        toChatId: this.chatUser.toChatId,
      };
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.setTopMsgShow(true);
        }
      });
    },
    resetPinMsg() {
      this.getPinList();
    },
    getPinList() {
      let params={
        toChatId:this.chatUser.toChatId,
        order:1,
      }
      pinList(params).then((res) => {
        if (res.code === 200) {
          this.pinDataList = res.data;
          if(this.pinDataList.length !== 0){
            if (this.pinDataList[0].chatType === "SRV_USER_AUDIO") {
            this.pinMsg = "語音訊息";
            } else {
              this.pinMsg = this.pinDataList[0].chat.text;
            }
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
    deleteMsgData(data) {
      this.messageData = this.messageData.filter((item) => {
        return item.historyId !== data.historyId;
      });
      this.getHiChatDataList();
    },
    getUserId(data) {
      let id = data.toChatId.replace("u", "");
      getSearchById({ id }).then((res) => {
        if (res.data.id === localStorage.getItem("id")) {
          this.userData.name = "Hichat 记事本";
          this.userData.icon = require("./../../../static/images/image_savemessage.png");
        } else {
          this.userData.username = res.data.username;
        }
        this.setChatUser(this.userData);
      });
    },
    noIconShow(iconData) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require("./../../../static/images/image_user_defult.png");
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
    // 訊息統一格式
    messageList(data) {
      this.chatRoomMsg = {
        chatType: data.chat.chatType,
        historyId: data.chat.historyId,
        message: {
          time: data.chat.sendTime,
          content: this.isBase64(data.chat.text),
        },
        isRead: data.isRead,
        userChatId: data.chat.fromChatId,
        toChatId: data.toChatId,
        icon: data.chat.icon,
        name: data.chat.name,
        nickName: data.chat.nickName,
        isRplay: data.replyChat === null ? null : data.replyChat,
        isPing: false,
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
    // 獲取歷史訊息
    getChatHistoryMessage() {
      let historyMessageData = this.userInfoData;
      historyMessageData.chatType = "CLI_HISTORY_REQ";
      historyMessageData.id = Math.random();
      historyMessageData.toChatId = this.chatUser.toChatId;
      historyMessageData.targetId = "";
      historyMessageData.pageSize = 1000;
      Socket.send(historyMessageData);
    },
    infoMsgShow() {
      this.setMsgInfoPage({ pageShow: true, type: "" });
      this.setInfoMsg({
        infoMsgShow: true,
        infoMsgNav: "ContactPage",
        infoMsgChat: true,
      });
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
      switch (userInfo.chatType) {
        // 发送影片照片讯息成功
        // 发送讯息成功
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_CHAT_PIN":
          this.pinMsg = "";
          this.getPinList();
          if (userInfo.toChatId === this.chatUser.toChatId) {
            if (userInfo.chat.fromChatId === this.chatUser.toChatId) {
              userInfo.chat.name = this.chatUser.name;
              userInfo.chat.icon = this.chatUser.icon;
              userInfo.chat.nickName = this.chatUser.name;
            } else if (
              userInfo.chat.fromChatId ===
              "u" + JSON.parse(localStorage.getItem("id"))
            ) {
              userInfo.chat.name = this.myUserInfo.nickname;
              userInfo.chat.icon = this.myUserInfo.icon;
            }
            if (userInfo.replyChat !== null) {
              if (userInfo.replyChat.fromChatId === this.chatUser.toChatId) {
                userInfo.replyChat.name = this.chatUser.name;
                userInfo.replyChat.icon = this.chatUser.icon;
                userInfo.replyChat.nickName = this.chatUser.name;
              } else if (
                userInfo.replyChat.fromChatId ===
                "u" + JSON.parse(localStorage.getItem("id"))
              ) {
                userInfo.replyChat.name = this.myUserInfo.nickname;
                userInfo.replyChat.icon = this.myUserInfo.icon;
                userInfo.replyChat.nickName = this.myUserInfo.nickname;
              }
            }
            this.messageList(userInfo);
            this.messageData.push(this.chatRoomMsg);
            if (this.hichatNav.num === 1) this.readMsgShow(userInfo);
            if (this.device === "pc") this.getHiChatDataList();
            if (
              userInfo.chat.fromChatId !==
              "u" + JSON.parse(localStorage.getItem("id"))
            ) {
              this.audioAction();
            }
          }
          break;
        case "SRV_CHAT_UNPIN":
          this.pinMsg = "";
          this.getPinList();
          break;
        // 历史讯息
        case "SRV_HISTORY_RSP":
          this.pinMsg = "";
          this.getPinList();   
          this.loading = true;
          this.messageData = [];
          let historyMsgList = userInfo.historyMessage.list;
          this.timeOut = historyMsgList.length * 5;
          this.$nextTick(() => {
            setTimeout(() => {
              historyMsgList.forEach((el) => {
                if (el.chat.fromChatId === this.chatUser.toChatId) {
                  el.chat.name = this.chatUser.name;
                  el.chat.icon = this.chatUser.icon;
                  el.chat.nickName = this.chatUser.name;
                } else if (
                  el.chat.fromChatId ===
                  "u" + JSON.parse(localStorage.getItem("id"))
                ) {
                  el.chat.name = this.myUserInfo.nickname;
                  el.chat.icon = this.myUserInfo.icon;
                }
                if (el.replyChat !== null) {
                  if (el.replyChat.fromChatId === this.chatUser.toChatId) {
                    el.replyChat.name = this.chatUser.name;
                    el.replyChat.icon = this.chatUser.icon;
                    el.replyChat.nickName = this.chatUser.name;
                  } else if (
                    el.replyChat.fromChatId ===
                    "u" + JSON.parse(localStorage.getItem("id"))
                  ) {
                    el.replyChat.name = this.myUserInfo.nickname;
                    el.replyChat.icon = this.myUserInfo.icon;
                    el.replyChat.nickName = this.myUserInfo.nickname;
                  }
                }
                if (el.toChatId === this.chatUser.toChatId) {
                  this.messageList(el);
                  this.messageData.unshift(this.chatRoomMsg);
                }
              });
              this.readMsg = historyMsgList.filter((el) => {
                return el.chat.toChatId === "u" + localStorage.getItem("id");
              });
              if (historyMsgList.length > 0 && this.readMsg.length > 0)
                this.readMsgShow(this.readMsg[0]);
              if (this.device === "pc") this.getHiChatDataList();
              this.loading = false;
            }, this.timeOut);
          });
          break;
        // 已讀
        case "SRV_MSG_READ":
          if (userInfo.toChatId === this.chatUser.toChatId) {
            this.messageData.forEach((res) => (res.isRead = true));
          }
          break;
        // 編輯訊息
        case "SRV_CHAT_EDIT":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) {
              return (res.message.content = userInfo.chat.text);
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
        // 撈取歷史訊息
        case "SRV_NEED_AUTH":
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
            data.isContact = true;
            this.setChatUser(data);
            this.setHichatNav({ type: "address", num: 1 });
            if (this.device === "pc") {
              this.getHiChatDataList();
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
            this.deleteDialogShow = false;
            localStorage.removeItem("userData");
            if (this.device === "pc") {
              this.setHichatNav({ type: "address", num: 1 });
              this.setChatUser({});
              this.getHiChatDataList();
            } else if (this.device === "moblie") {
              this.$router.push({ path: "/Address" });
            }
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
              this.getHiChatDataList();
              this.setChatUser(data);
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
              this.getHiChatDataList();
              this.setChatUser(data);
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
    deleteSubmitBtn(data) {
      let contactId = data.toChatId.replace("u", "");
      deleteContactUser(contactId)
        .then((res) => {
          if (res.code === 200) {
            this.isDeleteContactDialogShow = false;
            data.isContact = false;
            this.getHiChatDataList();
            this.setChatUser(data);
            this.setHichatNav({ type: "address", num: 1 });
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
        token: getToken("token"),
        deviceId: getLocal("UUID"),
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
    MessagePin,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  // min-height: 100vh;
  // min-height: webkit-fill-available;
  overflow: hidden;
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
      border-radius: 0 !important;
      box-shadow: none !important;
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
        .contact-box {
          position: absolute;
          right: 0;
          width: 600px;
          ul {
            justify-content: flex-end;
            li {
              margin-left: 5em;
              cursor: pointer;
              img {
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
        width: 70vw;
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
  color: rgba(0, 0, 0, 0.4);
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
.hichat-pc {
  .disabled-user {
    height: 59px;
  }
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
.top-msg {
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.01em solid rgba(0, 0, 0, 0.05);
  .top-msg-left {
    display: flex;
    align-items: center;
    img {
      height: 1.5em;
    }
  }
  .top-msg-right {
    height: 1.2em;
    cursor: pointer;
  }
}
</style>
