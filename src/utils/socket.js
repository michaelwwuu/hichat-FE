import Vue from "vue";
import { getLocal,setLocal,getToken } from "_util/utils.js";
const wsUrl = "ws://10.99.114.10:8299/im/echo";
var socket = new WebSocket(wsUrl);
const emitter = new Vue({
  methods: {
    send(message) {
      if (socket.readyState === 1) socket.send(JSON.stringify(message));
    },
    connect() {
      socket = new WebSocket(wsUrl);
      socket.onopen = function (e) {
        console.log("<--【开启连线】------初始化連線以建立-->");
        let joinRoom = {
          chatType: "CLI_AUTH",
          id: Math.random(),
          tokenType: 0,
          deviceId: getLocal('UUID'),
          token: getToken('token'),
        }
        socket.send(JSON.stringify(joinRoom));
      };
      socket.onmessage = function(msg) {
        let msgData = JSON.parse(msg.data)
        let chatType = msgData.chatType
        switch (chatType) {
          case "SRV_RECENT_CHAT":
            console.log("<--【聊天群組】------加入群組聊天室------【成功】");
            let groupRoomMsg = {
              chatType: "CLI_JOIN_ROOM",
              id: Math.random(),
              tokenType: 0,
              fromChatId: msgData.toChatId, // 登录以后由 SRV_RECENT_CHAT 取得
              toChatId: "c1",
              deviceId: getLocal('UUID'),
              token: getToken('token'),
            } 
            setLocal('toChatId',groupRoomMsg.toChatId)
            socket.send(JSON.stringify(groupRoomMsg));
            break;
          default:
            break;
        }
        emitter.$emit("message", msg.data);
      };
      socket.onerror = function(err) {
        emitter.$emit("error", err);
      };
      socket.onclose = function() {
        emitter.connect();
      };
    }
  }
});
export default emitter;