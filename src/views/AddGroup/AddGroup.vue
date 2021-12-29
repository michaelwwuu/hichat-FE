<template>
  <div class="home-wrapper">
    <el-container>
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
        </el-header>
        <template v-if="groupEditShow">
          <div class="home-search">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              @keyup.native.enter="developmentMessage(searchKey)"
            >
            </el-input>
          </div>
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
          <group-edit :checkList="checkList"/>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { getContactList } from "@/api";
import GroupEdit from "./components/GroupEdit.vue";


export default {
  name: "AddGroup",
  data() {
    return {
      contactList: [],
      searchKey: "",
      disabled: true,
      groupEditShow:true,
      checkList: [],
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.getAddressList();
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
    createGroup(){
      if(this.checkList.length > 0) this.groupEditShow = false;
    }
  },
  components:{
    GroupEdit
  }
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
</style>
