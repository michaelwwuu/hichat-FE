<template>
  <div class="home-wrapper">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header :height="groupEditShow?'125px':'60px'">
          <div class="home-header">
            <router-link :to="'/Home'" v-if="groupEditShow">
              <div class="home-user"></div>
            </router-link>
            <div class="home-user" v-else @click="groupEditShow = true"></div>
            <span class="home-header-title">创建群组</span>
            <div class="home-add-user"></div>
          </div>
          <div class="home-search" v-if="groupEditShow">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              @keyup.native.enter="developmentMessage(searchKey)"
            >
            </el-input>
          </div>
        </el-header>
        <template v-if="groupEditShow">
          <div class="home-content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                :label="item"
                v-for="(item, index) in contactList"
                :key="index"
              >
                <div class="address-box">
                  <el-image :src="item.icon"/>
                  <div class="msg-box">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="home-footer-btn">
            <el-button
              :class="disabled ? 'gray-btn' : 'orange-btn'"
              :disabled="disabled"
              @click="createGroup"
              >邀请联络人</el-button
            >
          </div>
        </template>
        <template v-else>
          <div class="add-content">
            <div class="user-data">
              <span><el-image :src="groupIcon === ''?require('./../../../static/images/image_group_defult.png') : groupIcon" alt="" /></span>
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
          
          <div class="home-content">
            <label class="el-checkbox">
              <span class="el-checkbox__label">
                <div class="address-box" v-for="(item, index) in checkList" :key="index">
                  <el-image :src="item.icon" />
                  <div class="msg-box">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </span>
            </label>
          </div>
          <div class="home-footer-btn">
            <el-button
              :class="disableEditSubmit ? 'gray-btn' : 'orange-btn'"
              :disabled="disableEditSubmit"
              @click="editSubmit"
              >创建群组</el-button
            >
          </div>
        </template>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="20%">
        <el-header height="70px">
          <div class="home-header flex-start" >
            <router-link :to="'/Home'" v-if="groupEditShow">
              <div class="home-user-pc"></div>
            </router-link>
            <div class="home-user-pc" v-else @click="groupEditShow = true"></div>
            <span class="home-header-title">创建群组</span>
          </div>
        </el-header>
        <div v-if="groupEditShow" style="border-bottom: 1px solid #e1e1e1b0;">
          <div class="home-search" >
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              @keyup.native.enter="developmentMessage(searchKey)"
            >
            </el-input>
          </div>
        </div>
        <template v-if="groupEditShow">
          <div class="home-content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                :label="item"
                v-for="(item, index) in contactList"
                :key="index"
              >
                <div class="address-box">
                  <el-image :src="item.icon"/>
                  <div class="msg-box">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="home-footer-btn">
            <el-button
              :class="disabled ? 'gray-btn' : 'orange-btn'"
              :disabled="disabled"
              @click="createGroup"
              >邀请联络人</el-button
            >
          </div>
        </template>
        <template v-else>
          <div class="add-content">
            <div class="user-data">
              <span><el-image :src="groupIcon === ''?require('./../../../static/images/image_group_defult.png') : groupIcon" alt="" /></span>
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
          
          <div class="home-content">
            <label class="el-checkbox">
              <span class="el-checkbox__label">
                <div class="address-box" v-for="(item, index) in checkList" :key="index">
                  <el-image :src="item.icon" />
                  <div class="msg-box">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </span>
            </label>
          </div>
          <div class="home-footer-btn">
            <el-button
              :class="disableEditSubmit ? 'gray-btn' : 'orange-btn'"
              :disabled="disableEditSubmit"
              @click="editSubmit"
              >创建群组</el-button
            >
          </div>
        </template>
      </el-aside>
    </el-container>
    <el-dialog
      title="上傳群组照片"
      :visible.sync="uploadImgShow"
      :class="{'el-dialog-loginOut':device ==='pc'}"
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
        <template v-if="device ==='moblie'">
          <el-button type="success" @click="submitAvatarUpload">确认</el-button>
          <el-button @click="uploadImgShow = false">取 消</el-button>
        </template>
        <template v-else>
          <el-button class="background-gray" @click="uploadImgShow = false">取消</el-button>
          <el-button class="background-orange" @click="submitAvatarUpload">确认</el-button>
        </template>        
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import { getContactList,uploadGroupIcon,addGroup } from "@/api";

