<template>
  <div class="home-wrapper">
    <el-container>
      <el-main>
        <el-header height="55px">
          <div class="home-header">
            <router-link :to="'/Setting'">
              <div class="home-user"></div>
            </router-link>
            <span class="home-header-title">封锁名单</span>
            <template v-if="editBtnShow">
              <div class="home-user-edit" :class="{'hidden':blockData.length <= 0}" @click="editBtnShow = false"></div>
            </template>
            <template v-else>
              <div class="cancel"  @click="editBtnShow = true">取消</div>
            </template>
          </div>
        </el-header>
        <template v-if="blockData.length <= 0">
          <div class="no-data">
            <span>封锁名单无资料</span>
          </div>
        </template>
        <template v-else>
          <div class="home-content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                v-for="(item, index) in blockData"
                :label="item.blockId"
                :key="index"
                :disabled="editBtnShow"
                :class="{'hidden':editBtnShow}"
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
        <div class="home-footer-btn" v-if="!editBtnShow">
          <el-button
            :class="disabled ? 'gray-btn' : 'orange-btn'"
            :disabled="disabled"
            @click="settingDialogShow = true"
            >解除封鎖</el-button
          >
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="settingDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/warn.png" alt="" /></div>
        <span>确认是否将所选联络人解除封锁？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="border-red" @click="settingDialogShow = false"
          >取消</el-button
        >
        <el-button class="background-red" @click="unblockDialogShow = true"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="unblockDialogShow"
      class="el-dialog-loginOut"
      width="70%"
      :show-close="false"
      center
    >
      <div class="loginOut-box">
        <div><img src="./../../../static/images/success.png" alt="" /></div>
        <span>封锁已解除</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="background-orange" @click="unBlockSubmit">確認</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { blockListMember,unBlockUser } from "@/api";
export default {
  name: "BlockMange",
  data() {
    return {
      blockData:[],
      checkList: [],
      disabled: true,
      editBtnShow:true,
      settingDialogShow:false,
      unblockDialogShow:false,
    };
  },
  mounted() {
    this.getBlockDataList()
  },
  watch: {
    checkList(val) {
      this.disabled = !val.length > 0;
    },
  },
  methods: {
    getBlockDataList(){
      blockListMember().then((res)=>{
        if(res.code === 200){
          this.blockData = res.data;
        }
      })
      .catch((err) => {
        this.$message({ message: err, type: "error"});
        return false;
      });
    },
    unBlockSubmit(){
      let blockIdList = this.checkList
      unBlockUser({blockIdList}).then((res) => {
        if(res.code === 200){
          this.settingDialogShow = false;
          this.unblockDialogShow = false;
          this.editBtnShow = true;
          this.getBlockDataList()
        }
      })
      .catch((err) => {
        this.$message({ message: err, type: "error"});
        return false;
      });
    }
    
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
    .home-add-user {
      background-color: #fff;
      background-image: url("./../../../static/images/edit.png");
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
    }
    .home-user-edit.hidden {
      visibility: hidden;
    }    
    .cancel{
      width: 2em;
      color:#fe5f3f;
      font-weight:550;
      font-size:16px
    }

  }
  .home-content {
    padding: 1em 0 0 0;
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
  .no-data {
    margin: 1em 0;
    text-align: center;
    color: #444444;
    font-size: 14px;
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
}
</style>
