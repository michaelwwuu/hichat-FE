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
      let deviceId = getLocal('UUID')
      let token = getToken('token')

      socket = new WebSocket(wsUrl);
      
      socket.onopen = function (el) {
        console.log("<--【开启连线】------初始建立连线-->");
        let joinRoom = {
          chatType: "CLI_AUTH",
          id: Math.random(),
          tokenType: 0,
          deviceId: deviceId,
          token: token,
        }
        socket.send(JSON.stringify(joinRoom));
      };
      socket.onmessage = function(msg) {
        let msgData = JSON.parse(msg.data)
        let chatType = msgData.chatType
        switch (chatType) {
          case "SRV_SUCCESS_MSG":
            console.log("<--【连线成功】------Websocket 连线已建立-->");
            break
          case "SRV_ERROR_MSG":
            console.log("<--【连线失敗】------请检察 Websocket onopen 参数是否正确-->");
            break
          case "SRV_RECENT_CHAT":
            console.log("<--【连线成功】------加入群组聊天室------【toChatId 聊天室ID】-->");
            let groupRoomMsg = {
              chatType: "CLI_JOIN_ROOM",
              id: Math.random(),
              tokenType: 0,
              deviceId: deviceId,
              token: token,
              toChatId: 'c1', //聊天室ID 暫時先寫死 可動態
              fromChatId: msgData.toChatId, // 登录以后由 SRV_RECENT_CHAT 取得
            } 
            setLocal('toChatId',groupRoomMsg.toChatId ) 
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