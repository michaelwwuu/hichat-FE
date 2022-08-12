<template>
  <div class="home-content" @touchmove="$root.handleTouch">
    <el-tabs v-model="hichatNav.type" @tab-click="handleClick">
      <el-tab-pane label="联络人" name="address">
        <span slot="label" v-if="newHiChatDataList.length > 0">
          <span>联络人</span>
          <el-badge
            v-if="hiChatNumBadge > 0"
            :value="hiChatNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in newHiChatDataList"
          :key="index"
          class="address-box"
          @click="goChatRoom(item, 'ChatMsg')"
        >
          <el-badge is-dot class="item" type="success" :class="{'no-show':!onlineMsg(item)}"
            ><el-image :src="noIconShow(item, 'user')"
          /></el-badge>
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span class="content-text">
                  <span v-if="item.lastChat === null"></span>
                  <span
                    v-else-if="item.lastChat.chatType === 'SRV_USER_SEND'"
                    >{{ isBase64(item.lastChat.text) }}</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_CHAT_PIN'"
                    >{{ item.lastChat.text }}置顶了消息</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
                    >传送了语音</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
                    >传送了图片</span
                  >
                </span>
              </div>
              <div class="time" v-if="item.lastChat !== null">
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
                  <span v-if="item.lastChat === null"></span>
                  <span
                    v-else-if="item.lastChat.chatType === 'SRV_GROUP_SEND'"
                    v-html="judgeTextMarking(isBase64(item.lastChat.text))"
                  ></span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_CHAT_PIN'"
                    >{{ item.lastChat.text }}置顶了消息</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_AUDIO'"
                    >传送了语音</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_IMAGE'"
                    >传送了图片</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_JOIN'"
                    >{{ item.lastChat.text }}加入了聊天室</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_GROUP_DEL'"
                    >{{ item.lastChat.text }}離開了聊天室</span
                  >
                  <span
                    v-else-if="
                      item.lastChat.chatType === 'SRV_GROUP_ADD_MANAGER_HISTORY'
                    "
                    >{{ item.lastChat.text }}已被指定為管理員</span
                  >
                  <span
                    v-else-if="
                      item.lastChat.chatType ===
                      'SRV_GROUP_REMOVE_MANAGER_HISTORY'
                    "
                    >{{ item.lastChat.text }}已被解除管理員身份</span
                  >
                  <span
                    v-else-if="
                      item.lastChat.chatType ===
                      'SRV_GROUP_CHANGE_ADMIN_HISTORY'
                    "
                    >群主變更為{{ item.lastChat.text }}</span
                  >
                </span>
              </div>
              <div class="time" v-if="item.lastChat !== null">
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
        v-if="newContactDataList.length > 0"
      >
        <span slot="label" v-if="newContactDataList.length > 0">
          <span>陌生讯息</span>
          <el-badge
            v-if="contactNumBadge > 0"
            :value="contactNumBadge"
            class="contact-badge"
          ></el-badge>
        </span>
        <div
          v-for="(item, index) in newContactDataList"
          :key="index"
          class="address-box"
          @click="
            device === 'moblie'
              ? goChatRoom(item, 'ChatMsg')
              : goChatRoom(item, 'ChatContact')
          "
        >
          <el-badge is-dot class="item" type="success" :class="{'no-show':!onlineMsg(item)}"
            ><el-image :src="noIconShow(item, 'user')"
          /></el-badge>
          <div class="contont-box">
            <div class="msg-box">
              <div>
                <span>{{ item.name }}</span>
                <span class="content-text">
                  <span v-if="item.lastChat === null"></span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_SEND'">{{
                    isBase64(item.lastChat.text)
                  }}</span>
                  <span v-else-if="item.lastChat.chatType === 'SRV_CHAT_PIN'"
                    >{{ item.lastChat.text }}置顶了消息</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_AUDIO'"
                    >传送了语音</span
                  >
                  <span v-else-if="item.lastChat.chatType === 'SRV_USER_IMAGE'"
                    >传送了图片</span
                  >
                </span>
              </div>
              <div class="time" v-if="item.lastChat !== null">
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
import AESBase64 from "@/utils/AESBase64.js";
import { mapState, mapMutations } from "vuex";
import { getToken } from "_util/utils.js";
import {
  getGroupList,
  groupListMember,
  // getSearchById,
  getGroupAuthoritySetting,
  // deleteRecentChat,
  groupMemberList,
  getMemberActivity,
} from "@/api";

