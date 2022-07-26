<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">禁言设定</span>
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
        <div class="home-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in newContactList"
              :label="
                !groupPermissionData.addGroup ? item.memberId : item.contactId
              "
              :key="index"
            >
              <div class="address-box">
                <el-image :src="item.icon" />
                <div class="msg-box">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="setBan">储存设定</el-button>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div
            class="home-header flex-start"
            :style="
              !groupPermissionData.addGroup
                ? 'position: relative; left: -4px; top: -1px;'
                : ''
            "
          >
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">禁言设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
          <div class="home-search">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              @keyup.native.enter="developmentMessage(searchKey)"
            >
            </el-input>
          </div>
        </div>
        <div class="home-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in newContactList"
              :label="
                !groupPermissionData.addGroup ? item.memberId : item.contactId
              "
              :key="index"
            >
              <div class="address-box">
                <el-image :src="item.icon" />
                <div class="msg-box">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="home-footer-btn">
          <el-button class="orange-btn" @click="setBan">储存设定</el-button>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { groupListMember, setBanPost, listMember } from "@/api";

export default {
  name: "SettingGroup",
  data() {
    return {
      checkList: [],
      contactList: [],
      newContactList: [],
      searchKey: "",
      device: localStorage.getItem("device"),
    };
  },

  created() {
    if (this.device === "moblie") {
      this.groupData = JSON.parse(localStorage.getItem("groupData"));
    } else {
      this.groupData = this.groupUser;
    }
  },
  mounted() {
    this.getGroupListMember();
  },
  watch: {
    searchKey(val) {
      let searchKeyData = val.split(" ");
      searchKeyData.forEach((el) => {
        let searchCase = this.contactList;
        this.searchData = searchCase.filter((item) => {
          return item.name.indexOf(el.replace("@", "")) !== -1;
        });
      });
      this.newContactList = this.searchData;
    },
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },
  methods: {
    ...mapMutations({
      setMsgInfoPage: "ws/setMsgInfoPage",
    }),
    getGroupListMember() {
      if (!this.groupPermissionData.addGroup) {
        let groupId = this.groupData.groupId;
        groupListMember({ groupId }).then((res) => {
          this.contactList = res.data.list;
          this.contactList.forEach((item) => {
            if (item.icon === undefined) {
              item.icon = require("./../../../static/images/image_user_defult.png");
            }
            if (item.isBanPost) {
              this.checkList.push(item.memberId);
            }
          });
          this.contactList = this.contactList.filter((el) => {
            return !el.isAdmin && !el.isManager;
          });
          this.newContactList = this.contactList;
        });
      } else {
        this.contactList = this.groupPermissionData.peopleData.filter((el) => {
          return el.isManager === undefined;
        });
        this.contactList.forEach((res) => {
          this.groupPermissionData.banPostMemberList.forEach((el) => {
            if (res.contactId === el) {
              this.checkList.push(res.contactId);
            }
          });
        });
        this.newContactList = this.contactList;
      }
    },
    setBan() {
      if (!this.groupPermissionData.addGroup) {
        let memberData = [];
        this.checkList.forEach((el) => {
          memberData.push(el);
        });
        let params = {
          groupId: this.groupData.groupId,
          memberId: memberData,
        };
        setBanPost(params).then((res) => {
          if (res.code === 200) {
            if (this.device === "moblie") {
              this.$router.push({ name: "SettingGroup" });
            } else {
              this.setMsgInfoPage({ pageShow: false, type: "SettingGroup" });
            }
          }
        });
      } else {
        this.groupPermissionData.banPostMemberList = this.checkList;
        this.$router.push({ name: "SettingGroup" });
      }
    },
    back() {
      if (this.device === "moblie") {
        this.$router.back(-1);
      } else {
        if (this.groupPermissionData.addGroup) {
          this.$router.back(-1);
        } else {
          this.setMsgInfoPage({ pageShow: false, type: "SettingGroup" });
        }
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
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/arrow-left.svg");
      cursor: pointer;
    }
  }
  .home-content {
    .setting-title {
      padding: 15px 20px;
      color: rgba(0, 0, 0, 0.4);
      font-size: 15px;
    }
    .setting-button {
      padding: 0.5em 0 0.5em 0.5em;
      background-color: #fff;
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        margin-left: 10px;
        position: relative;
        top: 9px;
      }
      a,
      .setting-box {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 0.5em 0.7em 0.5em 0;
        margin-left: 10px;
      }
      img {
        height: 1.2em;
      }
      .setting-button-left {
        display: flex;
        align-items: center;
        width: 20em;
        span {
          font-size: 15px;
          color: #333333;
        }
      }
      .setting-button-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10em;
        span {
          margin-right: 1em;
          font-size: 15px;
          color: #b3b3b3;
        }
      }
    }
    /deep/.el-checkbox {
      display: flex;
      align-items: center;
      flex-flow: row-reverse;
      background-color: #fff;
      width: 100vw;
      .el-checkbox__input {
        padding-right: 20px;
        .el-checkbox__inner {
          border-radius: 10px;
        }
      }
      .el-checkbox__label {
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
                margin-top: 0.65em;
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
}
.hichat-pc {
  .home-wrapper {
    .home-search {
      .el-input {
        width: 95%;
      }
    }
    .home-content {
      .el-checkbox {
        width: 100%;
      }
      .el-checkbox__label {
        .address-box {
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
  }
}
</style>
