<template>
  <div>
    <div class="home-header">
      <div class="home-user" @click="centerDialogVisible = true"></div>
      <span class="home-header-title">通訊錄</span>
      <router-link :to="'/AddUser'">
        <div class="home-add-user"></div>
      </router-link>
    </div>
    <div class="home-search">
      <el-input
        placeholder="输入欲搜寻的联络人"
        prefix-icon="el-icon-search"
        v-model="searchKey">
      </el-input>
    </div>

    <el-tabs v-model="activeName" >
      <el-tab-pane :label="`聯絡人 ${contactList.length || 0}`" name="address">
        <div  class="address-box" v-for="(item,index) in contactList" :key="index" @click="goContactPage(item)">
          <img :src="item.icon" alt="">
          <span>{{item.name}}</span>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="群組" name="group">
        <div></div>
      </el-tab-pane> -->
    </el-tabs>
    <el-dialog
      title="我的帐号"
      :visible.sync="centerDialogVisible"
      width="100%"
      center>
      <div class="qrcode-box">
        <vue-qr :correctLevel="3" :autoColor="false" colorDark="#333333" :text="qrCodeConfig"  :size="100" :margin="0" :logoMargin="3"></vue-qr>
      </div>
      <span class="qrcode-box-text">嗨聊用户扫描此二维码后，可将您加入好友！</span>
      <span slot="footer" class="dialog-footer">
        <img src="./../../../../static/images/scan.png" alt="">
        <img src="./../../../../static/images/share.png" alt="">
        <img src="./../../../../static/images/download.png" alt="">
      </span>
    </el-dialog>
  </div>    
</template>

<script>
import { getContactList } from "@/api";
import VueQr from 'vue-qr'

export default {
  name: "Address",
  data() {
    return {
      searchKey:'',
      contactList:[],
      activeName:'address',
      centerDialogVisible : false,
      qrCodeConfig:`http://localhost:8080/#/Address?${localStorage.getItem('username')}&${localStorage.getItem('id')}`,
    }
  },
  mounted() {
    this.getAddressList()
  },
  methods: {
    getAddressList(){
      getContactList()
      .then((res)=>{
        this.contactList = res.data.list
        this.contactList.forEach((res)=>{
          res.icon = require("./../../../../static/images/image_user_defult.png")
        })
      })
    },
    goContactPage(data){
      this.$router.push({ name: "ContactPage",params:data,query:{from:'Address'}});
    }
  },
  components: {
    VueQr,
  },
};
</script>
<style lang="scss" scoped>
.home-header {
  margin: 1em;
  display: flex;
  align-items: center;
  .home-user {
    width: 2em;
    height: 2em;
    border-radius: 10px;
    background-color: #fff;
    background-image: url("./../../../../static/images/qrcode.png");
    background-size: 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .home-header-title {
    margin: 0 auto;
    color: #10686e;
    font-weight: 600;
  }
  .home-add-user{
    width: 2em;
    height: 2em;
    border-radius: 10px;
    background-color: #fff;
    background-image: url("./../../../../static/images/add_user.png");
    background-size: 50%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.home-search{
  margin: 1em;
  /deep/.el-input{
    .el-input__inner{
      background-color: #e9e8e8;
      color: #666666;
    }
    .el-input__prefix{
      color: #666666;
    }
    ::placeholder { /* CSS 3 標準 */
      color: #666666;  
    }
  }
  
}

/deep/.el-tabs__header{
  background-color: #e2e0e0;
  display: flex;
  justify-content: space-evenly;
  margin:0;
  .el-tabs__nav-wrap{
    &:after {
      content: "";
      display:none;
    }
    .el-tabs__active-bar{
      display: none;
    }
    .el-tabs__item.is-active{
      color: #303133;
    }
    .el-tabs__nav{
      display: flex;
      width: 13em;
      justify-content: center;
      .el-tabs__item{
        font-size: 15px;
        padding: 0;
      }
    }
  }
  
}
.address-box{
  background-color: #FFFFFF;
  padding: 0.8em 1em;
  display: flex;
  align-items: center;
  img{
    height:2em;
  }
  span{
    padding-left: 1em;
    font-size:14px;
  }
  ::after{
    content: "";
    display: block;
    position: absolute;
    margin-top: 1.5em;
    width:100%;
    border-bottom: 0.02em solid #b3b3b3;
  }
}
/deep/.el-dialog__wrapper{
  overflow: hidden;
  .el-dialog{
    margin: 0 auto;
    border-radius: 20px 20px 0 0;
    position: absolute;
    bottom: 0;
    .el-dialog__header{
      .el-dialog__title{
        color: #10686e;
        font-weight: 600;
      }
      .el-dialog__headerbtn{
        left: 20px;
        .el-dialog__close{
          color: #F60;

        } 
      }
    }
    .el-dialog__body{
      text-align: center;
      .qrcode-box{
        width: 15em;
        height: 15em;
        border: 2px solid #333;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          height: 14em;
        }
        &::after{
          content: '';
          display: block;
          width: 2.5em;
          height: 2.5em;
          background-color: #FFF;
          background-image: url('./../../../../static/images/material_ic_logo.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 70%;
          position: absolute;
          margin: 0 auto;
          border-radius:10px;
        }
      }
      .qrcode-box-text{
        color: #0c0d0d;
        font-weight: 600;
        margin-top: 2em;
        display: block;
      }
    }
    .el-dialog__footer{
      padding: 20px 30px 20px 30px;
      .dialog-footer{
        display: flex;
        justify-content: space-between;
        img{
          height: 1em;
        }
      }
    }
  }
}

</style>

