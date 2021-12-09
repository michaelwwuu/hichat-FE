<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title">编辑个人资料</span>
      <div class="home-add-user"></div>
    </div>
    <div class="add-content">
      <div class="user-data">
        <span><img :src="userData.icon" alt=""></span>
        <span class="photo-edit" @click="uploadImgShow = true">变更头像</span>
      </div>
      <div class="home-footer-btn">
        <el-button
        @click="editSubmit(userEditForm.nickname)"
          >保存</el-button
        >
      </div>
    </div>
    <div class="user-edit-form">
      <el-form ref="form" :model="userEditForm" label-width="100px">
        <el-form-item label="用户昵称">
          <el-input v-model="userEditForm.nickname"></el-input>
        </el-form-item>
      </el-form>
    </div>  
    <el-dialog
      title="上傳大頭貼"
      :visible.sync="uploadImgShow"
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
        <el-button type="success" @click="submitAvatarUpload">确认</el-button>
        <el-button @click="uploadImgShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo,updateNickname,uploadIcon } from "@/api";

export default {
  name: "EditUser",
  data() {
    return {
      userData:{},
      userEditForm:{
        nickname:''
      },
      uploadImgShow:false,
      formData:new FormData(),
      fileList:[],
    }
  },
  created() {
    this.getUserData()
  },
  methods: {
    editSubmit(){ 
      if(this.userEditForm.nickname=== '') {
        this.$message({ message: "昵称不可为空白", type: "error" });
        return 
      }
      updateNickname(this.userEditForm.nickname).then((res)=>{
        if(res.code === 200) {
          this.getUserData()
          this.back()
        }
      })
    },
    getUserData() {
      getUserInfo().then((res) => {
        if(res.data.icon === undefined ) res.data.icon = require("./../../../static/images/image_user_defult.png");
        this.userData = res.data;
        this.userEditForm.nickname = this.userData.nickname.replace(/\["|"]/g, '' )
      });
    },
    back(){
      this.$router.back(-1)
    },
    uploadImg(file, fileList) {
      this.fileList = fileList
		},
    submitAvatarUpload(){
      this.formData.append('file',this.fileList[0].raw);
      uploadIcon(this.formData).then((res)=>{
        if(res.code === 200) {
          this.fileList =[]
          this.uploadImgShow = false
          this.getUserData()
        }
      })
    }
  },

};
</script>

<style lang="scss" scoped>
.home-wrapper{
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    .home-user {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .home-header-title {
      margin: 0 auto;
      color: #10686e;
      font-weight: 600;
    }
    .home-add-user{
      width: 2em;
      height: 2em;
    }
  }
  .user-edit-form{
    margin: 1em;
    background-color: #FFF;
    border-radius: 10px;
    /deep/.el-form{
      .el-form-item__label{
        font-size: 17px;
      }
      .el-input{
        font-size: 19px;
        .el-input__inner{
          border:none;
        }
      }
    }
  }
  .add-content{
    .user-data{
      margin: 2.5em auto 0 auto;
      span{
        display: block;
        text-align: center;
        height:4.5em;
        img{
          height:4em;
          border-radius: 10px;
        }
      }
      .photo-edit{
        height:1.5em;
        color: #fe5f3f;
      }
    }
    .home-footer-btn{
      margin: 1em 0;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      .el-button{
        width:93%;
        background-color: #fe5f3f;
        color: #fff;
      }
    }
  }
  /deep/.el-dialog__wrapper{
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
