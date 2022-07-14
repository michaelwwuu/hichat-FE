<template>
  <div
    class="message-input-box"
    style="height:59px"
  >
    <div class="input-tools-right">
      <div>
        <el-button type="danger" @click="sendMessage">发送广播</el-button>
      </div>
    </div>  
    <div class="text-send-box">   
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 1, maxRows: 1 }"
        placeholder="Aa"
        maxlength="500"
        :disabled="disabled"
        v-model="textArea"
        @keyup.native="keyUp"
      >
      </el-input>
      <div class="footer-tools" @touchmove="$root.handleTouch">
        <emoji-picker @emoji="insert" :search="search">
          <div
            slot="emoji-invoker"
            slot-scope="{ events: { click: clickEvent } }"
            @click.stop="clickEvent"
          >
            <div class="face-other-btn">
              <img src="./../../static/images/emoji.png" alt="" />
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

    <div class="input-tools-left">
      <div>
        <img
          src="./../../static/images/image.png"
          alt=""
          @click="uploadImgShow = true"
        />
        <img
          src="./../../static/images/camera.png"
          alt=""
          @click="takePictureShow = true"
        />
      </div>
    </div>
    <el-dialog
      title="上传图片"
      :visible.sync="uploadImgShow"
      width="100%"
      :append-to-body="device !== 'pc'"
      :close-on-click-modal="false"
      :class="{ 'el-dialog-loginOut': device === 'pc' }"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="圖片上传中"
      center
    >
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="uploadImg"
        :auto-upload="false"
        :file-list="fileList"
        list-type="picture"
      >
        <el-button type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传 jpg / png 图片，且不超过500kb
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <template v-if="device === 'moblie'">
          <el-button type="success" @click="submitAvatarUpload">确认</el-button>
          <el-button @click="uploadImgShow = false">取消</el-button>
        </template>
        <template v-else>
          <el-button class="background-gray" @click="uploadImgShow = false"
            >取消</el-button
          >
          <el-button class="background-orange" @click="submitAvatarUpload"
            >确认</el-button
          >
        </template>
      </span>
    </el-dialog>    
    <el-dialog
      title="照相"
      :visible.sync="takePictureShow"
      width="100%"
      class="el-dialog-takePicture"
      center
      :close-on-click-modal="false"
    >
      <Photo
        :chatType="'CLI_USER_IMAGE'"
        v-on:closePictureShow="pictureShow"
      ></Photo>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import EmojiPicker from "vue-emoji-picker";

import Photo from "./Photo.vue";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import { uploadMessageImage } from "@/api";
import { Encrypt } from "@/utils/AESUtils.js";

