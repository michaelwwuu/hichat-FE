<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="hichatNav.type" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <span slot="label" v-if="hiChatDataList.length > 0">
          <span>联络人</span>
          <el-badge
            v-if="hiChatNumBadge > 0"
            :value="hiChatNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in hiChatDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatMsg')"
        >
          <el-image :src="noIconShow(item, 'user')" />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span class="content-text">
                  <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'">{{
                    isBase64(item.lastChat.text)
                  }}</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_CHAT_PIN'">{{
                    isBase64(item.lastChat.text)
                  }}置顶了消息</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
                    >传送了语音</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
                    >传送了图片</span
                  >
                </span>
              </div>
              <div class="time">
                {{ $root.formatTimeDay(item.lastChat.sendTime) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <span slot="label" v-if="groupDataList.length > 0">
          <span>群组</span>
          <el-badge
            v-if="groupNumBadge > 0"
            :value="groupNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in groupDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatGroupMsg')"
        >
          <el-image :src="noIconShow(item, 'group')" />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span class="content-text">
                  <span v-if="item.lastChat.chatType === 'SRV_GROUP_SEND'">{{
                    isBase64(item.lastChat.text)
                  }}</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_CHAT_PIN'">{{
                    isBase64(item.lastChat.text)
                  }}置顶了消息</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_AUDIO'"
                    >传送了语音</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_IMAGE'"
                    >传送了图片</span
                  >
                </span>
              </div>
              <div class="time">
                {{ $root.formatTimeDay(item.lastChat.sendTime) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="陌生讯息"
        name="contact"
        v-if="contactDataList.length > 0"
      >
        <span slot="label" v-if="contactDataList.length > 0">
          <span>陌生讯息</span>
          <el-badge
            v-if="contactNumBadge > 0"
            :value="contactNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in contactDataList"
          :key="index"
          class="address-box"
          @click="
            device === 'moblie'
              ? goChatRoom(item, 'ChatMsg')
              : goChatRoom(item, 'ChatContact')
          "
        >
          <el-image :src="noIconShow(item, 'user')" />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span class="content-text">
                  <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'">{{
                    isBase64(item.lastChat.text)
                  }}</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_CHAT_PIN'">{{
                    isBase64(item.lastChat.text)
                  }}置顶了消息</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
                    >传送了语音</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
                    >传送了图片</span
                  >
                </span>
              </div>
              <div class="time">
                {{ $root.formatTimeDay(item.lastChat.sendTime) }}
                <div class="el-badge-box">
                  <el-badge
                    :value="item.unreadCount"
                    class="item"
                    v-if="item.unreadCount !== 0"
                  ></el-badge>
                </div>
              </div>
            </div>
            <div class="contont-border-bottom"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { Decrypt } from "@/utils/AESUtils.js";
import { mapState, mapMutations } from "vuex";
import { getGroupList, groupListMember, getSearchById } from "@/api";

