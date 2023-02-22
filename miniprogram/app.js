// app.js
const { formatDate } = require("./utils/util");
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'one-ej2yo',
        traceUser: true,
      });
    }

    this.globalData = {
      host: "#Your-host-domain",
      envId: "#Your-wechat-cloud-env-id",
      getOpenId: function () {
        return wx.cloud.callFunction({
          name: 'quickstartFunctions',
          config: {
            env: '#Your-wechat-cloud-env-id'
          },
          data: {
            type: 'getOpenId'
          }
        })
      }, // End of getOpenId

      getDatabase: function () {
        const db = wx.cloud.database();
        const userInfo = db.collection("userInfo");
        return userInfo.where({}).get();
      },

      insertDatabase: function (userData) {
        const db = wx.cloud.database();
        const userInfo = db.collection("userInfo");
        return userInfo.add({
          data: userData
        })
      },

      updateDatabase: function (userData) {
        const db = wx.cloud.database();
        const userInfo = db.collection("userInfo").doc(userData._id);
        delete userData._id;
        delete userData._openid;
        return userInfo.update({
          data: userData
        })
      },

      uploadFile: function (file) {
        const fileName = formatDate(new Date(), "yyyy-MM-dd-hh-mm-ss-") +
          Math.floor(Math.random() * 100000) + ".jpg";
        // 将图片上传至云存储空间
        return new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: fileName,
            // 指定要上传的文件的小程序临时文件路径
            filePath: file,
          }).then(res => {
            resolve(res.fileID);
          }).catch((e) => {
            console.error(e);
            reject(e);
          });
        })
      },

      deleteFile: function (file) {
        return wx.cloud.deleteFile({
          fileList: [file]
        });
      },
    }; // End of globalData
  }
});