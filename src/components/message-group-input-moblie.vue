<template>
  <div
    class="message-input-box"
    :style="device !== 'moblie' ? 'height:59px' : ''"
    @touchmove="$root.handleTouch"
  >
 
    <div class="input-tools-right">
      <div>
        <!--TODO 上傳檔案-->
        <!-- <img v-if="authorityGroupSendLink(groupData)" src="./../../static/images/plus.png" alt="" :style="device === 'moblie'?'margin-right: 10px;':'margin-left: 10px; cursor: pointer;'" @click="uploadFileShow = true"> -->
        <template v-if="authorityGroupSendImg(groupData) && device === 'moblie'">
          <img
            src="./../../static/images/image.png"
            alt=""
            @click="uploadImgShow = true"
          />
        </template>
        <!-- <img src="./../../static/images/camera.png" alt=""> -->
      </div>
    </div>
    <div class="text-send-box">
      <div
        class="disable-box"
        v-if="authorityGroupSendMessage(groupData,'disable')"
        @click="disableTouch"
      >
        已禁止發言
      </div>
      <template v-else>
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 1, maxRows: 1 }"
          placeholder="Aa"
          v-model="textArea"
          maxlength="500"
          @keyup.native="device === 'moblie' ? callout() : keyUp($event)"
        >
        </el-input>
        <div class="footer-tools" @touchmove="$root.handleTouch">
          <div class="face-other-btn" @click.stop="showDialog = !showDialog">
            <img
              v-if="!showDialog"
              src="./../../static/images/emoji.png"
              alt=""
            />
            <img v-else src="./../../static/images/keyboard.svg" alt="" />
          </div>
          <div class="face-icon" v-show="showDialog">
            <VEmojiPicker
              :showSearch="false"
              :showCategories="false"
              :emojisByRow="10"
              @select="selectEmoji"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="input-tools-left">
      <template v-if="device === 'moblie'">
        <div
          v-if="textArea === '' && authorityGroupSendImg(groupData)"
          @click="sendAduio"
        >
          <img src="./../../static/images/audio.png" alt="" />
        </div>
        <div
          v-else-if="authorityGroupSendMessage(groupData,'send')
          "
          @click="editMsg.innerText === '' ? sendMessage() : editMessage()"
        >
          <img src="./../../static/images/send.png" alt="" />
        </div>
      </template>
      <template v-else-if="device === 'pc' && authorityGroupSendImg(groupData)">
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
      </template>
    </div>

    <div
      class="callout-message"
      v-show="calloutShow && searchContactData.length > 0"
    >
      <ul>
        <li
          @click="markPeople(searchContactData)"
          v-if="groupData.isAdmin || groupData.isManager"
        >
          <div class="callout-message-box"><span>標記所有成員</span></div>
        </li>
        <li
          v-for="(item, index) in searchContactData"
          :key="index"
          @click="checkCallout(item)"
        >
          <el-avatar shape="square" size="small" :src="item.icon"></el-avatar>
          <div class="callout-message-box">
            <span
              >{{ item.name
              }}<span
                style="
                  font-size: 12px;
                  color: rgba(0, 0, 0, 0.5);
                  margin-left: 16px;
                "
                >{{ item.username }}</span
              ></span
            >
          </div>
        </li>
      </ul>
    </div>
    <el-dialog
      title="上传图片"
      :before-close="closeModel"
      :visible.sync="uploadImgShow"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      :class="{ 'el-dialog-loginOut': device === 'pc' }"
      v-loading.fullscreen.lock="fullscreenLoading"
      width="100%"
      class="el-upload-img"
      element-loading-text="圖片上传中"
      center
    >
      <div
        id="preview"
        class="preview-img"
        v-if="copyPicture"
        v-on:paste="onPasteUpload"
      >
        <span>将图片按Ctrl+V 粘贴至此处</span>
      </div>
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="uploadImg"
        :on-remove="handleRemove"
        :on-exceed="limitCheck"
        :auto-upload="false"
        :file-list="fileList"
        list-type="picture"
        multiple
        :limit="10"
        v-else
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <template v-if="device === 'moblie'">
          <el-button
            type="success"
            @click="copyPicture ? copySubmitAvatar() : submitAvatar()"
            >确认</el-button
          >
          <el-button @click="closeModel()">取消</el-button>
        </template>
        <template v-else>
          <el-button class="background-gray" @click="closeModel()"
            >取消</el-button
          >
          <el-button
            class="background-orange"
            @click="copyPicture ? copySubmitAvatar() : submitAvatar()"
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
      :close-on-click-modal="false"
      width="100%"
      class="el-dialog-takePicture"
      center
    >
      <Photo
        :chatType="'CLI_GROUP_IMAGE'"
        v-on:closePictureShow="pictureShow"
      ></Photo>
    </el-dialog>
    <el-dialog
      title="档案上传"
      :before-close="closeModel"
      :visible.sync="uploadFileShow"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      :class="{ 'el-dialog-loginOut': device === 'pc' }"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="档案上传中..."
      width="100%"
      class="el-upload-img"
      center
    >
      <el-upload
        class="upload-demo"
        action="#"
        accept=".zip, .rar, .txt,.pdf, .doc, .docx, .xls, .xlsx"        
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="limitFileCheck"
        :auto-upload="false"
        :file-list="fileData"
        :multiple="false"
        :limit="1"
        >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <template v-if="device === 'moblie'">
          <el-button type="success" @click="submitFile()">确认</el-button>
          <el-button @click="closeModel()">取消</el-button>
        </template>
        <template v-else>
          <el-button class="background-gray" @click="closeModel()"
            >取消</el-button
          >
          <el-button class="background-orange" @click="submitFile()"
            >确认</el-button
          >
        </template>
      </span>
    </el-dialog>      
    <audio
      id="notify-send-audio"
      src="./../../static/wav/send.mp3"
      preload="none"
    ></audio>
  </div>
