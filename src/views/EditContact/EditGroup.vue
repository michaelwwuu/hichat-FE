<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <template v-if="device === 'moblie'">
          <el-header height="55px">
            <div class="home-header">
              <div class="home-user" @click="back"></div>
              <span class="home-header-title">编辑群组</span>
              <div class="home-add-user"></div>
            </div>
          </el-header>
        </template>
        <template v-else>
          <el-header height="70px">
            <div class="home-header">
              <span class="home-header-title">
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  @click="back"
                >
                  <span style="padding-right: 10px"
                    ><img
                      src="./../../../static/images/pc/arrow-left.png"
                      alt=""
                  /></span>
                  <span>编辑群组</span>
                </div>
              </span>
              <div
                class="home-add-user home-edit-img"
                @click="editSubmit"
              ></div>
            </div>
          </el-header>
        </template>
        <div class="home-content">
          <div class="group-data">
            <span
              ><el-image
                :src="noIconShow(groupData)"
                :preview-src-list="[noIconShow(groupData)]"
            /></span>
            <div>
              <span class="photo-edit" @click="uploadImgShow = true">{{
                device === "moblie" ? "变更群组照片" : "變更頭像"
              }}</span>
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
        </div>

        <div class="home-footer-btn" v-if="device === 'moblie'">
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
      :class="{ 'el-dialog-loginOut': device === 'pc' }"
      width="100%"
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
        <div slot="tip" class="el-upload__tip">
          只能上传 jpg / png 圖片，且不超过500kb
        </div>
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
import Socket from "@/utils/socket";
import { mapState, mapMutations } from "vuex";
import { getLocal, getToken } from "_util/utils.js";
import { uploadGroupIcon, updateGroup } from "@/api";

export default {
  name: "EditContact",
  data() {
    return {
      groupData: {},
      groupForm: {
        name: "",
      },
      groupIcon: "",
      uploadImgShow: false,
      fileList: [],
      disabled: true,
      device: localStorage.getItem("device"),
    };
  },
  watch: {
    groupForm: {
      handler(val) {
        this.disabled = !val.name;
      },
      deep: true,
    },
    // groupUser(val){
    //   this.groupForm.name = val.groupName
    // }
  },
  computed: {
    ...mapState({
      groupList: (state) => state.ws.groupList,
    }),
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    this.groupForm.name = this.groupData.groupName;
  },
  methods: {
    ...mapMutations({
      setChatGroup: "ws/setChatGroup",
      setGroupList: "ws/setGroupList",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    noIconShow(iconData) {
      if ([undefined,null,""].includes(iconData.icon)) {
        return require("./../../../static/images/image_group_defult.png");
      } else {
        return iconData.icon;
      }
    },
    uploadImg(file, fileList) {
      this.fileList = fileList;
    },
    submitAvatarUpload() {
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      uploadGroupIcon(formData).then((res) => {
        if (res.code === 200) {
          this.fileList = [];
          this.uploadImgShow = false;
          this.groupData.icon = res.data;
        }
      });
    },
    editSubmit() {
      let params = {
        groupId: this.groupData.groupId,
        groupName: this.groupForm.name,
        icon: this.groupData.icon,
      };
      updateGroup(params)
        .then((res) => {
          if (res.code === 200) {
            this.groupData.groupName = this.groupForm.name;
            this.groupList.forEach((el) => {              
              if (el.groupId === Number(params.groupId)) {
                el.icon = params.icon
                el.groupName = params.groupName;
              }
            });
            this.setChatGroup(this.groupData);
            this.setGroupList(this.groupList);
            if (this.device === "pc") this.getHiChatDataList();
            this.back();
          }
        })
        .catch((err) => {
          this.$message({ message: err, type: "error" });
          return false;
        });
    },
    getHiChatDataList() {
      let chatMsgKey = {
        chatType: "CLI_RECENT_CHAT",
        id: Math.random(),
        tokenType: 0,
        token: getToken("token"),
        deviceId: localStorage.getItem("UUID"),
      };
      Socket.send(chatMsgKey);
    },
    back() {
      if (this.device === "moblie") {
        this.$router.back(-1);
      } else {
        this.setMsgInfoPage({ pageShow: true, type: "" });
      }
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
  .home-edit-img {
    background-color: #fff;
    background-image: url("./../../../static/images/pc/check.png");
  }
}
.home-content {
  .group-data {
    .el-image {
      width: 4em;
      height: 4em;
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
    .el-form-item {
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
.hichat-pc {
  .home-content {
    .group-data {
      .el-image {
        width: auto;
        height: 6em;
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
      padding: 0 !important;
      .el-button {
        &:nth-child(2) {
          border-left: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
