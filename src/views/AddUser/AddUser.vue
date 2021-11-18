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
        v-model="searchKey">
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddUser",
  data() {
    return {
      searchKey:'',
    }
  },
  methods: {

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
}
</style>
