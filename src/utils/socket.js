import Vue from "vue";
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
        console.log("[开启连线] Connection Success");
        let joinMsg = {
          chatType: "CLI_AUTH",
          id: Math.random(),
          tokenType: 0,
          deviceId: localStorage.getItem('UUID'),
          token: localStorage.getItem('token'),
        }
        socket.send(JSON.stringify(joinMsg));
      };
      socket.onmessage = function(msg) {
        let msgData = JSON.parse(msg.data)
        let chatType = JSON.parse(msg.data).chatType
        switch (chatType) {
          case "SRV_RECENT_CHAT":
            let userMsg={
              chatType: "CLI_JOIN_ROOM",
              id: Math.random(),
              tokenType: 0,
              fromChatId: msgData.toChatId, // 登录以后由 SRV_RECENT_CHAT 取得
              toChatId: 'r1',
              deviceId: localStorage.getItem('UUID'),
              token: localStorage.getItem('token'),
            }
            socket.send(JSON.stringify(userMsg));
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