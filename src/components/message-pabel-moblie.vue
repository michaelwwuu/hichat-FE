<template>
  <div class="message-pabel-box">
    
    <ul class="message-styles-box">
      <div 
        v-for="(item, index) in newMessageData"
        :key="index">
        <div class="now-time">
            <span>{{index}}</span>
          </div>
        <li
          v-for="(el, index) in item"
          :key="index"
          :class="judgeClass(item[index])"
        >
          <div class="read-check-box">
            <span class="read-check" v-if="el.isRead"><img src="./../../static/images/check.png" alt=""></span>
            <span class="read-check2"><img src="./../../static/images/check.png" alt=""></span>
          </div>
          <p>
            <span class="message-classic">{{el.message.content}}</span>
            <span class="nickname-time">{{
              $root.formatTimeSecound(el.message.time)
            }}</span>
          </p>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import { gotoBottom } from "@/assets/tools";
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
  },
  data() {
    return {
      message: [],
      gotoBottom: gotoBottom,
      newMessageData:{},
      newData:[],
    };
  },
  watch: {
    messageData(val) {
      //去除重复
      const set = new Set();
      this.message = val.filter(item => !set.has(item.historyId) ? set.add(item.historyId) : false); 
      this.gotoBottom();
    },
    message(val){
      this.newMessageData= {}
      val.forEach(el => {
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] = []
        let newData = this.message.filter((res) => {
          return this.$root.formatTimeDay(res.message.time) === this.$root.formatTimeDay(el.message.time)
        })
        this.newMessageData[this.$root.formatTimeDay(el.message.time)] = newData
      });
    }
  },
  methods: {
    // 判断讯息Class名称
    judgeClass(item) {
      if (item.userChatId === getLocal("fromChatId")) {
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
  padding: 0 15px 0 20px;
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
      .read-check-box{
        display:none;
      }
    }

    .message-layout-right {
      p{
        display: flex;
        align-items: end;
        flex-flow: row-reverse;
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
        background-color: #e5e4e4;
        letter-spacing: 0.5px;
        border-radius: 8px 0 8px 8px;
      }
      .nickname-time {
        color: #777777;
        font-size: 12px;
        padding-right: 10px;
      }
      .read-check-box{
        text-align:right;
        position: relative;
        top: 50px;
        left:7px;
        z-index: 9;
        span{
          img{
            height:1em;
          }
        }
        .read-check{
          position: relative;
          left: 0.5em;
        }
        .read-check2{
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
