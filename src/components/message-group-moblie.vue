<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch" v-debounce="scrollHistoryBar">
    <ul class="message-styles-box">
      <div v-for="(item, index) in reversedMessage" :key="index">
        <div class="now-time">
          <span>{{ index }}</span>
        </div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(el, index) in item"
            :key="el.historyId"
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
                    @dblclick="replyMsgclick(el,'replyMsg')"
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
                                  v-if="el.isRplay.chatType === 'SRV_GROUP_SEND'"
                                  class="goAnchor"
                                  >{{ isBase64(el.isRplay.text) }}</span
                                >
                                <img
                                  v-else-if="el.isRplay.chatType === 'SRV_GROUP_IMAGE'"
                                  :src="isBase64(el.isRplay.text)"
                                  style="border-radius: 5px"
                                />
                                <span v-else-if="el.isRplay.chatType === 'SRV_GROUP_AUDIO'">
                                  <div class="reply-audio-box"></div>
                                  <mini-audio
                                    :audio-source="isBase64(el.isRplay.text)"
                                  ></mini-audio>
                                </span>
                                <div v-else-if="el.isRplay.chatType === 'SRV_GROUP_FILE'" class="message-file-box" id="file-download">
                                <div class="file-message" style="padding-left:0;">
                                  <span>{{fileData(isBase64(el.isRplay.text),'content')}}</span>
                                  <span>档案大小　: {{ fileData(el.isRplay.fileSize,'size') }}</span>
                                </div>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>

                      <div
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
                          <template v-if="device === 'pc'">
                            <vue-markdown :anchor-attributes="linkAttrs">{{
                              calloutTextAreaConvert(item)
                            }}</vue-markdown>
                          </template>
                          <template v-else>
                            <div
                              v-if="!IsURL(item)"
                              @click.prevent.stop="onContextmenu(el)"
                            >
                              <vue-markdown :anchor-attributes="linkAttrs">{{
                                calloutTextAreaConvert(item)
                              }}</vue-markdown>
                            </div>
                            <div v-else-if="IsURL(item)">
                              <div
                                class="images-more-btn"
                                style="top: 5px"
                                @click.prevent.stop="
                                  device === 'moblie' ? onContextmenu(el) : false
                                "
                              >
                                <i class="el-icon-more"></i>
                              </div>
                              <vue-markdown
                                class="link-style"
                                :anchor-attributes="linkAttrs"
                                >{{ item }}</vue-markdown
                              >
                            </div>
                            <span v-else v-html="item"></span>
                          </template>
                        </span>
                      </div>
                    </div>
                  </span>
                  <span
                    class="message-classic"
                    v-else-if="el.chatType === 'SRV_GROUP_FILE'"
                    @contextmenu.prevent.stop="onContextmenu(el)"
                    @dblclick="replyMsgclick(el,'replyMsg')" 
                    @click.prevent.stop="
                      device === 'moblie' ? onContextmenu(el) : false
                    "
                  >
                    <div class="message-box">
                      <div class="message-name" style="padding: 0 0 10px 0;">{{ el.name }}</div>
                      <div class="message-file-box" id="file-download">
                        <div class="file-box"></div>
                        <div class="file-message">
                          <span>{{fileData(isBase64(el.message.content),'content')}}</span>
                          <span>档案大小　: {{ fileData(el.fileSize,'size') }}</span>
                        </div>
  
                      </div>
                    </div>
                  </span>                  
                  <span
                    class="message-audio"
                    v-else-if="el.chatType === 'SRV_GROUP_AUDIO'"
                    @contextmenu.prevent.stop="onContextmenu(el)"
                    @dblclick="replyMsgclick(el,'replyMsg')"
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
                    @dblclick="replyMsgclick(el,'replyMsg')"
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
import { copyPaste } from "@/utils/urlCopy.js";
import { getGroupAuthoritySetting } from '@/api/groupController'
import { pinHistory,unpinHistory,deleteRecentChat } from '@/api/chatController'
import { fileBoxName, formatFileSize } from "@/utils/FileSizeName.js";
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
    showCheckBoxBtn: {
      type: Boolean,
    },
    checkDataList: {
      type: Array,
    },
    historyMsgLength:{
      type: Number,
    }
  },
  data() {
    return {
      newData: [],
      message: [],
      checkList: [],
      newArr:[],
      newMessageData: {},
      checkBoxDisabled: true,
      isChatTop:false,
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
    this.groupData = this.groupUser
    this.getGroupAuthority();
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      myUserInfo: (state) => state.ws.myUserInfo,
      contactListData: (state) => state.ws.contactListData,
      goAnchorMessage: (state) => state.ws.goAnchorMessage,
    }),
    reversedMessage: function () {
      this.newMessageData = {};
      //去除重复
      this.message = this.unique(this.messageData , 'historyId') 
      this.message.forEach((el)=>{
        this.newMessageData[this.$root.formatTimeDay(el.message.time)]=[]
      })

      for(let item in this.newMessageData){
        this.newMessageData[item] = this.message.filter((res)=>{
          return item === this.$root.formatTimeDay(res.message.time)
        })   
      }
      if(!this.showScrollBar) this.$root.gotoBottom()
      return this.newMessageData
    },
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
    groupUser(){
      this.$root.gotoBottom()
    },
  },
  mounted() {
    if (this.goAnchorMessage.historyId !== undefined) {
      setTimeout(() => {
        this.goAnchor(this.goAnchorMessage.historyId);
        this.setGoAnchorMessage({});
      }, 2000);
    }
  },
  methods: {
    ...mapMutations({
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
      setGoAnchorMessage: "ws/setGoAnchorMessage",
    }),
    unique(arr, key) {
        if (!arr) return arr
        if (key === undefined) return [...new Set(arr)]
        const map = {
            'string': e => e[key],
            'function': e => key(e),
        }
        const fn = map[typeof key]
        const obj = arr.reduce((o,e) => (o[fn(e)]=e, o), {})
        return Object.values(obj)
    },
    scrollHistoryBar(){
      let scrollTop = document.querySelector(".message-pabel-box");
      if(scrollTop !==null){
        this.showScrollBar = !(
          (scrollTop.scrollHeight - scrollTop.scrollTop) - (this.device==="pc" ? 0.2001953125 : 0.60009765625) <= scrollTop.clientHeight
          );   
          if(scrollTop.scrollTop < 5000 && this.historyMsgLength === 200){
            this.$emit("scrollHistory",this.message[0].historyId)
          }
        this.$emit('scrollBar',this.showScrollBar)
      }
    },
    calloutTextAreaConvert(data){
      if(!data.match("@") || ["@所有成員","@所有成员"].includes(data)){
        return data
      }else{
        this.newArr = this.contactListData.find((el)=>{
          return "@" + el.memberId + "\u200B" === data
        })
        if(this.newArr !== undefined){
          return data = "@" + this.newArr.name
        }else{
          return data
        }
      }
    },
    fileData(data,type){
      if(type === "content"){
        return fileBoxName(data)
      }else{
        return formatFileSize(data)
      }
    },  
    showCheckBtn(status, data) {
      if (status) {
        return status;
      } else if (!status) {
        if (["SRV_GROUP_SEND", "SRV_GROUP_IMAGE", "SRV_GROUP_AUDIO","SRV_GROUP_FILE"].includes(data.chatType)) {
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
      if(document.getElementById(data) === null){
        this.$message({ message: "讯息过久，无法查询", type: "error" });
        return
      }else{
        document.getElementById(data).classList.add("blink");
        document.getElementById(data).scrollIntoView(true);
        setTimeout(() => {
          document.getElementById(data).classList.remove("blink");
        }, 3000);
      }   
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
    replyMsgclick(event,type) {
      this.setReplyMsg({
        chatType: event.chatType,
        clickType: type,
        innerText: this.isBase64(event.message.content),
        replyHistoryId: event.historyId,
        name: event.name,
        icon: event.icon,
        fileSize:event.fileSize,  
      });
    },
    onContextmenu(data) {
      let item = [
        {
          name: "edit",
          label: "编辑",
          onClick: () => {
            this.replyMsgclick(data,'editMsg')
            this.setEditMsg({ innerText: this.isBase64(data.message.content) });
          },
        },
        {
          name: "copy",
          label: "复制",
          onClick: () => {
            copyPaste(this.isBase64(data.message.content).replace(/(\s*$)/g, ""));
          },
        },

        {
          name: "reply",
          label: "回覆",
          onClick: () => {
            this.replyMsgclick(data,'replyMsg')
          },
        },
        {
          name: "download",
          label: "下载",
          onClick: () => {
            if(data.chatType === "SRV_GROUP_IMAGE"){
              this.downloadImages(data);
            }else{
              this.downloadFile(this.isBase64(data.message.content),this.fileData(this.isBase64(data.message.content),'content'))
            }            
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
        } else if (data.chatType === "SRV_GROUP_IMAGE" || data.chatType === "SRV_GROUP_FILE") {
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
        if (data.chatType === "SRV_GROUP_IMAGE" || data.chatType === "SRV_GROUP_FILE") {
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
    downloadFile(href,filename) {
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(href))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      element.click()
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
        font-weight: 600;
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
    .message-classic{
      .message-file-box{
        display: flex;
        align-items: center;
        padding-right: 45px;
        .file-box{
          width: 4em;
          height: 4em;
          background-color: #000;
          border-radius: 10px;
          background-image: url("./../../static/images/icon_file.svg");
          background-repeat: no-repeat;
          background-size:65%;        
          background-position: center;
        }
        .file-message{
          display: flex;
          flex-direction: column;
          padding-left: 10px;
        }
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
  display: inline-block;
  margin-right: 6px;
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
  right: 30px;
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
