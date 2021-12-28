<template>
  <div>
    <div class="home-header">
      <div class="home-user"></div>
      <span class="home-header-title">HiChat</span>
      <router-link :to="'/AddGroup'">
        <div class="home-add-user"></div>
      </router-link>
    </div>
    <div class="home-search">
      <el-input
        placeholder="搜索"
        prefix-icon="el-icon-search"
        v-model="searchKey"
      >
      </el-input>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="联络人" name="address">
        <div
          v-for="(item, index) in hiChatDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item,'ChatMsg')"
        >
          <el-image
            :src="
              item.icon === null
                ? require('./../../../../static/images/image_user_defult.png')
                : item.icon
            "
          />
          <div class="msg-box">
            <span>{{ item.name }}</span>
            <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'">{{
              item.lastChat.text
            }}</span>
            <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
              >传送了语音</span
            >
            <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
              >传送了图片</span
            >
          </div>
          <span class="time">
            {{ $root.formatTimeDay(item.lastChat.sendTime) }}
            <div class="el-badge-box">
              <el-badge
                :value="item.unreadCount"
                class="item"
                v-if="item.unreadCount !== 0"
              ></el-badge>
            </div>
          </span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <div
          v-for="(item, index) in groupDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item,'ChatGroupMsg')"
        >
          <el-image :src="item.icon" />
          <div class="msg-box">
            <span>{{ item.name }}</span>
            <span v-if="item.lastChat.chatType === 'SRV_GROUP_SEND'">{{
              item.lastChat.text
            }}</span>
            <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_AUDIO'"
              >传送了语音</span
            >
            <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_IMAGE'"
              >传送了图片</span
            >
          </div>
          <span class="time">
            {{ $root.formatTimeDay(item.lastChat.sendTime) }}
            <div class="el-badge-box">
              <el-badge
                :value="item.unreadCount"
                class="item"
                v-if="item.unreadCount !== 0"
              ></el-badge>
            </div>
          </span>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="陌生讯息"
        name="contact"
        v-if="contactDataList.length > 0"
      >
        <span slot="label" v-if="contactDataList.length > 0">
          <span>陌生讯息</span>
          <el-badge is-dot class="contact-badge"></el-badge>
        </span>
        <div
          v-for="(item, index) in contactDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item,'ChatMsg')"
        >
          <el-image :src="item.icon" />
          <div class="msg-box">
            <span>{{ item.name }}</span>
            <span v-if="item.lastChat.chatType === 'SRV_USER_SEND'">{{
              item.lastChat.text
            }}</span>
            <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
              >传送了语音</span
            >
            <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
              >传送了图片</span
            >
          </div>
          <span class="time">
            {{ $root.formatTimeDay(item.lastChat.sendTime) }}
            <div class="el-badge-box">
              <el-badge
                :value="item.unreadCount"
                class="item"
                v-if="item.unreadCount !== 0"
              ></el-badge>
            </div>
          </span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";

export default {
  name: "HiChat",
  data() {
    return {
      searchKey: "",
      activeName: "address",
      hiChatDataList: [],
      contactDataList: [],
      groupDataList: [],
      newMsgDataList: [],
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
    }),
  },
  mounted() {
    this.getHiChatDataList();
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
    }),
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
            (item) => !item.isContact && item.isContact !==null
          );
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_SEND":
          this.getHiChatDataList();
          break;
      }
    },
    goChatRoom(data,path) {
      console.log(data)
      if(path === 'ChatMsg'){
        localStorage.setItem("userData", JSON.stringify(data));
      } else {
        this.groupData = JSON.parse(localStorage.getItem("groupData"))
        this.groupData.groupId = data.toChatId.replace("g", ""),
        this.groupData.groupName = data.name
        this.groupData.memberId = data.forChatId.replace("u", ""),
        this.groupData.icon = data.icon
        localStorage.setItem("groupData", JSON.stringify(this.groupData));
      }
      this.$router.push({ name: path });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-header {
  .home-add-user {
    background-color: #fff;
    background-image: url("./../../../../static/images/add_chat.png");
  }
}

.address-box {
  .msg-box {
    span {
      display: block;
      padding-left: 1em;
      font-size: 16px;
      &:nth-child(1) {
        margin-bottom: 7px;
      }
      &:nth-child(2) {
        font-size: 14px;
        opacity: 0.5;
        &::after {
          content: "";
          display: block;
          position: absolute;
          margin-top: 1em;
          width: 100%;
          border-bottom: 0.02em solid #b3b3b3;
        }
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
.contact-badge{
  vertical-align: initial;
  padding-left: 5px;
}
</style>
