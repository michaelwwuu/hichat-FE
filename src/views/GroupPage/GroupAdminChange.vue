<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container>
      <el-main>
        <template v-if="device === 'moblie'">
          <el-header height="125px">
            <div class="home-header">
              <div class="home-user" @click="back"></div>
              <span class="home-header-title">转移群主权限</span>
              <div class="home-add-user"></div>
            </div>
            <div class="home-search">
              <el-input
                placeholder="搜寻"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </el-header>
        </template>
        <template v-else>
          <el-header height="70px">
            <div
              class="home-header flex-start"
              style="position: relative; left: -4px; top: -1px"
            >
              <div class="home-user-pc" @click="back"></div>
              <span class="home-header-title">转移群主权限</span>
            </div>
          </el-header>
          <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
            <div class="home-search-pc">
              <el-input
                placeholder="搜寻"
                prefix-icon="el-icon-search"
                v-model="searchKey"
              >
              </el-input>
            </div>
          </div>
        </template>

        <div class="home-content">
          <el-radio-group v-model="checkList">
            <el-radio
              v-for="(item, index) in newContactList"
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
            @click="groupAdminChange = true"
            >转移</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :title="device === 'pc' ? '转移群主权限' : ''"
      :visible.sync="groupAdminChange"
      class="el-dialog-loginOut"
      width="75%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/warn.svg" alt="" />
        </div>
        <span>确认是否將管理者权限轉移給 {{ checkMember.name }} ？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :class="device === 'moblie' ? 'border-red' : 'background-gray'"
          @click="groupAdminChange = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="successDialogShow = true"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="device === 'pc' ? '转移群主权限' : ''"
      :visible.sync="successDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="loginOut-box">
        <div v-if="device === 'moblie'">
          <img src="./../../../static/images/success.png" alt="" />
        </div>
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="changeGroupAdmin"
          >確認</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { groupListMember, changeAdmin } from "@/api";

export default {
  name: "GroupAdminChange",
  data() {
    return {
      groupData: {},
      checkList: "",
      checkMember: "",
      contactList: [],
      newContactList:[],
      searchKey: "",
      disabled: true,
      successDialogShow: false,
      groupAdminChange: false,
      device: localStorage.getItem("device"),
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
      this.disabled = val === "";
      this.checkMember = this.contactList.filter(
        (el) => el.memberId === val
      )[0];
    },
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase = this.contactList;
        this.searchData = searchCase.filter((item) => {
          return item.name.indexOf(el.replace("@", "")) !== -1;
        });
      });
      this.newContactList = this.searchData
    },    
  },
  methods: {
    ...mapMutations({
      setInfoMsg: "ws/setInfoMsg",
      setChatGroup: "ws/setChatGroup",
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    getGroupListMember() {
      let groupId = this.groupData.groupId;
      groupListMember({ groupId })
        .then((res) => {
          this.contactList = res.data.list;
          this.contactList.forEach((res) => {
            if (res.icon === undefined) {
              res.icon = require("./../../../static/images/image_user_defult.png");
            }
            if (res.memberId === this.groupData.memberId) {
              this.checkList = res.memberId;
            }
          });
          this.newContactList = this.contactList
        })
        .catch((err) => {
          return false;
        });
    },
    changeGroupAdmin() {
      let param = {
        groupId: this.groupData.groupId,
        memberId: this.checkList,
      };
      changeAdmin(param)
        .then((res) => {
          if (res.code === 200) {
            this.groupData.isAdmin = false;
            // localStorage.setItem("groupData",JSON.stringify(this.groupData))
            this.setChatGroup(this.groupData);
            this.back();
          }
        })
        .catch((err) => {
          return false;
        });
    },
    back() {
      if (this.device === "moblie") {
        this.$router.back(-1);
      } else {
        this.setInfoMsg({ infoMsgShow: true, infoMsgChat: true });
        this.setMsgInfoPage({ pageShow: true });
      }
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
                margin-top: 0.5em;
                width: 100%;
                border-bottom: 0.02em solid rgba(0, 0, 0, 0.05);
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
          .background-orange {
            background-color: #fe5f3f;
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
.hichat-pc {
  .home-wrapper {
    .el-container {
      .el-main {
        border-radius: 0;
        .home-header {
          .home-user-pc {
            background-color: #fff;
            background-image: url("./../../../static/images/pc/arrow-left.png");
            cursor: pointer;
          }
        }
        .home-search-pc {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1em;
          .el-input {
            width: 95%;
            /deep/.el-input__inner {
              background-color: #e9e8e8;
              color: #666666;
            }
          }
        }
        .home-content {
          .el-radio-group {
            width: 100%;
            .el-radio {
              width: 100%;
            }
          }
        }
        .home-footer-btn {
          .el-button {
            padding: 9px 20px;
          }
        }
      }
    }
    .el-dialog-loginOut {
      /deep/.el-dialog {
        .el-dialog__footer {
          padding: 0;
          .el-button {
            &:nth-child(2) {
              border-left: 1px solid rgb(239, 239, 239);
            }
          }
        }
      }
    }
  }
}
</style>
