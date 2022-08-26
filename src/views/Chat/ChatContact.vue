<template>
  <div class="wrapper">
    <el-container v-if="topMsgShow">
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header height="70px" class="PC-header">
          <template>
            <div class="home-header-pc">
              <span
                class="home-photo-link"
                @click="contactUser.isContact ? infoMsgShow() : false"
              >
                <div class="home-user-photo">
                  <img :src="noIconShow(contactUser)" />
                </div>
                <span>
                  <div>
                    {{
                      contactUser.name === undefined
                        ? userData.name
                        : contactUser.name
                    }}
                  </div>
                  <div
                    class="online-text"
                    :class="onlineTime === '在线' ? 'green-text' : 'gray-text'"
                  >
                    {{ onlineTime }}
                  </div>
                </span>
              </span>

              <div class="contact-box" v-if="showCheckBoxBtn">
                <ul>
                  <li @click="deleteDialogShow = true">
                    <img
                      src="./.../../../../../static/images/pc/trash.svg"
                      alt=""
                    />删除
                  </li>
                  <li @click="isBlockDialogShow = true">
                    <img
                      src="./.../../../../../static/images/pc/slash-red.svg"
                      alt=""
                    />
                    {{ contactUser.isBlock ? "解除封锁" : "封锁" }}
                  </li>
                  <li @click="addUser(contactUser)">
                    <img
                      src="./.../../../../../static/images/pc/add-user-block.svg"
                      alt=""
                    />加入联络人
                  </li>
                </ul>
              </div>
              <span
                class="el-dropdown close-choose"
                v-else
                @click="closeChooseAction"
                >取消</span
              >
            </div>
          </template>
        </el-header>
        <el-main
          v-loading="loading"
          element-loading-text="讯息加载中"
          element-loading-background="rgba(255, 255, 255, 0.5)"
        >
          <!-- 置頂訊息 -->
          <div
            class="top-msg"
            v-if="pinMsg !== '' && showCheckBoxBtn && pinDataList.length !==0"
            @click="goTopMsgShow"
          >
            <div class="top-msg-left">
              <img src="./../../../static/images/pin.png" alt="" />
              <span v-if="pinDataList[0].chatType === 'SRV_USER_IMAGE'">
                <img :src="isBase64(pinMsg)" alt="" />
              </span>
              <span v-else>{{ isBase64(pinMsg) }}</span>
            </div>
            <img
              class="top-msg-right"
              src="./../../../static/images/next.png"
              alt=""
            />
          </div>
          <message-pabel
            :messageData="messageData"
            :userInfoData="userInfoData"
            :checkDataList="checkDataList"
            :showCheckBoxBtn="showCheckBoxBtn"
            @deleteMsgHistoryData="deleteMsgData"
            @checkBoxDisabled="checkBoxDisabled"
            @isCheckDataList="isCheckDataList"
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
                replyMsg.innerText.length > (device==="moblie" ? 30 :110)
                  ? replyMsg.innerText.substr(0, device==="moblie" ? 30 :110) + " ..."
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
              <div
                v-else-if="replyMsg.chatType === 'SRV_USER_FILE'"
                class="replyMsg-file"
              >
                <span>{{fileBoxName(replyMsg.innerText)}}</span>
                <span>档案大小　: {{ formatFileSize(replyMsg.fileSize) }}</span>
              </div>
            </div>
            <div class="reply-close-btn" @click="$root.closeReplyMessage">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="disabled-user" v-if="contactUser.isBlock">
            <span>該用戶已被封鎖</span>
          </div>
          <div
            class="checkbox-btn"
            v-else-if="!showCheckBoxBtn"
            @click="chooseDeleteAction"
          >
            <img src="./../../../static/images/icon_defalt.svg" alt="" />
            <span>{{
              checkDataList.length === 0
                ? "选择讯息"
                : `已选择${checkDataList.length}则讯息`
            }}</span>
          </div>
          <message-input
            :userInfoData="userInfoData"
            :userData="contactUser"
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
                  ><img src="./../../../static/images/pc/arrow-left.svg" alt=""
                /></span>
                <span>置顶訊息</span>
              </span>
            </div>
          </template>
        </el-header>
        <message-pin
          :contactUser="contactUser"
          :userInfoData="userInfoData"
          @resetPinMsg="resetPinMsg"
        />
        <div class="top-msg-bottom" @click="isTopMsgShow = true">
          <span>取消所有置顶讯息(共 {{ pinDataList.length }} 則)</span>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :title="device === 'pc' ? '取消置頂' : ''"
      :visible.sync="isTopMsgShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/warn.svg" alt="" />
        </div>
        <span>确认是否取消置頂？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :class="device === 'moblie' ? 'border-red' : 'background-gray'"
          @click="isTopMsgShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="untopMsgAction"
          >确认</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="`${contactUser.isBlock ? '解除封锁' : '封锁'}联络人`"
      :visible.sync="isBlockDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/warn.svg" alt="" />
        </div>
        <span
          >确认是否{{
            contactUser.isBlock
              ? `解除封锁${device === "pc" ? "联络人" : ""}`
              : `封锁${device === "pc" ? "联络人" : ""}`
          }}
          {{ contactUser.name }}？</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :class="device === 'moblie' ? 'border-red' : 'background-gray'"
          @click="isBlockDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="blockSubmitBtn(contactUser)"
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
        <el-button
          v-if="device === 'pc'"
          class="background-orange"
          @click="deleteRecent(contactUser)"
          >確認</el-button
        >
        <el-button
          v-else
          class="background-orange"
          @click="$router.push({ path: '/Address' })"
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
        <span>确认是否删除联络人 {{ contactUser.name }}？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="background-gray"
          @click="isDeleteContactDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="deleteSubmitBtn(contactUser)"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <audio
      id="notify-receive-audio"
      muted="muted"
      src="./../../../static/wav/receive.mp3"
    ></audio>
    <el-dialog
      :visible.sync="isChooseDeleteShow"
      class="el-dialog-choose-delete"
      width="100%"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="false"
      center
    >
      <div class="loginOut-box">
        <img src="./../../../static/images/warn.svg" alt="" />
        <span class="choose-delete-title">刪除所選的訊息？</span>
        <el-button
          type="danger"
          v-show="!allHistoruShow"
          @click="deleteMessage('all')"
          >在所有人对话纪录中删除</el-button
        >
        <el-button type="danger" @click="deleteMessage('only')"
          >只在我的对话纪录中删除</el-button
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="footer-button" @click="isChooseDeleteShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import {
  getContactList,
  addContactUser,
  addBlockContactUser,
  unBlockContactUser,
  deleteRecentChat,
  deleteContactUser,
  pinList,
  unpinHistory,
  getMemberActivity,
  deleteRecentChatMul,
} from "@/api";
import AESBase64 from "@/utils/AESBase64.js";

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
        deviceId: localStorage.getItem("UUID"),
        tokenType: 0,
      },
      userData: {},
      readMsgData: [],
      pinDataList: [],
      checkDataList: [],
      onlineTime: "",
      pinMsg: "",
      loading: false,
      isTopMsgShow: false,
      showCheckBoxBtn: true,
      isChooseDeleteShow: false,
      allHistoruShow: false,
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
  watch: {
    topMsgShow(val) {
      val ? this.getChatHistoryMessage() : false;
    },
    messageData(val) {
      val.forEach((data) => {
        this.pinDataList.forEach((list) => {
          if (data.chatType !== "SRV_CHAT_PIN") {
            if (data.historyId === list.historyId) {
              data.isPing = true;
            }
          }
        });
      });
    },
    contactUser(val) {
      this.getUserMemberActivity(val);
    },
    checkBoxBtn(val) {
      this.showCheckBoxBtn = val;
    },
    showCheckBoxBtn(val){
      if(val) this.isChooseDeleteShow = false
    }
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("contactUser"));
    this.setContactUser(this.userData);
    this.getPinList();
    this.getUserMemberActivity(this.contactUser);
    Socket.$on("message", this.handleGetMessage);
  },
  mounted() {
    this.memberTime = setInterval(() => {
      this.getUserMemberActivity(this.contactUser);
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.memberTime);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      contactUser: (state) => state.ws.contactUser,
      hichatNav: (state) => state.ws.hichatNav,
      replyMsg: (state) => state.ws.replyMsg,
      myUserInfo: (state) => state.ws.myUserInfo,
      topMsgShow: (state) => state.ws.topMsgShow,
      checkBoxBtn: (state) => state.ws.checkBoxBtn,
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
      setContactUser: "ws/setContactUser",
      setMsgInfoPage: "ws/setMsgInfoPage",
      setTopMsgShow: "ws/setTopMsgShow",
      setCheckBoxBtn: "ws/setCheckBoxBtn",
      setMyContactDataList: "ws/setMyContactDataList",
    }),
    fileBoxName(data){
      let url = data
      let index = url.lastIndexOf("\/");
      let str = url.substring(index + 1,url.length);
      return str 
    },
    formatFileSize(fileSize) {
      var temp = fileSize / (1024*1024);
      temp = temp.toFixed(2);
      return temp + 'MB';
      // if (fileSize < 1024) {
      //     return fileSize + 'B';
      // } else if (fileSize < (1024*1024)) {
      //     var temp = fileSize / 1024;
      //     temp = temp.toFixed(2);
      //     return temp + 'KB';
      // } else if (fileSize < (1024*1024*1024)) {
      //     var temp = fileSize / (1024*1024);
      //      temp = temp.toFixed(2);
      //      return temp + 'MB';
      // } else {
      //     var temp = fileSize / (1024*1024*1024);
      //     temp = temp.toFixed(2);
      //     return temp + 'GB';
      // }
    },       
    closeChooseAction() {
      this.showCheckBoxBtn = true;
      this.$root.gotoBottom();
    },
    chooseDeleteAction() {
      if (this.checkDataList.length === 0) {
        this.$message({ message: "請勾選訊息", type: "error" });
        return false;
      } else {
        this.isChooseDeleteShow = true;
      }
    },
    checkBoxDisabled(data) {
      this.showCheckBoxBtn = data;
      this.setCheckBoxBtn(data);
    },
    isCheckDataList(data) {
      this.checkDataList = data;
      this.allHistoruShow = this.checkDataList.some(
        (el) => el.userChatId !== "u" + this.myUserInfo.id
      );
    },
    getUserMemberActivity(contactUser) {
      let memberId = [contactUser.toChatId.replace("u", "")];
      getMemberActivity({ memberId }).then((res) => {
        if (res.code === 200) {
          this.onlineTime = "";
          if (
            res.data[0].lastActivityTime === 0 ||
            this.contactUser.name === "嗨聊记事本"
          ) {
            return (this.onlineTime = "");
          } else {
            this.onlineTime = "";
            let nowTime = res.data[0].currentTime;
            let lastTime = res.data[0].lastActivityTime;
            const diffInMills = nowTime - lastTime;
            if (diffInMills / 1000 < 300) {
              return (this.onlineTime = "在线");
            } else {
              return (this.onlineTime =
                "上次上线于" +
                this.$root.formatTimeS(res.data[0].lastActivityTime));
            }
          }
        }
      });
    },
    goTopMsgShow() {
      this.setTopMsgShow(false);
    },
    untopMsgAction() {
      let param = {
        toChatId: this.contactUser.toChatId,
      };
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.setTopMsgShow(true);
          this.isTopMsgShow = false;
        }
      });
    },
    resetPinMsg() {
      this.getPinList();
    },
    getPinList() {
      let params = {
        toChatId: this.contactUser.toChatId,
        order: 1,
      };
      pinList(params).then((res) => {
        if (res.code === 200) {
          this.pinDataList = res.data;
          this.pinDataList.forEach((list) => {
            this.messageData.forEach((data) => {
              if (data.chatType !== "SRV_CHAT_PIN") {
                if (list.historyId === data.historyId) {
                  data.isPing = true;
                }
              }
            });
          });
          if (this.pinDataList.length !== 0) {
            if (this.pinDataList[0].chatType === "SRV_USER_AUDIO") {
              this.pinMsg = "語音訊息";
            } else {
              this.pinMsg = this.pinDataList[0].chat.text;
            }
          }
          // this.$root.gotoBottom();
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
        return require("./../../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },
    // closeReplyMessage() {
    //   this.setReplyMsg({
    //     name: "",
    //     icon: "",
    //     chatType: "",
    //     clickType: "",
    //     innerText: "",
    //     replyHistoryId: "",
    //     fileSize:"",   
    //   });
    //   this.setEditMsg({ innerText: "" });
    // },
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
        fileSize:data.fileSize !== undefined ? data.fileSize : "",        
      };
    },
    // 訊息過濾比對名稱
    messageReorganization(data){
      if (data.toChatId === this.contactUser.toChatId) {
        data.name = this.contactUser.name;
        data.icon = this.contactUser.icon;
        data.nickName = this.contactUser.name;
      } else {
        data.name = this.myUserInfo.nickname;
        data.icon = this.myUserInfo.icon;
      }
      if (data.isRplay !== null) {
        if (data.isRplay.fromChatId === this.contactUser.toChatId) {
          data.isRplay.name = this.contactUser.name;
          data.isRplay.icon = this.contactUser.icon;
          data.isRplay.nickName = this.contactUser.name;
        } else {
          data.isRplay.name = this.myUserInfo.nickname;
          data.isRplay.icon = this.myUserInfo.icon;
          data.isRplay.nickName = this.myUserInfo.nickname;
        }
      }
    },        
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey ,this.aesIv)
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
    infoMsgShow() {
      this.setMsgInfoPage({ pageShow: true, type: "" });
      this.setInfoMsg({
        infoMsgShow: true,
        infoMsgChat: true,
        infoMsgNav: "ContactPage",
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
        // 历史讯息
        case "SRV_HISTORY_RSP":
          if(JSON.stringify(this.contactUser) !== '{}'){
            this.pinMsg = "";
            this.getPinList();
          } 
          this.loading = true;
          let historyMsgList = userInfo.historyMessage.list;
          this.$nextTick(() => {
            setTimeout(() => {
              this.messageData = [];
              historyMsgList.forEach((el) => {
                this.messageList(el);
                this.messageReorganization(this.chatRoomMsg)
                this.messageData.unshift(this.chatRoomMsg);
              });
              this.readMsg = historyMsgList.filter((el) => {
                return el.chat.toChatId === "u" + localStorage.getItem("id");
              });
              if (historyMsgList.length > 0 && this.readMsg.length > 0)
                this.readMsgShow(this.readMsg[0]);
              this.getHiChatDataList();
              this.loading = false;
            }, 500);
          });
          break;        
        // 发送影片照片讯息成功
        // 发送讯息成功
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_USER_FILE":            
        case "SRV_CHAT_PIN":
          if (userInfo.toChatId === this.contactUser.toChatId) {
            this.getHiChatDataList();
            this.messageList(userInfo);
            this.messageReorganization(this.chatRoomMsg)
            this.messageData.push(this.chatRoomMsg);
            if (this.hichatNav.num === 1) this.readMsgShow(userInfo);
            if (userInfo.chat.fromChatId !== "u" + JSON.parse(localStorage.getItem("id"))) {
              this.audioAction();
            }
          }
          break;
        // 移除置頂  
        case "SRV_CHAT_UNPIN":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.replyHistoryId) {
              res.isPing = false;
            }
          });
          break;          
        // 已讀
        case "SRV_MSG_READ":
          this.messageData.forEach((res) => (res.isRead = true));
          break;
        // 編輯訊息
        case "SRV_CHAT_EDIT":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) {
              return (res.message.content = this.isBase64(userInfo.chat.text));
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
        //多選刪除
        case "SRV_CHAT_MUL_DEL":
          this.messageData = this.messageData.filter(item => !userInfo.targetArray.includes(item.historyId))
          this.checkDataList = this.checkDataList.filter(item => !userInfo.targetArray.includes(item.historyId))
          this.getHiChatDataList();
          break           
        // 撈取歷史訊息
        case "SRV_NEED_AUTH":
          this.getChatHistoryMessage();
          break;
      }
    },
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list
        this.setMyContactDataList(this.contactList)
      });
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
            this.setContactUser({});
            if (this.device === "pc") {
              this.getHistory(data);
              this.getHiChatDataList();
              this.setHichatNav({ type: "address", num: 1 });
              this.getAddressList()
            }
            this.$root.getMaybeKnow()
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
            localStorage.removeItem("contactUser");
            if (this.device === "pc") {
              
              this.setHichatNav({ type: "address", num: 1 });
              
              this.setContactUser({})
              window.location.reload();
              this.getHiChatDataList();
            }
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
    deleteMessage(type) {
      this.historyIdData = []
      this.checkDataList.forEach(el => {
        this.historyIdData.push(el.historyId)
      });
      let parmas = {
        fullDelete: type === "all", // 是否完整删除,搭配historyId
        haveOtherChat: type === "only", // 是否有不是自己的訊息
        historyId: this.historyIdData, // 历史记录ID
        toChatId: this.checkDataList[0].toChatId // 删除目标ID
      }
      deleteRecentChatMul(parmas)
        .then((res) => {
          if (res.code === 200) {
            if(res.data.isCompletely){
              this.$message({ message: "訊息删除成功", type: "success" });
            }else{
              this.$message({ message: "部分訊息無法刪除", type: "warning" });
            }
            this.isChooseDeleteShow = false
            this.closeChooseAction();
            this.$root.gotoBottom();
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
              this.setContactUser(data);
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
              this.setContactUser(data);
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
            this.setContactUser(data);
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
        deviceId: localStorage.getItem("UUID"),
      };
      Socket.send(chatMsgKey);
    },
    back() {
      this.$router.back(-1);
    },
    getHistory(data) {
      (this.getHistoryMessage = {
        chatType: "CLI_HISTORY_REQ",
        toChatId: data.toChatId,
        id: Math.random(),
        tokenType: 0,
        targetId: "",
        pageSize: 1000,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      }),
        Socket.send(this.getHistoryMessage);
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
          background-image: url("./../../../static/images/pc/more.svg");
          cursor: pointer;
        }
        .home-photo-link {
          position: absolute;
          left: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .online-text {
            font-size: 12px;
            font-weight: normal;
            margin-top: 3px;
          }
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
.disabled-user,
.checkbox-btn {
  height: 60px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}
.disabled-user {
  background-color: rgba(225, 225, 225, 0.85);
}
.checkbox-btn {
  background-color: #ffffff;
  img {
    height: 1.5em;
    margin-left: 5px;
    cursor: pointer;
  }
  span {
    margin: 0 auto;
    color: rgba(0, 0, 0, 0.8);
    letter-spacing: 2px;
  }
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
  cursor: pointer;
  .top-msg-left {
    display: flex;
    align-items: center;
    img {
      height: 1.5em;
    }
  }
  .top-msg-right {
    height: 1.2em;
  }
}
.close-choose {
  font-size: 17px;
  cursor: pointer;
}
.el-dialog-choose-delete {
  z-index: 2001;
  position: absolute;
  top: 0;
  left: 300px;
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: rgba(0, 0, 0, 0.6);
  align-items: center;
  /deep/.el-dialog {
    margin-top: 0 !important;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
      border-bottom: 0;
    }
    .el-dialog__body {
      padding: 20px 30px 0 30px !important;
      border-bottom: 0;
      text-align: center;
      .loginOut-box {
        background: #ffffff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        .choose-delete-title {
          color: rgba(0, 0, 0, 0.8);
          margin: 0 0 20px 0;
        }
        img {
          height: 5em;
          margin-bottom: 1.2em;
        }
        .el-button {
          width: 100%;
          padding: 15px 0 !important;
          margin-bottom: 10px;
        }
        .el-button + .el-button {
          margin-left: 0;
        }
      }
    }
    .el-dialog__footer {
      padding: 0 30px 20px 30px;

      .dialog-footer {
        justify-content: center !important;
        .el-button.footer-button {
          width: 100% !important;
          color: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(0, 0, 0, 0.4) !important;
          font-size: 15px;
          padding: 15px 0 !important;
          &:nth-child(1) {
            border-radius: 10px !important;
          }
        }
      }
    }
  }
}
</style>
