<template>
  <ul class="message-item">
    <li
      v-for="(item, index) in concats"
      :key="index"
      class="message-list">
      <div class="message-right" >
        <div class="message-header">
          <div class="message-title" :class="{'title-admin': item.id === '0'}">{{item.username}}</div>
          <div class="message-user-type"><el-tag :class="item.id === '0'?'user-admin':'user'">{{item.id === "0"? '專家':'粉絲'}}</el-tag></div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'Message',
  props: {
    concats: {
      type: Array
    }
  },
}
</script>

<style lang="scss" scoped>
.message-active {
  background: rgba(255, 255, 255, .4);
}
.message-item {
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .message-list {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    width: 100%;
    height: 62px;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #F3F9FF;
    border-bottom:3px solid #E6F3FF;
    &:hover {
      background-color: #F3F9FF;
    }
    .message-left {
      margin-right: 10px;
      font-size: 0;
      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .message-group {
        border: 1px solid #dedede;
        box-sizing: border-box;
      }
    }
    .message-right {
      flex: 1;
      overflow: hidden;
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .message-title {
          width: 100%;
          font-size: 14px;
        }
        .title-admin{
          font-weight: 600;
          color: #DD4400;
        }
        .message-user-type {
          .user-admin{
            border: 1px solid #FEDA42;
            background-image: linear-gradient(#FFFBC9, #FFEF2C);
            color: #DD4400;
          }
          .user{
            border: 1px solid #7986CB;
            background-color: #FFFFFF;
            color: #7986CB;
          }
        }
      }
      .message-content {
        margin-top: 4px;
        color: #999999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
