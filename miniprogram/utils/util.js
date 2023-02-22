function formatDate(date, formats) {
  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return date.format(formats);
}

function getTime() {
  return formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
}

function base64_encode(str) {

  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; //64个基本的编码

  let c1, c2, c3;
  let len = str.length; //需编码字符串的长度
  let i = 0;
  let out = ""; //输出

  while (i < len) {

    //位数不足情况
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) { //一个字节 没有数据用 = 补上
      out += chars.charAt(c1 >> 2);
      out += chars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) { //两个字节 没有数据用 = 补上
      out += chars.charAt(c1 >> 2);
      out += chars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += chars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    //位数足的情况
    c3 = str.charCodeAt(i++);
    out += chars.charAt(c1 >> 2);
    out += chars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += chars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += chars.charAt(c3 & 0x3F);
  }

  return out;
}

module.exports = {
  formatDate,
  getTime,
  base64_encode
}