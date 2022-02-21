<template>
  <div>
    <el-button @click="onTake" icon="el-icon-camera" size="small" v-if="onTakeBtn">
      拍照上传
    </el-button>
    <div v-if="visible">
      <div class="box">
        <video
          id="videoCamera"
          class="canvas"
          :width="videoWidth"
          :height="videoHeight"
          autoPlay
        ></video>
        <canvas
          id="canvasCamera"
          class="canvas"
          :width="videoWidth"
          :height="videoHeight"
        ></canvas>
      </div>
      <div slot="footer">
        <el-button @click="drawImage" icon="el-icon-camera" size="small">
          拍照
        </el-button>
        <el-button
          v-if="open"
          @click="getCompetence"
          icon="el-icon-video-camera"
          size="small"
        >
          打开摄像头
        </el-button>
        <el-button
          v-else
          @click="stopNavigator"
          icon="el-icon-switch-button"
          size="small"
        >
          关闭摄像头
        </el-button>
        <el-button @click="resetCanvas" icon="el-icon-refresh" size="small">
          重置
        </el-button>
        <el-button @click="onCancel" icon="el-icon-circle-close" size="small">
          取消
        </el-button>
        <el-button
          @click="onUpload"
          :loading="loading"
          type="primary"
          icon="el-icon-upload2"
          size="small"
        >
          上传
        </el-button>
      </div>
    </div>
    <!-- <el-dialog
      title="拍照上传"
      :visible.sync="visible"
      @close="onCancel"
      append-to-body
      center
      width="1065px">
      <div class="box">
        <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
        <canvas id="canvasCamera" class="canvas" :width="videoWidth" :height="videoHeight"></canvas>
      </div>
      <div slot="footer">
        <el-button
          @click="drawImage"
          icon="el-icon-camera"
          size="small">
          拍照
        </el-button>
        <el-button
          v-if="open"
          @click="getCompetence"
          icon="el-icon-video-camera"
          size="small">
          打开摄像头
        </el-button>
        <el-button
          v-else
          @click="stopNavigator"
          icon="el-icon-switch-button"
          size="small">
          关闭摄像头
        </el-button>
        <el-button
          @click="resetCanvas"
          icon="el-icon-refresh"
          size="small">
          重置
        </el-button>
        <el-button
          @click="onCancel"
          icon="el-icon-circle-close"
          size="small">
          取消
        </el-button>
        <el-button
          @click="onUpload"
          :loading="loading"
          type="primary"
          icon="el-icon-upload2"
          size="small">
          上传
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
//拍照上传组件
//父组件通过函数 getImg 获取照片路径,如 @getImg="getImg"
// const Address = require('../utils/url');//图片上传地址
import Socket from "@/utils/socket";
import { uploadMessageImage } from "@/api";
export default {
  name: "TakePhotos",
  data() {
    return {
      imgSrc: "",
      onTakeBtn:true,
      visible: false, //弹窗
      loading: false, //上传按钮加载
      open: false, //控制摄像头开关
      thisVideo: null,
      thisContext: null,
      thisCancas: null,
      videoWidth: 400,
      videoHeight: 300,
    };
  },
  watch:{
    visible(val){
      this.onTakeBtn = !val
    }
  },
  methods: {
    onTake() {
      this.visible = true;
      this.getCompetence();
    },
    onCancel() {
      this.visible = false;
      this.resetCanvas();
      this.stopNavigator();
    },
    //base64转成文件后上传
    onUpload() {
      if (this.imgSrc) {
        const file = this.imgSrc; // 把整个base64给file
        const time = new Date().valueOf(); //生成时间戳
        const name = time + ".png"; // 定义文件名字（例如：abc.png ， cover.png）
        const conversions = this.dataURLtoFile(file, name); // 调用base64转图片方法
        console.log(conversions);
        let formData = new FormData();
        this.loading = true;
        formData.append("file", conversions);
        uploadMessageImage(formData)
          .then((res) => {
            this.loading = false;
            if (res.code === 200) {
              console.log(this.userInfoData);
              let message = {
                chatType: "CLI_USER_IMAGE",
                token: localStorage.getItem("token"),
                deviceId: localStorage.getItem("UUID"),
                tokenType: 0,
                id: Math.random(),
                fromChatId: "u" + localStorage.getItem("id"),
                toChatId: JSON.parse(localStorage.getItem("userData")).toChatId,
                text: res.data,
              };
              Socket.send(message);
              this.onCancel();
              this.$notify({
                title: "上传成功",
                type: "success",
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$notify.error({
              title: "上传失败",
            });
          });
      } else {
        this.$notify({
          title: "警告",
          message: "请点击拍照",
          type: "warning",
        });
      }
    },
    // 调用摄像头权限
    getCompetence() {
      //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
      this.$nextTick(() => {
        const _this = this;
        this.open = false; //切换成关闭摄像头
        this.thisCancas = document.getElementById("canvasCamera");
        this.thisContext = this.thisCancas.getContext("2d");
        this.thisVideo = document.getElementById("videoCamera");
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            let getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia;
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
              );
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          audio: false,
          video: {
            width: _this.videoWidth,
            height: _this.videoHeight,
            transform: "scaleX(-1)",
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this.thisVideo) {
              _this.thisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.thisVideo.src = window.URL.createObjectURL(stream);
            }
            _this.thisVideo.onloadedmetadata = function (e) {
              _this.thisVideo.play();
            };
          })
          .catch((err) => {
            this.$notify({
              title: "警告",
              message: "没有开启摄像头权限或浏览器版本不兼容.",
              type: "warning",
            });
          });
      });
    },
    //绘制图片
    drawImage() {
      // 点击，canvas画图
      this.thisContext.drawImage(
        this.thisVideo,
        0,
        0,
        this.videoWidth,
        this.videoHeight
      );
      // 获取图片base64链接
      this.imgSrc = this.thisCancas.toDataURL("image/png");
    },
    //base64转文件
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    //清空画布
    clearCanvas(id) {
      let c = document.getElementById(id);
      let cxt = c.getContext("2d");
      cxt.clearRect(0, 0, c.width, c.height);
    },
    //重置画布
    resetCanvas() {
      this.imgSrc = "";
      this.clearCanvas("canvasCamera");
    },
    //关闭摄像头
    stopNavigator() {
      if (this.thisVideo && this.thisVideo !== null) {
        this.thisVideo.srcObject.getTracks()[0].stop();
        this.open = true; //切换成打开摄像头
      }
    },
  },
  beforeDestroy() {
    this.stopNavigator();
  },
};
</script>

<style scoped>
.box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 35px;
}

.canvas {
  border: 1px solid #e8e8e8;
}
</style>