export default {
  name: "AddGroup",
  data() {
    return {
      checkList: [],
      contactList: [],
      groupForm: {
        name: ""
      },
      searchKey: "",
      groupIcon: "",
      fileList: [],
      disabled: true,
      groupEditShow:true,
      uploadImgShow: false,
      disableEditSubmit:true,
      developmentMessage: developmentMessage,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getAddressList();
  },
  watch:{
    checkList(val) {
      this.disabled = !val.length > 0
    },
    groupForm:{
      handler(val) {
        this.disableEditSubmit = !val.name
      },
      deep: true,
    }
  },
  methods: {
    ...mapMutations({
      setChatGroup:"ws/setChatGroup",
    }),
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined)
            res.icon = require("./../../../static/images/image_user_defult.png");
        });
      });
    },
    createGroup(){
      if(this.checkList.length > 0) this.groupEditShow = false;
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
      this.disableEditSubmit = true
      addGroup(params).then((res) => {
        if (res.code === 200) {
          let groupData = { 
            groupId: res.data.id,
            groupName: res.data.groupName,
            icon: this.groupIcon,
            isAdmin: true,
            memberId: JSON.parse(localStorage.getItem("id")),
          }
          localStorage.setItem("groupData", JSON.stringify(groupData))
          this.setChatGroup(this.groupData)
          this.$router.push({ path: this.device === 'moblie' ? "/ChatGroupMsg" : "home" });
        }
      })
      .catch((err) => {
        this.$message({ message: err, type: "error"});
        return false;
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
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
  }
  .home-content {
    /deep/.el-checkbox {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      width: 100vw;
      .el-checkbox__input {
        padding-right: 20px;
        .el-checkbox__inner{
          border-radius: 10px;
        }
      }
      .el-checkbox__label {
        width: 100%;
        padding-left: 0;
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
                margin-top: 0.5em;
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
    }
  }
  .user-edit-form {
    margin: 1em;
    background-color: #fff;
    border-radius: 10px;
    /deep/.el-form {
      .el-form-item{
        margin-bottom: 0px;
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
  .add-content{
    .user-data{
      margin: 1.5em auto 0 auto;
      span {
        display: block;
        text-align: center;
        height: 3.5em;
      }
      .photo-edit {
        height: 1.5em !important;
        color: #fe5f3f;
      }
    }
  }
}
/deep/.el-dialog__wrapper {
  .el-dialog{
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
}

.hichat-pc{
  .home-wrapper{
    .home-search{
      .el-input{
        width: 95%;
      }
    }
    .home-content{
      .el-checkbox{
        width: 100%;
      }
      .el-checkbox__label{
        .address-box{
          .msg-box {
            span {
              &::after {
                content: "";
                margin-top: 1em;
              }
            }
          }
        }
      }
    }

    .el-container{
      .el-aside{
        .add-content{
          .user-data{
            .el-image{
              width: 5em;
              height: 5em;
            }
            span{
              height: 5.5em;
            }
          }
        }
      }
    }
    .user-edit-form{
      /deep/.el-form{
        border-radius: 8px;
        background-color: #eaeaea;
        .el-form-item{
          .el-form-item__label {
            font-size: 17px;
          }
          .el-input{
            .el-input__inner{
              background-color: #eaeaea;
            }
          }
        }
      }
    }
    .photo-edit {
      cursor: pointer;
    }
  }
  .el-dialog-loginOut{
    /deep/.el-dialog__footer {
      padding:0 !important;
      .el-button{
        &:nth-child(2){
          border-left: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
