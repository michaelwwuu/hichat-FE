<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header :style="num === 2 ? 'height:55px' : 'height:120px'">
          <div class="home-header">
            <div
              class="home-user"
              :class="{ 'QRcode-img': num === 0 || num === 2 }"
              @click="
                num === 0 || num === 2 ? (centerDialogVisible = true) : ''
              "
            ></div>
            <span class="home-header-title">{{
              num === 0 ? "通讯录" : num === 1 ? "HiChat" : "设定"
            }}</span>
            <template v-if="activeName === 'address' && num !== 2">
              <router-link :to="'/AddUser'">
                <div class="home-add-user address-img"></div>
              </router-link>
            </template>
            <template v-else-if="activeName === 'group' && num !== 2">
              <router-link :to="'/AddGroup'">
                <div class="home-add-user hichat-img"></div>
              </router-link>
            </template>
            <template v-else-if="num === 2">
              <router-link :to="'/EditUser'"
                ><div class="home-add-user setting-img"></div
              ></router-link>
            </template>
          </div>
          <div class="home-search" v-if="num !== 2">
            <el-input
              placeholder="搜索"
              prefix-icon="el-icon-search"
              clearable
              v-model="searchKey"
            >
            </el-input>
          </div>
        </el-header>

        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <el-footer class="home-footer-nav">
          <div
            class="footer-nav-btn"
            v-for="(item, index) in routerNav"
            :key="index"
            @click="changeImg(index)"
          >
            <router-link :to="item.path">
              <span>
                <div class="el-badge-box" v-if="index === 1">
                  <el-badge
                    :value="badgeNum"
                    class="item"
                    v-if="badgeNum !== 0"
                  ></el-badge>
                </div>
                <img :src="index !== num ? item.icon : item.active"
              /></span>
              <span>{{ item.name }}</span>
            </router-link>
          </div>
        </el-footer>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header style="height: 70px">
          <div class="home-header" v-if="num === 2">
            <span class="home-header-title">设定</span>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <img src="./../../../static/images/pc/more.png" alt="" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div class="logout-btn" @click="logoutDialogShow = true">
                    <img src="./../../../static/images/pc/logout.png" alt="" />
                    <span>登出</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="home-search" v-else>
            <el-input
              placeholder="搜索"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              clearable
            >
            </el-input>
            <template v-if="activeName === 'address'">
              <router-link :to="'/AddUser'">
                <img src="./../../../static/images/pc/user-plus.png" alt="" />
              </router-link>
            </template>
            <template v-else-if="activeName === 'group'">
              <router-link :to="'/AddGroup'">
                <img
                  src="./../../../static/images/pc/message-plus.png"
                  alt=""
                />
              </router-link>
            </template>
          </div>
        </el-header>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <el-footer class="home-footer-nav">
          <div
            class="footer-nav-btn"
            v-for="(item, index) in routerNav"
            :key="index"
            @click="changeImg(index)"
          >
            <router-link :to="item.path">
              <span>
                <div class="el-badge-box" v-if="index === 1">
                  <el-badge
                    :value="badgeNum"
                    class="item"
                    v-if="badgeNum !== 0"
                  ></el-badge>
                </div>
                <img :src="index !== num ? item.icon : item.active"
              /></span>
            </router-link>
          </div>
        </el-footer>
      </el-aside>
      <el-main>
        <template v-if="num === 1">
          <chat-msg
            v-if="
              hichatNav.type === 'address' && JSON.stringify(chatUser) !== '{}'
            "
          />
          <chat-group-msg
            v-else-if="
              hichatNav.type === 'group' && JSON.stringify(groupUser) !== '{}'
            "
          />
          <chat-contact
            v-else-if="
              hichatNav.type === 'contact' &&
              JSON.stringify(contactUser) !== '{}'
            "
          />
        </template>
        <template v-if="infoMsg.infoMsgShow && !infoMsg.infoMsgChat">
          <div class="go-room-style">
            <img src="./../../../static/images/msg-btn.png" alt="" />
            <el-button @click="goChatRoom(chatUser, activeName)"
              >開始聊天</el-button
            >
          </div>
        </template>
      </el-main>
      <el-aside
        width="300px"
        style="overflow: hidden"
        v-if="infoMsg.infoMsgShow"
      >
        <msg-info-page />
      </el-aside>
    </el-container>
    <el-dialog
      title="我的帐号"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="100%"
      center
    >
      <div class="qrcode-box">
        <vue-qr
          ref="Qrcode"
          :correctLevel="3"
          :autoColor="false"
          colorDark="#333333"
          :text="qrCodeConfig.text"
          :download="downloadFilename"
          :size="100"
          :margin="0"
          :logoSrc="qrCodeConfig.logo"
          :logoCornerRadius="2"
          :logoMargin="1"
        ></vue-qr>
      </div>
      <span class="qrcode-box-text"
        >嗨聊用户扫描此二维码后，可将您加入好友！</span
      >
      <span slot="footer" class="dialog-footer">
        <router-link :to="'/QRcode'"
          ><img src="./../../../static/images/scan.png" alt=""
        /></router-link>
        <img src="./../../../static/images/share.png" alt="" @click="copyUrl" />
        <img
          src="./../../../static/images/download.png"
          alt=""
          @click="downloadImg"
        />
      </span>
    </el-dialog>
    <el-dialog
      title="登出"
      :visible.sync="logoutDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <span>确认要登出嗎？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="background-gray"
          style="border-right: 1px solid #efefef; border-raduis: 0"
          @click="logoutDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="loginOut">登出</el-button>
      </span>
    </el-dialog>
    <!-- <audio
      id="notify-receive-audio"
      muted="muted"
      src="./../../../static/wav/receive.mp3"
    ></audio> -->
  </div>
