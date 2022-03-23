<template>
  <div
    class="message-input-box"
    :style="device !== 'moblie' ? 'height:59px' : ''"
  >
    <template v-if="device === 'moblie'">
      <div class="input-tools-right">
        <div>
          <!-- <img src="./../../static/images/plus.png" alt=""> -->
          <img
            src="./../../static/images/image.png"
            alt=""
            @click="uploadImgShow = true"
          />
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
          maxlength="500"
          @keyup.native="callout"
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
        <div v-if="textArea === ''" @click="sendAduio">
          <img src="./../../static/images/audio.png" alt="" />
        </div>
        <div v-else @click="editMsg.innerText === '' ? sendMessage() : editMessage()">
          <img src="./../../static/images/send.png" alt="" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-send-box">
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 1, maxRows: 1 }"
          placeholder="Aa"
          v-model="textArea"
          maxlength="500"
          @keyup.native="keyUp"
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
                <img src="./../../static/images/pc/smile.png" alt="" />
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
    </template>
    <div
      class="callout-message"
      v-show="calloutShow && searchContactData.length > 0"
    >
      <ul>
        <li
          v-for="(item, index) in searchContactData"
          :key="index"
          @click="checkCallout(item)"
        >
          <el-avatar shape="square" size="small" :src="item.icon"></el-avatar>
          <div class="callout-message-box">
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog
      title="上传图片"
      :visible.sync="uploadImgShow"
      :append-to-body="device !== 'pc'"
      :class="{ 'el-dialog-loginOut': device === 'pc' }"
      width="100%"
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
        <el-button type="primary"
          >点击上传</el-button
        >
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
      title="录音"
      :visible.sync="sendAduioShow"
      width="100%"
      append-to-body
      :before-close="closeAduioShow"
      center
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="录音上传中"          
    >
      <div class="record-play">
        <div class="record-time">
          {{ one }}<span>:</span>{{ two }}<span>:</span>{{ three }}
        </div>
        <div id="audioVoice-box"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disabledPlay" @click="onStartVoice"
          >开始录音</el-button
        >
        <el-button type="info" :disabled="endDisabledPlay" @click="onEndVoice"
          >結束录音</el-button
        >
        <el-button
          type="danger"
          :disabled="uploadDisabledPlay"
          @click="onAudioFile"
          >上传录音</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="照相"
      :visible.sync="takePictureShow"
      width="100%"
      class="el-dialog-takePicture"
      center
    >
      <Photo
        :chatType="'CLI_GROUP_IMAGE'"
        v-on:closePictureShow="pictureShow"
      ></Photo>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import EmojiPicker from "vue-emoji-picker";

import Record from "./../../static/js/record-sdk";
import Photo from "./Photo.vue";
import { mapState, mapMutations } from "vuex";
import { uploadMessageImage, uploadMessageFile } from "@/api";

