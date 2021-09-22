import Vue from "vue";
import { getLocal,setLocal,getToken } from "_util/utils.js";
const wsUrl = "ws://10.99.114.10:8299/im/echo";
var socket = new WebSocket(wsUrl);
const emitter = new Vue({
  data() {
    return {
      roomKey: {
        chatType: "CLI_AUTH",
        id: Math.random(),
        tokenType: 0,
        deviceId: getLocal('UUID'),
        token: getToken('token'),
      },
    }
  },
  methods: {
    send(message) {
      if (1 === socket.readyState ) socket.send(JSON.stringify(message));
    },
    // 初始化websocket 
    connect() {
      socket = new WebSocket(wsUrl);
      let joinRoom = this.roomKey;
      socket.onopen = function () {
        console.log("<--【开启连线】------初始建立连线-->");
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
            console.log("<--【连线成功】------加入群组聊天室------【toChatId：進入聊天室ID】-->");
            let groupRoomMsg = {
              chatType: "CLI_JOIN_ROOM",
              id: Math.random(),
              tokenType: 0,
              deviceId: deviceId,
              token: token,
              toChatId: 'c1', //聊天室ID 暫時先寫死 可動態
              fromChatId: msgData.toChatId, // 登录以后由 SRV_RECENT_CHAT 取得
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
    },
    onclose(){
      console.log("<--【中断连线】------使用者已离开聊天室-->");
      let leaveRoom = this.roomKey
      leaveRoom.chatType = "CLI_LEAVE_ROOM"
      socket.send(JSON.stringify(leaveRoom));
      socket.close()
    }
  }
});
export default emitter;