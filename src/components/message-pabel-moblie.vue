<template>
  <div class="message-pabel-box">
    
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in message"
        :key="index"
        :class="judgeClass(item)"
      >
        <div class="now-time">
          <span>{{$root.formatTimeDay(item.message.time)}}</span>
        </div>
        <p>
          <span class="message-classic">{{item.message.content}}</span>
          <span class="nickname-time">{{
            $root.formatTimeSecound(item.message.time)
          }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { gotoBottom,disabled,unBlock } from "@/assets/tools";
import { getLocal } from "_util/utils.js";
export default {
  name: "MessagePabel",
  props: {
    userInfoData: {
      type: Object,
    },
    messageData: {
      type: Array,
    },
    isChecked: {
      type: Boolean,
    },
    clearDialog:{
      type: Boolean,
    },
  },
  data() {
    return {
      message: [],
      gotoBottom: gotoBottom,
      disabled:disabled,
      unBlock:unBlock,
      disabledImg: require("./../../static/images/disabled.svg"),
    };
  },
  watch: {
    messageData(val) {
      //去除重复
      const set = new Set();
      this.message = val.filter(item => !set.has(item.historyId) ? set.add(item.historyId) : false);      
    },
  },
  methods: {
    // 判断讯息Class名称
    judgeClass(item) {
      this.gotoBottom();
      if (item.username === getLocal("username")) {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
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
  .now-time {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin: 1em 0;
    span{
      background-color: #d3d3d3;
      padding:3px 8px;
      border-radius:10px;
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
      p{
        display: flex;
        align-items: end;
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
    }

    .message-layout-right {
      p{
        display: flex;
        align-items: end;
      }
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
        border-radius: 8px 8px 0 8px;
      }
      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-left: 10px;
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
    }
  }
}

</style>
