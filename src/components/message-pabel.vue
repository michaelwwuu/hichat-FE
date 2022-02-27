<template>
  <div class="message-pabel-box">
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in message"
        :key="index"
        class="message-layout-left"
      >
        <p class="message-nickname">
          {{ item.username }}
        </p>
        <p
          class="message-classic"
          v-html="item.message.content"
        ></p>
      </li>
    </ul>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { gotoBottom } from "@/assets/tools";
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
      message: [],
      gotoBottom: gotoBottom,
    };
  },
  watch: {
    messageData(val) {
      this.historyId = val.length > 0 ? val[0].historyId : "";
      //去除重复
      const set = new Set();
      this.message = val.filter(item => !set.has(item.historyId) ? set.add(item.historyId) : false);
      this.gotoBottom();
    },
  },
  methods: {
    // 查看历史讯息
    seeMoreHistoryMsgData() {
      let historyMsgList = this.userInfoData;
      historyMsgList.chatType = "CLI_ROOM_HISTORY_REQ";
      historyMsgList.id = Math.random();
      historyMsgList.minute = 10; //分鐘
      historyMsgList.targetId = this.historyId;
      historyMsgList.pageSize = 50;
      Socket.send(historyMsgList);
    },
  },
};
</script>

<style lang="scss" >
.message-pabel-box {
  padding: 0 20px;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: rgba(255, 255, 255, 0.8);

  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left {
      margin-top: 20px;
      width: 100%;
      .message-classic::before {
        content: "";
        position: absolute;
        border-width: 8px;
        border-style: solid;
      }
    }

    .message-layout-left {
      .message-classic {
        background-color: rgb(243, 249, 255);
        line-height: 1.4rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        &::before {
          left: -16px;
          border-color: transparent rgb(243, 249, 255) transparent transparent;
        }
      }
    }

    .message-nickname {
      color: #777777;
      font-size: 12px;
    }

    .message-classic{
      position: relative;
      max-width: 45%;
      margin-top: 5px;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      border-radius: 5px;
      white-space: pre-line;
      word-break: break-all;
      .red {
        height: 1.5em;
      }
    }
  }
}
</style>
