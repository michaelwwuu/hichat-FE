# hichat(多彩网)
### 安装方法
```
npm install
```
### 運行方式
```
npm run serve
```
### 打包方式 ( 打包完會有dist檔 需要server 才能正常運行 )
```
npm run build
```
## 使用框架Vue Cli
```
## 使用 framework -> ElementUI
## 使用 套件 -> moment、md5、fontawesome、linkify
## 使用 vuex、router、axios(模組化封裝)、mixins(模組化封裝)、localstorage(模組化封裝)、socket(模組化封裝)
## Login.vue 登入頁面
## Room.vue 聊天室選則頁面
## Chat.vue 聊天室內聊天頁面 頁面內有區分三塊組件
-- message-group.vue 頁面左側 List
-- message-input.vue 頁面下方輸入框
-- message-pabel.vue 頁面中間+對話框
```
## 多彩網 串接 username
```
-- uesername需放入 Login.vue頁面 submitForm // 登入按鈕事件中的 
loginForm: {
  isGuest:false,
  username: "",  <------ 這個位置 即可使用平台接入
  sign:"",
  platformCode:"dcw", 
},
```


## tokenType 0 = app, 1 = web
## 事件命名
```
## 小駝峰式命名法
```

## 資料夾
```
/style/ -> 頁面各類樣式
--------------------------------------------------
/api/index.js -> axios api 事件封装包
/lib/axios/axios.js -> axios 事件封裝包
/lib/axios/api.request.js -> axios api 設置導向
/lib/utils/utils.js -> localStorage 事件封裝包
--------------------------------------------------
/mixins/root.js -> 日期格式化封裝包
/router/index.js -> 路由導向設置
--------------------------------------------------
/store/index.js -> vuex 底層 
/store/ws.js -> vuex socket 設置 
--------------------------------------------------
/assets/tools.js -> 共用事件处理、封禁、解禁、置底
--------------------------------------------------
/utils/socket.js -> websocket 初始化 事件處理
--------------------------------------------------
/views/Login/Login.vue -> 登入頁面
--------------------------------------------------
/views/Room/Room.vue -> 聊天室選房頁面
--------------------------------------------------
/views/Chat/Chat.vue -> 聊天頁面
/components/message-group.vue -> 聊天室內組件 頁面左側 List
/components/message-input.vue -> 聊天室內組件 頁面下方輸入框
/components/message-pabel.vue -> 聊天室內組件 頁面中間 + 對話框
--------------------------------------------------
/static/avatar/ -> 房間圖片
/static/images/ -> 各式功能圖片
--------------------------------------------------
main.js -> 設置引入套件
--------------------------------------------------
vue.confing.js -> 設置domin url api 位置
--------------------------------------------------
```
