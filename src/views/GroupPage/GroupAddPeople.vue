<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back"></div>
            <span class="home-header-title">邀请联络人</span>
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
        <div class="home-content">
          <el-checkbox-group v-model="checkList"> 
            <el-checkbox
              v-for="(item, index) in newContactDataList"
              :label="item.memberId"
              :key="index"
              :disabled="item.disabled"
              :class="{'hidden':item.disabled}"
              
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
            @click="addMemberSubmitBtn"
            >邀请联络人</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="addUserDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>操作成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="back">確認</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { groupListMember,addMember } from "@/api";

export default {
  name: "GroupPeople",
  data() {
    return {
      groupData: {},
      checkList: [],
      contactList: [],
      newContactDataList:[],
      searchKey: "",
      disabled: true,
      addUserDialogShow: false,
      developmentMessage: developmentMessage,
    };
  },
  created() {
    this.groupData = JSON.parse(localStorage.getItem("groupData"));
    this.myContactDataList = JSON.parse(localStorage.getItem("myContactDataList"));
  },
  mounted() {
    this.getGroupListMember();
  },
  watch: {
    checkList(val) {
      this.disabled = !val.length > 0;
    },
  },
  methods: {
    getGroupListMember() {
      let groupId = this.groupData.groupId
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list
        this.newContactDataList = this.contactList.filter((item) =>{
          return this.myContactDataList.filter((el)=>{
            return JSON.parse(el.contactId) === item.memberId
          })
        })
        this.newContactDataList.forEach(el =>{
          this.contactList.forEach((item)=>{
            if(el.memberId === item.memberId) el.disabled = true;
            if(item.icon === undefined) item.icon = require("./../../../static/images/image_user_defult.png")
          })
        })
      });
    },
    addMemberSubmitBtn(){
      let params = {
        groupId: this.groupData.groupId,
        memberList: this.checkList
      }
      addMember(params).then((res) => {
        if(res.code === 200){
          this.addUserDialogShow = true;
        }
      })
    },
    back() {
      this.$router.back(-1);
    },
    notJoinTip(){
      console.log(123)
    }
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    margin: 1em;
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
    padding: 0;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
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
      .is-disabled{
        visibility: hidden;
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
                margin-top: 0.5em;
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
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eaf5fa;
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
    .orange-btn{
      background-color: #fe5f3f;
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
</style>
