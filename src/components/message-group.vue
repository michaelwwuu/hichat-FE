<template>
  <ul class="message-item">
    <li v-for="(item, index) in concats" :key="index" class="message-list">
      <div class="message-right">
        <div class="message-header">
          <div class="message-title" :class="{ 'title-admin': item.isAdmin }">
            {{ item.username }}
          </div>
          <div class="message-user-type">
            <el-tag
              v-if="isAdmin"
              class="nodis"
              :class="[
                { 'admin-user': item.isAdmin },
                { disUser: item.banRemainTime !== null },
              ]"
              @click="item.banRemainTime === null ? disabled(item) : unBlock(item)"
              >{{ item.banRemainTime === null ? "封禁" : "解封" }}</el-tag
            >
          </div>
          <div class="message-user-type">
            <el-tag :class="item.isAdmin ? 'user-admin' : 'user'">{{
              item.isAdmin ? "專家" : "粉絲"
            }}</el-tag>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { disabled,unBlock } from "@/assets/tools";
export default {
  name: "MessageGroup",
  props: {
    concats: {
      type: Array,
    },
    isAdmin: {
      type: Boolean,
    },
  },
  data() {
    return {
      disabled:disabled,
      unBlock:unBlock,
      disabledImg: require("./../../static/images/disabled.svg"),
    };
  },
};
</script>

<style lang="scss" scoped>
.message-active {
  background: rgba(255, 255, 255, 0.4);
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
    background-color: #f3f9ff;
    border-bottom: 3px solid #e6f3ff;
    &:hover {
      background-color: #f3f9ff;
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
        .title-admin {
          font-weight: 600;
          color: #dd4400;
        }
        .message-user-type {
          padding-left: 10px;
          .user-admin {
            border: 1px solid #feda42;
            background-image: linear-gradient(#fffbc9, #ffef2c);
            color: #dd4400;
          }
          .user {
            border: 1px solid #7986cb;
            background-color: #ffffff;
            color: #7986cb;
          }
          .nodis {
            background-image: linear-gradient(#959595, #7e7e7e);
            color: #ffffff;
            cursor: pointer;
            border: none !important;
          }
          .disUser {
            background-image: linear-gradient(#b4d4ff, #559dff);
            color: #ffffff;
            cursor: pointer;
          }
          .admin-user {
            display: none;
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
