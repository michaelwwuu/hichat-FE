<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch">
    <ul class="message-styles-box">
      <div v-for="(item, index) in newMessageData" :key="index">
        <div class="now-time">
          <span>{{ index }}</span>
        </div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(el, index) in item"
            :key="index"
            :label="el"
            :disabled="showCheckBtn(checkBoxDisabled, el)"
            :class="judgeClass(item[index])"
          >
            <li>
              <template
                v-if="
                  ![
                    'SRV_CHAT_PIN',
                    'SRV_GROUP_DEL',
                    'SRV_GROUP_JOIN',
                    'SRV_GROUP_REMOVE_MANAGER_HISTORY',
                    'SRV_GROUP_ADD_MANAGER_HISTORY',
                    'SRV_GROUP_CHANGE_ADMIN_HISTORY',
                  ].includes(el.chatType)
                "
              >
                <img class="message-avatar" :src="el.icon" />
                <p
                  :class="[
                    {
                      'reply-aduio':
                        device === 'moblie' &&
                        el.isRplay !== null &&
                        el.isRplay.chatType === 'SRV_GROUP_AUDIO',
                    },
                    {
                      reply: el.isRplay !== null,
                    },
                  ]"
                  :id="el.historyId"
                >
                  <span
                    v-if="el.chatType === 'SRV_GROUP_SEND'"
                    class="message-classic"
                    @contextmenu.prevent.stop="onContextmenu(el)"
                    @dblclick="dblclick(el)"
                  >
                    <div class="message-box">
                      <div
                        class="message-name"
                        :style="
                          IsURL(isBase64(el.message.content))
                            ? 'padding-right:36px'
                            : ''
                        "
                      >
                        {{ el.name }}
                      </div>
                      <template v-if="el.isRplay !== null">
                        <div
                          class="reply-box"
                          @click="goAnchor(el.isRplay.historyId)"
                        >
                          <div class="reply-img">
                            <img :src="noIconShow(el.isRplay)" alt="" />
                          </div>
                          <div class="reply-msg">
                            <div style="color: rgba(0, 0, 0, 0.4)">
                              {{ el.isRplay.nickName }}
                            </div>
                            <div>
                              <div class="goAnchor-box">
                                <span
                                  v-if="
                                    el.isRplay.chatType === 'SRV_GROUP_SEND'
                                  "
                                  class="goAnchor"
                                  >{{ isBase64(el.isRplay.text) }}</span
                                >
                                <img
                                  v-if="
                                    el.isRplay.chatType === 'SRV_GROUP_IMAGE'
                                  "
                                  :src="isBase64(el.isRplay.text)"
                                  style="border-radius: 5px"
                                />
                                <div class="reply-audio-box"></div>
                                <mini-audio
                                  v-if="
                                    el.isRplay.chatType === 'SRV_GROUP_AUDIO'
                                  "
                                  :audio-source="isBase64(el.isRplay.text)"
                                ></mini-audio>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>

                      <div
                        v-if="device === 'pc'"
                        :class="{
                          'reply-content': el.isRplay !== null,
                        }"
                      >
                        <span
                          v-for="(item, index) in el.newContent"
                          :key="index"
                          :class="{
                            'message-touch-carte':
                              item.startsWith('@') && item.length > 1,
                          }"
                        >
                          <vue-markdown :anchor-attributes="linkAttrs">{{
                            item
                          }}</vue-markdown>

                          <!-- @click="
                              item.startsWith('@')
                                ? carteMsgShow(item.replace(/[\@|\s*]/g, ''))
                                : false
                            " -->
                        </span>
                      </div>

                      <div
                        v-else
                        :class="{
                          'reply-content': el.isRplay !== null,
                        }"
                      >
                        <div
                          v-for="(item, index) in el.newContent"
                          :key="index"
                          :class="{
                            'message-touch-carte':
                              item.startsWith('@') && item.length > 1,
                          }"
                        >
                          <div
                            v-if="!IsURL(item)"
                            @click.prevent.stop="onContextmenu(el)"
                          >
                            <span v-html="item"></span>
                            <!--TODO @標註-->
                            <!-- @click.prevent.stop="
                              !item.startsWith('@') ? onContextmenu(el) : false
                            " -->
                            <!-- @click="
                                item.startsWith('@')
                                  ? carteMsgShow(item.replace(/[\@|\s*]/g, ''))
                                  : false
                              " -->
                          </div>
                          <div v-else-if="IsURL(item)">
                            <div
                              v-if="device === 'moblie'"
                              class="images-more-btn"
                              style="top: 5px"
                              @click.prevent.stop="
                                device === 'moblie' ? onContextmenu(el) : false
                              "
                            >
                              <i class="el-icon-more"></i>
                            </div>
                            <vue-markdown
                              :class="device === 'moblie' ? 'link-style' : ''"
                              :anchor-attributes="linkAttrs"
                              >{{ item }}</vue-markdown
                            >
                          </div>
                          <span v-else v-html="item"></span>
                        </div>
                      </div>
                    </div>
                  </span>
                  <span
                    class="message-audio"
                    v-else-if="el.chatType === 'SRV_GROUP_AUDIO'"
                    @contextmenu.prevent.stop="onContextmenu(el)"
                    @dblclick="dblclick(el)"
                  >
                    <div class="message-box">
                      <div class="message-name">{{ el.name }}</div>
                      <div
                        v-if="device === 'moblie'"
                        class="images-more-btn"
                        @click.prevent.stop="
                          device === 'moblie' ? onContextmenu(el) : false
                        "
                      >
                        <i class="el-icon-more"></i>
                      </div>
                      <mini-audio
                        :audio-source="isBase64(el.message.content)"
                      ></mini-audio>
                    </div>
                  </span>
                  <span
                    class="message-image"
                    v-else-if="el.chatType === 'SRV_GROUP_IMAGE'"
                    @contextmenu.prevent.stop="onContextmenu(el)"
                    @dblclick="dblclick(el)"
                  >
                    <div class="message-box">
                      <div class="message-name" style="padding-right: 36px">
                        {{ el.name }}
                      </div>
                      <div
                        v-if="device === 'moblie'"
                        class="images-more-btn"
                        @click.prevent.stop="
                          device === 'moblie' ? onContextmenu(el) : false
                        "
                      >
                        <i class="el-icon-more"></i>
                      </div>
                      <el-image
                        :src="isBase64(el.message.content)"
                        :preview-src-list="[isBase64(el.message.content)]"
                      ></el-image>
                    </div>
                  </span>

                  <span class="nickname-time">{{
                    $root.formatTimeSecound(el.message.time)
                  }}</span>
                </p>

                <div class="read-check-box">
                  <span class="read-check" v-if="el.isRead"
                    ><img src="./../../static/images/check.png" alt=""
                  /></span>
                  <span class="read-check2"
                    ><img src="./../../static/images/check.png" alt=""
                  /></span>
                </div>
              </template>
              <template v-else-if="el.chatType === 'SRV_CHAT_PIN'">
                <div class="top-msg-style">
                  <span>{{ pinUserName(el) }}置顶了一則訊息</span>
                </div>
              </template>
              <template v-else-if="el.chatType === 'SRV_GROUP_DEL'">
                <div class="top-msg-style">
                  <span>{{ pinUserName(el) }}離開了聊天室</span>
                </div>
              </template>
              <template v-else-if="el.chatType === 'SRV_GROUP_JOIN'">
                <div class="top-msg-style">
                  <span>{{ pinUserName(el) }}加入了聊天室</span>
                </div>
              </template>
              <template
                v-else-if="el.chatType === 'SRV_GROUP_ADD_MANAGER_HISTORY'"
              >
                <div class="top-msg-style">
                  <span>{{ pinUserName(el) }}已被指定為管理員</span>
                </div>
              </template>
              <template
                v-else-if="el.chatType === 'SRV_GROUP_REMOVE_MANAGER_HISTORY'"
              >
                <div class="top-msg-style">
                  <span>{{ pinUserName(el) }}已被解除管理員身份</span>
                </div>
              </template>
              <template
                v-else-if="el.chatType === 'SRV_GROUP_CHANGE_ADMIN_HISTORY'"
              >
                <div class="top-msg-style">
                  <span>群主變更為{{ pinUserName(el) }}</span>
                </div>
              </template>
            </li>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </ul>
    <div style="width: 90%; text-align: right">
      <el-button
        class="scroll-bottom-btn"
        v-show="showScrollBar"
        size="medium"
        icon="el-icon-arrow-down"
        circle
        @click="$root.gotoBottom()"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  deleteRecentChat,
  pinHistory,
  unpinHistory,
  getGroupAuthoritySetting,
} from "@/api";
import AESBase64 from "@/utils/AESBase64.js";

