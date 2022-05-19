<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">编辑个人资料</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="group-data">
            <span>
              <el-image
                v-if="userData.icon !== undefined"
                :src="userData.icon"
                :preview-src-list="[userData.icon]"
              />
            </span>
            <span class="photo-edit" @click="uploadImgShow = true">变更头像</span>
          </div>
          <div class="user-edit-form">
            <el-form ref="form" :model="userEditForm" label-width="100px">
              <el-form-item label="用户昵称">
                <el-input v-model="userEditForm.nickname"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="editSubmit(userEditForm.nickname)">保存</el-button>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="上傳大頭貼"
      :visible.sync="uploadImgShow"
      width="100%"
      center
    >
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="uploadImg"
        :auto-upload="false"
        :file-list="fileList"
        list-type="picture"
        limit="1"
      >
        <el-button type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传 jpg / png 圖片，且不超过500kb
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitAvatarUpload">确认</el-button>
        <el-button @click="uploadImgShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, updateNickname, uploadIcon } from "@/api";

export default {
  name: "EditUser",
  data() {
    return {
      userData: {},
      userEditForm: {
        nickname: "",
      },
      uploadImgShow: false,
      formData: new FormData(),
      fileList: [],
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    editSubmit() {
      if (this.userEditForm.nickname === "") {
        this.$message({ message: "昵称不可为空白", type: "error" });
        return;
      }
      updateNickname(this.userEditForm.nickname).then((res) => {
        if (res.code === 200) {
          this.getUserData();
          this.back();
        }
      });
    },
    getUserData() {
      getUserInfo().then((res) => {
        if (res.data.icon === undefined)
          res.data.icon = require("./../../../static/images/image_user_defult.png");
        this.userData = res.data;
        this.userEditForm.nickname = this.userData.nickname.replace(
          /\["|"]/g,
          ""
        );
      });
    },
    back() {
      this.$router.back(-1);
    },
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    submitAvatarUpload() {
      this.formData.append("file", this.fileList[0].raw);
      uploadIcon(this.formData).then((res) => {
        if (res.code === 200) {
          this.fileList = [];
          this.uploadImgShow = false;
          this.getUserData();
        }
      });
    },
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
  }
  .user-edit-form {
    margin: 1em;
    background-color: #fff;
    border-radius: 10px;
    /deep/.el-form {
      .el-form-item__label {
        font-size: 17px;
      }
      .el-input {
        font-size: 19px;
        .el-input__inner {
          border: none;
        }
      }
    }
  }
}
</style>
