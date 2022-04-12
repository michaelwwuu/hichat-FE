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
          <p
            :class="{
              'reply-aduio':
                device === 'moblie' &&
                el.isRplay !== null &&
                el.isRplay.chatType === 'SRV_USER_AUDIO',
            }"
            :id="el.historyId"
          >
            <span
              class="message-classic"
              v-if="el.chatType === 'SRV_USER_SEND'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
            >
              <template v-if="el.isRplay !== null">
                <div class="reply-box" @click="goAnchor(el.isRplay.historyId)">
                  <div class="reply-img">
                    <img :src="noIconShow(el.isRplay)" alt="" />
                  </div>
                  <div>
                    <div style="color: #00a1ff">{{ el.isRplay.nickName }}</div>
                    <div>
                      <div class="goAnchor-box">
                        <span
                          v-if="el.isRplay.chatType === 'SRV_USER_SEND'"
                          class="goAnchor"
                          >{{ isBase64(el.isRplay.text) }}</span
                        >
                        <img
                          v-if="el.isRplay.chatType === 'SRV_USER_IMAGE'"
                          :src="isBase64(el.isRplay.text)"
                          style="border-radius: 5px"
                        />
                        <span v-if="el.isRplay.chatType === 'SRV_USER_AUDIO'">
                          <div class="reply-audio-box"></div>
                          <audio
                            class="message-audio"
                            controls
                            :src="isBase64(el.isRplay.text)"
                            type="mp3"
                          ></audio>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <span
                v-if="
                  el.message.content.match(
                    /(http|https):\/\/([\w.]+\/?)\S*/gi
                  ) === null
                "
                @click.prevent.stop="
                  device === 'moblie' ? onContextmenu(el) : false
                "
                v-html="el.message.content"
              ></span>
              <div
                v-else-if="
                  el.message.content.match(/(http|https):\/\/([\w.]+\/?)\S*/gi)
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
                  v-html="el.message.content"
                  v-linkified
                  :class="device === 'moblie' ? 'link-style' : ''"
                ></div>
              </div>
              <span v-else v-html="el.message.content"></span>
            </span>
            <span
              v-else-if="el.chatType === 'SRV_USER_AUDIO'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @click.prevent.stop="
                device === 'moblie' ? onContextmenu(el) : false
              "
              @dblclick="dblclick(el)"
            >
              <audio
                class="message-audio"
                :src="el.message.content"
                controls
                type="mp3"
              ></audio>
            </span>
            <span
              class="message-image"
              v-else-if="el.chatType === 'SRV_USER_IMAGE'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
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
                :src="el.message.content"
                :preview-src-list="[el.message.content]"
              />
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
        </li>
      </div>
    </ul>
    <!-- <el-button
      v-show="showScrollBar"
      class="scroll-bottom-btn"
      size="medium"
      icon="el-icon-arrow-down"
      circle
      @click="$root.gotoBottom()"
    ></el-button> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { deleteRecentChat } from "@/api";
