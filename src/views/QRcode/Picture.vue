<template>
    <div>
        <el-button type="success" @click="callCamera" style="margin-right: 10px;">开启摄像头</el-button>
        <el-button type="info" @click = 'changeDevice' style="margin-right: 10px;">切换摄像头</el-button>
        <el-button type="danger" @click="closeCamera">关闭摄像头</el-button>
        <canvas ref="canvas" width="640" height="240"></canvas>
        <!-- <video ref="video" width="640" height="480" autoplay></video> -->
        <el-button type="primary" :disabled="videoArr.length <= 0" @click="uploadImg">拍照</el-button>
        <div style="width:200px">
            <div v-for="(item,index) in videoArr" :key="index" @click="setCurrentDevice(item.id)">{{ item.label }}</div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                videoArr:[],//所有的摄像头,也可以加入音频设备
                modelSel:'',//当前使用的摄像头
                myInterval: null,
            }
        },
        created(){
            this.changeDevice();
        },
        methods: {
            callCamera () {
                navigator.mediaDevices.getUserMedia({
                    video: true
                }).then((success) => {
                    this.$refs['video'].srcObject = success;
                    this.$refs['video'].play()
                }).catch((err) => {
                    this.$message({ message: '摄像头开启失败，请检查摄像头是否可用！', type: "error"});
                })
            },
            uploadImg () {
                let ctx = this.$refs['canvas'].getContext('2d');
                ctx.drawImage(this.$refs['video'], 0, 0, 640, 480);
                let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7);
                let str = imgBase64.replace('data:image/jpeg;base64,', '');
                let strLength = str.length;
                let fileLength = parseInt(strLength - (strLength / 8) * 2);
                let size = (fileLength / 1024).toFixed(2);
                let ADOM = document.createElement('a');
                ADOM.href = this.headImgSrc
                ADOM.download = new Date().getTime() + '.jpeg';
                ADOM.click()
            },
            closeCamera () {
                if (!this.$refs['video'].srcObject) return;
                let stream = this.$refs['video'].srcObject;
                let tracks = stream.getTracks();
                tracks.forEach(track => {
                    track.stop();
                });
                this.$refs['video'].srcObject = null;
            },
            changeDevice(){
                navigator.mediaDevices.enumerateDevices().then((devices)=> {
                    this.videoArr = [];
                    devices.forEach((device)=> {
                        //音频是audioautput  摄像头videoinput
                        if(device.kind == 'videoinput'){
                            this.videoArr.push({
                                'label': device.label,
                                'id': device.deviceId
                            })
                        }
                    });
                }).catch(function(err) {
                    layer.msg(err.name + ": " + err.message);
                });
            },
            setCurrentDevice(val){
                const videoConstraints = {};
                if (val === '') {
                    videoConstraints.facingMode = 'environment';
                } else {
                    videoConstraints.deviceId = { exact: val };
                }
                var constraints = {
                    video: videoConstraints,
                };
                this.getUserMedia(constraints);
            },
            getUserMedia(constraints, success, error) {
                if (navigator.mediaDevices.getUserMedia) {
                    //最新的标准API
                    navigator.mediaDevices.getUserMedia(constraints).then(success=>{
                        // 摄像头开启成功
                        this.$refs['video'].srcObject = success
                        // 实时拍照效果
                        this.$refs['video'].play()
                    }).catch(error);

                } else if (navigator.webkitGetUserMedia) {
                    //webkit核心浏览器
                    navigator.webkitGetUserMedia(constraints,success, error)
                } else if (navigator.mozGetUserMedia) {
                    //firfox浏览器
                    navigator.mozGetUserMedia(constraints, success, error);
                } else if (navigator.getUserMedia) {
                    //旧版API
                    navigator.getUserMedia(constraints, success, error);
                }
            }
        }
    }
</script>