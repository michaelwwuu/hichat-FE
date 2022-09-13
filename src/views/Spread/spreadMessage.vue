<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <el-header height="70px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">私讯广播</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="setting-title">私讯广播发送对象</div>
          <label class="el-checkbox">
            <span class="el-checkbox__label">
              <div
                class="address-box"
                v-for="(item, index) in spreadDataList"
                :key="index"
              >
                <el-image :src="item.icon" />
                <div class="msg-box">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </span>
          </label>
        </div>
        <div class="message-input-box">
          <div class="input-tools-right">
            <div>
              <img
                src="./../../../static/images/image.png"
                alt=""
                @click="uploadImgShow = true"
              />
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
            >
            </el-input>
            <div class="footer-tools" @touchmove="$root.handleTouch">
              <div class="face-other-btn" @click.stop="showDialog = !showDialog">
                <img v-if="!showDialog" src="./../../../static/images/emoji.png" alt="" />
                <img v-else src="./../../../static/images/keyboard.svg" alt="" />
              </div> 
              <div class="face-icon" v-show="showDialog">
                <VEmojiPicker :showSearch="false" :showCategories="false" :emojisByRow="10" @select="selectEmoji"/>
              </div>              
            </div>
          </div>

          <div class="input-tools-left">
            <div v-if="textArea === ''" style="visibility: hidden">
              <img src="./../../../static/images/audio.png" alt="" />
            </div>
            <div v-else @click="sendMessage()">
              <img src="./../../../static/images/send.png" alt="" />
            </div>
          </div>
          <el-dialog
            title="上传图片"
            :before-close="closeModel"
            :visible.sync="uploadImgShow"
            width="100%"
            :modal-append-to-body="false"
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
              :on-remove="handleRemove"
              :auto-upload="false"
              :file-list="fileList"
              list-type="picture"
              :limit="1"              
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
            <span slot="footer" class="dialog-footer">
              <template v-if="device === 'moblie'">
                <el-button type="success" @click="submitAvatar()"
                  >确认</el-button
                >
                <el-button @click="closeModel()">取消</el-button>
              </template>
              <template v-else>
                <el-button
                  class="background-gray"
                  @click="closeModel()"
                  >取消</el-button
                >
                <el-button class="background-orange" @click="submitAvatar()"
                  >确认</el-button
                >
              </template>
            </span>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import { VEmojiPicker } from 'v-emoji-picker'
import { getToken } from "_util/utils.js";
import { Encrypt } from "@/utils/AESUtils.js";
import { uploadMessageImage } from '@/api/uploadController'

export default {
  name: "spreadMessage",
  data() {
    return {
      search: "",
      textArea: "",
      disabled:false,
      showDialog: false,
      uploadImgShow: false,
      fullscreenLoading: false,
      fileList: [],
      spreadDataList: [],
      device: localStorage.getItem("device"),

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
    };
  },
  created() {
    this.getSpreadDataList();
  },
  mounted() {
    document.addEventListener("click", (e)=>{
      if(e.target.className !== "emoji border"){
        this.showDialog = false
      }
    })
  },
  methods: {
    selectEmoji(emoji) {// 选择emoji后调用的函数
      this.textArea += emoji.data
    },        
    getSpreadDataList() {
      this.spreadDataList = this.$route.params.spreadData;
    },
    back() {
      this.$router.back(-1);
    },
    // 取得圖片
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    closeModel(){
      this.fileList = [];
      this.copyPicture = false   
      this.uploadImgShow = false;
      this.fullscreenLoading = false;
    },    
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },    
    submitAvatar() {
      this.fileList.forEach((data)=>{
        this.submitAvatarUpload(data.raw)
      })
    },        
    submitAvatarUpload(data) {
      let formData = new FormData();
      formData.append("file", data);
      this.fullscreenLoading = true;
      uploadMessageImage(formData).then((res) => {
        if (res.code === 200) {
          this.spreadDataList.forEach((res) => {
            let uploadImgData = {
              chatType: "CLI_USER_IMAGE",
              id: Math.random(),
              tokenType: 0,
              fromChatId: "u" + localStorage.getItem("id"),
              toChatId: "u" + res.contactId,
              text: Encrypt(res.data, this.aesKey, this.aesIv), //TODO 加密
              token: getToken("token"),
              deviceId: localStorage.getItem("UUID"),
            };
            Socket.send(uploadImgData);
          });
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
          this.$message({ message: "发送讯息成功", type: "success" });
          this.disabled = true
          setTimeout(() => {
            this.$router.push({ path: "/HiChat" });
          }, 1500);
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
        }
      });
    },
    sendMessage() {
      if (this.textArea.replace(/\s+/g, "") === "") {
        this.$message({ message: "不能发送空白消息", type: "error" });
        this.textArea = "";
        return false;
      }      
      this.spreadDataList.forEach((res) => {
        let message = {
          chatType: "CLI_USER_SEND",
          id: Math.random(),
          tokenType: 0,
          toChatId: "u" + res.contactId,
          replyHistoryId: "",
          targetArray: [],
          text: Encrypt(
            this.textArea.replace(/(\s*$)/g, ""),
            this.aesKey,
            this.aesIv
          ), //TODO 加密
          token: getToken("token"),
          deviceId: localStorage.getItem("UUID"),
        };
        Socket.send(message);
      });
      this.$message({ message: "发送讯息成功", type: "success" });
      this.disabled = true
      setTimeout(() => {
        this.$router.push({ path: "/HiChat" });
      }, 1500);
      // 消息清空
      this.textArea = "";
    },
  },
  components: {
    VEmojiPicker
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.svg");
      cursor: pointer;
    }
  }
  .home-content {
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
    }
    /deep/.el-checkbox {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      width: 100vw;
      .el-checkbox__input {
        padding-right: 20px;
        .el-checkbox__inner {
          border-radius: 10px;
        }
      }
      .el-checkbox__label {
        width: 100%;
        padding-left: 0;
        .address-box {
          .msg-box {
            span {
              display: block;
              padding-left: 1em;
              font-size: 16px;
              color: #666666;
              &::after {
                content: "";
                display: block;
                position: absolute;
                margin-top: 0.65em;
                width: 100%;
                border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
              }
            }
          }
          .checkBox {
            position: absolute;
            right: 1.5em;
            font-size: 14px;
          }
        }
      }
    }
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
/deep/.message-input-box {
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
    width: 260px;
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
</style>
