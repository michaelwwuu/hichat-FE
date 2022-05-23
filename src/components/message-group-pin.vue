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
          <img class="message-avatar" :src="el.chat.icon" />
          <p>
            <span
              class="message-classic"
              v-if="el.chatType === 'SRV_GROUP_SEND'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
            >
            
              <div class="message-box">
                <div class="message-name">{{ el.chat.name }}</div>
                <div
                  class="message-box-content"
                >
                  <span
                    v-if="
                      isBase64(el.chat.text).match(
                        /(http|https):\/\/([\w.]+\/?)\S*/gi
                      ) === null
                    "
                    @click.prevent.stop="
                      device === 'moblie' ? onContextmenu(el) : false
                    "
                    v-html="isBase64(el.chat.text)"
                  ></span>
                  <div
                    v-else-if="
                      isBase64(el.chat.text).match(
                        /(http|https):\/\/([\w.]+\/?)\S*/gi
                      )
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
                      v-html="isBase64(el.chat.text)"
                      v-linkified
                      :class="device === 'moblie' ? 'link-style' : ''"
                    ></div>
                  </div>
                  <span v-else v-html="isBase64(el.chat.text)"></span>
                </div>
              </div>
            </span>
            <span
              class="message-audio"
              v-else-if="el.chat.chatType === 'SRV_GROUP_AUDIO'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
            >
              <div class="message-box">
                <div class="message-name">{{ el.chat.name }}</div>
                <div
                  v-if="device === 'moblie'"
                  class="images-more-btn"
                  @click.prevent.stop="
                    device === 'moblie' ? onContextmenu(el) : false
                  "
                >
                  <i class="el-icon-more"></i>
                </div>
                <mini-audio :audio-source="isBase64(el.chat.text)"></mini-audio>
              </div>
            </span>
            <span
              class="message-image"
              v-else-if="el.chat.chatType === 'SRV_GROUP_IMAGE'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
            >
              <div class="message-box">
                <div class="message-name">{{ el.chat.name }}</div>
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
                ></el-image>
              </div>
            </span>

            <span class="nickname-time">
              <img class="go-message" src="./../../static/images/gotomessage.png" alt="" @click="goMessageAction(el.chat)">
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
import { unpinHistory,pinList  } from "@/api";
import { Encrypt,Decrypt } from "@/utils/AESUtils.js";

export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
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
  watch:{
    topMsgShow(val){
      !val ? this.getPinList() : false
    }
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      soundNofiy: (state) => state.ws.soundNofiy,
      contactListData: (state) => state.ws.contactListData,
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
          (scrollTopBox.scrollHeight - scrollTop) / 4 > 200 ||
          (scrollTopBox.scrollHeight - scrollTop) / 3 > 300;
      },
      true
    );
    this.getPinList()
  },
  methods: {
    ...mapMutations({
      setTopMsgShow:"ws/setTopMsgShow",
      setGoAnchorMessage: "ws/setGoAnchorMessage",
    }),
    goMessageAction(data){
      this.setGoAnchorMessage(data)
      this.setTopMsgShow(true)
    },
    getPinList() {
      let toChatId = this.groupUser.toChatId;
      pinList({ toChatId }).then((res) => {
        if(res.code === 200){
          this.pinDataList = res.data.reverse()
          this.newMessageData = {};
          this.pinDataList.forEach((el) => {
            this.newMessageData[this.$root.formatTimeDay(el.chat.sendTime)] = [];
            this.contactListData.forEach((list)=>{
              if(el.chat.fromChatId === "u" + list.memberId){
                el.chat.name = list.name
                el.chat.icon = list.icon
              }
            })
            let newData = this.pinDataList.filter((res) => {
              return (
                this.$root.formatTimeDay(res.chat.sendTime) ===
                this.$root.formatTimeDay(el.chat.sendTime)
              );
            });
            this.newMessageData[this.$root.formatTimeDay(el.chat.sendTime)] =
              newData;
          });
          this.$root.gotoBottom();
        }
      });
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
          label: "複製",
          onClick: () => {
            this.copyPaste(data);
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
          name: "share",
          label: "分享",
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
      if(data.chatType === "SRV_GROUP_SEND"){
        this.newItem = item.filter((list) => {
          return (
            list.name !== "share" &&
            list.name !== "download"
          );
        });
      }else if(data.chatType === "SRV_GROUP_IMAGE"){
        this.newItem = item.filter((list) => {
          return (
            list.name !== "copy" 
          );
        });
      }else if(data.chatType === "SRV_GROUP_AUDIO"){
        this.newItem = item.filter((list) => {
          return (
            list.name === "upDown"
          );
        });
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
    topMsgAction(data){
      let param ={
        historyId: data.historyId,
        toChatId: data.toChatId
      }
      unpinHistory(param).then((res) => {
        if (res.code === 200) {
          this.$emit("resetPinMsg");
          this.getPinList()
        }
      })
    },
    copyPaste(data) {
      let url = document.createElement("textarea");
      document.body.appendChild(url);
      url.value = data.chat.text.replace(/(\s*$)/g, "");
      url.select();
      document.execCommand("copy");
      document.body.removeChild(url);

      this.$message({
        message: `${
          url.value.length > 110 ? url.value.substr(0, 110) + " ..." : this.isBase64(url.value)
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #777777;
        font-size: 12px;
        padding-left: 10px;
        .go-message{
          height: 1.5em;
          width: fit-content;
          margin-bottom: 10px;
          cursor: pointer;
        }
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
            height: 12.5em !important;
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #777777;
        font-size: 12px;
        padding-right: 10px;
        align-items: flex-end;
        .go-message{
          height: 1.5em;
          width: fit-content;
          margin-bottom: 10px;
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
          height: 12.5em !important;
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
            height: 12.5em !important;
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
            height: 12.5em !important;
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
