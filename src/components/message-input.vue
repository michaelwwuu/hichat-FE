<template>
  <div class="message-input-box">
    <div class="no-login" v-if="isGuest">
      <span>登入后加入讨论</span>
    </div>
    <div class="text-send-box" v-else> 
      <el-input
        type="textarea"
        resize="none"
        maxlength="1000"
        placeholder="请输入文字..."
        :autosize="{ minRows: 3.5, maxRows: 3.5 }"
        v-model="textArea"
        @keyup.native="keyUp" 
      >
      </el-input>

      <div class="footer-tools">
        <el-button size="mini" class="send-button" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
export default {
  name: "MessageInput",
  data() {
    return {
      textArea: "",
      
    };
  },
  props: {
    isGuest: {
      type: Boolean,
    },  
    roomId:{
      type: String,
    },
    deviceId:{
      type: String,
    },
  },

  methods: {
    // 消息过滤
    textAreaTran() {
      return this.textArea
        .replace(/\n/g, "")
        .replace(new RegExp("<", "gm"), "&lt");
    },
    // 按Enter发送消息
    keyUp(event) {
      if (event.shiftKey && event.keyCode === 13) {
        return this.textArea;
      } else if (event.key === "Enter") {
        if (this.textArea.replace(/\s+/g, "") === "") {
          this.$alert("不能发送空白消息", "提示", {
            confirmButtonText: "确定",
          }).then(() => {
            this.textArea = ""
          });
          event.target.blur()
          return false;
        }
        this.sendMessage();
      }
    },
    // 发送消息
    sendMessage() {
      let sendMessageData= {
        chatType: "CLI_ROOM_SEND",
        deviceId: this.deviceId,
        id: Math.random(),
        platformCode: "manycaiSport",
        text: this.textArea,
        toChatId: this.roomId,
        token: localStorage.getItem('token'),
        tokenType: 1,
      }
      console.log(this.deviceId)
      Socket.send(sendMessageData);
      this.textArea = "";
    },
  },
};
</script>

<style lang="scss" >
.message-input-box {
  height: 145px;
  background-color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid #dddddd;
  .text-send-box {
    width: 97%;
    height: 73px;
    margin: 0 auto;
    .el-textarea {
      .el-textarea__inner {
        padding: 10px !important;
        border-radius: 0;
        border: 0;
        background-color: transparent;
        font-size: 16px;
      }
    }
    .footer-tools {
      text-align: right;
      img {
        height: 9px;
      }
      .send-button {
        width: 90px;
      
        padding: 7px 10px;
        margin-right: 20px;
        color: #ffffff;
        background-image: linear-gradient(
          180deg,
          rgba(67, 141, 255, 0.8),
          rgba(19, 99, 255, 0.8)
        );
        span{
          font-size: 16px;
        }
      }
    }
  }
  .no-login{
    width: 100%;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      font-size:25px;
    }
  }
}
</style>
