<template>
  <div style="overflow: hidden;">
    <div class="add-content">
      <div class="user-data">
        <span><el-image :src="groupIcon === ''?require('./../../../../static/images/image_group_defult.png') : groupIcon" alt="" /></span>
        <span class="photo-edit" @click="uploadImgShow = true"
          >变更群组照片</span
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
  </div>
</template>

<script>
import { uploadGroupIcon } from "@/api";

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
.home-footer-btn {
  margin: 1em 0;
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
</style>
