<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="hichatNav.type" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <div
          v-for="(item, index) in hiChatDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatMsg')"
        >
          <el-image
            :src="
              item.icon === undefined || item.icon === null || item.icon === ''
                ? require('./../../../../static/images/image_user_defult.png')
                : item.icon
            "
          />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span
                  v-if="item.lastChat.chatType === 'SRV_USER_SEND'"
                  class="content-text"
                >
                  <span>{{ item.lastChat.text }}</span>
                  <span v-if="item.lastChat.text.length > 55">...</span>
                </span>

                <span
                  v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
                  class="content-text"
                >
                  传送了语音</span
                >
                <span
                  v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
                  class="content-text"
                >
                  传送了图片</span
                >
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
        <div
          v-for="(item, index) in groupDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatGroupMsg')"
        >
          <el-image
            :src="
              item.icon === undefined || item.icon === null || item.icon === ''
                ? require('./../../../../static/images/image_group_defult.png')
                : item.icon
            "
          />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span
                  v-if="item.lastChat.chatType === 'SRV_GROUP_SEND'"
                  class="content-text"
                >
                  <span>{{ item.lastChat.text }}</span>
                  <span v-if="item.lastChat.text.length > 55">...</span>
                </span>
                <span
                  v-else-if="item.lastChat.chatType === 'SRV_GROUP_AUDIO'"
                  class="content-text"
                  >传送了语音</span
                >
                <span
                  v-else-if="item.lastChat.chatType === 'SRV_GROUP_IMAGE'"
                  class="content-text"
                  >传送了图片</span
                >
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
          <el-badge v-if="messageNum" is-dot class="contact-badge"></el-badge>
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
          <el-image
            :src="
              item.icon === undefined || item.icon === null || item.icon === ''
                ? require('./../../../../static/images/image_user_defult.png')
                : item.icon
            "
          />
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span
                  v-if="item.lastChat.chatType === 'SRV_USER_SEND'"
                  class="content-text"
                >
                  <span>{{ item.lastChat.text }}</span>
                  <span v-if="item.lastChat.text.length > 55">...</span>
                </span>

                <span
                  v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
                  class="content-text"
                >
                  传送了语音</span
                >
                <span
                  v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
                  class="content-text"
                >
                  传送了图片</span
                >
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
import { mapState, mapMutations } from "vuex";
import { getGroupList, groupListMember } from "@/api";

export default {
  name: "HiChat",
  data() {
    return {
      searchKey: "",
      groupList: {},
      groupDataList: [],
      hiChatDataList: [],
      newMsgDataList: [],
      contactDataList: [],
      messageNum: false,
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
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    this.getGroupDataList();
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      hichatNav: (state) => state.ws.hichatNav,
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      contactUser: (state) => state.ws.contactUser,
    }),
  },
  mounted() {
    this.getHiChatDataList();
  },
  watch: {
    contactDataList(val) {
      if (this.hichatNav === "contact" && val.length === 0) {
        this.setHichatNav({ type: "address", num: 1 });
      }
    },
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setReplyMsg: "ws/setReplyMsg",
      setChatUser: "ws/setChatUser",
      setHichatNav: "ws/setHichatNav",
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setContactUser: "ws/setContactUser",
      setContactListData: "ws/setContactListData",
    }),
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
          this.hiChatDataList = userInfo.recentChat.filter(
            (item) => item.isContact
          );
          this.groupDataList = userInfo.recentChat.filter(
            (item) => item.isGroup
          );
          this.contactDataList = userInfo.recentChat.filter(
            (item) => !item.isContact && item.isContact !== null
          );
          this.messageNum = this.contactDataList.some(
            (item) => item.unreadCount > 0
          );
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
        case "SRV_MSG_READ":
          this.getHiChatDataList();
          break;
      }
    },
    getGroupDataList() {
      getGroupList().then((res) => {
        this.groupList = res.data.list;
        this.setGroupList(this.groupList);
      });
    },
    getGroupListMember() {
      let groupId = this.groupUser.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined)
            res.icon = require("./../../../../static/images/image_user_defult.png");
        });
        this.setContactListData(this.contactList);
      });
    },
    goChatRoom(data, path) {
      if (path === "ChatMsg") {
        this.setChatUser(data);
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
        this.getGroupListMember();
      }

      if (this.device === "moblie") {
        this.$router.push({ name: path });
      } else {
        if (data.isContact) {
          this.type = "address";
          this.contact = false;
        } else if (data.isGroup) {
          this.type = "group";
          this.contact = false;
        } else if (!data.isBlock && !data.isContact && !data.isGroup) {
          this.type = "contact";
          this.contact = true;
        }
        this.setHichatNav({ type: this.type, num: 1, contact: this.contact });
        this.setInfoMsg({
          infoMsgShow: false,
          infoMsgNav: path === "ChatMsg" ? "ContactPage" : "GroupPage",
        });
        this.getHistory(data, path);
        setTimeout(() => this.getHiChatDataList(), 2000);
        this.closeReplyMessage();
      }
    },
    closeReplyMessage() {
      this.setReplyMsg({
        chatType: "",
        clickType: "",
        innerText: "",
        replyHistoryId: "",
      });
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
            width: 10em;
            overflow: hidden;
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
      border-bottom: 0.02em solid #b3b3b3;
      position: absolute;
    }
  }
}
.contact-badge {
  vertical-align: initial;
  padding-left: 5px;
}
</style>
