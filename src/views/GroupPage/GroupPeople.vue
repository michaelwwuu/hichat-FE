<template>
  <div class="home-wrapper">
    <div class="home-header">
      <router-link :to="'/GroupPage'" style="position: absolute;">
        <div class="home-user"></div>
      </router-link>
      <span class="home-header-title">成员 ({{contactList.length}}) </span>
      <template v-if="groupData.isAdmin">
        <div class="home-add-user"></div>
        <div class="home-user-edit" @click="editBtnShow = true"></div>
      </template>
    </div>
    <template>
      <div class="home-search">
        <el-input
          placeholder="搜寻"
          prefix-icon="el-icon-search"
          v-model="searchKey"
          @keyup.native.enter="developmentMessage(searchKey)"
        >
        </el-input>
      </div>
      <div class="home-content" :class="{'noAdmin': groupData.isAdmin && !editBtnShow}">
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
      <div class="home-footer-btn" v-if="editBtnShow">
        <el-button
          :class="disabled ? 'gray-btn' : 'red-btn'"
          :disabled="disabled"
          @click="createGroup"
          >退出</el-button
        >
      </div>
    </template>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { getContactList } from "@/api";

export default {
  name: "GroupPeople",
  data() {
    return {
      groupData:{},
      checkList: [],
      contactList: [],
      searchKey: "",
      disabled: true,
      editBtnShow:false,
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.getAddressList();
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
  },
  watch:{
    checkList(val) {
      this.disabled = !val.length > 0
    }
  },
  methods: {
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined)
            res.icon = require("./../../../static/images/image_user_defult.png");
        });
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    margin: 1.5em 1em 1em 1em;
    position: fixed;
    width: -webkit-fill-available;
    background-color: #eaf5fa;
    z-index: 9;
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
    .home-add-user{
      background-color: #fff;
      background-image: url("./../../../static/images/add.png");
      position: absolute;
      right: 45px;
    }
    .home-user-edit{
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
      position: absolute;
      right: 0;
    }
  }
  .home-search {
    position: fixed;
    width: -webkit-fill-available;
    top: 3em;
    background-color: #eaf5fa;
    z-index: 9;
    /deep/.el-input {
      .el-input__inner {
        background-color: #e9e8e8;
        color: #666666;
      }
      .el-input__prefix {
        color: #666666;
      }
      ::placeholder {
        /* CSS 3 標準 */
        color: #666666;
      }
    }
  }
  .home-content {
    overflow-x: hidden;
    overflow-y: auto;
    height: 34.5em;
    position: relative;
    top: 7.5em;
    z-index: 8;
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
    }
  }
  .noAdmin{
    /deep/.el-checkbox__input{
      visibility: hidden;
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
    .red-btn {
      background-color: #ee5253;
      color: #fff;
    }
  }
}
</style>
