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
          <p>
            <span
              class="message-classic"
              v-if="el.chatType === 'SRV_GROUP_SEND'"
            >
              <div class="message-box">
                <span class="message-name">{{ el.name }}</span>
                <span>{{ el.message.content }}</span>
              </div>
            </span>
            <span
              class="message-audio"
              v-else-if="el.chatType === 'SRV_GROUP_AUDIO'"
            >
              <div class="message-box">
                <span class="message-name">{{ el.name }}</span>
                <audio controls :src="el.message.content" type="mp3"></audio>
              </div>
            </span>

            <span
              class="message-image"
              v-else-if="el.chatType === 'SRV_GROUP_IMAGE'"
            >
              <div class="message-box">
                <span class="message-name">{{ el.name }}</span>
                <el-image
                  :src="el.message.content"
                  :preview-src-list="[el.message.content]"
                />
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
import { mapMutations } from "vuex";
import { groupListMember } from "@/api";

export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    messageData: {
      type: Array,
    },
    contactListData: {
      type: Array,
    },
  },
  data() {
    return {
      newData: [],
      message: [],
      newMessageData: {},
      contactList: [],
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    this.getGroupListMember();
  },
  watch: {
    contactListData(val) {
      val.forEach((res) => {
        this.message.forEach((el) => {
          if (el.userChatId === "u" + res.memberId) {
            el.icon = res.icon;
            el.name = res.name;
          }
        });
      });
      this.$root.gotoBottom();
    },
    messageData(val) {
      //去除重复
      const set = new Set();
      this.message = val.filter((item) =>
        !set.has(item.historyId) ? set.add(item.historyId) : false
      );
      this.$root.gotoBottom();
    },
    message(val) {
      this.newMessageData = {};
      val.forEach((el) => {
        this.contactList.forEach((res) => {
          if (el.userChatId === "u" + res.memberId) {
            el.icon = res.icon;
            el.name = res.name;
          }
        });
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
    },
  },
  methods: {
    ...mapMutations({
      setContactListData: "ws/setContactListData",
    }),
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.userChatId === "u" + localStorage.getItem("id")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },
    getGroupListMember() {
      let groupId = this.groupData.toChatId.replace("g", "");
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined) {
            res.icon = require("./../../static/images/image_user_defult.png");
          }
          this.setContactListData(this.contactList);
          // this.message.forEach((el) => {
          //   if (el.userChatId === "u" + res.memberId) {
          //     el.icon = res.icon;
          //     el.name = res.name;
          //   }
          // });
        });
      });
    },
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
            width: 10em !important;
            height: 10em !important;
            /deep/.el-image__inner {
              height: 100%;
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
          width: 10em !important;
          height: 10em !important;
          /deep/.el-image__inner {
            height: 100%;
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
</style>
