<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header :style="num === 2 ? 'height:55px' : 'height:120px'">
          <div class="home-header">
            <div
              class="home-user"
              :class="[
                { 'QRcode-img': num === 0 },
                { 'broadcast-img': num === 1 && activeName === 'address'},
                { 'promote-img': num === 2 },
              ]"
              @click="
                num === 0 || num === 2 ? (centerDialogVisible = true) : activeName === 'address' ? $router.push({ name: 'SpreadChange'}) : false
              "
            ></div>
            <span class="home-header-title">{{
              num === 0 ? "通讯录" : num === 1 ? "嗨聊" : "设定"
            }}</span>
            <div v-if="num === 0 || num === 1">
              <template v-if="['address', 'contact', 'maybeKnow'].includes(activeName || hichatNav.type)">
                <router-link
                  :to="'/AddUser'"
                  :style="
                  ['contact'].includes(activeName || hichatNav.type) ? 'visibility: hidden' : ''
                  "
                >
                  <div class="home-add-user address-img"></div>
                </router-link>
              </template>
              <template v-else-if="['group'].includes(activeName || hichatNav.type)">
                <router-link :to="'/AddGroup'">
                  <div class="home-add-user hichat-img"></div>
                </router-link>
              </template>
            </div>
            <div v-else-if="num === 2">
              <router-link :to="'/EditUser'"
                ><div class="home-add-user setting-img"></div
              ></router-link>
            </div>
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
                <div class="el-badge-box" v-if="index === 1 && badgeNum !== 0">
                  <el-badge
                    :value="badgeNum"
                    class="item"
                  ></el-badge>
                </div>
                <div class="el-badge-box" v-if="index === 0 && maybeKnowNum !== 0">
                  <el-badge
                    :value="maybeKnowNum"
                    class="item"
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
      <el-aside width="315px">
        <el-header style="height: 70px">
          <div class="home-header" v-if="num === 2">
            <span class="home-header-title">设定</span>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <img src="./../../../static/images/pc/more.svg" alt="" />
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
            <div v-if="num === 0 || num === 1">
              <template v-if="['address','maybeKnow'].includes(activeName || hichatNav.type)">
                <router-link :to="'/Spread'" class="spread-style" v-if ="num === 1">
                  <img
                    src="./../../../static/images/pc/promotion.svg"
                    alt=""
                  />
                </router-link>    
                <router-link :to="'/AddUser'" :class="{'addimg-style': num === 1}">
                  <img
                    src="./../../../static/images/pc/user-plus.svg"
                    alt=""
                  />
                </router-link>
              </template>

              <template v-else-if="['group'].includes(activeName || hichatNav.type)">
                <router-link :to="'/AddGroup'">
                  <img
                    src="./../../../static/images/pc/message-plus.svg"
                    alt=""
                  />
                </router-link>
                
              </template>
            </div>
          </div>
        </el-header>
        <div class="home-header" v-if="$route.name === 'Spread'" style="justify-content: center;">
          <span class="home-header-title" style="color: #b3b3b3; font-weight:normal;">请选择发送对象</span>
        </div>
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
                <div class="el-badge-box" v-if="index === 1 && badgeNum !== 0">
                  <el-badge
                    :value="badgeNum"
                    class="item"
                  ></el-badge>
                </div>
                <div class="el-badge-box" v-if="index === 0 && maybeKnowNum !== 0">
                  <el-badge
                    :value="maybeKnowNum"
                    class="item"
                  ></el-badge>
                </div>
                <img :src="index !== num ? item.icon : item.active"
              /></span>
            </router-link>
          </div>
        </el-footer>
      </el-aside>
      <el-main>
        <template v-if="num === 1 && $route.name !== 'Spread'">
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
        <template v-else-if="infoMsg.infoMsgShow && !infoMsg.infoMsgChat">
          <div class="go-room-style">
            <img src="./../../../static/images/msg-btn.svg" alt="" />
            <el-button @click="goChatRoom(chatUser, activeName)"
              >開始聊天</el-button
            >
          </div>
        </template>
        <template v-else-if="$route.name === 'Spread'">
          <chat-spread/>
        </template>
      </el-main>
      <el-aside
        width="315px"
        style="overflow: hidden"
        v-if="infoMsg.infoMsgShow"
      >
        <msg-info-page />
      </el-aside>
    </el-container>
    <el-dialog
      :title="num === 1 ? '我的帐号' : '推廣連結'"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="100%"
      center
    >
      <template v-if="num === 2">
        <a
          :href="promoteCodeConfig.text"
          class="promote-href-text"
          target="_blank"
          >{{ promoteCodeConfig.text }}</a
        >
        <div class="promote-box-text">快来注册并下载嗨聊吧</div>
      </template>
      <div class="qrcode-box">
        <vue-qr
          ref="Qrcode"
          :correctLevel="3"
          :autoColor="false"
          colorDark="#333333"
          :text="num === 0 ? qrCodeConfig.text : promoteCodeConfig.text"
          :download="downloadFilename"
          :size="1000"
          :margin="0"
          :logoSrc="qrCodeConfig.logo"
          :logoCornerRadius="2"
          :logoMargin="1"
        ></vue-qr>
      </div>
      <span class="qrcode-box-text" v-if="num === 0"
        >嗨聊用户扫描此二维码后，可将您加入联络人！</span
      >
      <span
        slot="footer"
        class="dialog-footer"
        :style="num === 2 ? 'justify-content: center;' : ''"
      >
        <router-link :to="'/QRcode'" v-if="num === 0"
          ><img src="./../../../static/images/scan.png" alt=""
        /></router-link>
        <img src="./../../../static/images/share.png" alt="" @click="copyUrl" />
        <img
          v-if="num === 0"
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
  </div>
