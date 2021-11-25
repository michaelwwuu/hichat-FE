<template>
  <div class="home-wrapper">
    <div class="home-header">
      <div class="home-user" @click="back"></div>
      <span class="home-header-title">编辑个人资料</span>
      <div class="home-add-user"></div>
    </div>
    <div class="add-content">
      <div class="user-data">
        <span><img :src="userData.icon" alt=""></span>
        <span class="photo-edit" @click="updataPhoto">变更头像</span>

      </div>
      <div class="home-footer-btn">
        <el-button
        @click="editSubmit"
          >保存</el-button
        >
      </div>
    </div>
    <div class="user-edit-form">
      <el-form ref="form" :model="userEditForm" label-width="100px">
        <el-form-item label="用户昵称">
          <el-input v-model="userEditForm.nickname"></el-input>
        </el-form-item>
      </el-form>
    </div>    
  </div>
</template>

<script>
import { updateNickname } from "@/api";

export default {
  name: "EditUser",
  data() {
    return {
      userData:{},
      userEditForm:{
        nickname:''
      },

    }
  },
  created() {
    this.userData = this.$route.params
    this.userEditForm.nickname = this.userData.nickname
  },
  methods: {
    editSubmit(){
      console.log(this.userEditForm)
      // updateNickname(this.userEditForm).then((res)=>{

      // })
    },
    back(){
      this.$router.back(-1)
    },
    updataPhoto(){
      console.log(123)
    }
  },

};
</script>

<style lang="scss" scoped>
.home-wrapper{
  min-height: 100%;
  width: 100%;
  background-color: #eaf5fa;
  overflow: hidden;
  .home-header {
    margin: 1em;
    display: flex;
    align-items: center;
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
    .home-header-title {
      margin: 0 auto;
      color: #10686e;
      font-weight: 600;
    }
    .home-add-user{
      width: 2em;
      height: 2em;
    }
  }
  .user-edit-form{
    margin: 1em;
    background-color: #FFF;
    border-radius: 10px;
    /deep/.el-form{
      .el-form-item__label{
        font-size: 17px;
      }
      .el-input{
        font-size: 19px;
        .el-input__inner{
          border:none;
        }
      }
    }
  }
  .add-content{
    .user-data{
      margin: 2.5em auto 0 auto;
      span{
        display: block;
        text-align: center;
        height:5.5em;
        img{
          height:5em;
          border-radius: 10px;
        }
      }
      .photo-edit{
        height:1.5em;
        color: #fe5f3f;
      }
    }
    .home-footer-btn{
      margin: 1em 0;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      .el-button{
        width:93%;
        background-color: #fe5f3f;
        color: #fff;
      }
    }
  }

}
</style>
