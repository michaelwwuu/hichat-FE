<template>
  <div class="wrapper">
    <el-container v-if="topMsgShow">
      <el-main>
        <el-header height="55px">
          <div class="home-header" v-if="showCheckBoxBtn">
            <span class="home-user-link">
              <router-link :to="'/HiChat'">
                <div class="home-user"></div>
              </router-link>
            </span>
            <span class="home-header-title">{{ groupData.groupName }}</span>
            <span class="home-photo-link">
              <router-link :to="'/GroupPage'">
                <div class="home-user-photo">
                  <img :src="noIconShow(groupData)" />
                </div>
              </router-link>
            </span>
          </div>
          <div class="home-header" v-else>
            <span class="home-user-link">
              <router-link :to="'/HiChat'">
                <div class="home-user"></div>
              </router-link>
            </span>
            <span class="home-header-title">{{
              checkDataList.length === 0
                ? "选择讯息"
                : `已选择${checkDataList.length}则讯息`
            }}</span>
            <span class="home-photo-link" @click="closeChooseAction">取消</span>
          </div>
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
              <span v-if="pinDataList[0].chatType === 'SRV_GROUP_IMAGE'">
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
            @scrollBar="scrollBar"            
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
                replyMsg.innerText.length > 30
                  ? replyMsg.innerText.substr(0, 30) + " ..."
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
              <div
                v-else-if="replyMsg.chatType === 'SRV_GROUP_FILE'"
                class="replyMsg-file"
              >
                <span>{{fileData(replyMsg.innerText,'content')}}</span>
                <span>档案大小　: {{ fileData(replyMsg.fileSize,'size') }}</span>                        
              </div>              
            </div>
            <div class="reply-close-btn" @click="$root.closeReplyMessage">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div
            class="checkbox-btn"
            v-if="!showCheckBoxBtn"
            @click="chooseDeleteAction"
          >
            <img src="./../../../static/images/icon_defalt.svg" alt="" />
          </div>
          <message-input
            v-else
            :userInfoData="userInfoData"
            :groupData="groupUser"
            :authorityGroupData="authorityGroupData"
            :authority="authority"
          />
        </el-main>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header height="70px">
          <div class="home-header" style="margin-top:1.5em">
            <span class="home-user-link">
              <div class="home-user" @click="setTopMsgShow(true)"></div>
            </span>
            <span class="home-header-title">置顶訊息</span>
            <!-- <div class="home-user-search"></div> -->
            <!-- <span class="home-photo-link">
              <router-link :to="'/GroupPage'">
                <div class="home-user-photo">
                  <img :src="noIconShow(groupData)" />
                </div>
              </router-link>
            </span> -->
          </div>
        </el-header>
        <message-pin :userInfoData="userInfoData" @resetPinMsg="resetPinMsg" />
        <div class="top-msg-bottom" @click="isTopMsgShow = true">
          <span>取消所有置顶讯息(共 {{ pinDataList.length }} 則)</span>
        </div>
      </el-main>
    </el-container>
    <audio
      id="notify-receive-audio"
      muted="muted"
      src="./../../../static/wav/receive.mp3"
    ></audio>
    <el-dialog
      :visible.sync="isTopMsgShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div>
          <img src="./../../../static/images/warn.svg" alt="" />
        </div>
        <span>确认是否取消置頂？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="isTopMsgShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="untopMsgAction"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="isChooseDeleteShow"
      class="el-dialog-choose-delete"
      width="100%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <el-button v-show="!allHistoruShow" @click="deleteMessage('all')"
          >在所有人对话纪录中删除</el-button
        >
        <el-button @click="deleteMessage('only')"
          >只在我的对话纪录中删除</el-button
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isChooseDeleteShow = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="isLeaveGroupShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div>
          <img src="./../../../static/images/warn.svg" alt="" />
        </div>
        <span>你已不再群組內</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-red" @click="leaveGroupAction"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import {
  groupListMember,
  pinList,
  unpinHistory,
  getGroupAuthoritySetting,
  deleteRecentChatMul,
} from "@/api";
import { Decrypt } from "@/utils/AESUtils.js";
import AESBase64 from "@/utils/AESBase64.js";
import { fileBoxName, formatFileSize } from "@/utils/FileSizeName.js";

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
      userInfoData: {
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
        tokenType: 0,
      },
      pinMsg: "",
      groupData: {},
      authorityGroupData: {},
      readMsgData: [],
      contactList: [],
      pinDataList: [],
      checkDataList: [],
      loading: false,
      showCheckBoxBtn: true,
      isChooseDeleteShow: false,
      allHistoruShow: false,
      isTopMsgShow: false,
      isScrollbar:false,      
      isLeaveGroupShow: false,
      unGroupDisabledWord: false,

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
    groupData(){
      this.messageData = [];
    }    
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    this.setChatGroup(this.groupData);
    Socket.$on("message", this.handleGetMessage);
  },
  mounted() {
    this.getChatHistoryMessage();
    this.getGroupListMember();
    this.getGroupAuthority();
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      groupUser: (state) => state.ws.groupUser,
      replyMsg: (state) => state.ws.replyMsg,
      topMsgShow: (state) => state.ws.topMsgShow,
      myUserInfo: (state) => state.ws.myUserInfo,
      authority: (state) => state.ws.authority,
      contactListData: (state) => state.ws.contactListData,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setChatGroup: "ws/setChatGroup",
      setTopMsgShow: "ws/setTopMsgShow",
      setContactListData: "ws/setContactListData",
      setAuthority: "ws/setAuthority",
      setAuthorityGroupData: "ws/setAuthorityGroupData",
    }),
    fileData(data,type){
      if(type === "content"){
        return fileBoxName(data)
      }else{
        return formatFileSize(data)
      }
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
    leaveGroupAction() {
      this.$router.push({ path: "/HiChat" });
    },
    checkBoxDisabled(data) {
      this.showCheckBoxBtn = data;
    },
    isCheckDataList(data) {
      this.checkDataList = data;
      if (
        (this.groupUser.isManager && !this.authority.delUserMessage) ||
        (!this.groupUser.isManager && !this.groupUser.isAdmin)
      ) {
        this.allHistoruShow = this.checkDataList.some(
          (el) => el.userChatId !== "u" + this.myUserInfo.id
        );
      }
    },
    deleteMessage(type) {
      this.historyIdData = [];
      this.checkDataList.forEach((el) => {
        this.historyIdData.push(el.historyId);
      });
      let parmas = {
        fullDelete: type === "all", // 是否完整删除,搭配historyId
        haveOtherChat: type === "only", // 是否有不是自己的訊息
        historyId: this.historyIdData, // 历史记录ID
        toChatId: this.checkDataList[0].toChatId, // 删除目标ID
      };
      deleteRecentChatMul(parmas)
        .then((res) => {
          if (res.code === 200) {
            if (res.data.isCompletely) {
              this.$message({ message: "訊息删除成功", type: "success" });
            } else {
              this.$message({ message: "部分訊息無法刪除", type: "warning" });
            }
            this.isChooseDeleteShow = false;
            this.closeChooseAction();
            this.$root.gotoBottom();
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
    getGroupAuthority() {
      let groupId = this.groupData.groupId;
      getGroupAuthoritySetting({ groupId }).then((res) => {
        if (res.code === 200) {
          if (res.data === undefined) {
            this.authorityGroupData = {
              checkUserInfo: true,
              pin: true,
              sendMessage: true,
              sendImage: true,
              sendLink: true,
            };
          } else {
            this.authorityGroupData = res.data;
          }
          this.setAuthorityGroupData(this.authorityGroupData);
        }
      });
    },
    resetPinMsg() {
      this.getPinList();
    },
    scrollBar(val){
      this.isScrollbar = val
    },    
    goTopMsgShow() {
      this.setTopMsgShow(false);
    },
    untopMsgAction() {
      let param = {
        toChatId: this.groupData.toChatId,
      };
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.setTopMsgShow(true);
          this.isTopMsgShow = false;
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
    getPinList() {
      let params = {
        toChatId: this.groupUser.toChatId,
        order: 1,
      };
      pinList(params).then((res) => {
        if (res.code === 200) {
          this.pinDataList = res.data;
          this.pinDataList.forEach((list) => {
            this.messageData.forEach((data) => {
              if (data.chatType !== "SRV_CHAT_PIN" && (list.historyId === data.historyId)) {
                data.isPing = true;
              }
            });
          });
          if (this.pinDataList.length !== 0) {
            if (this.pinDataList[0].chatType === "SRV_GROUP_AUDIO") {
              this.pinMsg = "語音訊息";
            } else if(this.pinDataList[0].chatType === "SRV_GROUP_FILE"){
              this.pinMsg = this.fileData(this.isBase64(this.pinDataList[0].chat.text),"content");  
            }else {
              this.pinMsg = this.pinDataList[0].chat.text;
            }
          }
          !this.isScrollbar ? this.$root.gotoBottom() : false
        }
      });
    },
    getGroupListMember() {
      let groupId = this.groupData.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          if (item.memberId === this.groupUser.memberId) {
            this.groupUser.isAdmin = item.isAdmin;
            this.groupUser.isBanPost = item.isBanPost;
            this.groupUser.isManager = item.isManager;
            if (item.memberId === Number(localStorage.getItem("id"))) {
              if (item.isAdmin) {
                localStorage.removeItem("authority");
              } else if (item.isManager) {
                this.setAuthority(item.authority);
              } else if (!item.isAdmin && !item.isManager) {
                localStorage.removeItem("authority");
              }
            }
          }
          if (item.icon === undefined) {
            item.icon = require("./../../../static/images/image_user_defult.png");
          }

        });
        this.setChatGroup(this.groupUser);
        this.setContactListData(this.contactList);
      });
    },
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
        toChatId: data.chat.toChatId,
        icon: data.chat.icon,
        name: data.chat.name,
        username: data.chat.username,
        newContent: data.chat.newContent,
        isRplay: data.replyChat === null ? null : data.replyChat,
        isPing: false,
        fileSize:data.chat.fileSize !== undefined ? data.chat.fileSize : "",
      };
    },
    // 訊息過濾比對名稱
    messageReorganization(data){
      this.contactListData.forEach((item) => {
        if (data.userChatId === "u" + item.memberId) {
          data.icon = item.icon;
          data.name = item.name;
          data.username = item.username;
        } else if (
          data.icon === undefined &&
          data.name === undefined
        ) {
          data.icon = require("./../../../static/images/image_user_defult.png");
          data.name = "无此成员";
        }
        if (
          data.isRplay !== null &&
          data.isRplay.fromChatId === "u" + item.memberId
        ) {
          data.isRplay.icon = item.icon;
          data.isRplay.nickName = item.name;
        }        
      })      
    },    
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey ,this.aesIv)
    },
    // 獲取歷史訊息
    getChatHistoryMessage() {
      let historyMessageData = this.userInfoData;
      historyMessageData.chatType = "CLI_GROUP_HISTORY_REQ";
      historyMessageData.id = Math.random();
      historyMessageData.toChatId = this.groupData.toChatId;
      historyMessageData.targetId = "";
      historyMessageData.pageSize = 100;
      Socket.send(historyMessageData);
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
        case "SRV_GROUP_HISTORY_RSP":
          this.pinMsg = "";
          this.getPinList();
          this.loading = true;
          let historyMsgList = userInfo.historyMessage.list;
          this.$nextTick(() => {
            setTimeout(() => {
              // this.messageData = [];
              historyMsgList.forEach((el) => {
                this.base64Msg = this.isBase64(el.chat.text);
                el.chat.newContent = this.base64Msg.split(" ");
                this.messageList(el);
                this.messageReorganization(this.chatRoomMsg)
                this.messageData.unshift(this.chatRoomMsg);
              });
              if (historyMsgList.length > 0)
                this.readMsgShow(historyMsgList[0]);
              this.loading = false;
            }, 500);
          });
          break;        
        // 发送影片照片讯息成功
        // 发送讯息成功
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
        case "SRV_GROUP_FILE":            
        case "SRV_GROUP_JOIN":
        case "SRV_GROUP_DEL":
        case "SRV_CHAT_PIN":
        case "SRV_GROUP_REMOVE_MANAGER_HISTORY":
        case "SRV_GROUP_ADD_MANAGER_HISTORY":
        case "SRV_GROUP_CHANGE_ADMIN_HISTORY":
          if (this.groupUser.toChatId === userInfo.toChatId) {
            if (userInfo.chat.text !== null) {
              this.base64Msg = this.isBase64(userInfo.chat.text);
              userInfo.chat.newContent = this.base64Msg.split(" ");
            }
            this.messageList(userInfo);
            this.messageReorganization(this.chatRoomMsg)
            this.readMsgShow(userInfo);
            this.messageData.push(this.chatRoomMsg);
            if (userInfo.chat.fromChatId !== "u" + localStorage.getItem("id")) {
              this.audioAction();
            }
          }
          if (userInfo.chatType === "SRV_GROUP_DEL") {
            if (userInfo.chat.fromChatId === "u" + localStorage.getItem("id")) {
              this.isLeaveGroupShow = true;
            }
          }
          break;
        //變更權限          
        case "SRV_GROUP_AUTHORITY":
          this.getGroupAuthority();
          break;
        case "SRV_GROUP_MANAGER_AUTHORITY":
        case "SRV_GROUP_ADMIN_CHANGE":
        case "SRV_GROUP_BAN_POST":
          setTimeout(() => {  
            this.getGroupListMember();
          }, 500);
          if(userInfo.chatType === "SRV_GROUP_MANAGER_AUTHORITY"){
            this.checkDataList = []
            this.isChooseDeleteShow = false
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
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) res.isRead = true;
          });
          break;
        // 編輯訊息
        case "SRV_CHAT_EDIT":
          this.messageData.forEach((res) => {
            if (res.historyId === userInfo.historyId) {
              res.message.content = userInfo.chat.text;
              res.newContent = this.isBase64(userInfo.chat.text).split(" ");
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
      border-radius: 0 !important;
      box-shadow: none !important;
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
          margin-right: 10px;
          position: absolute;
          right: 85px;
          background-image: url("./../../../static/images/pc/search.png");
          cursor: pointer;
        }
        .home-user-more {
          margin-right: 10px;
          position: absolute;
          right: 30px;
          background-image: url("./../../../static/images/pc/more.svg");
          cursor: pointer;
        }
        .home-photo-link {
          position: absolute;
          left: 20px;
          display: flex;
          align-items: center;
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

.disabled-user,
.checkbox-btn {
  height: 55px;
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
  }
}
.top-msg-bottom {
  height: 55px;
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
/deep/.el-dialog-choose-delete {
  .el-dialog {
    margin: 0 auto;
    background: rgba(0, 0, 0, 0);
    box-sizing: border-box;
    box-shadow: none;
    width: 50%;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 20px 30px 0 30px;
      .loginOut-box {
        background: #ffffff;
        border-radius: 10px;
        .el-button {
          width: 100%;
          border-radius: 0px;
          border: 0;
          background: #ffffff00;
          color: #ee5253;
          padding: 20px;
          &:nth-child(2) {
            border-top: 1px solid rgba(0, 0, 0, 0.05);
          }
        }
        .el-button + .el-button {
          margin-left: 0;
        }
      }
    }
    .dialog-footer {
      justify-content: center !important;
      .el-button {
        width: 100% !important;
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>
