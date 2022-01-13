<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">编辑群组</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div class="home-content">
          <div class="group-data">
            <span><img :src="groupData.icon === ''?require('./../../../static/images/image_group_defult.png') : groupData.icon" alt="" /></span>
            <span class="photo-edit" @click="uploadImgShow = true"
              >变更群组照片</span
            >
          </div>
          <div class="user-edit-form">
            <el-form ref="form" :model="groupForm" label-width="100px">
              <el-form-item label="群组名称">
                <el-input
                  v-model="groupForm.name"
                  placeholder="群组名称"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="home-footer-btn">
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="editSubmit"
            >编辑群组</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="上傳群组照片"
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
import { uploadGroupIcon,updateGroup } from "@/api";

export default {
  name: "EditContact",
  data() {
    return {
      groupData: {},
      groupForm: {
        name: ""
      },
      groupIcon: '',
      uploadImgShow: false,
      formData: new FormData(),
      fileList: [],
      disabled: true,
    };
  },
  watch:{
    groupForm:{
      handler(val) {
        this.disabled = !val.name
      },
      deep: true,
    }
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    this.groupForm.name = this.groupData.groupName;
  },
  methods: {
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    submitAvatarUpload() {
      this.formData.append("file", this.fileList[0].raw);
      uploadGroupIcon(this.formData).then((res) => {
        if (res.code === 200) {
          this.fileList = [];
          this.uploadImgShow = false;
          this.groupData.icon = res.data
          this.groupIcon = res.data
          localStorage.setItem("groupData",JSON.stringify(this.groupData))
        }
      });
    },
    editSubmit() {
      let params = {
        groupId:this.groupData.groupId,
        groupName: this.groupForm.name,
        icon:this.groupIcon,
      }
      updateGroup(params).then((res) => {
        if (res.code === 200) {
          this.groupData.groupName = this.groupForm.name
          localStorage.setItem("groupData",JSON.stringify(this.groupData))
          this.back()
        }
      })
      .catch((err) => {
        this.$message({ message: err, type: "error"});
        return false;
      });
    },
    back() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-header {
  .home-user {
    background-color: #fff;
    background-image: url("./../../../static/images/back.png");
  }
}
.home-content {
  .group-data {
    span {
      height: 4.5em !important;
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
    .el-form-item{
      margin-bottom: 0;
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
