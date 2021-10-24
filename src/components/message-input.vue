<template>
  <div class="message-input-box">
    <div class="input-tools">
      <el-button class="other-btn" size="mini" round @click="redEnvelopeShow = true"
        ><img src="./../../static/images/red-btn.svg" alt="" />
        发红包</el-button
      >
      <emoji-picker @emoji="insert" :search="search">
        <div
          slot="emoji-invoker"
          slot-scope="{ events: { click: clickEvent } }"
          @click.stop="clickEvent"
        >
          <el-button class="face-other-btn" size="mini" round
            ><img
              src="./../../static/images/face-btn.svg"
              alt=""
            />表情</el-button
          >
        </div>
        <div
          slot="emoji-picker"
          slot-scope="{ emojis, insert }"
          class="face-icon"
        >
          <div>
            <div>
              <div
                v-for="(emojiGroup, category) in emojis"
                :key="category"
                class="face-box"
              >
                <h5>{{ emojiChine(category) }}</h5>
                <div>
                  <span
                    v-for="(emoji, emojiName) in emojiGroup"
                    :key="emojiName"
                    @click="insert(emoji)"
                    >{{ emoji }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </emoji-picker>
    </div>
    <div class="text-send-box">
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 2.5, maxRows: 2.5 }"
        v-model="textArea"
        v-on:keyup.native="keyUp"
      >
      </el-input>

      <div class="footer-tools">
        <el-button size="mini" class="send-button" @click="sendMessage">
          <img src="./../../static/images/send-btn.svg" alt="" />
          发送
        </el-button>
      </div>
    </div>
    <el-dialog
      title="发红包"
      :visible.sync="redEnvelopeShow"
      class="redEnvelope-box"
      width="30%"
      center
      append-to-body
    >
      <el-dialog
        title="提示"
        :visible.sync="redEnvelopeDialog"
        class="redEnvelope-box"
        width="30%"
        center
        append-to-body>
        <div class="redEnvelope-title" :style="redEnvelopeRadio === 1 ? 'text-align: center' : ''">{{redEnvelopeMsg}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="closeRedEnvelope(redEnvelopeRadio)">确 定</el-button>
        </span>
      </el-dialog>
      <div class="redEnvelope-title">请选择你所要发放的红包，每次发放只会发出一包，一包红包可让 10 位会员索取</div>
      <div class="redEnvelope-style" v-for="(item,index) in redEnvelope" :key="index">
        <el-radio v-model="redEnvelopeRadio" :label="item.redEnvelopeNumber">{{item.redEnvelopeType}}</el-radio>
        <span>数量 : {{item.redEnvelopeNumber}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="redEnvelopeSubmit(redEnvelopeRadio)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import EmojiPicker from "vue-emoji-picker";
export default {
  name: "MessageInput",
  data() {
    return {
      textArea: "",
      search: "",
      redEnvelopeShow:false,
      redEnvelopeDialog:false,
      redEnvelopeRadio:'',
      redEnvelopeMsg:'',
      redEnvelope:[
        {
          redEnvelopeType:'金紅包',
          redEnvelopeNumber:0,
        },
        {
          redEnvelopeType:'银红包',
          redEnvelopeNumber:1,
        }

      ]
    };
  },
  props: {
    // 当前用户
    userInfoData: {
      type: Object,
    },
  },
  methods: {
    // 表情符号转简中
    emojiChine(category) {
      if (category === "Frequently used") return "经常使用";
      if (category === "People") return "笑臉與人物";
      if (category === "Nature") return "動物與大自然";
      if (category === "Objects") return "活動與美食";
      if (category === "Places") return "旅遊與地標";
      if (category === "Symbols") return "符號";
    },

    // 表情符号
    insert(emoji) {
      this.textArea += emoji;
    },

    // 消息过滤
    textAreaTran() {
      return this.textArea
        .replace(/\n/g, "")
        .replace(new RegExp("<", "gm"), "&lt");
    },
    
    // 检测空白
    blankTesting() {
      if (this.textArea.replace(/\s+/g, "") === "") {
        this.$alert("不能发送空白消息", "提示", {
          confirmButtonText: "确定",
        });
        return false;
      }
      return true;
    },

    // 按Enter发送消息
    keyUp(event) {
      if (event.key === "Enter") this.sendMessage();
    },

    // 发送紅包
    redEnvelopeSubmit(redEnvelopeRadio){
      console.log(redEnvelopeRadio)
      this.redEnvelopeDialog = true;
      this.redEnvelopeMsg = redEnvelopeRadio === 0 ? '红发数量不足，请参阅会员中心首页钱包说明，有更多红包获取资讯' : '发放成功！'
    },
    // 发送紅包
    closeRedEnvelope(redEnvelopeRadio){
      this.redEnvelopeDialog = false;
      if(redEnvelopeRadio !== 0) {
        this.redEnvelopeShow = false
        let message = this.userInfoData;
        message.chatType = "CLI_ROOM_RED"
        message.id = Math.random();
        message.text = this.textAreaTran();
        Socket.send(message)
      };
    },
    // 发送消息
    sendMessage() {
      let message = this.userInfoData;
      message.chatType = "CLI_ROOM_SEND"
      message.id = Math.random();
      message.text = this.textAreaTran();
      if (this.blankTesting()) {
        // 发送服务器
        Socket.send(message);
        // 消息清空
        this.textArea = "";
      }
    },
  },
  components: {
    EmojiPicker,
  },
};
</script>

<style lang="scss" >
.message-input-box {
  height: 145px;
  background-color: rgba(255, 255, 255, 0.85);
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
    .face-other-btn {
      color: #ffffff;
      border: 1px solid #87b3f9;
      background-image: linear-gradient(#b4d4ff, #559dff);
      margin-right: 10px;
      span {
        display: flex;
        align-items: center;
        img {
          padding-right: 5px;
        }
      }
    }
    .face-icon {
      position: absolute;
      bottom: 136px;
      background-color: #fff;
      max-width: 65%;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0px 0 7px #ccc;
      padding: 10px;
      height: 20em;
      overflow: auto;
      line-height: 30px;
      .face-box {
        font-size: 18px;
        font-weight: 600;
        margin: 10px 0 15px 0;
        h5 {
          margin-bottom: 10px;
        }
      }
      span {
        cursor: pointer;
        font-size: 20px;
        margin-right: 5px;
      }
    }
  }
  .text-send-box {
    width: 97%;
    height: 73px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    background-color: #f4f4f4;
    .el-textarea {
      .el-textarea__inner {
        padding: 10px !important;
        border-radius: 0;
        border: 0;
        background-color: transparent;
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
.redEnvelope-box{
  .el-dialog__header{
    font-weight: 600;
    border-bottom:0.01em solid #b3b3b3 ;
  }
  .el-dialog__body{
    width:80%;
    margin: 0 auto;
    .redEnvelope-title{
      line-height: 1.5em; 
      font-weight: 700;
    }
    .redEnvelope-style{
      text-align:center;
      margin: 15px 0;
    }
  }
}
</style>
