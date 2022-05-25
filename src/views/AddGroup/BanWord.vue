<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">禁用詞設定</span>
            <router-link
              :to="''"
            >
              <div class="home-add-user">＋</div>
            </router-link>
          </div>
          <div class="home-search" >
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </el-header>
        <div class="home-content">
          <div
            class="setting-button"
            v-for="(item, index) in banMessage"
            :key="index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ item.value }}</span>
              </div>
              <div class="setting-button-right">
                <span @click="unAdmin(item)">－</span>
              </div>
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >儲存設定</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="125px">
          <div class="home-header">
            <span class="home-header-title">
              <div
                style="
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  margin-left: 5px;
                  margin-top: 1px;
                "
              >
                <span style="padding-right: 10px" @click="back()"
                  ><img src="./../../../static/images/pc/arrow-left.png" alt="" style="height: 1.4em;"
                /></span>
                <span>禁用詞設定</span>
              </div>
            </span>
            <router-link :to="''">
              <div class="home-add-user">＋</div>
            </router-link>
          </div>
          <div class="home-search" >
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
            >
            </el-input>
          </div>
        </el-header>
        <div class="home-content">
          <div
            class="setting-button"
            v-for="(item, index) in banMessage"
            :key="index"
          >
            <div class="setting-box">
              <div class="setting-button-left">
                <span>{{ item.value }}</span>
              </div>
              <div class="setting-button-right">
                <span @click="unAdmin(item)">－</span>
              </div>
            </div>
          </div>
        </div>
        <div class="home-footer-btn">
          <el-button
            class="orange-btn"
            >儲存設定</el-button
          >
        </div>
      </el-aside>
    </el-container>    
    <el-dialog
      :visible.sync="unBanShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
      append-to-body
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>是否確定要刪除該則禁用字詞？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="unBanShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="unBanAction">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import { addGroup } from "@/api";

export default {
  name: "AdminSetting",
  data() {
    return {
      searchKey:"",
      banMessage:[
        {
          name:"ban1",
          value:"請多指教",
        },
        {
          name:"ban2",
          value:"請勿",
        },
      ],
      banObject:{},
      unBanShow:false,
      device: localStorage.getItem("device"),
    };
  },
  computed: {
    ...mapState({
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },  
  methods: {
    unAdmin(data){
      this.unBanShow = true
      this.banObject = data
    },
    unBanAction(){
      console.log(this.banObject)
    },
    back() {
      this.$router.back(-1);
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
      background-image: url("./../../../static/images/pc/arrow-left.png");
      cursor: pointer;
    }
    // .home-add-user {
    //   background-color: #fff;
    //   background-image: url("./../../../static/images/edit.png");
    // }    
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
      a,.setting-box {
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
  }
}
.el-dialog-loginOut {
  overflow: auto;
  /deep/.el-dialog {
    margin: 0 auto 50px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
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
</style>
