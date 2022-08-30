import Vue from "vue";

export function urlCopy(copyUrl) {
  if (copyUrl == "") {
    return;
  }
  let url = document.createElement("input");
  document.body.appendChild(url);
  url.value = copyUrl;
  url.select();
  document.execCommand('copy');
  document.body.removeChild(url);
  //判斷是否有加http
  if(copyUrl.indexOf('http') < 0) {
    copyUrl = 'http://'+copyUrl; 
  }

  Vue.prototype.$message({
    message: copyUrl + "网址复制成功" ,
    type: 'success',
    duration: 1000
  });
}
//複製
export function copyPaste(data) {
  let url = document.createElement("input");
  document.body.appendChild(url);
  url.value = data;
  url.select();
  document.execCommand("copy");
  document.body.removeChild(url);
  
  Vue.prototype.$message({
    message: `ID : ${data} 复制成功`,
    type: "success",
    duration: 1000,
  });

}
