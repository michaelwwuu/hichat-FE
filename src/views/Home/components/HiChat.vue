<template>
  <div>
    <div class="home-header">
      <div class="home-user"></div>
      <span class="home-header-title">HiChat</span>
      <div class="home-add-user"></div>
    </div>
    <div class="home-content">
      <el-input
        placeholder="搜索"
        prefix-icon="el-icon-search"
        v-model="searchKey">
      </el-input>
      <div>
        
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "HiChat",
  data() {
    return {
      searchKey:"",
    }
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
      // background-image: url("./../../../static/images/add_user.png");
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .home-content{
    margin: 1em;
    /deep/.el-input{
      .el-input__inner{
        background-color: #e2e0e0;
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
</style>
