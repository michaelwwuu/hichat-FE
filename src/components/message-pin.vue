<template>
  <div class="message-pabel-box" @touchmove="$root.handleTouch">
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
          <p>
            <span
              class="message-classic"
              v-if="el.chatType === 'SRV_USER_SEND'"
              @contextmenu.prevent.stop="onContextmenu(el)"
            >
              <div>
                <span
                  v-if="!IsURL(isBase64(el.chat.text))"
                  @click.prevent.stop="
                    device === 'moblie' ? onContextmenu(el) : false
                  "
                  v-html="isBase64(el.chat.text)"
                ></span>
                <div
                  v-else-if="IsURL(isBase64(el.chat.text))"
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
                    v-html="isBase64(el.chat.text)"
                    v-linkified
                    :class="device === 'moblie' ? 'link-style' : ''"
                  ></div>
                </div>
                <span v-else v-html="isBase64(el.chat.text)"></span>
              </div>
            </span>
            <span
              class="message-mini-audio"
              v-else-if="el.chatType === 'SRV_USER_AUDIO'"
              @contextmenu.prevent.stop="onContextmenu(el)"
            >
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
                class="message-audio"
                :audio-source="isBase64(el.chat.text)"
              ></mini-audio>
            </span>
            <span
              class="message-image"
              v-else-if="el.chatType === 'SRV_USER_IMAGE'"
              @contextmenu.prevent.stop="onContextmenu(el)"
            >
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
                :src="isBase64(el.chat.text)"
                :preview-src-list="[isBase64(el.chat.text)]"
              />
            </span>
            <span class="nickname-time">
              <img
                class="go-message"
                src="./../../static/images/gotomessage.png"
                alt=""
                @click="goMessageAction(el.chat)"
              />
              <span>{{ $root.formatTimeSecound(el.chat.sendTime) }}</span>
            </span>
          </p>
          <div class="read-check-box">
            <span class="read-check" v-if="el.isRead"
              ><img src="./../../static/images/check.png" alt=""
            /></span>
            <span class="read-check2"
              ><img src="./../../static/images/check.png" alt=""
            /></span>
          </div>
        </li>
      </div>
    </ul>
    <div style="width: 90%; text-align: right;">
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
import { unpinHistory, pinList } from "@/api";
import AESBase64 from "@/utils/AESBase64.js";


