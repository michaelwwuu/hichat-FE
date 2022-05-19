<template>
  <div
    class="message-pabel-box"
    @touchmove="$root.handleTouch"
  >
    <ul class="message-styles-box">
      <div v-for="(item, index) in newMessageData" :key="index">
        <div class="now-time">
          <span>{{ index }}</span>
        </div>
        <li
          v-for="(el, index) in item"
          :key="index"
          :class="judgeClass(item[index])"
        >
            <img class="message-avatar" :src="el.isRplay.icon" />
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
                class="message-classic"
                v-if="el.isRplay.chatType === 'SRV_GROUP_SEND'"
                @contextmenu.prevent.stop="onContextmenu(el)"
                @dblclick="dblclick(el)"
                :id="el.historyId"
              >
                <div class="message-box">
                  <div class="message-name">{{ el.isRplay.nickName }}</div>
                  <div
                    class="message-box-content"
                    :class="{
                      'reply-content': el.isRplay !== null,
                    }"
                  >
                    <div v-if="device === 'pc'">
                      <span
                        v-for="(item, index) in el.newContent"
                        :key="index"
                        :class="{
                          'message-touch-carte':
                            item.startsWith('@') && item.length > 1,
                        }"
                      >
                        <span
                          v-html="isBase64(el.isRplay.text)"
                          v-linkified
                          @click="
                            item.startsWith('@')
                              ? carteMsgShow(item.replace(/[\@|\s*]/g, ''))
                              : false
                          "
                        ></span>
                      </span>
                    </div>

                    <div v-else>
                      <div
                        v-for="(item, index) in el.newContent"
                        :key="index"
                        :class="{
                          'message-touch-carte':
                            item.startsWith('@') && item.length > 1,
                        }"
                      >
                        <div
                          v-if="
                            item.match(/(http|https):\/\/([\w.]+\/?)\S*/gi) ===
                            null
                          "
                          @click.prevent.stop="
                            !item.startsWith('@') ? onContextmenu(el) : false
                          "
                        >
                          <span
                            v-html="isBase64(el.isRplay.text)"
                            @click="
                              item.startsWith('@')
                                ? carteMsgShow(item.replace(/[\@|\s*]/g, ''))
                                : false
                            "
                          ></span>
                        </div>
                        <div
                          v-else-if="
                            item.match(/(http|https):\/\/([\w.]+\/?)\S*/gi)
                          "
                        >
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
                          <div
                            v-html="isBase64(el.isRplay.text)"
                            v-linkified
                            :class="device === 'moblie' ? 'link-style' : ''"
                          ></div>
                        </div>
                        <span v-else v-html="isBase64(el.isRplay.text)"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
              <span
                class="message-audio"
                v-else-if="el.isRplay.chatType === 'SRV_GROUP_AUDIO'"
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
                  <mini-audio :audio-source="el.message.content"></mini-audio>
                </div>
              </span>
              <span
                class="message-image"
                v-else-if="el.isRplay.chatType === 'SRV_GROUP_IMAGE'"
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
                  <el-image
                    :src="el.message.content"
                    :preview-src-list="[el.message.content]"
                  ></el-image>
                </div>
              </span>

              <span class="nickname-time">{{
                $root.formatTimeSecound(el.message.time)
              }}</span>
            </p>
        </li>
      </div>
    </ul>
    <el-button
      v-show="showScrollBar"
      class="scroll-bottom-btn"
      size="medium"
      icon="el-icon-arrow-down"
      circle
      @click="$root.gotoBottom()"
    ></el-button>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { unpinHistory  } from "@/api";
import { Encrypt,Decrypt } from "@/utils/AESUtils.js";

