//辨識名稱
export function fileBoxName(data) {
  let url = data
  let index = url.lastIndexOf("\/");
  let str = url.substring(index + 1,url.length);
  return str 
}
export function formatFileSize(fileSize) {
  var temp = fileSize / (1024*1024);
  temp = temp.toFixed(2) === '0.00' ? '0.01' : temp.toFixed(2);
  return temp + 'MB';
  // if (fileSize < 1024) {
  //     return fileSize + 'B';
  // } else if (fileSize < (1024*1024)) {
  //     var temp = fileSize / 1024;
  //     temp = temp.toFixed(2);
  //     return temp + 'KB';
  // } else if (fileSize < (1024*1024*1024)) {
  //     var temp = fileSize / (1024*1024);
  //      temp = temp.toFixed(2);
  //      return temp + 'MB';
  // } else {
  //     var temp = fileSize / (1024*1024*1024);
  //     temp = temp.toFixed(2);
  //     return temp + 'GB';
  // }
}