export default {
  name: "HiChat",
  data() {
    return {
      searchKey: "",
      groupList: [],
      authorityData: {},
      groupDataList: [],
      newHiChatDataList:[],
      newContactDataList:[],
      noGroupPeopleData:[],
      getHistoryMessage: {
        chatType: "",
        toChatId: "",
        id: Math.random(),
        tokenType: 0,
        targetId: "",
        pageSize: 1000,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      },
      groupMemberDataList:{},
      device: localStorage.getItem("device"),
      activeName: "address",
      isDialogShow: false,
      dialogData: {},
      
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    Socket.$on("message", this.handleGetMessage);
    this.getGroupDataList();
    this.getGroupMemberList()
    this.setActiveName(this.hichatNav.type);
    this.memberTime = setInterval(() => {
      this.getUserMemberActivity(this.noGroupPeopleData)
    }, 30000);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
    clearInterval(this.memberTime)
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      myUserInfo: (state) => state.ws.myUserInfo,
      contactUser: (state) => state.ws.contactUser,
      myContactDataList: (state) => state.ws.myContactDataList,
    }),
  },
  mounted() {
    this.getHiChatDataList();
    this.homeScrollHeight()
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
      setTopMsg: "ws/setTopMsg",
      setInfoMsg: "ws/setInfoMsg",
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setChatUser: "ws/setChatUser",
      setAuthority: "ws/setAuthority",
      setHichatNav: "ws/setHichatNav",
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setTopMsgShow: "ws/setTopMsgShow",
      setActiveName: "ws/setActiveName",
      setContactUser: "ws/setContactUser",
      setCheckBoxBtn: "ws/setCheckBoxBtn",
      setContactListData: "ws/setContactListData",
      setAuthorityGroupData: "ws/setAuthorityGroupData",
    }),
    homeScrollHeight(){
      let scrollTop = document.querySelector(".home-content");
      let headerScrollTop = document.querySelector(".is-top");
      let tabsContentHeight = scrollTop.scrollHeight - headerScrollTop.scrollHeight
      document.querySelector(".el-tabs__content").style.height = tabsContentHeight + 'px';       
    }, 
    getGroupMemberList(){
      groupMemberList().then((res)=>{
        if(res.code === 200){
          this.groupMemberDataList = res.data
          for (let item in this.groupMemberDataList) {
            this.groupDataList.forEach((el)=>{
              if(this.groupMemberDataList[item].groupId === Number(el.toChatId.replace("g", ""))){
                const dictionary = this.isBase64(el.lastChat.text).split(" ")
                this.groupMemberDataList[item].memberList.forEach((name)=> {
                  const xIndex = dictionary.indexOf("@"+name.memberId + "\u200B")
                  if (xIndex > -1) {
                    dictionary.splice(xIndex, 1, "@" + name.name)
                  }
                });
                return el.lastChat.text = dictionary.toString().replace(/,/g, " ")
              }
            })
          }

        }
      })
    },
    judgeTextMarking(data) {
      let judgeTextData = data.replace(/\n|\r/g, "").split(" ")
      const xIndex = judgeTextData.indexOf("@" + this.myUserInfo.nickname)
      if (xIndex > -1 || ["@所有成員","@所有成员"].includes(data)) {
        if(this.device === "moblie"){
          return `<div style="color:#F00">【 有人@我 】</div>` + data;
        }else{
          return `<div style="color:#F00">【 有人@我 】</div>` + (data.length > 8 ? data.slice(0,6) + '...' : data);
        }
      } else{
        if(this.device === "moblie"){
          return data
        }else{
          return data.length > 25 ? data.slice(0,10) + '...' : data
        }
      }
    },
    noIconShow(iconData, key) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require(`./../../../../static/images/image_${key}_defult.png`);
      } else {
        return iconData.icon;
      }
    },
    handleClick(tab) {
      if (tab.name === "address" || tab.name === "contact") {
        this.getHistoryMessage.chatType = "CLI_HISTORY_REQ";
        this.getHistoryMessage.toChatId = tab.name === "address" ? this.chatUser.toChatId : this.contactUser.toChatId;
        this.getHistoryMessage.id = Math.random();
        this.memberTime = setInterval(() => {
          this.getUserMemberActivity(this.noGroupPeopleData)
        }, 30000);
      } else {
        this.getHistoryMessage.chatType = "CLI_GROUP_HISTORY_REQ";
        this.getHistoryMessage.toChatId = this.groupUser.toChatId;
        this.getHistoryMessage.id = Math.random();
        clearInterval(this.memberTime)
      }
      Socket.send(this.getHistoryMessage);
      this.setInfoMsg({ infoMsgShow: false });
      this.setActiveName(this.hichatNav.type);
      this.setTopMsgShow(true);
      this.closeReplyMessage();
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey ,this.aesIv)
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
          this.groupDataList = [];
          userInfo.recentChat.forEach((item) => {
            if (item.isContact && (item.forChatId === item.toChatId)) {
              item.name = "嗨聊记事本"
              item.icon = require("./../../../../static/images/image_savemessage.png");
              this.hiChatNumBadge += item.unreadCount;
            } else if (item.isGroup) {
              this.groupDataList.push(item);
              this.groupNumBadge += item.unreadCount;
            } else if (
              !item.isContact &&
              item.isContact !== null &&
              item.lastChat !== null
            ) {
              this.contactNumBadge += item.unreadCount;
            }
          });
          this.noGroupPeopleData = userInfo.recentChat.filter(res=> !res.isGroup)
          this.getUserMemberActivity(this.noGroupPeopleData)
          this.getGroupMemberList()
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
    getUserMemberActivity(data) {
      let memberId = [];
      data.forEach(listNumber => {
        memberId.push(listNumber.toChatId.replace("u", ""))
      });
      getMemberActivity({ memberId }).then((res) => {
        if (res.code === 200) {
          this.userTimeData = res.data;
          this.newHiChatDataList = []
          this.newContactDataList = [] 
          data.forEach((res)=>{
            this.userTimeData.forEach((data) => {
              if (res.toChatId ==="u" +  data.memberId) {
                res.currentTime = data.currentTime;
                res.lastActivityTime = data.lastActivityTime;
              } 
            });
          })
          this.newHiChatDataList = data.filter(list => list.isContact)
          this.newContactDataList = data.filter(list => !list.isContact)
        }
      });
    },
    onlineMsg(data){
      if(data.lastActivityTime === 0 || data.name === "嗨聊记事本" ) {
        return false
      } else {
        let nowTime = data.currentTime
        let lastTime = data.lastActivityTime
        const diffInMills = nowTime - lastTime
        if(diffInMills/1000 < 300){
          return true
        } else{
          return false
        }
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
    getGroupAuthority(data) {
      let groupId = data.toChatId.replace("g", "");
      getGroupAuthoritySetting({ groupId }).then((res) => {
        if (res.code === 200) {
          this.authorityGroupData = res.data;
          this.setAuthorityGroupData(this.authorityGroupData);
        }
      });
    },
    getGroupListMember(data) {
      let groupId = data.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((item) => {
          if (item.memberId === this.groupUser.memberId) {
            this.groupUser.isAdmin = item.isAdmin;
            this.groupUser.isBanPost = item.isBanPost;
            this.groupUser.isManager = item.isManager;
          }
          if (item.icon === undefined) {
            item.icon = require("./../../../../static/images/image_user_defult.png");
          }
          if (item.memberId === Number(localStorage.getItem("id"))) {
            if (item.isAdmin || (!item.isAdmin && !item.isManager)) {
              localStorage.removeItem("authority");
            } else if (item.isManager) {
              this.setAuthority(item.authority);
            }
          }
        });
        this.setContactListData(this.contactList);
      });
    },
    goChatRoom(data, path) {
      this.setTopMsgShow(true);
      this.getGroupDataList();
      this.setInfoMsg({ infoMsgMap: "HiChat" });
      if(this.device === "moblie"){
        clearInterval(this.memberTime)
      }
      if (path === "ChatMsg") {
        data.contactId = data.toChatId.replace("u", "");
        data.memberId = data.toChatId.replace("u", "");
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
            data.isAdmin = item.isAdmin;
            data.isBanPost = item.isBanPost;
            data.isManager = item.isManager;
          }
        });
        this.setChatGroup(data);
        this.getGroupListMember(data);
        this.getGroupAuthority(data);
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
        this.setCheckBoxBtn(true)
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
  .no-show{
    /deep/.el-badge__content{
      display: none;
    }
  }
  .contont-box {
    .msg-box {
      .content-text {
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
              width: 140px;
            }
          }
        }
      }
    }
  }
}
.el-dialog-msg-show {
  overflow: auto;
  /deep/.el-dialog {
    margin: 0 auto 50px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    .el-dialog__header {
      padding: 10px;
      background-color: #f60;
      border-radius: 10px 10px 0 0;
      .el-dialog__title {
        color: #000000;
      }
    }
    .el-dialog__body {
      text-align: center;
      padding: 0;
      div {
        height: 3.5em;
        line-height: 3.5em;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 1.5em;
          padding-right: 5px;
        }
        &:nth-child(1) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}
.home-content{
  overflow: hidden !important;
}
</style>