import VueMarkdown from "vue-markdown";

export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    messageData: {
      type: Array,
    },
    timeOut: {
      type: Number,
    },
    showCheckBoxBtn: {
      type: Boolean,
    },
    checkDataList: {
      type: Array,
    },
  },
  data() {
    return {
      newData: [],
      message: [],
      checkList: [],
      newMessageData: {},
      checkBoxDisabled: true,
      fullscreenLoading: false,
      fileList: [],
      device: localStorage.getItem("device"),
      showScrollBar: false,
      linkAttrs: {
        target: "_blank",
        class: "linkified",
      },
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    this.setMyUserInfo(JSON.parse(localStorage.getItem("myUserInfo")));
    this.getGroupAuthority();
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      myUserInfo: (state) => state.ws.myUserInfo,
      contactListData: (state) => state.ws.contactListData,
      goAnchorMessage: (state) => state.ws.goAnchorMessage,
    }),
  },
  watch: {
    showCheckBoxBtn(val) {
      this.checkBoxDisabled = val;
    },
    checkList(val) {
      this.$emit("isCheckDataList", val);
    },
    checkDataList(val) {
      this.checkList = val;
    },
    messageData(val) {
      //去除重复
      const set = new Set();
      this.message = val.filter((item) =>
        !set.has(item.historyId) ? set.add(item.historyId) : false
      );
      this.newMessageData = {};
      this.message.forEach((el) => {
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] = [];
        let newData = this.message.filter((res) => {
          return (
            this.$root.formatTimeDay(res.message.time) ===
            this.$root.formatTimeDay(el.message.time)
          );
        });
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] =
          newData;
          
      });
      this.$root.gotoBottom();
    },
  },
  mounted() {
    window.addEventListener(
      "scroll",
      () => {
        let scrollTop = document.querySelector(".message-pabel-box");
        this.showScrollBar = !(
          (scrollTop.scrollHeight - scrollTop.scrollTop) - (this.device==="pc" ? 0.2001953125 : 0.60009765625)  <=
          scrollTop.clientHeight
        );
      },
      true
    );
    if (this.goAnchorMessage.historyId !== undefined) {
      let newTime = this.timeOut + 3000;
      setTimeout(() => {
        this.goAnchor(this.goAnchorMessage.historyId);
        this.setGoAnchorMessage({});
      }, newTime);
    }
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setEditMsg: "ws/setEditMsg",
      setChatUser: "ws/setChatUser",
      setReplyMsg: "ws/setReplyMsg",
      setMyUserInfo: "ws/setMyUserInfo",
      setGoAnchorMessage: "ws/setGoAnchorMessage",
    }),
    showCheckBtn(status, data) {
      if (status) {
        return status;
      } else if (!status) {
        if (
          ["SRV_GROUP_SEND", "SRV_GROUP_IMAGE", "SRV_GROUP_AUDIO"].includes(
            data.chatType
          )
        ) {
          return status;
        } else {
          return !status;
        }
      }
    },
    IsURL(str_url) {
      var strRegex =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      var re = new RegExp(strRegex);
      if (re.test(str_url)) {
        return true;
      } else {
        return false;
      }
    },
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    getGroupAuthority() {
      let groupId = this.groupData.groupId;
      getGroupAuthoritySetting({ groupId }).then((res) => {
        if (res.code === 200) {
          if (res.data !== undefined) {
            this.checkGroupPeople = res.data.checkUserInfo;
          }
        }
      });
    },
    pinUserName(data) {
      if (data.username === this.myUserInfo.username) {
        return (data = "你");
      } else {
        return data.message.content;
      }
    },
    goAnchor(data) {
      document.getElementById(data).classList.add("blink");
      document.getElementById(data).scrollIntoView(true);
      setTimeout(() => {
        document.getElementById(data).classList.remove("blink");
      }, 3000);
    },
    //判斷是否base64
    isBase64(data) {
      return AESBase64(data, this.aesKey ,this.aesIv)
    },
    noIconShow(iconData) {
      if ([undefined, null, ""].includes(iconData.icon)) {
        return require("./../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },

    audioAction() {
      let audioEl = document.getElementById("notify-send-audio");
      var playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            audioEl.pause();
          })
          .catch((error) => {});
      }
      audioEl.src = ""; // 移除src, 防止之后播放空白音频
      setTimeout(() => {
        // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3");
        audioEl.play();
      }, 150);
    },
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.userChatId === "u" + localStorage.getItem("id")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },
    carteMsgShow(data) {
      this.carteContact = this.contactListData.filter((el) => {
        return el.username === data;
      });
      if (this.carteContact.length === 0) {
        this.$message({ message: "無此成員", type: "error" });
        return;
      } else {
        this.carteContact[0].toChatId = "u" + this.carteContact[0].memberId;
        if (
          data === JSON.parse(localStorage.getItem("myUserInfo")).username
        ) {
          this.$message({ message: "此即为您的帐号", type: "warning" });
        } else {
          if (this.device === "moblie"){
            this.$router.push({ name: "ContactPage" });
          } else{
            this.carteContact[0].type = "address";
            this.setInfoMsg({
              infoMsgShow: true,
              infoMsgChat: true,
              infoMsgNav: "ContactPage",
            });
          }
        }
      }
      this.setChatUser(this.carteContact[0]);
    },
    dblclick(event) {
      this.setReplyMsg({
        chatType: event.chatType,
        clickType: "replyMsg",
        innerText: this.isBase64(event.message.content),
        replyHistoryId: event.historyId,
        name: event.name,
        icon: event.icon,
      });
    },
    onContextmenu(data) {
      let item = [
        {
          name: "edit",
          label: "编辑",
          onClick: () => {
            this.setReplyMsg({
              chatType: data.chatType,
              clickType: "editMsg",
              innerText: this.isBase64(data.message.content),
              replyHistoryId: data.historyId,
              name: data.name,
              icon: data.icon,
            });
            this.setEditMsg({ innerText: this.isBase64(data.message.content) });
          },
        },
        {
          name: "copy",
          label: "复制",
          onClick: () => {
            this.copyPaste(data);
          },
        },

        {
          name: "reply",
          label: "回覆",
          onClick: () => {
            this.setReplyMsg({
              chatType: data.chatType,
              clickType: "replyMsg",
              innerText: this.isBase64(data.message.content),
              replyHistoryId: data.historyId,
              name: data.name,
              icon: data.icon,
            });
          },
        },
        {
          name: "download",
          label: "下载",
          onClick: () => {
            this.downloadImages(data);
          },
        },
        {
          name: "upDown",
          label: data.isPing ? "取消置顶" : "置顶訊息",
          onClick: () => {
            this.topMsgAction(data, data.isPing);
          },
        },
        {
          name: "deleteAllChat",
          label: "在所有人的對話紀錄中刪除",
          divided: true,
          onClick: () => {
            this.deleteRecent(data, "all");
          },
        },
        {
          name: "deleteMyChat",
          label: "只在我的對話紀錄中刪除",
          divided: true,
          onClick: () => {
            this.deleteRecent(data, "only");
          },
        },
        {
          name: "choose",
          label: this.checkBoxDisabled ? "选择" : "取消选择",
          onClick: () => {
            this.checkList = [];
            this.checkBoxDisabled = !this.checkBoxDisabled;
            this.$emit("checkBoxDisabled", this.checkBoxDisabled);
          },
        },
      ];
      let isAdmin = JSON.parse(localStorage.getItem("groupData")).isAdmin;
      let isManager = JSON.parse(localStorage.getItem("groupData")).isManager;

      if (data.userChatId !== "u" + localStorage.getItem("id")) {
        if (data.chatType === "SRV_GROUP_AUDIO") {
          if (
            isAdmin ||
            (isManager &&
              JSON.parse(localStorage.getItem("authority")).delUserMessage)
          ) {
            this.newItem = item.filter(
              (list) => !["edit", "copy", "download"].includes(list.name)
            );
          } else {
            this.newItem = item.filter(
              (list) =>
                !["deleteAllChat", "edit", "copy", "download"].includes(
                  list.name
                )
            );
          }
        } else if (data.chatType === "SRV_GROUP_IMAGE") {
          if (
            isAdmin ||
            (isManager &&
              JSON.parse(localStorage.getItem("authority")).delUserMessage)
          ) {
            this.newItem = item.filter(
              (list) => !["edit", "copy"].includes(list.name)
            );
          } else {
            this.newItem = item.filter(
              (list) => !["deleteAllChat", "edit", "copy"].includes(list.name)
            );
          }
        } else {
          if (
            isAdmin ||
            (isManager &&
              JSON.parse(localStorage.getItem("authority")).delUserMessage)
          ) {
            this.newItem = item.filter(
              (list) => !["edit", "download"].includes(list.name)
            );
          } else {
            this.newItem = item.filter(
              (list) =>
                !["deleteAllChat", "edit", "download"].includes(list.name)
            );
          }
        }
      } else {
        if (data.chatType === "SRV_GROUP_IMAGE") {
          this.newItem = item.filter(
            (list) => !["edit", "copy"].includes(list.name)
          );
        } else if (data.chatType === "SRV_GROUP_AUDIO") {
          this.newItem = item.filter(
            (list) => !["edit", "copy", "download"].includes(list.name)
          );
        } else {
          this.newItem = item.filter((list) => {
            return list.name !== "download";
          });
        }
      }

      if (isManager) {
        if (
          JSON.parse(localStorage.getItem("groupAuthority")).pin ||
          JSON.parse(localStorage.getItem("authority")).pin
        ) {
          this.newItem = this.newItem.filter((list) => {
            return list.name !== "edit";
          });
        } else {
          this.newItem = this.newItem.filter((list) => {
            return list.name !== "edit" && list.name !== "upDown";
          });
        }
      } else if (!isAdmin && !isManager) {
        if (!JSON.parse(localStorage.getItem("groupAuthority")).pin) {
          this.newItem = this.newItem.filter((list) => {
            return list.name !== "upDown";
          });
        }
      }

      if (!this.checkBoxDisabled) {
        this.newItem = item.filter((list) => list.name === "choose");
      }

      this.$contextmenu({
        items: this.newItem,
        // event,
        x: event.clientX,
        y: event.clientY,
        customClass: "custom-class",
        zIndex: 3,
        minWidth: 230,
      });
      return false;
    },
    topMsgAction(data, key) {
      let param = {
        historyId: data.historyId,
        toChatId: data.toChatId,
      };
      if (key) {
        unpinHistory(param).then((res) => {
          if (res.code === 200) {
            this.$emit("resetPinMsg");
          }
        });
      } else {
        pinHistory(param).then((res) => {
          if (res.code === 200) {
            this.$emit("resetPinMsg");
          }
        });
      }
    },
    downloadImages(data) {
      let downloadUrl = "";
      downloadUrl = this.isBase64(data.message.content);
      this.downloadByBlob(downloadUrl, "images");
    },
    downloadByBlob(url, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob);
          this.download(url, name);
          // 用完释放URL对象
          URL.revokeObjectURL(url);
        });
      };
    },
    download(href, name) {
      let link = document.createElement("a");
      link.download = name;
      link.href = href;
      link.click();
      link.remove();
    },
    copyPaste(data) {
      let url = document.createElement("textarea");
      document.body.appendChild(url);
      url.value = this.isBase64(data.message.content).replace(/(\s*$)/g, "");
      url.select();
      document.execCommand("copy");
      document.body.removeChild(url);

      this.$message({
        message: `${
          url.value.length > 110 ? url.value.substr(0, 110) + " ..." : url.value
        } 复制成功`,
        type: "success",
        duration: 1000,
      });
    },
    deleteRecent(data, type) {
      let parmas = {
        fullDelete: type === "all",
        historyId: data.historyId,
        toChatId: data.toChatId,
      };
      deleteRecentChat(parmas)
        .then((res) => {
          if (res.code === 200) {
            this.$emit("deleteMsgHistoryData", data);
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
  },
  components: {
    VueMarkdown,
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left,
      .message-layout-right {
        /deep/.el-checkbox__input {
          .el-checkbox__inner {
            width: 20px;
            height: 20px;
            &:after {
              height: 12px;
              width: 6px;
              left: 5px;
            }
          }
        }
      }
    }
  }
}
.message-pabel-box {
  padding: 0 10px 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .now-time {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin: 2em 0;
    span {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 4px 15px;
      border-radius: 10px;
    }
  }
  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left,
    .message-layout-right {
      margin-top: 20px;
      width: 100%;
      //TODO
      display: flex;
      align-items: center;
      /deep/.el-checkbox__input {
        .el-checkbox__inner {
          border-radius: 10px;
        }
      }
      /deep/.el-checkbox__label {
        width: 100%;
        white-space: normal;
        cursor: initial;
      }
      /deep/.is-disabled {
        display: none;
      }
    }

    .message-layout-left {
      p {
        display: flex;
        align-items: flex-end;
        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);
          height: auto;
          padding: 9px 12px;
          .message-box {
            .message-name {
              font-size: 13px;
              color: #919191;
              padding-bottom: 5px;
            }
            audio {
              width: 190px;
            }
          }
        }
        .images-more-btn {
          top: 10px;
        }
      }
      .reply {
        .message-classic {
          padding: 0;
          .message-box {
            .message-name {
              padding: 8px 12px 0px 12px;
            }
          }
        }
      }
      .message-avatar {
        float: left;
        margin-right: 10px;
        border-radius: 10px;
        border: 0;
      }
      .message-box {
        .message-name {
          font-size: 13px;
          color: #919191;
        }
      }
      .message-classic {
        background-color: rgba(0, 0, 0, 0.05);
        line-height: 1.4rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        border-radius: 0 8px 8px 8px;
      }
      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-left: 10px;
      }
      .read-check-box {
        display: none;
      }
      .message-image {
        position: relative;
        display: inline-block;
        padding: 9px 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 0 8px 8px 8px;
        .message-box {
          .message-name {
            padding: 0 0 10px 0;
          }
          .el-image {
            width: -webkit-fill-available !important;
            height: 9em !important;
            top: 0;
            /deep/.el-image__inner {
              height: unset;
            }
          }
        }
      }
    }

    .message-layout-right {
      p {
        display: flex;
        align-items: flex-end;
        flex-flow: row-reverse;
        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);
          audio {
            width: 190px;
          }
        }
      }
      .reply {
        .message-classic {
          padding: 0;
          .message-box {
            .message-name {
              padding: 8px 12px 0px 12px;
            }
          }
        }
      }
      .message-avatar,
      .message-name {
        display: none;
      }
      .message-classic {
        text-align: left;
        color: #000000;
        line-height: 1.4rem;
        font-weight: 600;
        background-color: #ffffff;
        letter-spacing: 0.5px;
        border-radius: 8px 0 8px 8px;
      }
      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-right: 10px;
      }
      .read-check-box {
        display: flex;
        justify-content: flex-end;
        span {
          img {
            height: 1em;
          }
        }
        .read-check {
          position: relative;
          left: 0.5em;
        }
        .read-check2 {
          left: 1em;
        }
      }
      .message-image {
        position: relative;

        display: inline-block;
        padding: 5px 6px 2px 6px;
        color: #333333;
        background-color: #e5e4e4;
        border-radius: 8px 0 8px 8px;
        .el-image {
          width: -webkit-fill-available !important;
          height: 9em !important;
          top: 0;
          /deep/.el-image__inner {
            height: unset;
          }
        }
      }
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }
    .vueAudioBetter {
      margin: 0;
      box-shadow: none;
      background-image: none;
      /deep/.operate {
        span {
          &:nth-child(3) {
            color: rgba(0, 0, 0, 0.8) !important;
          }
        }
      }
    }
    .message-classic,
    .message-disabled {
      position: relative;
      max-width: 100%;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      word-break: break-all;
      .red {
        height: 1.5em;
      }
      img {
        height: 6em;
      }
    }
    .message-audio {
      width: 190px;
      height: 2.5em;
      display: inline-block;
      position: relative;
      .images-more-btn {
        top: 10px !important;
      }
    }
  }
  .vueAudioBetter {
    box-shadow: none;
    background-image: none;
    width: auto;
    margin: 0;
    /deep/.operate {
      span {
        &:nth-child(3) {
          color: rgba(0, 0, 0, 0.8) !important;
        }
      }
    }
    /deep/.slider {
      display: none;
    }
    /deep/.icon-notificationfill {
      &:before {
        content: "\E66A";
        display: none;
      }
    }
  }
}
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
        p {
          .message-image {
            .message-box {
              .el-image {
                width: 15em !important;
                height: 11em !important;
                top: 0;
                /deep/.el-image__inner {
                  height: 100%;
                }
              }
            }
          }
        }
      }
      .message-layout-right {
        p {
          .el-image {
            width: -webkit-fill-available !important;
            height: 11em !important;
            top: 0;
            /deep/.el-image__inner {
              height: 100%;
            }
          }
        }
      }
      .message-layout-left,
      .message-layout-right {
        /deep/.el-checkbox__label {
          cursor: pointer;
        }
      }
      .el-checkbox.is-disabled {
        /deep/.el-checkbox__label {
          cursor: auto;
        }
      }
    }
  }
}

