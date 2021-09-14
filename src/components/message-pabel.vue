<template>
  <div class="message-pabel-box">
    <el-button
      class="eye-more"
      @click="eyeMore"
      v-if="nowSwitchId === 'group' && isShowMore"
      type="text"
      >加载更多消息</el-button
    >
    <ul class="message-styles-box">
      <li
        v-for="(item, index) in message"
        :key="index"
        :class="judgeClass(item.chatType)"
      >
        <img
          class="message-avatar"
          :src="
            item.avatar ? item.avatar : './../../../static/avatar/avatar_14.jpg'
          "
          :alt="item.nickName ? item.nickName : '我是憨批'"
        />

        <p class="message-nickname" v-if="item.type !== 'CLI_ROOM_SEND'">
          {{ item.nickName }} {{ formatTime(item.message.time) }}
        </p>
        <p class="message-nickname" v-else>
          {{ formatTime(item.message.time) }} {{ item.nickName }}
        </p>
        <p class="message-classic" v-html="item.message.content"></p>
        <div
          v-if="item.chatType === 'SRV_ROOM_SEND' && item.fromId !== 'admin'"
          class="message-disabled"
          @click="disabled(item.nickName)"
          :class="disUserNumber === '0'? 'noDis' : 'disUser'"
        >
          {{disUserNumber === '0'?'封禁':'解封'}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Bus from "@/assets/eventBus";
import { gotoBottom } from "@/assets/tools";
import { getLocal } from "_util/utils.js";
export default {
  name: "MessagePabel",
  props: {
    // 选择的联系人ID
    nowSwitchId: {
      type: String,
    },
    // 当前用户
    localInfo: {
      type: Object,
    },
    roomMsg: {
      type: Array,
    },
  },
  data() {
    return {
      message: [],
      disUserNumber: "0",
      disTitle: "",
      page: 0,
      isShowMore: true,
      disDialog:false,
      gotoBottom: gotoBottom,
      disabledImg: require('./../../static/images/disabled.svg')
    };
  },
  watch: {
    roomMsg(val) {
      this.message = val;
    },
  },
  mounted() {
    /**
     * 接收消息
     */
    // this.sockets.subscribe('MESSAGE', message => {
    //   let id = message.id
    //   let gotoId = message.body.gotoId
    //   let fromId = message.body.fromId
    //   let content = message.body.message.content

    //   message.body.message.content = content.replace(/[{]/g, '<').replace(/[}]/g, '>')

    //   this.initMessageArray(gotoId, fromId)

    //   // 用户在群聊发消息
    //   if (gotoId === 'group' && fromId === this.localInfo.id) {
    //     message.body.type = 'user-message'
    //   }

    //   if (gotoId === 'group') {
    //     this.message['group'].push(message.body)
    //   } else {
    //     this.message[id].push(message.body)
    //   }
    //   this.$forceUpdate()
    //   this.gotoBottom()
    //   // 把消息传给父级
    //   this.$emit('message', message)
    // })

    /**
     * 当前用户发的消息
     */
    Bus.$on("MESSAGE", (response) => {
      if (response.fromChatId === "u120") {
        this.userImg = require("./../../static/avatar/avatar_03.jpg");
      } else if (response.fromChatId === "u146") {
        this.userImg = require("./../../static/avatar/avatar_02.jpg");
      } else {
        for (let index = 4; index < 25; index++) {
          this.userImg = require("./../../static/avatar/avatar_0" +
            `${index}` +
            ".jpg");
        }
      }
      let message = {
        chatType: response.chatType,
        avatar: this.userImg,
        fromId: response.fromChatId,
        gotoId: response.toChatId,
        message: {
          time: +new Date(),
          content: response.text,
          textContent: response.text,
        },
        nickName: getLocal("username"),
      };
      this.$forceUpdate();
      // 把消息传给父级
      this.$emit("message", message);
    });

    /**
     * 接收更多消息
     */
    // this.sockets.subscribe('GROUP_MESSAGE', result => {
    //   const box = document.getElementsByClassName('message-pabel-box')[0]
    //   const scroll = box.scrollHeight - box.scrollTop

    //   // 是否有更多数据
    //   if (result.length) {
    //     result.map((item, index) => {
    //       this.message['group'].unshift(JSON.parse(item.body))
    //     })
    //   } else {
    //     this.isShowMore = false
    //   }

    //   if (result.length < 9) this.isShowMore = false

    //   setTimeout(() => {
    //     box.scrollTop = box.scrollHeight - scroll
    //   }, 0)

    //   this.$forceUpdate()
    // })
  },
  methods: {
    disabled(val) {
      this.disTitle = val;
      this.disDialog = true;
      const h= this.$createElement;
      this.$prompt('確定要封禁玩家',`確定要封禁玩家"${this.disTitle}"?`, {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          center:true,
          message:h('div',null,[
            h('div', { style: 'width:100%;height:50px;background-image:url(' + this.disabledImg +');background-repeat:no-repeat;background-position: center; position: absolute;top: -3rem;'}),
          ]),
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '确定封禁' + value + '分钟',
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    /**
     * 数组初始化
     */
    // initMessageArray(gotoId, fromId) {
    //   let array = this.message;

    //   if (!gotoId) return;
    //   if (!array[gotoId]) {
    //     this.message[gotoId] = [];
    //   }

    //   if (!fromId) return;
    //   if (!array[fromId]) {
    //     this.message[fromId] = [];
    //   }
    // },

    /**
     * 判断Class
     */
    judgeClass(type) {
      if (type === "CLI_ROOM_SEND") {
        return "message-layout-right";
      } else {
        return "message-layout-left";
      }
    },

    /**
     * 查看更多
     */
    eyeMore() {
      let obj = {
        id: this.localInfo.id,
        page: (this.page += 1),
      };
      this.initMessageArray("group");
      if (this.message["group"] !== undefined && this.page === 1) {
        obj.length = this.message["group"].length;
      }
      // 发送查询消息
      this.$socket.emit("QUERY_PAGE", obj);
    },
    /**
     * 获取年月日
     */
    formatFullYearMonthDay(date, isShowHourMinute, type) {
      date = new Date(date);
      const fullYear = date.getFullYear();
      const month = date.getMonth() + 1;
      const dayDate = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      if (isShowHourMinute) {
        return `${fullYear}${month}${dayDate}${hours}${minutes}`;
      } else {
        if (type) {
          return `${fullYear}${type}${month}${type}${dayDate}`;
        } else {
          return `${fullYear}${month}${dayDate}`;
        }
      }
    },
    /**
     * 时间格式化
     */
    formatTime(time) {
      var date = new Date(time);
      var nowDate = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      if (
        this.formatFullYearMonthDay(date) ===
        this.formatFullYearMonthDay(nowDate)
      ) {
        return `${hours}:${minutes}`;
      } else {
        return `${this.formatFullYearMonthDay(
          date,
          false,
          "/"
        )} ${hours}:${minutes}`;
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
      .noDis{
        background-image: linear-gradient(#959595, #7e7e7e);
      }
      .disUser{
        background-image: linear-gradient(#B4D4FF, #559DFF);
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
        background-color: rgba(55, 126, 200, 0.8);
        &::before {
          right: -16px;
          border-color: transparent transparent transparent
            rgba(55, 126, 200, 0.8);
        }
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
    }
  }
}
.el-message-box--center{
  .el-message-box__title{
    top: 3rem;
    span{
      color: #2F84ED;
      font-weight: 600;
    }
  }
  .el-message-box__content{
    padding-left: 50px;
    padding-right: 50px;
  }
  .el-message-box__input{
    position: relative;
    top: 2rem;
    padding-bottom: 36px;
    .el-input{
      .el-input__inner{
        text-align: center;
      }
    }
    &:after{
      content: '※若填0则封禁999999分钟';
      display: block;
      position: relative;
      top: -10px;
      right: -67px;
    }
  }
  .el-message-box__btns{
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    padding: 0 86px;
    .el-button{
      font-size: 15px;
      padding: 8px 27px;
      border-radius: 5px;
      color: #FFF;
      &:first-child{
        background-image: linear-gradient(#BABABA, #7C7C7C);
      }
      &:last-child{
        background-image: linear-gradient(#438DFF, #1363FF);
      }
    }
  }
}

</style>