import { Decrypt } from "@/utils/AESUtils.js";

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
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
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
    ...mapMutations({
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
    }),
    goAnchor(data) {
      document.getElementById(data).classList.add("blink");
      document.getElementById(data).scrollIntoView(true);
      setTimeout(() => {
        document.getElementById(data).classList.remove("blink");
      }, 3000);
    },
    isBase64(data) {
      if (data === "" || data.trim() === "") {
        return data;
      }
      try {
        return Decrypt(data, this.aesKey, this.aesIv);
      } catch (err) {
        return data;
      }
    },
    noIconShow(iconData) {
      if (
        iconData.icon === undefined ||
        iconData.icon === null ||
        iconData.icon === ""
      ) {
        return require("./../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.userChatId === "u" + localStorage.getItem("id")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },
    mouseClick(event) {
      for (let item in this.newMessageData) {
        this.newMessageData[item].forEach((res) => {
          if (res.historyId === event.historyId) {
            return (res.isMoreSetUp = true);
          } else {
            return (res.isMoreSetUp = false);
          }
        });
      }
    },
    dblclick(event) {
      this.setReplyMsg({
        chatType: event.chatType,
        clickType: "replyMsg",
        innerText: event.message.content,
        replyHistoryId: event.historyId,
        name: event.name,
        icon: event.icon,
      });
    },
    onContextmenu(data) {
      let item = [
        {
          name: "edit",
          label: "編輯",
          onClick: () => {
            this.setReplyMsg({
              chatType: data.chatType,
              clickType: "editMsg",
              innerText: data.message.content,
              replyHistoryId: data.historyId,
              name: data.name,
              icon: data.icon,
            });
            this.setEditMsg({ innerText: data.message.content });
          },
        },

        {
          name: "copy",
          label: "複製",
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
              innerText: data.message.content,
              replyHistoryId: data.historyId,
              name: data.name,
              icon: data.icon,
            });
          },
        },
        {
          name: "download",
          label: "下載",
          onClick: () => {
            this.downloadImages(data);
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
      ];
      if (data.userChatId !== "u" + localStorage.getItem("id")) {
        if (
          data.chatType === "SRV_USER_IMAGE" ||
          data.chatType === "SRV_USER_AUDIO"
        ) {
          if (data.chatType === "SRV_USER_AUDIO") {
            this.newItem = item.filter((list) => {
              return (
                list.name !== "deleteAllChat" &&
                list.name !== "edit" &&
                list.name !== "copy" &&
                list.name !== "download"
              );
            });
          } else {
            this.newItem = item.filter((list) => {
              return (
                list.name !== "deleteAllChat" &&
                list.name !== "edit" &&
                list.name !== "copy"
              );
            });
          }
        } else {
          this.newItem = item.filter((list) => {
            return (
              list.name !== "deleteAllChat" &&
              list.name !== "edit" &&
              list.name !== "download"
            );
          });
        }
      } else {
        if (
          data.chatType === "SRV_USER_IMAGE" ||
          data.chatType === "SRV_USER_AUDIO"
        ) {
          if (data.chatType === "SRV_USER_IMAGE") {
            this.newItem = item.filter((list) => {
              return list.name !== "edit" && list.name !== "copy";
            });
          } else {
            this.newItem = item.filter((list) => {
              return (
                list.name !== "edit" &&
                list.name !== "copy" &&
                list.name !== "download"
              );
            });
          }
        } else {
          this.newItem = item.filter((list) => {
            return list.name !== "download";
          });
        }
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
    downloadImages(data) {
      let hreLocal = "";
      hreLocal = data.message.content;
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
    copyPaste(data) {
      let url = document.createElement("textarea");
      document.body.appendChild(url);
      url.value = data.message.content.replace(/(\s*$)/g, "");
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
};
</script>

<style lang="scss" scoped>
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
        p {
          .el-image {
            width: auto !important;
            height: 15em !important;
            /deep/.el-image__inner {
              height: 100%;
            }
          }
        }
      }
      .message-layout-right {
        p {
          .el-image {
            width: auto !important;
            height: 15em !important;
            /deep/.el-image__inner {
              height: 100%;
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
    margin: 1em 0;
    span {
      background-color: #d3d3d3;
      padding: 3px 8px;
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
          background-color: #f1f3f4;
        }
        audio {
          width: 210px;
        }
        .el-image {
          width: auto !important;
          height: 10em !important;
          /deep/.el-image__inner {
            height: 15em;
          }
        }
      }
      .message-avatar {
        float: left;
        margin-right: 10px;
      }
      .message-classic {
        background-color: rgb(243, 249, 255);
        line-height: 1.4rem;
        font-weight: 500;
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
          background-color: #f1f3f4;
          audio {
            width: 190px;
          }
        }
        .el-image {
          width: auto !important;
          height: 10em !important;
          /deep/.el-image__inner {
            height: 15em;
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
        font-weight: 500;
        background-color: #f1f3f4;
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
      max-width: 45%;
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
      border: 1px solid #eeeeee;
    }
    .message-image {
      position: relative;
      // margin-top: 1em;
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
  }
}
.reply-aduio {
  .message-classic {
    max-width: 100% !important;
  }
}

.images-more-btn {
  width: 2em;
  // height: 2em;
  cursor: pointer;
  border-radius: 5px;
  // background-size: 70%;
  // background-position: center;
  // background-repeat: no-repeat;
  // background-color: #f7f7f794;
  // background-image: url("./../../static/images/pc/more.png");
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 9;
  // border:1px solid #ebebeb;
  text-align: center;
  .el-icon-more {
    font-size: 20px;
  }
}
.reply-box {
  display: flex;
  border-bottom: 1px solid #c3c3c3;
  margin-bottom: 5px;
  cursor: pointer;
  .reply-img {
    margin-right: 5px;
    img {
      width: 3em !important;
      height: 3em !important;
      border-radius: 10px;
    }
  }
  .goAnchor-box {
    cursor: pointer;
    .goAnchor {
      color: #ababab;
      text-decoration: none;
    }
    .reply-audio-box {
      display: block;
      // background-color: #000000;
      width: 14em;
      height: 55px;
      position: absolute;
      z-index: 9;
    }
    .message-audio {
      width: 200px !important;
      border: 0 !important;
    }
  }
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
</style>
