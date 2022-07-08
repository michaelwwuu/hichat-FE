<template>
  <div class="home-content" style="border-top: 1px solid rgba(0, 0, 0, 0.05);">
    <el-checkbox-group v-model="checkList" @touchmove="$root.handleTouch">
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
</template>

<script>
import Socket from "@/utils/socket";

import { getContactList } from "@/api";
import { mapMutations } from "vuex";
import { getToken } from "_util/utils.js";


export default {
  name: "Spread",
  data() {
    return {
      searchKey: "",
      checkList: [],
      contactList: [],
      newContactList:[],
      device: localStorage.getItem("device"),
    };
  },
  created() {
    this.getAddressList();
    this.setSpreadDataList([])
    Socket.$on("message", this.handleGetMessage);
  },
  beforeDestroy() {
    Socket.$off("message", this.handleGetMessage);
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
      this.newContactList = this.searchData
    },
    checkList(val){
      this.setSpreadDataList(val)
    }
  },
  methods: {
    ...mapMutations({
      setSpreadDataList:"ws/setSpreadDataList",
    }),    
    getAddressList() {
      getContactList().then((res) => {
        this.contactList = res.data.list.filter(
          (el) => el.contactId !== localStorage.getItem("id")
        );
        this.contactList.forEach((res) => {
          if (res.icon === undefined) {
            res.icon = require("./../../../../static/images/image_user_defult.png");
          }
        });
        this.newContactList = this.contactList
      });
    },
    // 收取 socket 回来讯息 (全局讯息)
    handleGetMessage(msg) {
      let userInfo = JSON.parse(msg);
      switch (userInfo.chatType) {
        case "SRV_USER_IMAGE":
        case "SRV_USER_AUDIO":
        case "SRV_USER_SEND":
        case "SRV_GROUP_IMAGE":
        case "SRV_GROUP_AUDIO":
        case "SRV_GROUP_SEND":
          this.getHiChatDataList();
          break;
      }
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
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    .home-user {
      background-color: #fff;
      background-image: url("./../../../../static/images/back.png");
    }
    .home-user-pc {
      background-color: #fff;
      background-image: url("./../../../../static/images/pc/arrow-left.png");
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
                border-bottom: 0.1em solid rgba(0, 0, 0, 0.05);
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
