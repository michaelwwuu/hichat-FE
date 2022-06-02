<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">管理员设定</span>
            <router-link to="/AdminSettingPage">
              <div class="home-add-user"></div>
            </router-link>
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
          <div v-for="(item, index) in isManagerList" :key="index">
            <div class="setting-button mt10">
              <div class="setting-box">
                <div class="setting-button-left">
                  <div class="el-image">
                    <img :src="item.icon" alt="" class="el-image__inner" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
                <div class="setting-button-right">
                  <a @click="addAdmin(item)">
                    <img src="./../../../static/images/next.png" alt="" />
                  </a>
                  <span @click="unAdmin(item)">－</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-aside width="300px">
        <el-header height="70px">
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
                <span>管理员设定</span>
              </div>
            </span>
            <router-link to="/AdminSettingPage">
              <div class="home-add-user"></div>
            </router-link>
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
          <div v-for="(item, index) in isManagerList" :key="index">
            <div class="setting-button mt10">
              <div class="setting-box">
                <div class="setting-button-left">
                  <div class="el-image">
                    <img :src="item.icon" alt="" class="el-image__inner" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
                <div class="setting-button-right">
                  <router-link to="/AdminSettingDetail">
                    <img src="./../../../static/images/next.png" alt="" />
                  </router-link>

                  <span @click="unAdmin(item)">－</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
    <el-dialog
      :visible.sync="unAdminShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
      center
      append-to-body
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>是否確定要移除 {{ unAdminData.name }} 管理員</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="unAdminShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="unAdminAction"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import { groupListMember,delManager } from "@/api";

export default {
  name: "AdminSetting",
  data() {
    return {
      searchKey: "",
      unAdminShow: false,
      isManagerList: [],
      unAdminData: {},
      device: localStorage.getItem("device"),
    };
  },
  created() {
    if(this.device === "moblie"){
      this.groupData = JSON.parse(localStorage.getItem("groupData"));
    }else{
      this.groupData = this.groupUser
    }
  },
  mounted() {
    if(!this.groupPermissionData.addGroup) this.getGroupListMember();
  },
  computed: {
    ...mapState({
      groupUser: (state) => state.ws.groupUser,
      groupPermissionData: (state) => state.ws.groupPermissionData,
    }),
  },
  methods: {
    getGroupListMember() {
      let groupId = this.groupData.groupId;
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined) {
            res.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        this.isManagerList = this.contactList.filter(
          (el) => el.isManager
        );
      });
    },    
    unAdmin(data) {
      this.unAdminShow = true;
      this.unAdminData = data;
    },
    unAdminAction() {
      let params = {
        groupId:this.unAdminData.groupId,
        memberId:this.unAdminData.memberId,
      }
      delManager(params).then((res)=>{
        if(res.code === 200){
          this.unAdminShow = false;
          this.getGroupListMember()
        }
      })  
    },
    addAdmin(data){
      this.$router.push({ name: "AdminSettingDetail",params:data });
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
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
    }
    .home-add-user-pc {
      background-color: #fff;
      background-image: url("./../../../static/images/pc/edit_info.png");
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
        width: 94%;
        /* margin-left: 0; */
        position: relative;
        top: -14px;
        left: 74px;
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
        .el-image {
          .el-image__inner {
            height: -webkit-fill-available !important;
          }
        }
      }

      .setting-button-left {
        display: flex;
        align-items: center;
        width: 20em;
        span {
          font-size: 16px;
          padding-left: 1em;
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
          color: #fe5f3f;
          border: 1px solid #fe5f3f;
          cursor: pointer;
        }
      }
    }
  }
}
.hichat-pc {
  .home-wrapper {
    .home-header {
      .home-add-user {
        background-color: #fff;
        background-image: url("./../../../static/images/pc/edit_info.png");
      }
    }
    .home-search {
      .el-input {
        width: 95%;
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
