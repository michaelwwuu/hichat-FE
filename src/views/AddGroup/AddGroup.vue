<template>
  <div class="home-wrapper">
    <div class="home-header">
      <router-link :to="'/Home'">
        <div class="home-user"></div>
      </router-link>
      <span class="home-header-title">创建群组</span>
      <router-link :to="'/QRcode'"
        ><div class="home-add-user"></div
      ></router-link>
    </div>
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
      <el-checkbox-group v-model="checkList"  @change="handleCheckedCitiesChange">
        <el-checkbox :label="item" v-for="(item, index) in contactList" :key="index">
          <div class="address-box">
            <el-image :src="item.icon" lazy />
            <div class="msg-box"><span>{{ item.name }}</span></div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { getContactList } from "@/api";

export default {
  name: "AddGroup",
  data() {
    return {
      contactList:[],
      searchKey: "",
      checkList:[],
      avatarImg: require("./../../../static/images/image_user_defult.png"),
      developmentMessage:developmentMessage
    };
  },
  created() {
    this.getAddressList()
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
    handleCheckedCitiesChange() {
      console.log(this.checkList)

    },
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow-x: hidden;
  overflow-y: auto;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
    position: fixed;
    width: -webkit-fill-available;
    background-color: #eaf5fa;
    z-index: 9;
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
    .home-add-user {
      width: 2em;
      height: 2em;
    }
  }
  .home-search {
    margin: 1em;
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
    /deep/.el-checkbox{
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #FFF;
      width: 100vw;
      .el-checkbox__input{
        padding-right: 20px;
      }
      .el-checkbox__label{
        width: 100%;
        padding-left:0;
        .address-box {
          background-color: #ffffff;
          padding: 0.8em 1em;
          display: flex;
          align-items: center;
          .el-image {
            width: 3em;
            border-radius: 10px;
          }
          .msg-box {
            span {
              display: block;
              padding-left: 1em;
              font-size: 16px;
              color: #666666 ;
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
          .checkBox{
            position: absolute;
            right: 1.5em;
            font-size: 14px;
          }
        }
      }
    }
  }

}
</style>
