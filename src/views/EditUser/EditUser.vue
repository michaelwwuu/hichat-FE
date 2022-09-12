<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'">
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
            <span
              ><el-image
                :src="noIconShow(userData)"
                :preview-src-list="[noIconShow(userData)]"
            /></span>
            <!-- <div>
              <span class="photo-edit" @click="uploadImgShow = true"
                >变更头像</span
              >
            </div> -->
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
          <el-button class="orange-btn" @click="editSubmit">保存</el-button>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back"></div>
            <span class="home-header-title">编辑个人资料</span>
            <div class="home-add-user home-edit-img" @click="editSubmit()"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="group-data">
            <span
              ><el-image
                :src="noIconShow(userData)"
                :preview-src-list="[noIconShow(userData)]"
            /></span>
            <!-- <div>
              <span class="photo-edit" @click="uploadImgShow = true"
                >变更头像</span
              >
            </div> -->
          </div>
          <div class="user-edit-form">
            <el-form ref="form" :model="userEditForm" label-width="100px" onsubmit="return false;">
              <el-form-item label="用户昵称">
                <el-input v-model="userEditForm.nickname"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-aside>
    </el-container>
    <el-dialog
      title="上傳大頭貼"
      :visible.sync="uploadImgShow"
      width="100%"
      :class="{ 'el-dialog-loginOut': device === 'pc' }"
      center
      :close-on-click-modal="false"      
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
        <!-- <div slot="tip" class="el-upload__tip">
          只能上传 jpg / png 圖片，且不超过500kb
        </div> -->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <template v-if="device === 'moblie'">
          <el-button type="success" @click="submitAvatarUpload">确认</el-button>
          <el-button @click="uploadImgShow = false">取 消</el-button>
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
  </div>
</template>

<script>
import { updateNickname  } from "@/api/memberProfileController";
import { uploadIcon } from '@/api/uploadController'
import { mapMutations } from "vuex";

export default {
  name: "EditUser",
  data() {
    return {
      userData: {},
      userEditForm: {
        nickname: "",
      },
      uploadImgShow: false,
      fileList: [],
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("myUserInfo"));
    this.userEditForm.nickname = this.userData.nickname;
  },
  methods: {
    ...mapMutations({
      setMyUserInfo: "ws/setMyUserInfo",
    }),
    noIconShow(iconData) {
      if ([undefined,null,""].includes(iconData.icon)) {
        return require("./../../../static/images/image_user_defult.png");
      } else {
        return iconData.icon;
      }
    },
    back() {
      this.$router.back(-1);
    },
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    submitAvatarUpload() {
      this.uploadImgShow = false;
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      uploadIcon(formData).then((res) => {
        if (res.code === 200) {
          this.fileList = [];
          this.userData.icon = res.data;
          this.setMyUserInfo(this.userData)
        }
      });
    },
    editSubmit() {
      if (this.userEditForm.nickname === "") {
        this.$message({ message: "昵称不可为空白", type: "error" });
        return;
      }
      updateNickname(this.userEditForm.nickname).then((res) => {
        if (res.code === 200) {
          this.back();
        }
      })

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
    .home-edit-img {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/check.png");
      position: absolute;
      right: 7px;
    }
  }
  .home-content {
    .group-data {
      .el-image {
        width: 4em;
        height: 4em;
        top:0;
      }
      span {
        height: 4.5em !important;
        overflow: hidden;
        img {
          width: 4em;
          border-radius: 10px;
        }
      }
      .photo-edit {
        height: 1.5em !important;
        color: #fe5f3f;
      }
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
.hichat-pc {
  .home-user-pc {
    background-color: #fff;
    background-image: url("./../../../static/images/pc/arrow-left.svg");
    cursor: pointer;
  }
  .home-content {
    .group-data {
      .el-image {
        width: auto;
        height: 6em;
        top:0;
      }
      span {
        height: 6.5em !important;
      }
    }
  }
  .user-edit-form {
    /deep/.el-form {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      .el-form-item {
        .el-form-item__label {
          font-size: 17px;
        }
        .el-input {
          .el-input__inner {
            background:none;
          }
        }
      }
    }
  }
  .photo-edit {
    cursor: pointer;
  }
  .el-dialog-loginOut {
    /deep/.el-dialog__footer {
      padding: 0;
      .el-button {
        &:nth-child(2) {
          border-left: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
