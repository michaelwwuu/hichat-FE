<template>
  <div class="message-pabel-box">
    <el-button
      v-if="isShowMoreMsg && userInfoData.usernameCLI_ROOM_SEND !== 'guest'"
      class="eye-more"
      @click="seeMoreHistoryMsgData()"
      type="text"
      >加载更多历史讯息</el-button
    >
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in message"
        :key="index"
        class="message-layout-left"
      >
        <span class="message-nickname"
          v-if="item.username !== 'guest'"
          ><span :class="{ 'userIdStyle': item.fromChatId === userId }"
            >{{ item.nickname }}：</span
          >
          <span :style="item.chatType === 'SRV_JOIN_ROOM' ? 'color: #f00' :'color: #afafaf;'">{{ item.message.content }}</span>
        </span>
      </li>
    </ul>
    <el-button v-show="showBottomBtn" class="bottom-btn" icon="el-icon-arrow-down" circle @click="goDown"></el-button>
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
    isShowMoreMsg: {
      type: Boolean,
    },
  },
  data() {
    return {
      message: [],
      userId: localStorage.getItem("username"),
      gotoBottom: gotoBottom,
      showBottomBtn:false,
    };
  },
  watch: {
    messageData(val) {
      this.message = val
      this.historyId = val.length > 0 ? val[0].historyId : "";
      //去除重复
      // const set = new Set();
      // this.message = val.filter((item) =>
      //   !set.has(item.historyId) ? set.add(item.historyId) : false
      // );
      if (!this.showBottomBtn) {
        this.gotoBottom();
      }
      console.log(this.showBottomBtn)
    },
    showBottomBtn(val){
      if(!val) this.gotoBottom();
    }
  },
  methods: {
    goDown(){
      this.showBottomBtn = false;
    },
    // 查看历史讯息
    seeMoreHistoryMsgData() {
      this.showBottomBtn = true
      let historyMsgList = this.userInfoData;
      historyMsgList.chatType = "CLI_ROOM_HISTORY_REQ";
      historyMsgList.id = Math.random();
      historyMsgList.targetId = this.historyId;
      historyMsgList.pageSize = 100;
      delete historyMsgList.username
      delete historyMsgList.text
      setTimeout(() => {
        Socket.send(historyMsgList);  
      }, 500);
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
      font-size: 15px;
      span {
        color: #0079fe;
      }
    }
    .userIdStyle {
      color: rgb(255, 0, 0) !important;
    }
    .message-classic {
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
.message-pabel-box .eye-more {
  width: 100%;
  padding: 25px 0 15px 0;
  font-size: 15px;
  text-align: center;
}
.bottom-btn{
  position: fixed;
  bottom: 200px;
  right: 270px;
}
</style>