.message-touch-carte {
  color: #10686e;
  cursor: pointer;
}

.reply-aduio {
  .message-classic {
    max-width: 100% !important;
  }
}
.images-more-btn {
  width: 2em;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 9;
  // border:1px solid #ebebeb;
  text-align: center;
  background-color: #fff;
  color: #000;
  .el-icon-more {
    font-size: 20px;
  }
}
.reply-box {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  .reply-msg {
    padding: 9px 12px 9px 5px;
  }
  .reply-img {
    margin-right: 5px;
    padding: 9px 0px 9px 12px;
    img {
      width: 3em !important;
      height: 3em !important;
      border-radius: 10px;
    }
  }
  .goAnchor-box {
    .goAnchor {
      color: rgba(0, 0, 0, 0.8);
      text-decoration: none;
    }
    .reply-audio-box {
      display: block;
      // background-color: #000000;
      // width: 12em;
      height: 40px;
      position: absolute;
      z-index: 9;
    }
    .message-audio {
      height: 2.5em !important;
      padding: 0 !important;
      border: none !important;
      background-color: none;
    }
    .vueAudioBetter {
      box-shadow: none;
      background-image: none;
      width: auto;
      margin: 0;
      /deep/.operate {
        span {
          &:nth-child(3) {
            color: rgba(0, 0, 0, 0.8) !important;
          }
        }
      }
      /deep/.slider {
        display: none;
      }
      /deep/.icon-notificationfill {
        &:before {
          content: "\E66A";
          display: none;
        }
      }
    }
  }
}
.reply-content {
  padding: 5px 12px 5px 12px;
}
/* 定义keyframe动画，命名为blink */
@keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.blink {
  color: red;
  background: #0000000d;
  animation: blink 2s linear 1;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 2s linear 1;
  -moz-animation: blink 2s linear 1;
  -ms-animation: blink 2s linear 1;
  -o-animation: blink 2s linear 1;
}
.scroll-bottom-btn {
  position: fixed;
  bottom: 80px;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 9;
}
.link-style {
  padding: 15px 0 7px 0;
}
/deep/.linkified {
  color: #10686e;
  text-decoration: none;
}
.top-msg-style {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0.5em 0;
  color: #000000;
  span {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 4px 15px;
    border-radius: 10px;
  }
}
</style>
