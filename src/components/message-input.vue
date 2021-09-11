<template>
  <div class="message-input-box">
    <div class="input-tools">
     <el-button class="other-btn" size="mini" round><img src="./../../static/images/red-btn.svg" alt=""> 发红包</el-button>
     <el-button class="other-btn" size="mini" round><img src="./../../static/images/face-btn.svg" alt="">表情</el-button>
    </div>
    <div class="text-send-box">
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 3, maxRows: 3}"
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
// import Bus from '@/assets/eventBus'
import { gotoBottom } from '@/assets/tools'
import Socket from "@/utils/socket";
export default {
  data () {
    return {
      textArea: '',
      gotoBottom: gotoBottom
    }
  },
  props: {
    // 联系人列表
    concats: {
      type: Array
    },
    // 当前选择的ID
    nowSwitchId: {
      type: String
    },
    // 当前用户
    localInfo: {
      type: Object
    }
  },
  // mounted () {
  //   // 表情
  //   this.obj = new window.Face({
  //     el: document.querySelector('.el-icon-s-opportunity'),
  //     callBack: face => {
  //       this.textArea += `〖${face.title}〗`
  //       document.querySelector('.face-warp').style.display = 'none'
  //     }
  //   })
  // },
  methods: {
    /**
     * 消息类型
     */
    nowSwitchType () {
      if (this.nowSwitchId === 'group') {
        return 'group-message'
      } else if (this.nowSwitchId === 'robots') {
        return 'robots-message'
      } else {
        return 'user-message'
      }
    },

    /**
     * 消息过滤
     */
    textAreaTran () {
      return this.textArea.replace(/\n/g, '').replace(new RegExp('<', 'gm'), '&lt')
    },

    /**
     * 检测空白
     */
    blankTesting () {
      if (this.textArea.replace(/\s+/g, '') === '') {
        this.$alert('不能发送空白消息', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      return true
    },

    /**
     * 按Enter发送消息
     */
    keyUp (event) {
      if (event.key === 'Enter') {
        this.sendMessage()
      }
    },

    /**
     * 发送消息
     */
    // sendMessage () {
    //   let message = {
    //     // 类型
    //     type: this.nowSwitchType(),
    //     // 发送者ID
    //     id: this.localInfo.id,
    //     body: {
    //       // 消息类型
    //       type: 'user-message',
    //       // 收者ID
    //       gotoId: this.nowSwitchId,
    //       // 发送者ID
    //       fromId: this.localInfo.id,
    //       // 发送者头像
    //       avatar: this.localInfo.avatar,
    //       // 发送者昵称
    //       nickName: this.localInfo.nickName,
    //       message: {
    //         // 发送时间
    //         time: +new Date(),
    //         // 内容带标签
    //         content: this.obj.replaceFace(this.textAreaTran()),
    //         // 纯内容不带标签
    //         textContent: this.textAreaTran()
    //       }
    //     }
    //   }
    //   if (this.blankTesting()) {
    //     // 发送服务器
    //     this.$socket.emit('MESSAGE', message)
    //     // 传递至同级
    //     Bus.$emit('MESSAGE', message)
    //     // 消息清空
    //     this.textArea = ''
    //     // 消息置底
    //     this.gotoBottom()
    //   }
    // }
    sendMessage() {
      Socket.send(
        //...一些後端要求要傳的資料request，通常會是一包物件{}。
      );
    },
  }
}
</script>

<style lang="scss" >
.message-input-box {
  height: 130px;
  background-color: rgba(255, 255, 255, .85);
  border-top: 1px solid #dddddd;
  .input-tools {
    position: relative;
    padding: 10px 0 10px 18px;
    .upload-demo {
      display: inline;
    }
    .other-btn{
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
    width: 94%;
    height: 65px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    background-color: #F4F4F4;
    .el-textarea {
      .el-textarea__inner {
        padding: 5px 20px;
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
