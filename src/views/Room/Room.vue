<template>
  <div class="wrapper">
    <el-container>
      <el-aside width="600px">
        <el-header height="55px">
          <font-awesome-icon icon="comment-dots" />
          <span class="title">欢迎登录 请选择要进入的聊天室</span>
        </el-header>
        <div class="room-box">
          <ul>
            <li v-for="(item,index) in roomList" :key="index" class="room-list"> 
              <div class="room-list-box">
                <img :src="item.avatar" alt="">
                <span class="room-list-title">{{item.chatRoomName}}</span>
                <div>
                  <el-row>
                    <el-button type="primary" plain @click="joinChatRoom(item)">加入</el-button>
                  </el-row>
                </div>
              </div>
            </li>
          </ul>
        </div>
         <el-row style="margin:35px auto">
            <el-button type="danger" plain @click="leaveChatRoom">返回聊天室登录首頁</el-button>
          </el-row>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { getRoomList } from "_api/index.js";
import { setLocal } from "_util/utils.js";
export default {
  name: "Room",
  data() {
    return {
      roomList:[],
      params: {
        pageSize:10,
        pageNum:1,
        name:'',
      },
    };
  },
  mounted() {
    localStorage.removeItem('chatRoomId')
    this.getChatRoomList(this.params)
  },
  methods: {
    // 取得聊天室清單
    getChatRoomList(params){
      getRoomList(params)
      .then((res) => {
        if (res.code == 200) {
          this.roomList = res.data.list
          this.roomList.forEach((res)=>{
            res.avatar = require(`./../../../static/avatar/avatar_0${res.id}.jpg`)
          })
        }
      })
      .catch((err) => {
        this.$message({
          message: "加入聊天室失敗",
          type: "error",
        });
        return false;
      })
    },

    // 加入聊天室
    joinChatRoom(item){
      this.$alert(`確定要加入【<strong style="font-weight:bold;color:#F00">${item.chatRoomName}</strong>】的聊天室嗎?`, '提示', {
        dangerouslyUseHTMLString: true
      })
      .then((value) => {
        if(value === 'confirm'){
          setLocal('chatRoomId','r'+item.id)
          this.$router.push({ path: "/Chat" });
        }
      })
      .catch((err)=>{
        this.$message({
          type: "info",
          message: "取消输入",
        });
      })
    },
    
    // 離開聊天室
    leaveChatRoom(){
      localStorage.clear()
      this.$router.push({ path: "/Login" });
    }
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  .el-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 95%;
    margin: 30px auto;
    .el-aside{
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      background: rgba(235, 233, 232, 0.8);
      margin: 0 auto;
    }
    .el-header {
      position: relative;
      line-height: 55px;
      background-image: linear-gradient(#579fff, #3481e8);
      overflow: hidden;
      border-right: 1px solid #ffffff;
      .fa-comment-dots{
        font-size:20px;
        color: #FFFFFF;
        padding-right: 10px;
      }
      img {
        position: relative;
        top: 7px;
      }
      .online-img {
        position: relative;
        top: 9px;
      }
      .title,
      .icon-message {
        color: #ffffff;
      }
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
    .room-box{
      // margin:20px;
      .room-list{
        padding: 10px 15px;
        width: 100%;
        height: 90px;
        font-size: 12px;
        box-sizing: border-box;
        background-color: #f3f9ff;
        border-bottom: 3px solid #e6f3ff;
        .room-list-box{
          display: flex;
          justify-content: space-between;
          align-items: center;
          img{
            height:5em;
            border-radius: 10px;
          }
          .room-list-title{
            padding-left: 20px;
            font-size: 20px;
          }
        } 
      }
    }
  }


}
</style>
