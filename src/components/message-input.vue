<template>
  <div class="message-input-box">
    <div class="input-tools">
     <el-button class="other-btn" size="mini" round @click="sendRed"><img src="./../../static/images/red-btn.svg" alt=""> 发红包</el-button>
     <el-button class="face-other-btn" size="mini" round><img src="./../../static/images/face-btn.svg" alt="">表情</el-button>
    </div>
    <div class="text-send-box">
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 2, maxRows: 2}"
        v-model="textArea"
        v-on:keyup.native="keyUp">
      </el-input>
      <div class="footer-tools">
        <el-button
          size="mini"
          @click="sendMessage"
          class="send-button">
          <img src="./../../static/images/send-btn.svg" alt="">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { gotoBottom } from '@/assets/tools'
export default {
  data () {
    return {
      textArea: '',
      gotoBottom: gotoBottom,
    }
  },
  props: {
    // 联系人列表
    concats: {
      type: Array
    },
    // 当前用户
    localInfo: {
      type: Object
    }
  },
  mounted () {
    // 表情
    this.obj = new window.Face({
      el: document.querySelector('.face-other-btn'),
      callBack: face => {
        this.textArea += `:${face.title}:`
        document.querySelector('.face-warp').style.display = 'none'
      }
    })
  },
  methods: {
    sendRed(){
      let sendRed = this.localInfo
      sendRed.chatType ="CLI_ROOM_RED"
      sendRed.id = Math.random()
      Socket.send(sendRed)
    },
    /**消息过滤**/
    textAreaTran () {
      return this.textArea.replace(/\n/g, '').replace(new RegExp('<', 'gm'), '&lt')
    },
    /**检测空白**/
    blankTesting () {
      if (this.textArea.replace(/\s+/g, '') === '') {
        this.$alert('不能发送空白消息', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      return true
    },

    /**按Enter发送消息**/
    keyUp (event) {
      if (event.key === 'Enter') this.sendMessage()
    },

    /**发送消息**/
    sendMessage () {
      let message = this.localInfo
      message.chatType = "CLI_ROOM_SEND"
      message.id = Math.random()
      message.text = this.obj.replaceFace(this.textAreaTran())
      if (this.blankTesting()) {
        // 发送服务器
        Socket.send(message);
        // 消息清空
        this.textArea = ''
        // 消息置底
        this.gotoBottom()
      }
    }
  }
}
</script>

<style lang="scss" >
.message-input-box {
  height: 145px;
  background-color: rgba(255, 255, 255, .85);
  border-top: 1px solid #dddddd;
  .input-tools {
    width: 97%;
    padding: 15px 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    .upload-demo {
      display: inline;
    }
    .other-btn,
    .face-other-btn{
      color: #FFFFFF;
      border: 1px solid #87B3F9;
      background-image: linear-gradient(#B4D4FF, #559DFF);
      span{
        display: flex;
        align-items: center;
        img{
          padding-right:5px;
        }
      }
    }
  }
  .text-send-box{
    width: 97%;
    height: 73px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    background-color: #F4F4F4;
    .el-textarea {
      .el-textarea__inner {
        padding: 20px 20px !important;
        border-radius: 0;
        border: 0;
        background-color: transparent;
        
      }
    }
    .footer-tools {
      text-align: right;
      img{
        height: 9px;
      }
      .send-button {
        width: 90px;
        padding: 7px 10px;
        margin-right: 20px;
        color: #FFFFFF;
        background-image: linear-gradient(180deg,rgba(67,141,255,0.8), rgba(19,99,255,0.8));
      }
    }
  }

}
.face-pabel {
  .face {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
</style>
