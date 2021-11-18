<template>
  <div class="home-wrapper">
    <div class="home-header">
      <router-link :to="'/Home'">
        <div class="home-user"></div>
      </router-link>
      <span class="home-header-title">新增聯絡人</span>
      <div class="home-add-user"></div>
    </div>
    <div class="home-search">
      <el-input
        placeholder="输入欲搜寻的邮箱或帐号ID"
        prefix-icon="el-icon-search"
        v-model="searchKey"
        @keyup.native.enter="searchUserData(searchKey)">
      </el-input>
    </div>
    <div class="no-data" v-show="noData">
      <span>此用户不存在</span>
      <span>无法找到此用户，请确认您填写的 ID 是否正确。</span>
    </div>

    <div v-if="Object.keys(addUser).length !== 0">
      <div class="user-data">
        <span><img :src="avatarImg" alt=""></span>
        <span>{{addUser.username}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { searchByEmailUsername } from "@/api";

export default {
  name: "AddUser",
  data() {
    return {
      searchKey:'',
      noData:false,
      addUser:{},
      avatarImg:require("./../../../static/images/image_user_defult.png")
    }
  },
  methods: {
    searchUserData(token){
      this.noData = false
      if(token === '') {
        this.addUser = {}
        this.noData = true
        return
      }
      
      this.addUser = {}
      searchByEmailUsername({token})
      .then((res)=>{
        if(res.data === undefined) {
          this.noData = true
        } else if(res.data !=={}){
          this.addUser = res.data

        }
      })
      .catch((res)=>{

      })
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
      border-radius: 10px;
      background-color: #fff;
      background-image: url("./../../../static/images/scan.png");
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
  .no-data{
    margin: 2em 0;
    span{
      display: block;
      text-align: center;
      height:2em;
      &:nth-child(2){
        color: #b3b3b3;
        font-size:14px;
      }
    }
  }
  .user-data{
    margin: 2.5em auto;
    
    span{
      display: block;
      text-align: center;
      height:3.5em;
      img{
        height:3em;
      }
    }
  }
}
</style>