export default {
  name: "MessageSpreadInput",
  data() {
    return {
      search: "",
      textArea: "",
      disabled:false,
      sendAduioShow: false,
      uploadImgShow: false,
      takePictureShow: false,
      fullscreenLoading: false,
      fileList: [],
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  computed: {
    ...mapState({
      chatUser: (state) => state.ws.chatUser,
      spreadDataList: (state) => state.ws.spreadDataList,
    }),
  },
  methods: {
    ...mapMutations({
      setSpreadDataList:"ws/setSpreadDataList",
    }),        
    pictureShow(val) {
      this.takePictureShow = val;
    },
    // 取得圖片
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    // 上傳圖片
    submitAvatarUpload() {
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      this.fullscreenLoading = true;
      uploadMessageImage(formData).then((res) => {
        if (res.code === 200) {
          if(this.spreadDataList.length === 0) {
            this.$message({ message: "请选择发送对象", type: "error" });
            this.textArea = this.textArea.replace(/(\s*$)/g, "")
            return false
          }
          this.spreadDataList.forEach((res)=>{
            let uploadImgData = {
              chatType: "CLI_USER_IMAGE",
              id: Math.random(),
              tokenType: 0,
              fromChatId:"u" + localStorage.getItem("id"),
              toChatId: "u" + res.contactId,
              text: Encrypt(
                res.data,
                this.aesKey,
                this.aesIv
              ),//TODO 加密
              token: getToken("token"),
              deviceId: localStorage.getItem("UUID"),
            }
            Socket.send(uploadImgData);

          })
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
          this.$message({ message: "发送讯息成功", type: "success" });
          this.getChatHistoryMessage()
          this.disabled = true
          setTimeout(() => {
            this.setSpreadDataList([])
            this.$router.push({ path: "/HiChat" });
          }, 1000);
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
        }
      });
    },

    // 表情符号转简中
    emojiChine(category) {
      if (category === "Frequently used") return "经常使用";
      if (category === "People") return "笑脸与人物";
      if (category === "Nature") return "动物与大自然";
      if (category === "Objects") return "活动与美食";
      if (category === "Places") return "旅游与地标";
      if (category === "Symbols") return "符号";
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
    // 按Enter发送消息
    keyUp(event) {
      if (event.shiftKey && event.keyCode === 13) {
        return this.textArea;
      } else if (event.key === "Enter") {
        if (this.textArea.replace(/\s+/g, "") === "") {
          this.$alert("不能发送空白消息", "提示", {
            confirmButtonText: "确定",
          }).then(() => {
            this.textArea = "";
          });
          event.target.blur();
          return false;
        } else {
          this.sendMessage();
        }
      }
    },
    // 发送消息
    sendMessage() {
      if(this.spreadDataList.length === 0) {
        this.$message({ message: "请选择发送对象", type: "error" });
        this.textArea = this.textArea.replace(/(\s*$)/g, "")
        return false
      }else if (this.textArea.replace(/\s+/g, "") === "") {
        this.$alert("不能发送空白消息", "提示", {
          confirmButtonText: "确定",
        }).then(() => {
          this.textArea = "";
        });
        return false;
      }
      this.spreadDataList.forEach((res)=>{
        let message = {
          chatType: "CLI_USER_SEND",
          id: Math.random(),
          tokenType: 0,
          toChatId: "u" + res.contactId,
          replyHistoryId:"",
          targetArray: [],
          text: Encrypt(
            this.textArea.replace(/(\s*$)/g, ""),
            this.aesKey,
            this.aesIv
          ),//TODO 加密
          token: getToken("token"),
          deviceId: localStorage.getItem("UUID"),
        };
        Socket.send(message);
      })
      this.$message({ message: "发送讯息成功", type: "success" });
      this.getChatHistoryMessage()
      this.disabled = true
      setTimeout(() => {
        this.setSpreadDataList([])
        this.$router.push({ path: "/HiChat" });
      }, 1000);
      // 消息清空
      this.textArea = "";
    },
    audioAction(){
      let audioEl = document.getElementById("notify-send-audio")  
      var playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          audioEl.pause();
        })
        .catch(error => {
        });
      }
      audioEl.src= "" // 移除src, 防止之后播放空白音频  
      setTimeout(() => { // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3")
        audioEl.play();
      }, 150);
    },
    // 獲取歷史訊息
    getChatHistoryMessage() {
      let historyMessageData = {
        chatType: "CLI_HISTORY_REQ",
        id: Math.random(),
        tokenType: 0,
        toChatId: this.chatUser.toChatId,
        targetId:"",
        pageSize: 1000,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      Socket.send(historyMessageData);
    },
  },
  components: {
    EmojiPicker,
    Photo,
  },
};
</script>

<style lang="scss" >
.message-input-box {
  height: 55px;
  background-color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  .input-tools-left,
  .input-tools-right {
    padding: 15px 0;
    img {
      height: 1.1em;
    }
  }
  .text-send-box {
    width: 280px;
    height: 35px;
    display: flex;
    align-items: center;
    // margin: 0 auto;
    background-color: #f4f4f4;
    border-radius: 20px;
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
        left: 0;
        background-color: #fff;
        width: 100%;
        border-radius: 15px 15px 0 0;
        box-shadow: 0px 0 7px #ccc;
        height: 20em;
        overflow: auto;
        line-height: 2em;
        .face-icon-box {
          padding: 20px;
          .face-box {
            word-break: break-word;
            margin-bottom: 20px;
            h5 {
              font-weight: 600;
            }
          }
          span {
            cursor: pointer;
            font-size: 1.2em;
            margin-right: 10px;
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

.el-dialog__wrapper {
  overflow: hidden;
  .el-dialog {
    margin: 0 auto;
    border-radius: 20px 20px 0 0;
    position: absolute;
    bottom: 0;
    .el-dialog__header {
      .el-dialog__title {
        color: #10686e;
        font-weight: 600;
      }
      .el-dialog__headerbtn {
        position: inherit;
        float: left;
        .el-dialog__close {
          color: #f60;
        }
      }
    }
    .el-dialog__body {
      text-align: center;
      .qrcode-box {
        width: 15em;
        height: 15em;
        border: 2px solid #333;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 14em;
        }
      }
      .qrcode-box-text {
        color: #0c0d0d;
        font-weight: 600;
        margin-top: 2em;
        display: block;
      }
      .upload-demo {
        line-height: 1.5em;
        .el-upload-list {
          .el-upload-list__item {
            margin-top: -72px;
          }
        }
        .hidden {
          visibility: hidden;
        }
      }
      .record-play {
        .record-play-box {
          margin-top: 1em;
          width: 100%;
        }
        .record-time {
          width: 100%;
          text-align: center;
          font-size: 2em;
          font-family: monospace;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px 30px 20px 30px;
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        .el-button {
          width: 90%;
        }
        img {
          height: 1em;
        }
      }
    }
  }
}
.winClass {
  width: 300px;
}
.hichat-pc {
  .el-dialog__wrapper.el-dialog-takePicture {
    .el-dialog {
      width: 880px !important;
      margin-top: 3em !important;
      .el-dialog__footer {
        padding: 0 !important;
        .el-button {
          padding: 20px !important;
          border-radius: 0 !important;

          &:nth-child(2) {
            border-left: 1px solid #efefef;
          }
        }
      }
    }
  }
}
</style>
