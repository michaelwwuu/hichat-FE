<template>
  <div class="message-input-box">
    <div class="input-tools-right">
      <div>
        <!-- <img src="./../../static/images/plus.png" alt=""> -->
        <img src="./../../static/images/image.png" alt="">
        <!-- <img src="./../../static/images/camera.png" alt=""> -->
      </div>
    </div>
    <div class="text-send-box">
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 1, maxRows: 1 }"
        placeholder="Aa"
        v-model="textArea"
        v-on:keyup.native="keyUp"
      >
      </el-input>
      <div class="footer-tools">
        <emoji-picker @emoji="insert" :search="search">
          <div
            slot="emoji-invoker"
            slot-scope="{ events: { click: clickEvent } }"
            @click.stop="clickEvent"
          >
            <div class="face-other-btn">
              <img
                src="./../../static/images/emoji.png"
                alt=""
              />
            </div>
          </div>
          <div
            slot="emoji-picker"
            slot-scope="{ emojis, insert }"
            class="face-icon"
          >
            <div class="face-icon-box">
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
    </div>
    <div class="input-tools-left" @click="sendMessage">
      <div v-if="textArea === ''">
        <img src="./../../static/images/audio.png" alt="">
      </div>
      <div v-else>
        <img src="./../../static/images/send.png" alt="">
      </div>
    </div>
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
    };
  },
  props: {
    // 当前用户
    userInfoData: {
      type: Object,
    },
  },
  watch:{
    textArea(val){
      console.log(val)
    }
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

    // 发送消息
    sendMessage() {
      let message = this.userInfoData;
      message.chatType = "CLI_USER_SEND"
      message.id = Math.random();
      message.text = this.textAreaTran();
      console.log(message)
      if (this.blankTesting()) {
        // 发送服务器
        // Socket.send(message);
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
  height: 55px;
  background-color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .input-tools-right {
    padding: 15px 0 ;
    display: flex;
    align-items: center;
    margin: 0 auto;
    position: relative;
    left: 7px;
    img{
      height: 1.1em;
      margin-right:10px;
    }
  }
  .input-tools-left {
    padding: 15px 0 ;
    display: flex;
    align-items: center;
    margin: 0 auto;
    position: relative;
    left: 3px;
    img{
      height: 1.1em;
      margin-right:10px;
    }
  }
  .text-send-box {
    width: 20em;
    height: 35px;
    display: flex;
    align-items: center;
    // margin: 0 auto;
    background-color: #f4f4f4;
    border-radius:20px;
    .el-textarea {
      .el-textarea__inner {
        padding: 10px !important;
        border-radius: 0;
        border: 0;
        background-color: transparent;
      }
    }
    .footer-tools {
      // text-align: right;
      .face-other-btn {
        margin-right: 10px;
        img {
          height: 1.2em;
        }
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
      .face-icon {
        position: absolute;
        bottom: 57px;
        left:0;
        background-color: #fff;
        width: 100%;
        border-radius: 15px 15px 0 0; 
        box-shadow: 0px 0 7px #ccc;
        height: 20em;
        overflow: auto;
        line-height: 30px;
        .face-icon-box{
          padding: 10px;
          .face-box {
            font-size: 16px;
            word-break: break-word;
            h5 {
              font-weight: 600;
            }
          }
          span {
            cursor: pointer;
            font-size: 14px;
            margin-right: 5px;
          }
        }

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
