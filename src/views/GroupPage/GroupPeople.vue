<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="125px">
          <div class="home-header">
            <div class="home-user" @click="back" style="position: absolute"></div>
            <span class="home-header-title"
              >成员 ({{ contactList.length }})
            </span>
            <template v-if="groupData.isAdmin && !editBtnShow">
              <router-link :to="'GroupAddPeople'" style="position: absolute; right: 50px;">
                <div class="home-add-user" ></div>
              </router-link>  
              <div class="home-user-edit" @click="(editBtnShow = true) && (checkList = [])"></div>
            </template>
            <template v-else-if="groupData.isAdmin">
              <div class="cancel"  @click="editBtnShow = false">取消</div>
            </template>
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
        <template v-if="!editBtnShow">
          <div class="home-content" >
            <div class="el-checkbox-group">
              <label class="el-checkbox">
                <span class="el-checkbox__label">
                  <div class="address-box"
                    v-for="(item, index) in contactList"
                    :key="index"
                    @click="goContactPage(item)">
                    <el-image :src="item.icon" v-if="item.icon !== undefined" lazy/>
                    <div class="msg-box">
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </span>
              </label>
            </div>

          </div>
        </template>
        <template v-else>
          <div class="home-content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                v-for="(item, index) in contactList"
                :label="item.memberId"
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
        <div class="home-footer-btn" v-if="editBtnShow">
          <el-button
            :class="disabled ? 'gray-btn' : 'red-btn'"
            :disabled="disabled"
            @click="leaveUserDialogShow = true"
            >退出</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="leaveUserDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>确认是否将所选的联络人退出群组？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="leaveUserDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="removeGroupMember">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { developmentMessage } from "@/assets/tools";
import { groupListMember,removeMember } from "@/api";

export default {
  name: "GroupPeople",
  data() {
    return {
      groupData: {},
      checkList: [],
      contactList: [],
      searchKey: "",
      disabled: true,
      editBtnShow: false,
      leaveUserDialogShow: false,
      developmentMessage: developmentMessage,
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
      this.disabled = !val.length > 0;
    },
  },
  methods: {
    getGroupListMember() {
      let groupId = this.groupData.groupId
      groupListMember({ groupId }).then((res) => {
        this.contactList = res.data.list;
        this.contactList.forEach((res) => {
          if (res.icon === undefined){
            res.icon = require("./../../../static/images/image_user_defult.png");
          }
        });
        localStorage.setItem('groupDataList',JSON.stringify(this.contactList))
      });
    },
    removeGroupMember(){
      let param = {
        groupId: this.groupData.groupId,
        memberList: this.checkList
      }
      removeMember(param).then((res)=>{
        if(res.code === 200) this.$router.push({ path: "/GroupPage" });
      })
      .catch((err) => {console.log(err)})
    },
    back() {
      this.$router.back(-1);
    },
    goContactPage(data){
      if(data.memberId === JSON.parse(localStorage.getItem("id"))){
        this.$message({ message: "此即为您的帐号", type: "warning" });
      }else{
        data.toChatId = "u" + data.memberId;
        localStorage.setItem("userData", JSON.stringify(data));
        this.$router.push({ name: 'ContactPage' });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .home-header {
    margin: 1.5em 1em 1em 1em !important;
    .home-user {
      background-color: #fff;
      background-image: url("./../../../static/images/back.png");
    }
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/add.png");
      margin-right: 10px;
    }
    .home-user-edit {
      width: 2em;
      height: 2em;
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
      position: absolute;
      right: 16px;
    }
    .cancel{
      position: absolute;
      right: 14px;
      color:#fe5f3f;
      font-weight:550;
      font-size:17px
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
                margin-top: 1em;
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
    .address-box {
      background-color: #ffffff;
      padding: 0.8em 1em;
      display: flex;
      align-items: center;
      font-size: 14px;
      /deep/.el-image {
        width: 3em;
        height: 48px;
        border-radius: 10px;
        .el-image__inner{
          height: auto;
          border-radius: 10px;
        }
        .el-image__error{
          height: 48px;
          font-size: 10px;
        }
      }    
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
            margin-top: 1em;
            width: 100%;
            border-bottom: 0.02em solid #b3b3b3;
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
