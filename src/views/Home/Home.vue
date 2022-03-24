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
            <template v-if="num === 0">
              <router-link :to="'/AddUser'">
                <div class="home-add-user address-img"></div>
              </router-link>
            </template>
            <template v-else-if="num === 1">
              <router-link :to="'/AddGroup'">
                <div class="home-add-user hichat-img"></div>
              </router-link>
            </template>
            <template v-else>
              <router-link :to="'/EditUser'"
                ><div class="home-add-user setting-img"></div
              ></router-link>
            </template>
          </div>
          <div class="home-search" v-if="num !== 2">
            <el-input
              placeholder="搜索"
              prefix-icon="el-icon-search"
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
            >
            </el-input>
            <template v-if="num === 0">
              <router-link :to="'/AddUser'">
                <img src="./../../../static/images/pc/user-plus.png" alt="" />
              </router-link>
            </template>
            <template v-else-if="num === 1">
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
  </div>
</template>

<script>
import VueQr from "vue-qr";
import urlCopy from "@/utils/urlCopy.js";
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { getGroupList, groupListMember,getUserInfo } from "@/api";
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
      chatDataList: [],
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
    };
  },
  created() {
    this.num = this.$route.fullPath === "/Address" ? 0 : this.$route.fullPath === "/HiChat" ? 1 : 2;
    Socket.$on("message", this.handleGetMessage);
    this.getGroupDataList();
    this.getUserData()
  },
  watch: {
    hichatNav(val) {
      this.num = val.num;
    },
  },
  computed: {
    ...mapState({
      hichatNav: (state) => state.ws.hichatNav,
      infoMsg: (state) => state.ws.infoMsg,
      chatUser: (state) => state.ws.chatUser,
      groupUser: (state) => state.ws.groupUser,
      contactUser: (state) => state.ws.contactUser,
      badgeNum: (state) => state.ws.badgeNum,
    }),
  },
  methods: {
    ...mapMutations({
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setBadgeNum:"ws/setBadgeNum",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setContactUser:"ws/setContactUser",
      setGroupList: "ws/setGroupList",
      setHichatNav: "ws/setHichatNav",
      setMyUserInfo:"ws/setMyUserInfo",
      setContactListData: "ws/setContactListData",
    }),
    getUserData() {
      getUserInfo().then((res) => {
        console.log(res)
        if (res.data.icon === undefined) {
          res.data.icon = require("./../../../static/images/image_user_defult.png");
        }
        this.setMyUserInfo(res.data)
      });
    },
    changeImg(index) {
      this.num = index;
      this.setInfoMsg({ infoMsgShow: false });
      this.setHichatNav({ type: this.hichatNav.type, num: this.num });
      if(this.num === 1 ) this.getHistory(this.hichatNav.type);
      if(this.device === "pc") this.getHistorySetTimeout()
    },
    getHistorySetTimeout(){
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
            res.icon = require("./../../../static/images/image_user_defult.png");
        });
        this.setContactListData(this.contactList);
      });
    },
    handleGetMessage(msg) {
      let msgInfo = JSON.parse(msg);
      this.numNumber = 0
      switch (msgInfo.chatType) {
        //成功收到
        case "SRV_RECENT_CHAT":
          this.chatDataList = msgInfo.recentChat;
          this.chatDataList.forEach((item) => {
            this.numNumber += item.unreadCount;
            this.setBadgeNum(this.numNumber)
            if(item.toChatId === this.chatUser.toChatId){
              item.username = this.chatUser.username
              this.setChatUser(item)
            }
          });
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          if (msgInfo.chat.fromChatId !== "u" + localStorage.getItem("id")) {
            // let filterList = this.chatDataList.some((list) => {
            //   return list.toChatId === msgInfo.toChatId;
            // });
            this.getHiChatDataList();
            // if (!filterList) this.getHiChatDataList();
            setTimeout(() => this.openNotify(msgInfo, msgInfo.chatType), 1000);
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
          if(this.device === "moblie") {
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
      if (iconData === undefined || iconData === null || iconData === "") {
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
          body: this.bodyMsg, // 一个图片的URL，将被用于显示通知的图标。
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
            }else if(notify.type === "contact"){
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
            this.getHistorySetTimeout()
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
.el-badge-box {
  position: absolute;
  margin: -10px 0 0 20px;
}
</style>
