<template>
  <div>
    <div class="add-content">
      <div class="user-data">
        <span><el-image :src="groupIcon === ''?require('./../../../../static/images/image_group_defult.png') : groupIcon" alt="" /></span>
        <span class="photo-edit" @click="uploadImgShow = true"
          >变更群组照片</span
        >
      </div>
      <div class="home-footer-btn">
        <el-button
          :class="disabled ? 'gray-btn' : 'orange-btn'"
          :disabled="disabled"
          @click="editSubmit"
          >创建群组</el-button
        >
      </div>
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
    <div class="home-content">
      <div class="address-box" v-for="(item, index) in checkList" :key="index">
        <el-image :src="item.icon" />
        <div class="msg-box">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <el-dialog
      title="上傳群组照片"
      :visible.sync="uploadImgShow"
      width="80%"
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
        <el-button size="small" type="primary">点击上传</el-button>
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
import { uploadGroupIcon,addGroup } from "@/api";

export default {
  name: "AddGroup",
  props: {
    // 当前用户
    checkList: {
      type: Array,
    },
  },
  data() {
    return {
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
          this.groupIcon = res.data
        }
      });
    },
    editSubmit() {
      let memberList = []
      this.checkList.forEach(res => memberList.push(res.contactId));
      let params = {
        groupName: this.groupForm.name,
        icon:this.groupIcon,
        memberList:memberList,
      }
      addGroup(params).then((res) => {
        if (res.code === 200) {
          this.$router.push({ path: "/Address" });
        }
      })
      .catch((err) => {
        this.$message({ message: err, type: "error" });
      })
    },
  },
};
</script>

<style lang="scss" scoped>
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
.add-content {
  .user-data {
    .photo-edit {
      height:1.5em !important;
      color: #fe5f3f;
    }
  }
  .home-footer-btn {
    margin: 1em 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button {
      width: 93%;
    }
    .gray-btn {
      background-color: #b3b3b3;
      color: #fff;
    }
    .orange-btn {
      background-color: #fe5f3f;
      color: #fff;
    }
  }
}
.home-content {
  overflow-x: hidden;
  overflow-y: auto;
  height: 26.5em;
  position: relative;
  .address-box {
    background-color: #ffffff;
    padding: 0.8em 1em;
    display: flex;
    align-items: center;
    .el-image {
      width: 4em;
    }    
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
          margin-top: 1em;
          width: 100%;
          border-bottom: 0.02em solid #b3b3b3;
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
/deep/.el-dialog__wrapper {
  .el-dialog__body {
    .upload-demo {
      .el-upload-list {
        .el-upload-list__item {
          margin-top: -72px;
        }
      }
    }
  }
}
</style>