export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    contactUser: {
      type: Object,
    },
  },
  data() {
    return {
      newData: [],
      message: [],
      newMessageData: {},
      fullscreenLoading: false,

      device: localStorage.getItem("device"),
      showScrollBar: false,
      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  watch: {
    topMsgShow(val) {
      !val ? this.getPinList() : false;
    },
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      soundNofiy: (state) => state.ws.soundNofiy,
      topMsgShow: (state) => state.ws.topMsgShow,
    }),
  },
  mounted() {
    window.addEventListener(
      "scroll",
      () => {
        let scrollTop =  document.querySelector(".message-pabel-box")
        this.showScrollBar = !(
          (scrollTop.scrollHeight - scrollTop.scrollTop) - (this.device==="pc" ? 0.199951171875 : 0.60009765625)  <=
          scrollTop.clientHeight
        );
      },
      true
    );
    this.getPinList();
  },
  methods: {
    ...mapMutations({
      setTopMsgShow: "ws/setTopMsgShow",
      setGoAnchorMessage: "ws/setGoAnchorMessage",
    }),
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
    goMessageAction(data) {
      this.setGoAnchorMessage(data);
      this.setTopMsgShow(true);
    },
    getPinList() {
      let params = {
        toChatId: this.chatUser.toChatId,
        order: 0,
      };
      if (this.contactUser !== undefined) {
        params.toChatId = this.contactUser.toChatId;
      } else {
        params.toChatId = this.chatUser.toChatId;
      }
      pinList(params).then((res) => {
        if (res.code === 200) {
          this.pinDataList = res.data.reverse();
          this.newMessageData = {};
          this.pinDataList.forEach((el) => {
            this.newMessageData[this.$root.formatTimeDay(el.chat.sendTime)] =
              [];
            let newData = this.pinDataList.filter((res) => {
              return (
                this.$root.formatTimeDay(res.chat.sendTime) ===
                this.$root.formatTimeDay(el.chat.sendTime)
              );
            });
            this.newMessageData[this.$root.formatTimeDay(el.chat.sendTime)] =
              newData;
          });
          if(JSON.stringify(this.newMessageData) === '{}') {
            this.setTopMsgShow(true);
            this.$emit("resetPinMsg");
          }
          this.$root.gotoBottom();
        }
      });
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
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.chat.fromChatId === "u" + localStorage.getItem("id")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },
    onContextmenu(data) {
      let item = [
        {
          name: "copy",
          label: "复制",
          onClick: () => {
            this.copyPaste(data);
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
          name: "share",
          label: "分享",
          disabled: true,
        },
        {
          name: "upDown",
          label: "取消置顶",
          onClick: () => {
            this.topMsgAction(data);
          },
        },
      ];
      if (data.chatType === "SRV_USER_SEND") {
        this.newItem = item.filter(list => list.name !== "share" && list.name !== "download");
      } else if (data.chatType === "SRV_USER_IMAGE") {
        this.newItem = item.filter(list => list.name !== "copy");
      } else if (data.chatType === "SRV_USER_AUDIO") {
        this.newItem = item.filter(list => list.name === "upDown");
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
    //下載圖片
    downloadImages(data) {
      let hreLocal = "";
      hreLocal = this.isBase64(data.chat.text);
      this.downloadByBlob(hreLocal, "images");
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

    topMsgAction(data) {
      let param = {
        historyId: data.historyId,
        toChatId: data.toChatId,
      };
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.$emit("resetPinMsg");
          this.getPinList();
        }
      });
    },
    copyPaste(data) {
      let url = document.createElement("textarea");
      document.body.appendChild(url);
      url.value = this.isBase64(data.chat.text).replace(/(\s*$)/g, "");
      url.select();
      document.execCommand("copy");
      document.body.removeChild(url);

      this.$message({
        message: `${
          url.value.length > 110
            ? url.value.substr(0, 110) + " ..."
            : this.isBase64(url.value)
        } 复制成功`,
        type: "success",
        duration: 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
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
        .reply {
          .message-classic {
            padding: 0;
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
        .reply {
          .message-classic {
            padding: 0;
          }
        }
        .message-image {
          background-color: #ffffff;
        }
      }
      .message-audio {
        width: 190px;
        display: flex;
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
    /deep/.el-dialog-takePicture {
      .el-dialog {
        width: 450px !important;
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
    }

    .message-layout-left {
      p {
        display: flex;
        align-items: flex-end;
        .message-audio {
          border-radius: 0 10px 10px 10px;
          background-color: rgba(0, 0, 0, 0.05);
        }
        audio {
          width: 210px;
        }
        .el-image {
          width: -webkit-fill-available !important;
          height: 11em !important;
          top: 0;
          /deep/.el-image__inner {
            height: unset;
          }
        }
      }
      .message-avatar {
        float: left;
        margin-right: 10px;
        border-radius: 10px;
        border: 0;
      }
      .message-classic {
        background-color: rgba(0, 0, 0, 0.05);
        line-height: 1.4rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        border-radius: 0 8px 8px 8px;
      }
      .nickname-time {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #777777;
        font-size: 12px;
        padding-left: 10px;
        .go-message {
          height: 1.5em;
          display: table;
          margin: 10px auto;
          cursor: pointer;
        }
      }
      .read-check-box {
        display: none;
      }
    }

    .click-more-btn {
      width: 180px;
      background-color: #ffffffcb;
      box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.4);
      position: relative;
      border-radius: 5px;
      padding: 10px;
      ul {
        li {
          line-height: 2em;
          font-size: 14px;
          font-weight: 600;
          padding: 5px;
          color: #403f3f;
          cursor: pointer;
          &:hover {
            background-color: #dadadacb;
            border-radius: 5px;
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
        .el-image {
          width: -webkit-fill-available !important;
          height: 11em !important;
          top: 0;
          /deep/.el-image__inner {
            height: unset;
          }
        }
      }
      .message-avatar {
        float: right;
        margin-left: 10px;
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #777777;
        font-size: 12px;
        padding-right: 10px;
        align-items: flex-end;
        .go-message {
          height: 1.5em;
          display: table;
          margin: 10px auto;
          cursor: pointer;
        }
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
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }

    .message-classic,
    .message-disabled {
      position: relative;
      // max-width: 45%;
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
      
      display: inline-block;
      // border: 1px solid #eeeeee;
    }
    .message-image {
      position: relative;
      
      display: inline-block;
      padding: 5px 6px 2px 6px;
      color: #333333;
      background-color: #e5e4e4;
      border-radius: 10px;
      img {
        border-radius: 8px;
        width: 6em;
      }
    }
    .message-mini-audio {
      position: relative;
      
      display: inline-block;
      border-radius: 10px;
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
  text-align: center;
  background-color: #fff;
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
    cursor: pointer;
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
      width: 200px !important;
      border: 0 !important;
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
  padding: 10px 0;
}
/deep/.linkified {
  color: #10686e;
  text-decoration: none;
}
.top-msg-style {
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
</style>
