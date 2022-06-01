<template>
  <div class="home-wrapper" @touchmove="$root.handleTouch">
    <el-container v-if="device === 'moblie'">
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back()"></div>
            <span class="home-header-title">管理员设定</span>
            <div class="home-add-user"></div>
          </div>
          <div class="home-search">
            <el-input
              placeholder="搜寻"
              prefix-icon="el-icon-search"
              v-model="searchKey"
              @keyup.native.enter="searchUserData(searchKey)"
            >
            </el-input>
          </div>
        </el-header>
        <div class="home-content">
          <div v-for="(item, index) in contactList" :key="index">
            <div class="setting-button mt10">
              <div class="setting-box">
                <div class="setting-button-left">
                  <div class="el-image">
                    <img :src="item.icon" alt="" class="el-image__inner" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
                <div class="setting-button-right">
                  <span @click="addAdmin(item)">＋</span>
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
          <div class="home-header flex-start">
            <div class="home-user-pc" @click="back()"></div>
            <span class="home-header-title">禁言设定</span>
            <div class="home-add-user"></div>
          </div>
        </el-header>
        <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.05);">
          <div class="home-search" >
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
          <div v-for="(item, index) in contactList" :key="index">
            <div class="setting-button mt10">
              <div class="setting-box">
                <div class="setting-button-left">
                  <div class="el-image">
                    <img :src="item.icon" alt="" class="el-image__inner" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
                <div class="setting-button-right">
                  <span @click="addAdmin(item)">＋</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>    
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import { developmentMessage } from "@/assets/tools";
import { groupListMember } from "@/api";

export default {
  name: "SettingGroup",
  data() {
    return {
      contactList: [],
      adminUser: [
        // {
        //   name: "Michael",
        //   icon: "http://test.hichat.tools/images/icon/68f981ed-c647-4ec1-b24d-dc0c1f2bee49.jpg",
        // },
      ],      
      searchKey:"",
      device: localStorage.getItem("device"),
    };
  },
  created() {
    // this.contactList = this.groupPermissionData.peopleData;
    if(this.device === "moblie"){
      this.groupData = JSON.parse(localStorage.getItem("groupData"));
    }else{
      this.groupData = this.groupUser
    }    
  },
  mounted() {
    this.getGroupListMember();
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
        this.setContactListData(this.contactList);
        this.checkDataList = this.contactList.filter(
          (el) => el.memberId !== this.groupData.memberId
        );
      });
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
.hichat-pc{
  .home-wrapper{
    .home-search{
      .el-input{
        width: 95%;
      }
    }
    .home-content{
      .el-checkbox{
        width: 100%;
      }
      .el-checkbox__label{
        .address-box{
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
