<template>
  <div class="message-pabel-box">
    <el-button
      v-if="showMoreMsg"
      class="eye-more"
      @click="eyeMore()"
      type="text"
      >加载更多历史讯息</el-button
    >
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in message"
        :key="index"
        :class="judgeClass(item)"
      >
        <p class="message-nickname">
          {{ item.username }}
          <span class="nickname-time">{{
            $root.formatTimeS(item.message.time)
          }}</span>
        </p>
        <p
          class="message-classic"
          v-html="item.message.content"
          @click="redImg(item.chatType)"
          v-linkified
        ></p>
        <div
          v-if="adminUser"
          class="message-disabled"
          @click="item.banTime === null ? disabled(item) : unBlock(item)"
          :class="item.banTime === null ? 'noDis' : 'disUser'"
        >
          {{ item.banTime === null ? "封禁" : "解封" }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { gotoBottom } from "@/assets/tools";
import { getLocal } from "_util/utils.js";
export default {
  name: "MessagePabel",
  props: {
    // 当前用户
    localInfo: {
      type: Object,
    },
    serverMsg: {
      type: Array,
    },
    checked: {
      type: Boolean,
    },
    showMoreMsg: {
      type: Boolean,
    },
    clearDialog:{
      type: Boolean,
    },
    adminUser:{
      type: Boolean,
    },
    historyId:{
      type:String,
    },
  },
  data() {
    return {
      message: [],
      disUserNumber: "0",
      disDialog: false,
      gotoBottom: gotoBottom,
      disabledImg: require("./../../static/images/disabled.svg"),
      pageSize: 0,
    };
  },
  watch: {
    clearDialog(val){
      if(!val){
        this.historyId='';
        this.pageSize = 0;
        this.$emit('showMoreBtn',true);
      }
    },
    serverMsg(val) {
      //去除重複
      const set = new Set();
      this.message = val.filter(item => !set.has(item.historyId) ? set.add(item.historyId) : false);
      if (this.checked) this.gotoBottom();
    },
    checked(val) {
      if (val) this.gotoBottom();
    },
  },
  methods: {
    redImg(type) {
      if (type === "SRV_ROOM_RED") console.log("搶紅包囉");
    },
    /**封禁人員**/
    disabled(item) {
      const h = this.$createElement;
      this.$prompt("確定要封禁玩家", `確定要封禁玩家"${item.username}"?`, {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        inputPlaceholder: "請輸入封禁分鐘",
        inputPattern: /^[+-]?\d+$/,
        inputErrorMessage: "※只能輸入數字",
        center: true,
        message: h("div", null, [
          h("div", {
            style:
              "width:100%;height:50px;background-image:url(" +
              this.disabledImg +
              ");background-repeat:no-repeat;background-position: center; position: absolute;top: -3rem;",
          }),
        ]),
      })
      .then(({value}) => {
        let banList  = this.localInfo;
        banList.chatType = "CLI_ROOM_BAN";
        banList.toChatId = item.chatRoomId;
        banList.banUser = item.username;
        banList.minute = value;
        banList.id = Math.random();
        Socket.send(banList);
        this.$message({
          type: "success",
          message: "确定封禁" + value + "分钟",
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消输入",
        });
      });
    },
    unBlock(item){
      let unBlock  = this.localInfo;
      unBlock.chatType = "CLI_ROOM_LIFT_BAN";
      unBlock.toChatId = item.chatRoomId;
      unBlock.banUser = item.username;
      unBlock.id = Math.random();
      Socket.send(unBlock);      
    },
    /**判断Class**/
    judgeClass(item) {
      if (item.username === getLocal("username")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },

    /**查看更多**/
    eyeMore() {
      let historyMsg = this.localInfo;
      historyMsg.chatType = "CLI_ROOM_HISTORY_REQ";
      historyMsg.id = Math.random();
      historyMsg.minute = 10; //分鐘
      historyMsg.targetId = this.historyId;
      (historyMsg.pageSize = this.pageSize += 50),
      Socket.send(historyMsg);
      this.$emit('chebox',false)
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

  .eye-more {
    width: 100%;
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
  }

  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left,
    .message-layout-right {
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
      .message-avatar {
        float: left;
        margin-right: 10px;
      }
      .message-classic {
        background-color: rgb(243, 249, 255);
        line-height: 1.4rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        .linkified{
          color: #333333;
        }
        &::before {
          left: -16px;
          border-color: transparent rgb(243, 249, 255) transparent transparent;
        }
      }
      .message-disabled {
        display: none;
        position: relative;
        left: 36px;
        color: #ffffff;
        cursor: pointer;
      }
      .noDis {
        background-image: linear-gradient(#959595, #7e7e7e);
      }
      .disUser {
        background-image: linear-gradient(#b4d4ff, #559dff);
      }
      &:hover {
        .message-disabled {
          display: inline-block;
        }
      }
    }

    .message-layout-right {
      text-align: right;
      .message-avatar {
        float: right;
        margin-left: 10px;
      }
      .message-classic {
        text-align: left;
        color: #ffffff;
        line-height: 1.4rem;
        font-weight: 500;
        background-color: rgba(55, 126, 200, 0.8);
        letter-spacing: 0.5px;
        &::before {
          right: -16px;
          border-color: transparent transparent transparent
            rgba(55, 126, 200, 0.8);
        }
        .linkified{
          color:#FFFFFF;
        }
      }
      .message-disabled.noDis {
        display: none !important;
      }
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }
    .message-nickname {
      color: #777777;
      font-size: 12px;
      .nickname-time {
        padding: 0 10px;
      }
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
      border-radius: 5px;
      white-space: pre-line;
      word-break: break-all;
      .red {
        height: 1.5em;
      }
    }
  }
}
.el-message-box--center {
  .el-message-box__title {
    top: 3rem;
    span {
      color: #2f84ed;
      font-weight: 600;
    }
  }
  .el-message-box__content {
    padding-left: 50px;
    padding-right: 50px;
  }
  .el-message-box__input {
    position: relative;
    top: 2rem;
    padding-bottom: 36px;
    .el-input {
      .el-input__inner {
        text-align: center;
      }
    }
    &:after {
      content: "※若填0则封禁999999分钟";
      display: block;
      position: relative;
      top: -10px;
      right: -67px;
    }
    .el-message-box__errormsg {
      text-align: left;
    }
  }
  .el-message-box__btns {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    margin: 0 86px;
    .el-button {
      font-size: 15px;
      padding: 8px 27px;
      border-radius: 5px;
      color: #fff;
      &:first-child {
        background-image: linear-gradient(#bababa, #7c7c7c);
      }
      &:last-child {
        background-image: linear-gradient(#438dff, #1363ff);
      }
    }
  }
}
</style>