</template>

<script>
import Socket from "@/utils/socket";
import Record from "./../../static/js/record-sdk";
import Photo from "./Photo.vue";
import { VEmojiPicker } from "v-emoji-picker";
import { getToken } from "_util/utils.js";
import { mapState, mapMutations } from "vuex";
import { getGroupDisabledWord } from '@/api/groupController'
import { uploadMessageImage,uploadMessageFile } from '@/api/uploadController'
import { Encrypt } from "@/utils/AESUtils.js";

export default {
  name: "MessageInput",
  data() {
    return {
      textArea: "",
      newTextArea:"",
      search: "",
      showDialog: false,
      calloutShow: false,
      sendAduioShow: false,
      uploadImgShow: false,
      uploadFileShow:false,      
      takePictureShow: false,
      fullscreenLoading: false,
      banMessage: [],
      checkName: [],
      fileList: [],
      fileData:[],      
      file: {},
      copyPicture: false,
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

      //加解密 key iv
      aesKey: "hichatisachatapp",
      aesIv: "hichatisachatapp",
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
    unGroupDisabledWord: {
      type: Boolean,
    },
    authorityGroupData: {
      type: Object,
    },
    authority: {
      type: Object,
    },
  },
  computed: {
    ...mapState({
      replyMsg: (state) => state.ws.replyMsg,
      editMsg: (state) => state.ws.editMsg,
      soundNofiy: (state) => state.ws.soundNofiy,
      contactListData: (state) => state.ws.contactListData,
    }),
  },
  watch: {
    textArea: {
      immediate: true,
      handler(val) {
        if (val === "") this.calloutShow = false;
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
  created() {
    Socket.$on("message", this.handleGetMessage);
    this.getDisabledWord();
  },
  mounted() {
    document.addEventListener("paste", this.onPasteUpload);
    document.addEventListener("click", (e) => {
      if (e.target.className !== "emoji border") {
        this.showDialog = false;
      }
    });
  },
  methods: {
    ...mapMutations({
      setEditMsg: "ws/setEditMsg",
      setReplyMsg: "ws/setReplyMsg",
    }),
    authorityGroupSendImg(user){ 
      return user.isAdmin || (user.isManager && (this.authority.sendImage || this.authorityGroupData.sendImage)) || this.authorityGroupData.sendImage
    },
    authorityGroupSendLink(user){
      return user.isAdmin || (user.isManager && (this.authority.sendLink || this.authorityGroupData.sendLink)) || this.authorityGroupData.sendLink
    },
    authorityGroupSendMessage(user,type){ 
      if(type === "send"){
        return user.isAdmin || (user.isManager && (this.authority.sendMessage || this.authorityGroupData.sendMessage)) || this.authorityGroupData.sendMessage
      }else{
        return (user.isManager && !this.authority.sendMessage) || (!user.isAdmin && !user.isManager && !this.authorityGroupData.sendMessage)
      }
    },
    // 选择的文件超出限制的文件总数量时触发
    limitCheck() {
      this.$message({ message: "最多只能上传10张图片", type: "warning" });
    },
    limitFileCheck(){
      this.$message({ message: "最多只能上传1个档案", type: "warning" });
    },
    selectEmoji(emoji) {
      // 选择emoji后调用的函数
      this.textArea += emoji.data;
    },
    disableTouch() {
      this.$message({ message: "已禁止發言", type: "warning" });
    },
    markPeople(data) {
      data.forEach((el) => {
        this.targetArray.push("u" + el.memberId);
      });
      this.textArea = "@所有成員";
    },
    checkCallout(data) {
      this.calloutShow = false;
      this.targetArray.push("u" + data.memberId);
      this.textArea = this.textArea + data.name;
    },
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      if (userInfo.chatType === "SRV_GROUP_DISABLE_WORD") {
        this.getDisabledWord();
      }
    },
    getDisabledWord() {
      let groupId = this.groupData.groupId;
      getGroupDisabledWord({ groupId }).then((res) => {
        if (res.code === 200) {
          this.banMessage = res.data;
        }
      });
    },
    pictureShow(val) {
      this.takePictureShow = val;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      this.fileData = fileList
    },      
    // 取得圖片
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    closeModel() {
      this.fileList = [];
      this.fileData = [];
      this.copyPicture = false;
      this.uploadImgShow = false;
      this.fullscreenLoading = false;
    },
    //貼上上傳圖片
    onPasteUpload(event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        return;
      } else {
        this.uploadImgShow = true;
        this.copyPicture = true;
      }
      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}">`;
      };
      reader.readAsDataURL(file);
      this.file = file;
    },
    copySubmitAvatar() {
      this.submitAvatarUpload(this.file);
    },
    submitAvatar() {
      if (
        ((!this.groupData.isAdmin && !this.groupData.isManager) ||
          (this.groupData.isManager && !this.authority.sendImage)) &&
        !this.authorityGroupData.sendImage
      ) {
        this.$message({ message: "群組已禁止發送圖片訊息", type: "error" });
        this.fileList = [];
        this.uploadImgShow = false;
        this.fullscreenLoading = false;
        return false;
      }
      this.fileList.forEach((data) => {
        this.submitAvatarUpload(data.raw);
      });
    },
    // 上傳圖片
    submitAvatarUpload(data) {
      let formData = new FormData();
      formData.append("file", data);
      this.fullscreenLoading = true;
      uploadMessageImage(formData).then((res) => {
        if (res.code === 200) {
          let message = this.userInfoData;
          message.chatType = "CLI_GROUP_IMAGE";
          message.id = Math.random();
          message.fromChatId = "u" + localStorage.getItem("id");
          message.toChatId = "g" + this.groupData.groupId;
          (message.text = Encrypt(res.data, this.aesKey, this.aesIv)), //TODO 加密
            // message.text = res.data,
            // 发送服务器
            this.soundNofiy.forEach((res) => {
              if (res.key === "group" && res.isNofity) this.audioAction();
            });
          Socket.send(message);
          this.fileList = [];
          this.uploadImgShow = false;
          this.fullscreenLoading = false;
        } else if (res.code === 40001) {
          this.fileList = [];
          this.fullscreenLoading = false;
        }
      });
    },
    submitFile(){
      let formData = new FormData();
      formData.append("file", this.fileData[0].raw);
      formData.append("type", "FILE");
      this.fullscreenLoading = true;
      uploadMessageFile(formData).then((res) => {
        if (res.code === 200) {
          let message ={
            chatType: "CLI_GROUP_FILE",
            deviceId: localStorage.getItem("UUID"),
            fileSize: JSON.stringify(this.fileData[0].size),
            fromChatId:"u" + localStorage.getItem("id"),
            id:Math.random(),
            replyHistoryId:"",
            targetArray :[],
            text:Encrypt(res.data,this.aesKey,this.aesIv),//TODO 加密  
            toChatId:"g" + this.groupData.groupId,
            token:getToken("token"),
            tokenType:0
          }
          Socket.send(message);
          this.fileData = [];
          this.uploadFileShow = false;
          this.fullscreenLoading = false;
        } else if (res.code === 40001) {
          this.fileData = [];
          this.fullscreenLoading = false;
        }
      })
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
          this.startHandler()
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
      if (
        ((!this.groupData.isAdmin && !this.groupData.isManager) ||
          (this.groupData.isManager && !this.authority.sendImage)) &&
        !this.authorityGroupData.sendImage
      ) {
        this.$message({ message: "群组已禁止发送语音讯息", type: "error" });
        this.sendAduioShow = false;
        this.fullscreenLoading = false;
        this.audioMessageData = {};
        return false;
      }
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
          (message.toChatId = "g" + this.groupData.groupId),
            (message.text = Encrypt(res.data, this.aesKey, this.aesIv)), //TODO 加密
            // message.text = res.data,
            // 发送服务器
            this.soundNofiy.forEach((res) => {
              if (res.key === "group" && res.isNofity) this.audioAction();
            });
          Socket.send(message);
          this.sendAduioShow = false;
          this.fullscreenLoading = false;
          this.audioMessageData = {};
        }
      });
    },
    // 消息过滤
    textAreaTran() {
      return this.textArea
        .replace(/\n/g, "")
        .replace(new RegExp("<", "gm"), "&lt");
    },

    callout() {
      this.textArea.split(" ").forEach((res) => {
        if (res.startsWith("@")) {
          this.calloutShow = true;
        } else {
          this.calloutShow = false;
        }
      });
    },

    keyUp(event) {
      this.textArea.split(" ").forEach((res) => {
        this.calloutShow = res.startsWith("@");
      });
      // this.textArea = this.textArea.replace(/(\n*$)/g,"");
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
        } else if (
          this.replyMsg.clickType === "replyMsg" ||
          this.replyMsg.clickType === ""
        ) {
          this.sendMessage();
        } else {
          this.editMessage();
        }
      }
    },
    // 发送消息
    sendMessage() {
      const dictionary = this.textArea.replace(/(\n*$)/g,"").split(" ")

      // //先找到x的位置，等會要用c來取代x
      this.contactListData.forEach((item) => {
        const xIndex = dictionary.indexOf("@"+item.name)
        if (xIndex > -1) {
          dictionary.splice(xIndex, 1, "@" + item.memberId + "\u200B")
        }
      })
      this.calloutTextArea = dictionary.toString().replace(/,/g, " ")

      if (this.textArea.replace(/\s+/g, "") === "") {
        this.$message({ message: "不能发送空白消息", type: "error" });
        this.textArea = "";
        return false;
      }else if (
        ((!this.groupData.isAdmin && !this.groupData.isManager) ||
          (this.groupData.isManager && !this.authority.sendLink)) &&
        !this.authorityGroupData.sendLink
      ) {
        var strRegex =
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        var re = new RegExp(strRegex);
        if (re.test(this.textArea.replace(/(\s*$)/g, ""))) {
          this.$message({ message: "无法发送超连结", type: "error" });
          this.textArea = "";
          return false;
        }
      }
      this.banMessageData = this.banMessage.filter((el) =>
        this.textArea.replace(/(\s*$)/g, "").includes(el.word)
      );
      if (this.banMessageData.length !== 0) {
        this.$message({ message: "讯息含有禁用字词，无法传送", type: "error" });
        this.textArea = this.textArea.replace(/(\s*$)/g, "");
        return false;
      } else {
        let message = {
          chatType: "CLI_GROUP_SEND",
          id: Math.random(),
          toChatId: this.groupData.toChatId,
          replyHistoryId:
            this.replyMsg.replyHistoryId !== ""
              ? this.replyMsg.replyHistoryId
              : "",
          targetArray: this.targetArray,
          text: Encrypt(
            this.textArea.replace(/(\s*$)/g, ""),
            // this.calloutTextArea,//TODO @memberId
            this.aesKey,
            this.aesIv
          ), //TODO 加密
          
          // text: this.textArea,
          token: getToken("token"),
          deviceId: localStorage.getItem("UUID"),
          tokenType: 0,
        };
        // 发送服务器
        this.soundNofiy.forEach((res) => {
          if (res.key === "group" && res.isNofity) this.audioAction();
        });
        Socket.send(message);
        this.$root.closeReplyMessage();
        // 消息清空
        this.targetArray = [];
        this.checkName = [];
        this.textArea = "";
        this.showDialog = false;
      }
    },
    audioAction() {
      let audioEl = document.getElementById("notify-send-audio");
      var playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            audioEl.pause();
          })
          .catch((error) => {});
      }
      audioEl.src = ""; // 移除src, 防止之后播放空白音频
      setTimeout(() => {
        // 用setTimeout模拟一个2秒的延迟
        audioEl.src = require("./../../static/wav/send.mp3");
        audioEl.play();
      }, 150);
    },
    editMessage() {
      let editMessage = {
        chatType: "CLI_CHAT_EDIT",
        id: Math.random(),
        tokenType: 0,
        fromChatId: this.groupData.lastChat.fromChatId,
        targetId: this.replyMsg.replyHistoryId,
        text: Encrypt(
          this.textArea.replace(/(\s*$)/g, ""),
          this.aesKey,
          this.aesIv
        ), //TODO 加密
        // text: this.textArea,
        toChatId: this.groupData.lastChat.toChatId,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      // 发送服务器
      Socket.send(editMessage);
      this.$root.closeReplyMessage();
      // 消息清空
      this.textArea = "";
    },
  },
  components: {
    VEmojiPicker,
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
    background-color: #f4f4f4;
    border-radius: 20px;
    .disable-box {
      width: 280px;
      height: 35px;
      display: flex;
      align-items: center;
      background-color: #f4f4f4;
      color: #959393;
      font-size: 14px;
      border-radius: 20px;
      position: absolute;
      justify-content: center;
      z-index: 1;
    }
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
      .face-icon {
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
  .el-dialog__wrapper.el-upload-img {
    .el-dialog {
      width: 500px !important;
      .el-dialog__body {
        .preview-img {
          img {
            width: 30em;
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
  .el-dialog__wrapper.el-upload-img {
    .el-dialog {
      .el-dialog__body {
        .upload-demo {
          .el-upload-list {
            .el-upload-list__item {
              width: 90%;
              float: none;
            }
          }
        }
        .preview-img {
          img {
            width: 9em;
          }
        }
      }
    }
  }
}
.callout-message {
  background-color: rgba(225, 225, 225, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
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