</template>

<script>
import VueQr from "vue-qr";
import urlCopy from "@/utils/urlCopy.js";
import Socket from "@/utils/socket";

import { mapState, mapMutations } from "vuex";
import {
  getGroupList,
  groupListMember,
  getUserInfo,
  getContactList,
} from "@/api";
import { Decrypt } from "@/utils/AESUtils.js";
import ChatMsg from "./../Chat/ChatMsg.vue";
import ChatGroupMsg from "./../Chat/Chat.vue";
import ChatContact from "./../Chat/ChatContact.vue";
import MsgInfoPage from "./../ContactPage/MsgInfoPage.vue";

export default {
  name: "Home",
  data() {
    return {
      routerNav: [
        {
          icon: require("./../../../static/images/address.png"),
          active: require("./../../../static/images/address_hover.png"),
          path: "/Address",
          name: "通讯录",
        },
        {
          icon: require("./../../../static/images/chat.png"),
          active: require("./../../../static/images/chat_hover.png"),
          path: "/HiChat",
          name: "聊天",
        },
        {
          icon: require("./../../../static/images/setting.png"),
          active: require("./../../../static/images/setting_hover.png"),
          path: "/Setting",
          name: "设定",
        },
      ],
      qrCodeConfig: {
        text: `${
          process.env.VUE_APP_URL
        }fe/#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      num: 0,
      searchKey: "",
      groupList:[],
      searchData: [],
      chatDataList: [],
      addressDataList: [],
      downloadFilename: "",
      logoutDialogShow: false,
      infoMsgAsideShow: false,
      centerDialogVisible: false,
      device: localStorage.getItem("device"),
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

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    this.num =
      this.$route.fullPath === "/Address"
        ? 0
        : this.$route.fullPath === "/HiChat"
        ? 1
        : 2;
    Socket.$on("message", this.handleGetMessage);
    this.getContactDataList();
    this.getUserData();
  },
  watch: {
    hichatNav(val) {
      this.num = val.num;
    },
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase =
          this.activeName === "address" ? this.addressDataList : this.groupList;
        this.searchData = searchCase.filter((item) => {
          if (this.activeName === "address") {
            return item.name.indexOf(el.replace("@", "")) !== -1;
          } else {
            return item.groupName.indexOf(el.replace("@", "")) !== -1;
          }
        });
      });
      this.activeName === "address"
        ? this.setMyContactDataList(this.searchData)
        : this.setGroupList(this.searchData);
    },
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      infoMsg: (state) => state.ws.infoMsg,
      chatUser: (state) => state.ws.chatUser,
      badgeNum: (state) => state.ws.badgeNum,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      soundNofiy: (state) => state.ws.soundNofiy,
      activeName: (state) => state.ws.activeName,
      contactUser: (state) => state.ws.contactUser,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setBadgeNum: "ws/setBadgeNum",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setContactUser: "ws/setContactUser",
      setGroupList: "ws/setGroupList",
      setHichatNav: "ws/setHichatNav",
      setMyUserInfo: "ws/setMyUserInfo",
      setContactListData: "ws/setContactListData",
      setMyContactDataList: "ws/setMyContactDataList",
    }),
    goChatRoom(data, type) {
      this.setInfoMsg({
        infoMsgShow: false,
        infoMsgNav: type === "address" ? "ContactPage" : "GroupPage",
      });
      if (type === "address") {
        delete this.chatUser.type;
        this.setChatUser(this.chatUser);
      } else {
        delete this.groupUser.type;
        this.getGroupListMember(data);
        this.setChatGroup(this.groupUser);
      }
      this.setHichatNav({ type: type, num: 1 });
      this.getHistory(type);
      this.$router.push({ name: "HiChat", params: data });
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
        // return Decrypt(data, this.aesKey, this.aesIv);
      } catch (err) {
        return data;
      }
    },
    getContactDataList() {
      getContactList().then((res) => {
        this.addressDataList = res.data.list;
        this.addressDataList.forEach((el) => {
          if (el.icon === undefined) {
            return (el.icon = require("./../../../static/images/image_user_defult.png"));
          }
          if (el.contactId === localStorage.getItem("id")) {
            el.name = "Hichat 记事本";
            el.icon = require("./../../../static/images/image_savemessage.png");
            el.toChatId = "u" + el.memberId;
          }
        });
      });
      getGroupList().then((res) => {
      this.groupList = res.data.list;
      this.groupList.forEach((el) => {
        if (el.icon === "") {
          el.icon = require("./../../../static/images/image_group_defult.png");
        }
      });
      // this.setGroupList(this.groupData);
    });
    },
    getUserData() {
      getUserInfo().then((res) => {
        if (res.data.icon === undefined) {
          res.data.icon = require("./../../../static/images/image_user_defult.png");
        }
        this.setMyUserInfo(res.data);
      });
    },
    getGroupListMember() {
      let groupId = this.groupUser.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined) {
            return (res.icon = require("./../../../static/images/image_user_defult.png"));
          }
        });
        this.setContactListData(this.contactList);
      });
    },
    changeImg(index) {
      this.num = index;
      this.setInfoMsg({ infoMsgShow: false });
      this.setHichatNav({ type: this.hichatNav.type, num: this.num });
      if (this.num === 1) this.getHistory(this.hichatNav.type);
      this.getHistorySetTimeout();
    },
    getHistorySetTimeout() {
      setTimeout(() => this.getHiChatDataList(), 2000);
    },
    copyUrl() {
      let url = this.qrCodeConfig.text;
      urlCopy(url);
    },
    downloadImg() {
      const iconUrl = this.$refs.Qrcode.$el.src;
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = "二维码";
      a.href = iconUrl;
      a.dispatchEvent(event);
    },
    audioAction(){
      // let audioEl = document.getElementById("notify-receive-audio")  
      // const playPromise = audioEl.play();
      // if (playPromise !== undefined) {
      //   playPromise.then(_ => {
      //     audioEl.src= "" // 移除src, 防止之后播放空白音频  
      //     setTimeout(() => { // 用setTimeout模拟一个2秒的延迟
      //       audioEl.src = require("./../../../static/wav/receive.mp3")
      //     }, 150);  
      //   })
      //   .catch(error => {
      //     audioEl.pause();
      //   });
      // }
    },
    handleGetMessage(msg) {
      let msgInfo = JSON.parse(msg);
      let numNumber = 0;
      switch (msgInfo.chatType) {
        //成功收到
        case "SRV_RECENT_CHAT":
          this.chatDataList = msgInfo.recentChat;
          this.chatDataList.forEach((item) => {
            numNumber += item.unreadCount;
            if (item.toChatId === this.chatUser.toChatId) {
              if (item.toChatId === item.forChatId) {
                item.name = "Hichat 记事本";
                item.username = "Hichat 记事本";
                item.icon = require("./../../../static/images/image_savemessage.png");
              } else {
                item.contactId = this.chatUser.contactId;
                item.username = this.chatUser.username;
              }
              this.setChatUser(item);
            }
            this.setBadgeNum(numNumber);
          });
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          if (msgInfo.chat.fromChatId !== "u" + localStorage.getItem("id")) {
            this.soundNofiy.forEach((res) => {
              if (
                msgInfo.chatType === "SRV_USER_IMAGE" ||
                msgInfo.chatType === "SRV_USER_AUDIO" ||
                msgInfo.chatType === "SRV_USER_SEND"
              ) {
                if (res.key === "private" && res.isNofity) {
                  this.audioAction()
                }
              } else {
                if (res.key === "group" && res.isNofity) {
                 this.audioAction()
                }
              }
            });
            setTimeout(() => this.openNotify(msgInfo, msgInfo.chatType), 1000);
          }
          if (this.device === "moblie") {
            this.getHiChatDataList();
          }
          break;
        case "SRV_ERROR_MSG":
          if (msgInfo.text === "30006") {
            this.$confirm("群組已解散, 是否继续?", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "danger",
              center: true,
            }).then(() => {
              this.getHiChatDataList();
              this.setHichatNav({ type: "address", num: 1 });
              this.setChatGroup({});
            });
          }
          break;
        case "SRV_CHAT_DEL":
          if (this.device === "moblie") {
            this.getHiChatDataList();
          }
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
    openNotify(msgInfo, chatType) {
      // 判断浏览器是否支持Notification
      if (!window.Notification) {
        // console.log("浏览器不支持通知");
      } else {
        // 检查用户曾经是否同意接受通知
        if (Notification.permission === "granted") {
          this.notifyMe(msgInfo, chatType); // 显示通知
        } else if (Notification.permission === "default") {
          // 用户还未选择，可以询问用户是否同意发送通知
          Notification.requestPermission(function (permission) {
            this.notifyMe(msgInfo, chatType); // 显示通知
          });
        } else {
          // denied 用户拒绝
          // console.log("用户曾经拒绝显示通知");
        }
      }
    },
    noIconShow(iconData) {
      if ([undefined,null,""].includes(iconData.icon)) {
        return require("./../../../static/images/image_user_defult.png");
      } else {
        return iconData;
      }
    },
    notifyMe(msgInfo, chatType) {
      let notify = {
        name: "",
        icon: "",
        title: "",
        type: "",
      };
      this.chatDataList.forEach((el) => {
        if (el.toChatId === msgInfo.toChatId) {
          if (el.isContact) {
            notify.icon = this.noIconShow(el.icon);
            notify.title = "(联络人)";
            notify.type = "address";
          } else if (el.isGroup) {
            notify.icon =
              el.icon === ""
                ? require("./../../../static/images/image_group_defult.png")
                : el.icon;
            notify.title = "(群组)";
            notify.type = "group";
          } else if (!el.isBlock && !el.isContact && !el.isGroup) {
            notify.icon = this.noIconShow(el.icon);
            notify.title = "(陌生人)";
            notify.type = "contact";
          }
          notify.name = el.name;
        }
      });
      switch (chatType) {
        case "SRV_USER_SEND":
        case "SRV_GROUP_SEND":
          this.bodyMsg = msgInfo.chat.text;
          break;
        case "SRV_USER_IMAGE":
        case "SRV_GROUP_IMAGE":
          this.bodyMsg = "传送了图片";
          break;
        case "SRV_USER_AUDIO":
        case "SRV_GROUP_AUDIO":
          this.bodyMsg = "传送了语音";
          break;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification#Parameters
      this.$notification.show(
        `${notify.name} ${notify.title}`,
        {
          dir: "rtl", //auto（自动）, ltr（从左到右）, or rtl（从右到左）
          lang: "zh", //指定通知中所使用的语言。这个字符串必须在 BCP 47 language tag 文档中是有效的。
          tag: msgInfo.toChatId, //赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
          icon: notify.icon, //提示时候的图标
          body: this.isBase64(this.bodyMsg), // 一个图片的URL，将被用于显示通知的图标。
          data: msgInfo,
          renotify: true,
        },
        {
          onclick: (even) => {
            this.$router.push({ path: "/HiChat" });
            this.setHichatNav({ type: notify.type, num: 1 });
            this.notifyData = this.chatDataList.filter((el) => {
              return el.toChatId === even.target.data.toChatId;
            });
            if (notify.type === "address") {
              this.setChatUser(this.notifyData[0]);
            } else if (notify.type === "contact") {
              this.setContactUser(this.notifyData[0]);
            } else if (notify.type === "group") {
              this.notifyData[0].icon = this.notifyData[0].icon;
              this.notifyData[0].groupName = this.notifyData[0].name;
              this.notifyData[0].groupId = this.notifyData[0].toChatId.replace(
                "g",
                ""
              );
              this.notifyData[0].memberId = JSON.parse(
                this.notifyData[0].forChatId.replace("u", "")
              );
              this.groupList.forEach((item) => {
                if (item.groupName === this.notifyData[0].groupName) {
                  return (this.notifyData[0].isAdmin = item.isAdmin);
                }
              });
              this.setChatGroup(this.notifyData[0]);
              this.getGroupListMember();
            }
            this.getHistory(notify.type);
            this.getHistorySetTimeout();
          },
        }
      );
    },
    getHistory(type) {
      if (type === "address" || type === "contact") {
        this.getHistoryMessage.chatType = "CLI_HISTORY_REQ";
        this.getHistoryMessage.toChatId = this.chatUser.toChatId;
        this.getHistoryMessage.id = Math.random();
      } else {
        this.getHistoryMessage.chatType = "CLI_GROUP_HISTORY_REQ";
        this.getHistoryMessage.toChatId = this.groupUser.toChatId;
        this.getHistoryMessage.id = Math.random();
      }
      Socket.send(this.getHistoryMessage);
    },
    loginOut() {
      this.$router.push({ path: "/login" });
      localStorage.removeItem("token");
      localStorage.removeItem("myUserList");
      window.location.reload();
    },
  },
  components: {
    VueQr,
    ChatMsg,
    ChatGroupMsg,
    ChatContact,
    MsgInfoPage,
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .el-container {
    /deep/.el-main {
      .el-header {
        .home-header {
          .QRcode-img {
            background-color: #fff;
            background-image: url("./../../../static/images/qrcode.png");
          }
          .home-add-user {
            background-color: #fff;
          }
          .address-img {
            background-image: url("./../../../static/images/add_user.png");
          }
          .hichat-img {
            background-image: url("./../../../static/images/add_chat.png");
          }
          .setting-img {
            background-image: url("./../../../static/images/edit.png");
          }
        }
      }
    }
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    .logout-btn {
      display: flex;
      align-items: center;
      width: 12em;
      img {
        height: 1.5em;
      }
      span {
        margin-left: 0.3em;
        font-size: 17px;
        color: #333333;
        font-weight: 600;
        margin-top: 4px;
      }
    }
  }
}
.el-dialog-loginOut {
  /deep/.el-dialog__footer {
    padding: 0 !important;
    .el-button {
      padding: 20px !important;
      border-radius: 0 !important;
    }
  }
}
::v-deep .el-input__suffix {
  .el-icon-circle-close:before {
    content: "\e6db";
    font-size: 18px;
    color: #10686e;
  }
}
.el-badge-box {
  position: absolute;
  margin: -10px 0 0 20px;
}
.go-room-style {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    height: 8em;
    margin-bottom: 2.5em;
  }
  .el-button {
    color: #ffffff;
    padding: 1.3em 3em;
    background-color: #fe5f3f;
  }
}
</style>