</template>

<script>
import VueQr from "vue-qr";
import {urlCopy} from "@/utils/urlCopy.js";
import Socket from "@/utils/socket";
import AESBase64 from "@/utils/AESBase64.js";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import {
  getGroupList,
  groupListMember,
  getUserInfo,
  getContactList,
  getMemberActivity,
  groupMemberList,
  maybeKnow,
  logout,
} from "@/api";
import { Encrypt } from "@/utils/AESUtils.js";
import ChatMsg from "./../Chat/ChatMsg.vue";
import ChatGroupMsg from "./../Chat/Chat.vue";
import ChatContact from "./../Chat/ChatContact.vue";
import ChatSpread from "./../Chat/ChatSpread.vue";
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
        text: `${location.origin}/fe/#/AddUser?username=${localStorage.getItem(
          "username"
        )}&id=${localStorage.getItem("id")}`,
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      promoteCodeConfig: {
        text: "",
        logo: require("./../../../static/images/material_ic_logo.png"),
      },
      num: 0,
      searchKey: "",
      groupList: [],
      searchData: [],
      chatDataList: [],
      addressDataList: [],
      maybeKnowDataList:[],
      groupMemberDataList:{},
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
        pageSize: 20,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      },
      agentId: "",

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",

      //推廣 key iv
      promoteKey: "142c7ec1b64ae0c6",
      promoteIv: "0000000000000000",
    };
  },
  created() {
    this.num =
      this.$route.fullPath === "/Address"
        ? 0
        : ["/HiChat","/Spread"].includes(this.$route.fullPath)
        ? 1
        : 2;
    Socket.$on("message", this.handleGetMessage);
    this.getContactDataList();
    this.getMaybeKnow();
    this.getUserData();
    if (localStorage.getItem("soundNofiy") === null) {
      this.setSoundNofiy(this.soundNofiy);
    }
    this.promoteCodeConfig.text = `${
      location.origin
    }/pub/#/signUp?${encodeURIComponent(
      Encrypt(
        `agentId=${localStorage.getItem("id")}`,
        this.promoteKey,
        this.promoteIv
      )
    )}`;
  },
  watch: {
    hichatNav(val) {
      this.num = val.num;
    },
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase =
          this.activeName === "address" 
          ? this.addressDataList 
          : this.activeName === "group" 
          ? this.newGroupList
          : this.maybeKnowDataList;
        this.searchData = searchCase.filter((item) => {
          if (this.activeName === "address") {
            return item.name.indexOf(el.replace("@", "")) !== -1;
          } else if(this.activeName === "group") {
            return item.groupName.indexOf(el.replace("@", "")) !== -1;
          } else {
            return item.nickname.indexOf(el.replace("@", "")) !== -1;
          }
        });
      });
      this.activeName === "address"
        ? this.setMyContactDataList(this.searchData)
        : this.activeName === "group" 
        ? this.setGroupList(this.searchData)
        : this.setMaybeKnowList(this.searchData)
    },
  },
  computed: {
    ...mapState({
      wsRes: (state) => state.ws.wsRes,
      infoMsg: (state) => state.ws.infoMsg,
      chatUser: (state) => state.ws.chatUser,
      badgeNum: (state) => state.ws.badgeNum,
      maybeKnowNum: (state) => state.ws.maybeKnowNum,
      groupUser: (state) => state.ws.groupUser,
      hichatNav: (state) => state.ws.hichatNav,
      activeName: (state) => state.ws.activeName,
      contactUser: (state) => state.ws.contactUser,
      nofity: (state) => state.ws.nofity,
      soundNofiy: (state) => state.ws.soundNofiy,
    }),
  },
  methods: {
    ...mapMutations({
      setNofiy: "ws/setNofiy",
      setSoundNofiy: "ws/setSoundNofiy",
      setWsRes: "ws/setWsRes",
      setInfoMsg: "ws/setInfoMsg",
      setBadgeNum: "ws/setBadgeNum",
      setChatUser: "ws/setChatUser",
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setHichatNav: "ws/setHichatNav",
      setTopMsgShow: "ws/setTopMsgShow",
      setMyUserInfo: "ws/setMyUserInfo",
      setContactUser: "ws/setContactUser",
      setMaybeKnowList:"ws/setMaybeKnowList",
      setContactListData: "ws/setContactListData",
      setMyContactDataList: "ws/setMyContactDataList",
    }),

    goChatRoom(data, type) {
      this.setInfoMsg({
        infoMsgShow: false,
        infoMsgNav: type === "address" ? "ContactPage" : "GroupPage",
      });
      this.setTopMsgShow(true);
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
      return AESBase64(data, this.aesKey ,this.aesIv)
    },
    getContactDataList() {
      getContactList().then((res) => {
        let memberActivityData = []
        this.addressDataList = res.data.list;
        this.addressDataList.forEach((el) => {
          if (el.contactId === localStorage.getItem("id")) {
            el.name = "嗨聊记事本";
            el.icon = require("./../../../static/images/image_savemessage.png");
            el.toChatId = "u" + el.memberId;
          } else if (el.icon === undefined) {
            el.icon = require("./../../../static/images/image_user_defult.png");
          }    
         memberActivityData.push(el.contactId)   
        });
        this.getUserMemberActivity(memberActivityData)
      });
      getGroupList().then((res) => {
        this.groupList = res.data.list;
        this.groupList.forEach((el) => {
          if (el.icon === "") {
            el.icon = require("./../../../static/images/image_group_defult.png");
          }
        });
        this.newGroupList = this.groupList.filter((el)=>{
          return el.groupName !== undefined
        })
      });
    },
    getMaybeKnow(){
      maybeKnow().then((res) => {
        this.maybeKnowDataList = res.data
      })
    },    
    getUserMemberActivity(data){
      let memberId = data
      getMemberActivity({memberId}).then((res) => {
        if(res.code === 200){
          this.userTimeData = res.data
          this.addressDataList.forEach((list)=>{
            this.userTimeData.forEach((data) => {
              if(list.contactId === JSON.stringify(data.memberId)){
                list.currentTime = data.currentTime 
                list.lastActivityTime = data.lastActivityTime
              }

            });
          })
          this.setMyContactDataList(this.addressDataList);
        }
      })
    },
    getUserData() {
      getUserInfo().then((res) => {
        if (res.data.icon === undefined) {
          res.data.icon = require("./../../../static/images/image_user_defult.png");
        }
        this.qrCodeConfig.text = `${location.origin}/fe/#/AddUser?username=${res.data.username}&id=${res.data.id}`;
        this.setMyUserInfo(res.data);
      });
    },
    getGroupListMember() {
      let groupId = this.groupUser.toChatId.replace("g", "");
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
      let url = this.num === 0? this.qrCodeConfig.text:this.promoteCodeConfig.text;
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
                item.name = "嗨聊记事本";
                item.username = "嗨聊记事本";
                item.icon = require("./../../../static/images/image_savemessage.png");
              } else {
                item.contactId = this.chatUser.contactId;
                item.username = this.chatUser.username;
              }
              // if (this.device === "pc") {
              //   this.setChatUser(item);
              // }
            }
            this.setBadgeNum(numNumber);
          });
          this.getGroupMemberList()
          break;
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          if (msgInfo.chat.fromChatId !== "u" + localStorage.getItem("id")) {
            this.groupList.forEach((list)=>{
              if(("u" + list.memberId === msgInfo.forChatId) && ("g" + list.groupId === msgInfo.toChatId)){
                if(list.setting.prompt){
                  setTimeout(() => this.openNotify(msgInfo, msgInfo.chatType), 500);
                } 
              }
            })
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
          this.getHiChatDataList();
          break;
        case "SRV_EDIT_CONTACT":  
          this.getMaybeKnow();
          break  
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
    getGroupMemberList(){
      groupMemberList().then((res)=>{
        if(res.code === 200){
          this.groupMemberDataList = res.data
        }
      })
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
    noIconShow(iconData, key) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require(`./../../../static/images/image_${key}_defult.png`);
      } else {
        return iconData.icon;
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
            notify.icon = this.noIconShow(el,"user");
            notify.title = "(联络人)";
            notify.type = "address";
          } else if (el.isGroup) {
            notify.icon = this.noIconShow(el,"group");
            notify.title = "(群组)";
            notify.type = "group";
          } else if (!el.isBlock && !el.isContact && !el.isGroup) {
            notify.icon = this.noIconShow(el,"user");
            notify.title = "(陌生人)";
            notify.type = "contact";
          }
          notify.name = el.name;
        }
      });
      switch (chatType) {
        case "SRV_USER_SEND":
        case "SRV_GROUP_SEND":
          if(chatType === "SRV_GROUP_SEND"){
            for (let item in this.groupMemberDataList) {
              if(this.groupMemberDataList[item].groupId === Number(msgInfo.chat.toChatId.replace("g", ""))){
                const dictionary = this.isBase64(msgInfo.chat.text).split(" ")
                this.groupMemberDataList[item].memberList.forEach((name)=> {
                  const xIndex = dictionary.indexOf("@"+name.memberId + "\u200B")
                  if (xIndex > -1) {
                    dictionary.splice(xIndex, 1, "@" + name.name)
                  }
                });
                this.bodyMsg = dictionary.toString().replace(/,/g, " ")
              }
            } 
          }else{
            this.bodyMsg = msgInfo.chat.text;
          }    
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
        this.getHistoryMessage.toChatId = type === "address" ? this.chatUser.toChatId : this.contactUser.toChatId;
        this.getHistoryMessage.id = Math.random();
      } else {
        this.getHistoryMessage.chatType = "CLI_GROUP_HISTORY_REQ";
        this.getHistoryMessage.toChatId = this.groupUser.toChatId;
        this.getHistoryMessage.id = Math.random();
      }
      Socket.send(this.getHistoryMessage);
    },
    loginOut() {
      logout()
        .then((res) => {
          if (res.code === 200 && res.message === "登出成功") {
            this.$router.push({ path: "/login" });
            localStorage.removeItem("id");
            localStorage.removeItem("token");
            localStorage.removeItem("myUserInfo");
            localStorage.removeItem("myUserList");
            window.location.reload();
          }
        })
        .catch((err) => {
          return false;
        });
    },
  },
  components: {
    VueQr,
    ChatMsg,
    ChatGroupMsg,
    ChatContact,
    MsgInfoPage,
    ChatSpread,
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
          .promote-img {
            background-color: #fff;
            background-image: url("./../../../static/images/icon_share.png");
          }
          .broadcast-img{
            background-color: #fff;
            background-image: url("./../../../static/images/icon_promotion.png");
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
.hichat-pc{
  .home-wrapper{
    .el-container{
      .home-search{
        .spread-style{
          img{
            left: 7px;
            height:1.4em;
          }
        }
        .addimg-style{
          img{
            left: 13px;
          }
        }
      }
    }
  }
}
</style>
