<template>
  <div class="wrapper">
    <el-container>
      <el-main style="overflow-y: auto; overflow-x: hidden">
        <el-header
          height="70px"
          class="PC-header"
        >
          <div class="home-header-pc">
            <div class="home-search">
              <el-input
                placeholder="搜索聯絡人"
                prefix-icon="el-icon-search"
                clearable
                v-model="searchKey"
              >
              </el-input>
            </div>
            <div class="home-header-title">私讯广播</div>
            <el-button type="danger" @click="back()">取消</el-button>
          </div>
        </el-header>
        <el-main>
          <message-pabel />
          <message-input />
        </el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getToken } from "_util/utils.js";
import { mapMutations } from "vuex";
import MessagePabel from "@/components/message-spread-moblie";
import MessageInput from "@/components/message-spread-input-moblie";
export default {
  name: "ChatMsg",
  data() {
    return {
      searchKey:"",
      textArea:"",
      messageData: [],
      device: localStorage.getItem("device"),
    };
  },
  methods: {
    ...mapMutations({
      setSpreadDataList:"ws/setSpreadDataList",
    }),    
    back(){
      this.setSpreadDataList([])
      this.$router.push({name:'HiChat'})
    },
  },
  components: {
    MessagePabel,
    MessageInput,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
  width: 100%;
  background-color: #eef7fb;
  overflow: hidden;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .el-aside,
    .el-main {
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      /deep/.el-row {
        float: right;
        .el-button {
          background-image: linear-gradient(#579fff, #3481e8);
          color: #ffffff;
        }
        .el-checkbox__inner {
          border-radius: 0;
          border: 1px solid #dcdfe6;
          &::after {
            border: 1px solid #4fba00;
            border-left: 0;
            border-top: 0;
          }
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #ffffff;
        }
        .el-checkbox__label {
          color: #fff;
        }
      }
    }
    .el-aside {
      border-radius: 6px 0px 6px 6px;
    }
    .el-main {
      border-radius: 0px 6px 6px 6px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    .el-header {
      position: relative;
      padding: 0;
      .home-header {
        margin: 1.5em 1em 1em 1em;
        display: flex;
        align-items: center;
        .home-user-link {
          position: absolute;
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
        }
        .home-header-title {
          margin: 0 auto;
          color: #10686e;
          font-weight: 600;
        }
        .home-user-photo,
        .home-user-search {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          // background-color: #fff;
          background-size: 50%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search {
          margin-right: 10px;
          position: absolute;
          right: 50px;
          background-image: url("./../../../static/images/search_icon.png");
        }
        .home-photo-link {
          position: absolute;
          right: 14px;
          .home-user-photo {
            text-align: center;
            overflow: hidden;
            img {
              top: 0;
              height: 2em;
              border-radius: 6px;
            }
          }
        }
      }
      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
    .PC-header {
      position: relative;
      padding: 0;
      background-color: #ffffff;
      display: flex;
      .home-header-pc {
        margin: 1em;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .home-search{
          display: block;
          margin:0;
        }
        .home-user-link {
          position: absolute;
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
        }
        .home-header-title {
          margin: 0 auto;
          color: #10686e;
          font-weight: 600;
          position: absolute;
          left: 45em;          
        }
        .home-user-photo,
        .home-user-search,
        .home-user-more {
          width: 2em;
          height: 2em;
          border-radius: 10px;
          background-size: 70%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .home-user-search {
          position: absolute;
          right: 70px;
          background-image: url("./../../../static/images/pc/search.png");
          cursor: pointer;
        }
        .home-user-more {
          background-image: url("./../../../static/images/pc/more.png");
          cursor: pointer;
        }
        .home-photo-link {
          position: absolute;
          left: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          .home-user-photo {
            text-align: center;
            overflow: hidden;
            img {
              top: 0;
              height: 2em;
              border-radius: 6px;
              width: inherit;
            }
          }
          span {
            font-size: 15px;
            padding-left: 10px;
            font-weight: 600;
          }
        }
        .contact-box {
          position: absolute;
          right: 0;
          width: 600px;
          ul {
            justify-content: flex-end;
            li {
              margin-left: 5em;
              cursor: pointer;
              img {
                height: 1.2em;
                right: 5px;
                top: 4px !important;
              }
            }
          }
        }
      }

      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
    .contact-box {
      background-color: #ffffff;
      width: 100vw;
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 3em;
        width: 70vw;
        margin: 0 auto;
        font-weight: 550;
        li {
          &:nth-child(1) {
            color: #ee5253;
          }
          &:nth-child(2) {
            color: #ee5253;
          }
          &:nth-child(3) {
            color: #363636;
          }
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
.disabled-user {
  height: 50px;
  background-color: rgba(225, 225, 225, 0.85);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}
.top-msg-bottom {
  height: 59px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: #959393;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
}
.reply-message {
  height: 50px;
  background-color: rgba(225, 225, 225, 0.85);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  color: rgba(0, 0, 0, 0.4);
  // justify-content: center;
  align-items: center;
  padding: 10px;
  .reply-message-box {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    span {
      line-height: 20px;
      color: #363636;
      width: 90em;
      word-wrap: break-word;
    }
    .replyMsg-Img {
      img {
        height: 2em;
        border-radius: 5px;
      }
    }
  }
  .reply-close-btn {
    position: absolute;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
  }
  /deep/.el-avatar {
    overflow: initial;
    img {
      border-radius: 4px;
      width: -webkit-fill-available;
    }
  }
}
.hichat-pc {
  .disabled-user {
    height: 59px;
  }
}
/* width */
::-webkit-scrollbar {
  width: 10px;
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
.top-msg {
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.01em solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  .top-msg-left {
    display: flex;
    align-items: center;
    img {
      height: 1.5em;
    }
  }
  .top-msg-right {
    height: 1.2em;
    
  }
}
</style>
