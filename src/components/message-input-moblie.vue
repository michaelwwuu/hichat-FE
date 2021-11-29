<template>
  <div class="message-input-box">
    <div class="input-tools-right">
      <div>
        <!-- <img src="./../../static/images/plus.png" alt=""> -->
        <img src="./../../static/images/image.png" alt="" @click="uploadImgShow = true"> 
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
    <div class="input-tools-left">
      <div v-if="textArea === ''" @click="sendAduio">
        <img src="./../../static/images/audio.png" alt="">
      </div>
      <div v-else  @click="sendMessage">
        <img src="./../../static/images/send.png" alt="">
      </div>
    </div>
    <el-dialog
      :title="tipMsg"
      :visible.sync="sendAduioShow"
      width="90%"
      class="audio-box"
      append-to-body
      :before-close="closeAduioShow"
      center>
      <div class="record-play">
        <audio id="audioVoice" controls class="record-play-box"></audio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onStartVoice">开始录音</el-button>
        <!-- <el-button type="danger" @click="onPlayAudio">播放录音</el-button> -->
        <el-button type="info" @click="onEndVoice">結束录音</el-button>
        <el-button type="danger" @click="onAudioFile">上傳錄音</el-button>
      </span>
    </el-dialog>    
    <el-dialog
      title="上傳圖片"
      :visible.sync="uploadImgShow"
      append-to-body
      class="upload-box"
      width="80%"
      center>
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="uploadImg"     
        :auto-upload="false"
        :file-list="fileList"
        list-type="picture">
        <el-button size="small" type="primary" >点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传 jpg / png 圖片，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitAvatarUpload">确 定</el-button>
        <el-button @click="uploadImgShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import EmojiPicker from "vue-emoji-picker";

import Record from './../../static/js/record-sdk';
import { uploadMessageImage,uploadMessageFile } from "@/api";

export default {
  name: "MessageInput",
  data() {
    return {
      textArea: "",
      search: "",
      sendAduioShow:false,
      uploadImgShow:false,
      formData:new FormData(),
      fileList:[],
      //錄音
      isVoice: false,
      // isFinished: false,
      tipMsg: '录音',
      audio: "",
      recorder: new Record(),
      audioMessageData:{},
    };
  },
  props: {
    // 当前用户
    userInfoData: {
      type: Object,
    },
    // 当前用户
    userData: {
      type: Object,
    },
  },
  methods: {
    uploadImg(file, fileList) {
      this.fileList = fileList
		},
    submitAvatarUpload(){
      this.formData.append('file',this.fileList[0].raw);
      uploadMessageImage(this.formData).then((res)=>{
        if(res.code === 200) {
          let message = this.userInfoData;
          message.chatType = "CLI_USER_IMAGE"
          message.id = Math.random();
          message.fromChatId = localStorage.getItem("fromChatId");
          message.toChatId = this.userData.toChatId;
          message.text = res.data;
          Socket.send(message);
          this.fileList =[]
          this.uploadImgShow = false
        }
      })
    },
    // 關閉錄音
    closeAduioShow(){
      this.sendAduioShow = false
      this.audioMessageData = {}
    },
    // 上傳錄音
    onAudioFile(){
      this.formData.append('file',this.audioMessageData);
      this.formData.append('type','AUDIO');
      uploadMessageFile(this.formData).then((res)=>{
        if(res.code === 200) {
          console.log(res)
        }
      })
    },
    sendAduio(){
      // this.isFinished = false
      this.sendAduioShow = true
    },
    // 开始录音
    onStartVoice () {
      this.onStopAudio()
      // this.isFinished = false;
      this.recorder.startRecord({
        success: res => {
          this.isVoice = true
        },
        error: e => {
          this.isVoice = false
          this.$message({
            message: e,
            type: 'warning'
          });
        }
      });
    },

    // 结束录音
    onEndVoice () {
      // this.isFinished = false;
      this.recorder.stopRecord({
        success: res => {
          this.isVoice = false
          //此处可以获取音频源文件(res)，用于上传等操作
          this.audio = document.getElementById("audioVoice");
          this.recorder.play(this.audio);
          console.log('音频源文件', res)
          this.audioMessageData = res
        },
        error: e => {
          this.isVoice = false
        }
      });
    },

     // 播放录音
    onPlayAudio () {
      this.isVoice = false
      // this.isFinished = true;
      this.audio = document.getElementById("audioVoice");
      console.log(this.audio)
      this.recorder.play(this.audio);
    },
    
    // 停止播放录音
    onStopAudio () {
      if(this.audio !== '') this.recorder.clear(this.audio);
    },


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
      message.fromChatId = localStorage.getItem("fromChatId");
      message.toChatId = this.userData.toChatId;
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
.audio-box{
  position: absolute;
  top: 5em;
  .el-dialog{
    border-radius: 10px;
    .el-dialog__body{
      .record-play{
        .record-play-box{
          width: 100%;
        }
      }
    }
  }
}
.upload-box{
  .el-dialog{
    border-radius: 10px;
    .el-dialog__body{
      .upload-demo{
        .el-upload-list{
          .el-upload-list__item{
            margin-top: -72px;
          }
        }
      }
    }
  }
}
</style>