export default {
  name: "HiChat",
  data() {
    return {
      searchKey: "",
      groupList: [],
      groupDataList: [],
      hiChatDataList: [],
      contactDataList: [],
      newMsgDataList: [],
      getHistoryMessage: {
        chatType: "",
        toChatId: "",
        id: Math.random(),
        tokenType: 0,
        targetId: "",
        pageSize: 1000,
        deviceId: localStorage.getItem("UUID"),
        token: localStorage.getItem("token"),
      },
      device: localStorage.getItem("device"),
      activeName: "address",

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    this.getGroupDataList();
    this.setActiveName(this.hichatNav.type);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      contactUser: (state) => state.ws.contactUser,
    }),
  },
  mounted() {
    this.getHiChatDataList();
  },
  watch: {
    contactDataList(val) {
      if (this.hichatNav.type === "contact" && val.length === 0) {
        this.setHichatNav({ type: "address", num: 1 });
      }
    },
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setTopMsg:"ws/setTopMsg",
      setInfoMsg: "ws/setInfoMsg",
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setChatUser: "ws/setChatUser",
      setHichatNav: "ws/setHichatNav",
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setContactUser: "ws/setContactUser",
      setActiveName: "ws/setActiveName",
      setTopMsgShow:"ws/setTopMsgShow",
      setContactListData: "ws/setContactListData",
    }),
    noIconShow(iconData, key) {
      if (
        iconData.icon === undefined ||
        iconData.icon === null ||
        iconData.icon === ""
      ) {
        return require(`./../../../../static/images/image_${key}_defult.png`);
      } else {
        return iconData.icon;
      }
    },
    handleClick(tab) {
      if (tab.name === "address" || tab.name === "contact") {
        this.getHistoryMessage.chatType = "CLI_HISTORY_REQ";
        this.getHistoryMessage.toChatId = this.chatUser.toChatId;
        this.getHistoryMessage.id = Math.random();
      } else {
        this.getHistoryMessage.chatType = "CLI_GROUP_HISTORY_REQ";
        this.getHistoryMessage.toChatId = this.groupUser.toChatId;
        this.getHistoryMessage.id = Math.random();
      }
      Socket.send(this.getHistoryMessage);
      this.setInfoMsg({ infoMsgShow: false });
      this.setActiveName(this.hichatNav.type);
      this.closeReplyMessage();
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
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      this.setWsRes(JSON.parse(msg));
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        //成功收到
        case "SRV_RECENT_CHAT":
          this.groupNumBadge = 0;
          this.hiChatNumBadge = 0;
          this.contactNumBadge = 0;
          this.hiChatDataList = [];
          this.groupDataList = [];
          this.contactDataList = [];
          userInfo.recentChat.forEach((item) => {
            if (item.isContact && item.lastChat !== null) {
              if (item.forChatId === item.toChatId) {
                item.name = "Hichat 记事本";
                item.icon = require("./../../../../static/images/image_savemessage.png");
              }
              this.hiChatDataList.push(item);
              this.hiChatNumBadge += item.unreadCount;
            } else if (item.isGroup && item.lastChat !== null) {
              this.groupDataList.push(item);
              this.groupNumBadge += item.unreadCount;
            } else if (
              !item.isContact &&
              item.isContact !== null &&
              item.lastChat !== null
            ) {
              this.contactDataList.push(item);
              this.contactNumBadge += item.unreadCount;
            }
          });
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          this.getHiChatDataList();
          break;
      }
    },
    getGroupDataList() {
      getGroupList().then((res) => {
        this.groupList = res.data.list;
        this.groupList.forEach((el) => {
          if (el.icon === "") {
            el.icon = require("./../../../../static/images/image_group_defult.png");
          }
        });
        this.setGroupList(this.groupList);
      });
    },
    getGroupListMember(data) {
      let groupId = data.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          if (item.icon === undefined) {
            item.icon = require("./../../../../static/images/image_user_defult.png");
          }
        });
        this.setContactListData(this.contactList);
      });
    },
    getUserId(data) {
      let id = data.toChatId.replace("u", "");
      getSearchById({ id }).then((res) => {
        if (res.data.id === localStorage.getItem("id")) {
          data.name = "Hichat 记事本";
          data.icon = require("./../../../../static/images/image_savemessage.png");
        } else {
          data.username = res.data.username;
          data.toChatId = "u" + res.data.id;
        }
        this.setChatUser(data);
      });
    },
    goChatRoom(data, path) {
      this.setTopMsgShow(true)
      if (path === "ChatMsg") {
        data.contactId = data.toChatId.replace("u", "");
        this.setChatUser(data);
        // this.getUserId(data)
      } else if (path === "ChatContact") {
        this.setContactUser(data);
      } else {
        data.icon = data.icon;
        data.groupName = data.name;
        data.groupId = data.toChatId.replace("g", "");
        data.memberId = JSON.parse(data.forChatId.replace("u", ""));
        this.groupList.forEach((item) => {
          if (item.groupName === data.groupName) {
            return (data.isAdmin = item.isAdmin);
          }
        });
        this.setChatGroup(data);
        this.getGroupListMember(data);
      }
      if (this.device === "moblie") {
        this.$router.push({ name: path });
      } else {
        if (data.isContact) {
          this.type = "address";
        } else if (data.isGroup) {
          this.type = "group";
        } else if (!data.isBlock && !data.isContact && !data.isGroup) {
          this.type = "contact";
        }
        this.setHichatNav({ type: this.type, num: 1 });
        this.setInfoMsg({
          infoMsgShow: false,
          infoMsgNav: path === "ChatMsg" ? "ContactPage" : "GroupPage",
        });
        this.getHistory(data, path);
        this.closeReplyMessage();
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
    getHistory(data, path) {
      if (path === "ChatMsg" || path === "ChatContact") {
        this.getHistoryMessage.chatType = "CLI_HISTORY_REQ";
      } else {
        this.getHistoryMessage.chatType = "CLI_GROUP_HISTORY_REQ";
      }
      this.getHistoryMessage.toChatId = data.toChatId;
      this.getHistoryMessage.id = Math.random();
      Socket.send(this.getHistoryMessage);
    },
  },
};
</script>

<style lang="scss" scoped>
.address-box {
  cursor: pointer;
  &:hover {
    background-color: #ebeaea81;
  }
  .contont-box {
    padding-left: 1em;
    height: 48px;
    .msg-box {
      height: 48px;
      display: flex;
      span {
        display: block;
        font-size: 16px;
        &:nth-child(1) {
          margin-bottom: 7px;
        }
      }
      .content-text {
        display: flex;
        font-size: 14px;
        opacity: 0.5;
        span {
          &:nth-child(1) {
            width: 15em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 0;
            font-size: 14px;
          }
          &:nth-child(2) {
            opacity: 1;
            font-size: 14px;
          }
        }
      }
      .time {
        position: absolute;
        right: 1.5em;
        font-size: 14px;
        .el-badge-box {
          height: 25px;
          .el-badge {
            display: block;
            top: 5px;
          }
        }
      }
    }
    .contont-border-bottom {
      width: 100vw;
      border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
      position: absolute;
    }
  }
}
.contact-badge {
  vertical-align: initial;
  padding-left: 5px;
  top: -2px;
}
.hichat-pc {
  .address-box {
    .contont-box {
      .msg-box {
        .content-text {
          span {
            &:nth-child(1) {
              width: 120px;
            }
          }
        }
      }
    }
  }
}
</style>
