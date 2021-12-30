<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <router-link :to="'/GroupPage'">
              <div class="home-user"></div>
            </router-link>
            <span class="home-header-title">转移管理者权限</span>
            <div class="home-add-user"></div>
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
        </el-header>
        <div
          class="home-content"
          
        >
          <el-radio-group v-model="checkList">
            <el-radio
              v-for="(item, index) in contactList"
              :label="item.memberId"
              :key="index"
            >
              <div class="address-box">
                <el-image :src="item.icon" />
                <div class="msg-box">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="home-footer-btn">
          <el-button
            :class="disabled ? 'gray-btn' : 'red-btn'"
            :disabled="disabled"
            @click="GroupAdminChange = true"
            >转移</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="GroupAdminChange"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>确认是否將管理者權限轉移給 XXX ？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="GroupAdminChange = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="changeGroupAdmin">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { groupListMember,changeAdmin } from "@/api";

export default {
  name: "GroupAdminChange",
  data() {
    return {
      groupData: {},
      checkList: "",
      contactList: [],
      searchKey: "",
      disabled: true,
      GroupAdminChange: false,
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
  },
  mounted() {
    this.getGroupListMember();
  },
  watch: {
    checkList(val) {
      this.disabled = val === '';
    },
  },
  methods: {
    getGroupListMember() {
      let groupId = this.groupData.groupId
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined)
            res.icon = require("./../../../static/images/image_user_defult.png");
        })
        .catch((err) => {
          console.log(err)
        })
      });
      
    },
    changeGroupAdmin(){
      let param = {
        groupId: this.groupData.groupId,
        memberId: this.checkList
      }
      changeAdmin(param).then((res)=>{
        if(res.code === 200){
          this.$router.push({ name: "Address" });
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
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
    /deep/.el-radio {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      width: 100vw;
      .el-radio__input {
        padding-right: 20px;
        .el-radio__inner {
          border-radius: 10px;
        }
      }
      .el-radio__label {
        width: 100%;
        padding-left: 0;
        .address-box {
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
  /deep/.el-dialog-loginOut {
    overflow: auto;
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      background: #ffffff;
      border-radius: 10px;
      box-sizing: border-box;
      width: 50%;
      .el-dialog__header {
        padding: 10px;
      }
      .el-dialog__body {
        text-align: center;
        padding: 25px 25px 15px;
        .loginOut-box {
          img {
            height: 5em;
            margin-bottom: 1.2em;
          }
        }
      }
      .el-dialog__footer {
        padding: 20px;
        padding-top: 10px;
        text-align: right;
        box-sizing: border-box;
        .dialog-footer {
          display: flex;
          justify-content: space-between;
          .el-button {
            width: 100%;
            border-radius: 8px;
          }
          .background-red {
            background-color: #ee5253;
            color: #fff;
          }
          .border-red {
            border: 1px solid #fe5f3f;
            color: #fe5f3f;
          }
        }
      }
    }
  }
}
</style>
