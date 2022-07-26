<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <router-link :to="'/Home'">
              <div class="home-user"></div>
            </router-link>
            <span class="home-header-title">私讯广播</span>
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
              :label="item"
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
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="chooseContact(checkList)"
            >选择联络人</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">私讯广播</span>
          </div>
        </el-header>
        <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
          <div class="home-search">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </div>
        <div class="home-content">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              :label="item"
              v-for="(item, index) in newContactList"
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
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="chooseContact(checkList)"
            >选择联络人</el-button
          >
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { getContactList } from "@/api";

export default {
  name: "SpreadChange",
  data() {
    return {
      checkList: [],
      contactList: [],
      newContactList: [],
      searchKey: "",
      disabled: true,
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getAddressList();
  },
  watch: {
    checkList(val) {
      this.disabled = !val.length > 0;
    },
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
  methods: {
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list.filter(
          (el) => el.contactId !== localStorage.getItem("id")
        );
        this.contactList.forEach((res) => {
          if (res.icon === undefined) {
            res.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.newContactList = this.contactList;
      });
    },
    chooseContact(data) {
      if (this.device === "moblie") {
        this.$router.push({
          name: "spreadMessage",
          params: { spreadData: data },
        });
      }
    },
    back() {
      this.$router.push({ path: "/HiChat" });
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
  .user-edit-form {
    margin: 1em;
    background-color: #fff;
    border-radius: 10px;
    /deep/.el-form {
      .el-form-item {
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
  .add-content {
    .user-data {
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
  .el-dialog {
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

    .el-container {
      .el-aside {
        .add-content {
          .user-data {
            .el-image {
              width: 5em;
              height: 5em;
            }
            span {
              height: 5.5em;
            }
          }
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
              background: none;
            }
          }
        }
      }
    }
    .photo-edit {
      cursor: pointer;
    }
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