export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    messageData: {
      type: Array,
    },
  },
  data() {
    return {
      newData: [],
      message: [],
      newMessageData: {},
      fullscreenLoading:false,

      device: localStorage.getItem("device"),
      showScrollBar: false,
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  watch: {
    messageData(val) {
      //去除重复
      const set = new Set();
      this.message = val.filter((item) =>{
        if(item.chatType === "SRV_CHAT_PIN"){
          if(!set.has(item.historyId)){
            return set.add(item.historyId)
          } else {
            return false
          }
        }
      });
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
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      soundNofiy: (state) => state.ws.soundNofiy,
    }),
  },
  mounted() {
    window.addEventListener(
      "scroll",
      () => {
        let scrollTopBox =
          document.getElementsByClassName("message-pabel-box")[0];
        let scrollTop =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          document.querySelector(".message-pabel-box").scrollTop;
        this.showScrollBar =
          (scrollTopBox.scrollHeight - scrollTop) / 4 > 400 ||
          (scrollTopBox.scrollHeight - scrollTop) / 3 > 300;
      },
      true
    );
  },
  methods: {

    goAnchor(data) {
      document.getElementById(data).classList.add("blink");
      document.getElementById(data).scrollIntoView(true);
      setTimeout(() => {
        document.getElementById(data).classList.remove("blink");
      }, 3000);
    },
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
    noIconShow(iconData) {
      if ([undefined,null,""].includes(iconData.icon)) {
        return require("./../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },

    audioAction(){
      let audioEl = document.getElementById("notify-send-audio")  
      var playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          audioEl.pause();
        })
        .catch(error => {
        });
      }
      audioEl.src= "" // 移除src, 防止之后播放空白音频  
      setTimeout(() => { // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3")
        audioEl.play();
      }, 150);
    },     
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.isRplay.fromChatId === "u" + localStorage.getItem("id")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },

    onContextmenu(data) {
      let item = [
        {
          name: "copy",
          label: "複製",
          onClick: () => {
            this.copyPaste(data);
          },
        },
        {
          name: "copy",
          label: "轉傳",
          onClick: () => {
       
          },
        },
        {
          name: "upDown",
          label: "取消置顶",
          onClick: () => {
            this.topMsgAction(data)
          },
        },
      ];
      this.$contextmenu({
        items: item,
        // event,
        x: event.clientX,
        y: event.clientY,
        customClass: "custom-class",
        zIndex: 3,
        minWidth: 230,
      });
      return false;
    },
    topMsgAction(data){
      let param ={
        historyId: data.historyId,
        toChatId: data.toChatId
      }
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.$emit("resetPinMsg");
        }
      })
    },
    copyPaste(data) {
      let url = document.createElement("textarea");
      document.body.appendChild(url);
      url.value = data.isRplay.text.replace(/(\s*$)/g, "");
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

  },
};
</script>

<style lang="scss" scoped>
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
        // margin-top: 1em;
        display: inline-block;
        padding: 9px 12px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        .message-box {
          .message-name {
            padding: 10px 0;
          }
          .el-image {
            width: -webkit-fill-available !important;
            height: 15em !important;
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
        // margin-top: 1em;
        display: inline-block;
        padding: 5px 6px 2px 6px;
        color: #333333;
        background-color: #e5e4e4;
        border-radius: 10px;
        .el-image {
          width: -webkit-fill-available !important;
          height: 15em !important;
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
      // margin-top: 5px;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      white-space: pre-line;
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
      // margin-top: 1em;
      display: inline-block;
              position: relative;
        // margin-top: 1em;
        display: inline-block;
      // border: 1px solid #eeeeee;
      .images-more-btn{
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
          .el-image {
            width: -webkit-fill-available !important;
            height: 15em !important;
            top: 0;
            /deep/.el-image__inner {
              height: 100%;
            }
          }
        }
      }
      .message-layout-right {
        p {
          .el-image {
            width: -webkit-fill-available !important;
            height: 15em !important;
            top: 0;
            /deep/.el-image__inner {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.message-box-content {
  display: flex;
  span {
    margin-right: 3px;
  }
  .message-touch-carte {
    color: #10686e;
    cursor: pointer;
  }
}
.hichat-moblie {
  .message-box-content {
    display: flex;
    flex-direction: column;
    line-height: 1.5em;
  }
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
  background-color: #FFF;
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
  border: 0;
}
.link-style {
  padding: 10px 0;
}
/deep/.linkified {
  color: #10686e;
  text-decoration: none;
}
.top-msg-style{
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 2em 0;
  span{
    background-color: rgba(0, 0, 0, 0.05);
    padding: 4px 15px;
    border-radius: 10px;
  }
}
</style>