export default {
  name: "MessageInput",
  data() {
    return {
      textArea: "",
      search: "",
      calloutShow: false,
      sendAduioShow: false,
      uploadImgShow: false,
      takePictureShow: false,
      fullscreenLoading:false,      
      checkName: [],
      fileList: [],
      targetArray: [],
      searchContactData: [],
      device: localStorage.getItem("device"),
      //錄音
      isVoice: false,
      isFinished: false,
      disabledPlay: false,
      endDisabledPlay: true,
      uploadDisabledPlay: true,
      audio: "",
      recorder: new Record(),
      audioMessageData: {},

      //計時
      flag: null,
      one: "00", // 時
      two: "00", // 分
      three: "00", // 秒
      abc: 0, // 秒的計數
      cde: 0, // 分的計數
      efg: 0, // 時的計數
    };
  },
  props: {
    // 当前用户
    userInfoData: {
      type: Object,
    },
    // 当前用户
    groupData: {
      type: Object,
    },
  },
  computed: {
    ...mapState({
      replyMsg: (state) => state.ws.replyMsg,
      editMsg: (state) => state.ws.editMsg,
      contactListData: (state) => state.ws.contactListData,
    }),
  },
  watch: {
    textArea: {
      immediate: true,
      handler(val) {
        if(val === '') this.calloutShow = false;
        let textAreaSearchData = val.split(" ");
        textAreaSearchData.forEach((el) => {
          this.searchContactData = this.contactListData.filter((item) => {
            return item.name.indexOf(el.replace("@", "")) !== -1;
          });
        });
      },
    },
    editMsg(val) {
      this.textArea = val.innerText;
    },
  },
  methods: {
    ...mapMutations({
      setEditMsg:"ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
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
          let message = this.userInfoData;
          message.chatType = "CLI_GROUP_IMAGE";
          message.id = Math.random();
          message.fromChatId = "u" + localStorage.getItem("id");
          message.toChatId = "g" + this.groupData.groupId;
          message.text = res.data;
          Socket.send(message);
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;          
        }
      });
    },

    // 開始計時
    startHandler() {
      this.resetTime();
      this.flag = setInterval(() => {
        if (this.three === 60 || this.three === "60") {
          this.three = "00";
          this.abc = 0;
          if (this.two === 60 || this.two === "60") {
            this.two = "00";
            this.cde = 0;
            if (this.efg + 1) {
              this.efg++;
              this.one = "0" + this.efg;
            } else {
              this.efg++;
              this.one = this.efg;
            }
          } else {
            if (this.cde + 1 <= 9) {
              this.cde++;
              this.two = "0" + this.cde;
            } else {
              this.cde++;
              this.two = this.cde;
            }
          }
        } else {
          if (this.abc + 1 <= 9) {
            this.abc++;
            this.three = "0" + this.abc;
          } else {
            this.abc++;
            this.three = this.abc;
          }
        }
      }, 1000);
    },
    // 暫停計時
    endHandler() {
      this.flag = clearInterval(this.flag);
    },
    // 重置秒數
    resetTime() {
      this.one = "00"; // 時
      this.two = "00"; // 分
      this.three = "00"; // 秒
      this.abc = 0; // 秒的計數
      this.cde = 0; // 分的計數
      this.efg = 0; // 時的計數
    },

    // 開啟錄音
    sendAduio() {
      this.resetTime();
      this.endHandler();
      this.onStopAudio();
      this.isFinished = false;
      this.sendAduioShow = true;

      //初始化按鈕
      this.disabledPlay = false;
      this.endDisabledPlay = true;
      this.uploadDisabledPlay = true;
    },
    // 开始录音
    onStartVoice() {
      this.onStopAudio();
      this.disabledPlay = true;
      this.uploadDisabledPlay = true;
      // this.isFinished = false;
      this.recorder.startRecord({
        success: (res) => {
          this.isVoice = true;
          this.endDisabledPlay = false;
        },
        error: (e) => {
          this.resetTime();
          this.endHandler();
          this.isVoice = false;
          this.disabledPlay = false;
          this.sendAduioShow = false;
          this.endDisabledPlay = true;
          this.$message({ message: e, type: "warning" });
        },
      });
      this.$nextTick(() => setTimeout(() => this.startHandler(), 1000));
    },
    // 结束录音
    onEndVoice() {
      this.isFinished = true;
      this.disabledPlay = false;
      this.endDisabledPlay = true;
      this.uploadDisabledPlay = false;
      this.endHandler();
      this.recorder.stopRecord({
        success: (res) => {
          this.isVoice = false;
          //此处可以获取音频源文件(res)，用于上传等操作
          this.audio = document.getElementById("audioVoice-box");
          this.recorder.play(this.audio);
          // console.log("音频源文件", res);
          this.audioMessageData = res;
        },
        error: (e) => {
          this.isVoice = false;
        },
      });
    },
    // 停止播放录音
    onStopAudio() {
      if (document.getElementById("audioVoice") !== null)
        this.recorder.clear(this.audio);
    },

    // 關閉錄音
    closeAduioShow() {
      this.sendAduioShow = false;
      this.audioMessageData = {};
    },

    // 上傳錄音
    onAudioFile() {
      let formData = new FormData();
      formData.append("file", this.audioMessageData, `${Date.now()}.mp3`);
      formData.append("type", "AUDIO");
      this.fullscreenLoading = true;      
      uploadMessageFile(formData).then((res) => {
        if (res.code === 200) {
          let message = this.userInfoData;
          message.chatType = "CLI_GROUP_AUDIO";
          message.id = Math.random();
          message.fromChatId = "u" + localStorage.getItem("id");
          message.toChatId = "g" + this.groupData.groupId,
          message.text = res.data;
          Socket.send(message);
          this.sendAduioShow = false;
          this.fullscreenLoading = false;          
          this.audioMessageData = {};
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

    // 检测空白
    blankTesting() {
      if (this.textArea.replace(/\s+/g, "") === "") {
        this.$alert("不能发送空白消息", "提示", {
          confirmButtonText: "确定",
          customClass: "winClass", //弹窗样式
        });
        return false;
      }
      return true;
    },

    callout() {
      this.textArea.split(" ").forEach((res)=>{
        if(res.startsWith('@')){
          this.calloutShow = true;
        } else{
          this.calloutShow = false;
        }
      })
    },

    keyUp(event) {
      this.textArea.split(" ").forEach((res)=>{
        if(res.startsWith('@')){
          this.calloutShow = true;
        } else {
          this.calloutShow = false;
        }
      })
      if (event.shiftKey && event.keyCode === 13) {
        return this.textArea;
      } else if (event.key === "Enter") {
        if (
          this.replyMsg.clickType === "replyMsg" ||
          this.replyMsg.clickType === ""
        ) {
          this.sendMessage();
        } else {
          this.editMessage();
        }
      }
    },

    checkCallout(data) {
      this.calloutShow = false;
      this.targetArray.push("u" + data.memberId);
      this.textArea = this.textArea + data.username;
    },

    closeReplyMessage() {
      this.setReplyMsg({
        name:"",
        icon:"",
        chatType:"",
        clickType:"",
        innerText:"",
        replyHistoryId:"",
      });
      this.setEditMsg({ innerText:""});
    },
    // 发送消息
    sendMessage() {
      let message = {
        chatType: "CLI_GROUP_SEND",
        id: Math.random(),
        toChatId: this.groupData.toChatId,
        replyHistoryId:
          this.replyMsg.replyHistoryId !== ""
            ? this.replyMsg.replyHistoryId
            : "",
        targetArray: this.targetArray,
        text: this.textArea.replace(/(\s*$)/g, ""),
        deviceId: localStorage.getItem("UUID"),
        token: localStorage.getItem("token"),
        tokenType: 0,
      };
      if (this.blankTesting()) {
        // 发送服务器
        Socket.send(message);
        this.closeReplyMessage();
        // 消息清空
        this.targetArray = [];
        this.checkName = [];
        this.textArea = "";
      }
    },
    editMessage() {
      let editMessage = {
        chatType: "CLI_CHAT_EDIT",
        id: Math.random(),
        tokenType: 0,
        fromChatId: this.groupData.lastChat.fromChatId,
        targetId: this.replyMsg.replyHistoryId,
        text: this.textArea.replace(/(\s*$)/g, ""),
        toChatId: this.groupData.lastChat.toChatId,
        deviceId: localStorage.getItem("UUID"),
        token: localStorage.getItem("token"),
      };
      if (this.blankTesting()) {
        // 发送服务器
        Socket.send(editMessage);
        this.closeReplyMessage();
        // 消息清空
        this.textArea = "";
      }
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
  border-top: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .input-tools-left,
  .input-tools-right {
    padding: 15px 0;
    img {
      height: 1.1em;
    }
  }
  .text-send-box {
    width: 83vw;
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
          padding: 15px;
          .face-box {
            font-size: 1.6em;
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
  width: 90%;
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
.hichat-moblie {
  .callout-message {
    bottom: 55px;
    overflow: scroll;
    ul {
      li {
        .callout-message-box {
          span {
            line-height: 20px;
            color: #363636;
            word-wrap: break-word;
          }
        }
      }
    }
  }
}
.callout-message {
  background-color: rgba(225, 225, 225, 0.95);
  border-top: 1px solid #dddddd;
  color: #959393;
  position: absolute;
  left: 0;
  bottom: 60px;
  width: 100%;
  ul {
    max-height: 200px;
    overflow-x: none;
    overflow-y: auto;
    li {
      display: flex;
      padding: 11px 8px;
      cursor: pointer;
      .el-avatar {
        overflow: initial;
        img {
          border-radius: 4px;
          width: -webkit-fill-available;
        }
      }
      &:hover {
        background: #ecf5ff;
      }
      .callout-message-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        span {
          line-height: 20px;
          color: #363636;
          word-wrap: break-word;
        }
        .replyMsg-Img {
          img {
            height: 2em;
            border-radius: 5px;
          }
        }
      }
    }
  }

  .reply-close-btn {
    position: absolute;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
  }
  /deep/.el-avatar {
    overflow: initial;
    img {
      border-radius: 4px;
      width: -webkit-fill-available;
    }
  }
}
</style>
