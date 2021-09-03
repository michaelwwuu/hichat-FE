<template>
  <div class="rankBox">
    <div class="allBox">
      <div class="rankHead">
        <div class="admin">
          <span class="username">{{username}}</span>
        </div>
      </div>

      <div class="rankContent">
        <!-- table -->
        <div class="rankTable">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
      <div class="message"></div>
    </div>
  </div>
</template>

<script>
import { setLocal } from "_util/utils.js";
import { logout, setEngine, getUserInfo } from "@/api";
export default {
  data() {
    return {
      activeIndex: 0,
      showMain: true,
      showYu: false,
      guanjian: false,
      manange: false,
      //不確定是否要默認？應該不用，因為是從後端取的值
      engine: "",
      pageVal: "",
      username: localStorage.getItem('username'),
    };
  },
  computed: {
    // firstUserName() {
    //   return this.username.slice(0, 1).toUpperCase();
    // },
  },
  created() {
    this.judgeActiveIndex(this.$route.name);

    getUserInfo({}).then((user) => {
 
      // setLocal("engine", user.data.user.engine);
    });
  },
  methods: {
    hoverSide(val) {
      this.activeIndex = val.id - 1;
      if (val.router) this.$router.push(val.router);
      //登出
      if (val.id == 6) {
        this.$alert("是否確定要登出", "登出提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            if (action == "confirm") {
              logout(null).then((res) => {
                if (res.code == 200) {
                  window.localStorage.removeItem("token");
                  window.localStorage.removeItem("rememberMe");
                  this.$router.push({ name: "Login" });
                }
              });
            } else {
              return false;
            }
          },
        });
      }
    },
    returnIndex() {
      this.activeIndex = 0;
      this.$router.push({ name: "Home" });
    },
    //判斷當前頁面
    judgeActiveIndex(name) {
      switch (name) {
        case "Home":
          this.activeIndex = 0;
          break;
      }
    },
    //判斷更換引擎是否成功及記錄當前引擎
    getEngineData(val) {
      setEngine({ engine: val }).then((res) => {
        if (res.code == 200) {
          setLocal("engine", val);
          this.engine = val;
        }
      });
      this.$store.commit("getEngine", val);
    },
  },
};
</script>

<style lang="scss">
.rankBox {
  height: 100%;
  // background: url("../../assets/baidu/body-bg.png") no-repeat;
  background-size: 100% 100%;
  .allBox {
    margin: 0 auto;
    padding-bottom: 50px;
  }
  .rankHead {
    display: flex;
    justify-content: space-between;
    padding: 32px 100px;
    div {
      position: relative;
      &:first-child {
        width: auto;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      &:last-child {
        width: 105px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .username {
          margin-right: 10px;
          color: #000;
        }
        .firstusr {
          color: #fff;
          font-size: 20px;
          position: absolute;
        }
      }
    }
    .leftlogo {
      display: flex;
    }
    .el-select {
      margin-left: 40px;
      .el-input {
        width: 150px !important;
        height: 50%;
      }
    }
  }
  .rankContent {
    display: flex;
    height: 100%;
    margin: 0 auto;
    padding: 0 100px;
    .rankAside {
      width: 320px;
      .isActive {
        // background: url("../../assets/baidu/actived.svg") no-repeat 0 -6px;
      }
      ul {
        li {
          padding-top: 7px;
          line-height: 40px;
          cursor: pointer;
          &:hover {
            // background: url("../../assets/baidu/actived.svg") no-repeat 0 -6px;
          }
          .sideList {
            font-size: 27px;
            color: #fff;
          }
        }
      }
    }
    .rankTable {
      width: auto;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.185);
      .content {
        padding: 0 26px 1vh 26px;
        .tableHead {
          display: flex;
          width: 66vw;
          margin: 0 auto;
          padding: 41px 0;
          border-bottom: 1px solid #eaeaea;
          div {
            margin: 0 8px;
            &:first-child {
              margin-left: 0px;
            }
            &:last-child {
              margin-right: 0px;
            }
            .el-input__inner {
              font-family: "Helvetica Neue", Helvetica, "PingFang SC",
                "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial,
                sans-serif;
            }
          }
        }
        .table {
          width: 66vw;
          margin: 0 auto;
          padding: 10px 0 21px 0;
          thead {
            font-size: 11px;
            .caret-wrapper {
              font-size: 11px;
            }
          }
          tbody {
            font-size: 11px;
          }
          .el-table .warning-row {
            background: oldlace;
          }
          .el-table .success-row {
            background: #f0f9eb;
          }
          .el-table .caret-wrapper {
            font-size: 11px;
            width: 8px;
          }
          .el-button--mini {
            background: #5bc0de;
            color: #fff;
          }
          .mannage,
          .guanjian {
            display: flex;
            justify-content: flex-end;
            width: 95vw;
            margin: 0 auto;
            padding: 41px 0;
            border-bottom: 1px solid #eaeaea;
            div {
              margin: 0 8px;
              &:first-child {
                margin-left: 0px;
              }
              &:last-child {
                margin-right: 0px;
              }
            }
          }
        }
        .addKey {
          .el-dialog__wrapper {
            top: 8%;
          }
          .tip {
            margin: 15px 0px 0px 16px;
            font-size: 14px;
            font-weight: 300;
            line-height: 0.86;
            color: #868e96;
          }
          .footer {
            display: flex;
            justify-content: flex-end;
            span {
              width: 65px;
              height: 38px;
              line-height: 38px;
              opacity: 0.76;
              border-radius: 4px;
              text-align: center;
              font-size: 16px;
              cursor: pointer;
            }
            .cancel {
              border: solid 1px #868e96;
              background-color: #ffffff;
              margin-right: 20px;
            }
            .confirm {
              border: solid 1px #5595c8;
              background-color: #66afe9;
              color: #fff;
            }
          }
        }
      }
    }
    .el-button--primary {
      background: #1479bb;
    }
  }
}
.selectimg {
  width: 20px;
  margin-right: 7px;
  position: relative;
  top: 4px;
}
.el-select-dropdown__item {
  padding: 0 7px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
