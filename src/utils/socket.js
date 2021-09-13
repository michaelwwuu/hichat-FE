import Vue from "vue";
const wsUrl = "ws://10.99.114.10:8299/im/echo";
var socket = new WebSocket(wsUrl);

const emitter = new Vue({

  methods: {
    send(message) {
      if (1 === socket.readyState) socket.send(JSON.stringify(message));
    },
    connect() {
      socket = new WebSocket(wsUrl);
      
      socket.onopen = function (e) {
        console.log("[开启连线] Connection Success");
        socket.send(JSON.stringify({
          "chatType": "CLI_AUTH",
          "id": Math.random(),
          "tokenType": 0,
          "deviceId": localStorage.getItem('UUID'),
          "token": localStorage.getItem('token'),
        }));
      };
      socket.onmessage = function(msg) {
        let msgData = JSON.parse(msg.data)
        switch (msgData.chatType) {
          case "SRV_RECENT_CHAT":
            socket.send(JSON.stringify({
              "chatType": "CLI_JOIN_ROOM",
              "id": Math.random(),
              "tokenType": 0,
              "fromChatId": msgData.toChatId, // 登录以后由 SRV_RECENT_CHAT 取得
              "chatRoomId": 'c1',
              "deviceId": localStorage.getItem('UUID'),
              "token": localStorage.getItem('token'),
            }));
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

emitter.connect();
export default emitter;