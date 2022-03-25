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
          <img class="message-avatar" :src="el.icon" />
          <p
            :class="{
              'reply-aduio': device ==='moblie' &&
                el.isRplay !== null && el.isRplay.chatType === 'SRV_GROUP_AUDIO' ,
            }"
          >
            <span
              class="message-classic"
              v-if="el.chatType === 'SRV_GROUP_SEND'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
            >
              <div class="message-box">
                <span class="message-name">{{ el.name }}</span>
                <template v-if="el.isRplay !== null">
                  <div style="color: #00a1ff">{{ el.isRplay.nickName }}</div>
                  <div @click="goAnchor(el.isRplay.historyId)">
                    <div class="goAnchor-box">
                      <span
                        v-if="el.isRplay.chatType === 'SRV_GROUP_SEND'"
                        class="goAnchor"
                        >{{ el.isRplay.text }}</span
                      >
                      <img
                        v-if="el.isRplay.chatType === 'SRV_GROUP_IMAGE'"
                        :src="el.isRplay.text"
                        style="border-radius: 5px"
                      />
                      <audio
                        v-if="el.isRplay.chatType === 'SRV_GROUP_AUDIO'"
                        class="message-audio"
                        controls
                        :src="el.isRplay.text"
                        type="mp3"
                      ></audio>
                    </div>
                  </div>
                </template>
                <div class="message-box-content">
                  <div
                    v-for="(item, index) in el.newContent"
                    :key="index"
                    :id="el.historyId"
                    :class="{
                      'message-touch-carte':
                        item.startsWith('@') && item.length > 1,
                    }"
                    @click="
                      item.startsWith('@')
                        ? carteMsgShow(item.replace(/[\@|\s*]/g, ''))
                        : false
                    "
                    ><span v-html="item" v-linkified @click.prevent.stop="device === 'moblie'? onContextmenu(el):false"></span
                  ></div>
                </div>
              </div>
            </span>
            <span
              :id="el.historyId"
              class="message-audio"
              v-else-if="el.chatType === 'SRV_GROUP_AUDIO'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @click.prevent.stop="device === 'moblie'? onContextmenu(el):false"
              @dblclick="dblclick(el)"
            >
              <div class="message-box">
                <span class="message-name">{{ el.name }}</span>
                <audio controls :src="el.message.content" type="mp3"></audio>
              </div>
            </span>

            <span
              :id="el.historyId"
              class="message-image"
              v-else-if="el.chatType === 'SRV_GROUP_IMAGE'"
              @contextmenu.prevent.stop="onContextmenu(el)"
              @dblclick="dblclick(el)"
            >
              <div class="message-box">
                <span class="message-name">{{ el.name }}</span>
                <div
                  v-if="device === 'moblie'"
                  class="images-more-btn"
                  @click.prevent.stop="
                    device === 'moblie' ? onContextmenu(el) : false
                  "
                ></div> 
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
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { deleteRecentChat } from "@/api";

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
      noIcon: require("./../../static/images/image_user_defult.png"),
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      contactListData: (state) => state.ws.contactListData,
    }),
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
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setEditMsg: "ws/setEditMsg",
      setChatUser: "ws/setChatUser",
      setReplyMsg: "ws/setReplyMsg",
    }),
    goAnchor(data) {
      document.getElementById(data).scrollIntoView(true);
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
        if (this.device === "moblie") {
          this.$router.push({ name: "ContactPage" });
        } else {
          this.carteContact[0].type = "address";
          this.setInfoMsg({
            infoMsgShow: true,
            infoMsgChat: true,
            infoMsgNav: "ContactPage",
          });
        }
      }

      this.setChatUser(this.carteContact[0]);
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
          data.chatType === "SRV_GROUP_IMAGE" ||
          data.chatType === "SRV_GROUP_AUDIO"
        ) {
          if (data.chatType === "SRV_GROUP_AUDIO") {
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
          data.chatType === "SRV_GROUP_IMAGE" ||
          data.chatType === "SRV_GROUP_AUDIO"
        ) {
          if (data.chatType === "SRV_GROUP_IMAGE") {
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
      let downloadUrl = "";
      downloadUrl = data.message.content;
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
            this.$emit('deleteMsgHistoryData',data)
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
        });
    },
    // getHiChatDataList() {
    //   let chatMsgKey = {
    //     chatType: "CLI_RECENT_CHAT",
    //     id: Math.random(),
    //     tokenType: 0,
    //     deviceId: localStorage.getItem("UUID"),
    //     token: localStorage.getItem("token"),
    //   };
    //   Socket.send(chatMsgKey);
    // },
    // getHistory() {
    //   let getHistoryMessage = {
    //     chatType: "CLI_GROUP_HISTORY_REQ",
    //     toChatId: this.groupUser.toChatId,
    //     id: Math.random(),
    //     tokenType: 0,
    //     pageSize: 1000,
    //     deviceId: localStorage.getItem("UUID"),
    //     token: localStorage.getItem("token"),
    //   };
    //   Socket.send(getHistoryMessage);
    // },
  },
};
</script>

<style lang="scss" scoped>
.message-pabel-box {
  padding: 0 15px 0 20px;
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
          background-color: #f3f9ff;
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
      }
      .message-avatar {
        float: left;
        margin-right: 10px;
        border-radius: 10px;
      }
      .message-box {
        span {
          display: block;
        }
        .message-name {
          font-size: 13px;
          color: #919191;
        }
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
      .message-image {
        position: relative;
        margin-top: 1em;
        display: inline-block;
        padding: 5px 6px 2px 6px;
        background-color: #f3f9ff;
        border-radius: 10px;
        .message-box {
          .message-name {
            padding-bottom: 5px;
          }
          .el-image {
            width: auto !important;
            height: 10em !important;
            /deep/.el-image__inner {
              height: 15em;
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
          background-color: #f1f3f4;
          audio {
            width: 190px;
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
      .message-image {
        position: relative;
        margin-top: 1em;
        display: inline-block;
        padding: 5px 6px 2px 6px;
        color: #333333;
        background-color: #e5e4e4;
        border-radius: 10px;
        .el-image {
          width: auto !important;
          height: 10em !important;
          /deep/.el-image__inner {
            height: 15em;
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

    .message-classic,
    .message-disabled {
      position: relative;
      max-width: 45%;
      margin-top: 5px;
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
      margin-top: 1em;
      display: inline-block;
      border: 1px solid #eeeeee;
    }
  }
}
.hichat-pc {
  .message-pabel-box {
    .message-styles-box {
      .message-layout-left {
        p {
          .el-image {
            width: auto !important;
            height: 20em !important;
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
            height: 20em !important;
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
    margin-right: 5px;
  }
  .message-touch-carte {
    color: #00a1ff;
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
.images-more-btn{
  width: 2em;
  height: 2em;
  background-image: url('./../../static/images/pc/more.png');
  cursor: pointer;
  border-radius: 5px;
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  background-color:#f7f7f794;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 9;
}
.goAnchor-box {
  cursor: pointer;
  .goAnchor {
    color: #ababab;
    text-decoration: none;
  }
  &:hover {
    .goAnchor {
      color: #5f5f5f;
    }
    border-radius: 8px;
  }
  .message-audio {
    height: 2.5em !important;
    padding: 0 !important;
    border: none !important;
  }
}
</style>
