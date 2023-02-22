// pages/editUser/editUser.js
const app = getApp();
const { formatDate } = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew: false,
    isSetNewAvatar: false,
    oldAvatar: "",
    userId: "",
    userData: {
      avatar: "",
      name: "",
      identity: "",
      cardId: "",
      schoolNum: "",
      status: true
    },
    statusList: ["正常", "禁止"],
    tempPath: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userData = wx.getStorageSync('userData') || null;
    const userId = wx.getStorageSync('userId') || "";
    this.setData({
      userData,
      userId
    });
    if (!userId) {
      this.getUserId();
    }
    if (!userData) {
      this.setData({
        isNew: true
      });
    } else {
      this.setCardId();
    }
  },

  getUserId: function () {
    app.globalData.getOpenId().then(v => {
      this.setData({ userId: v.result.openid });
      wx.setStorageSync('userId', v.result.openid);
      console.info("userId:", v.result.openid);
    });
  },

  setCardId: function () {
    const userData = this.data.userData;
    userData.cardId = userData.cardId.replace(/\*/g, "");
    this.setData({ userData });
  },

  handleInput: function (e) {
    this.setData({
      [`userData.${e.target.id}`]: e.detail.value
    })
  },

  handlePickerChange: function (e) {
    const { value } = e.detail;
    console.log("Picker:", value)
    if (value == 0) {
      this.setData({
        "userData.status": true
      })
    } else {
      this.setData({
        "userData.status": false
      })
    }
  },

  handleEmit: function () {
    const userData = this.data.userData;
    if (!userData.avatar) {
      wx.showToast({
        title: '设置头像！',
        icon: 'none'
      });
      return;
    } else if (!userData.name) {
      wx.showToast({
        title: '设置名字！',
        icon: 'none'
      });
      return;
    } else if (!userData.identity) {
      wx.showToast({
        title: '设置身份！',
        icon: 'none'
      });
      return;
    } else if (!userData.cardId || userData.cardId.length !== 6) {
      wx.showToast({
        title: '设置证件号！',
        icon: 'none'
      });
      return;
    } else if (!userData.schoolNum || userData.schoolNum.length !== 13) {
      wx.showToast({
        title: '设置学号！',
        icon: 'none'
      });
      return;
    } else {
      userData.cardId = userData.cardId.slice(0, 3) + '#' + userData.cardId.slice(3);
      wx.showLoading({
        title: '正在处理',
      });
      const _this = this;
      new Promise((resolve, reject) => {
        if (_this.data.isNew || _this.data.isSetNewAvatar) {
          const oldFile = this.data.oldAvatar;
          app.globalData.uploadFile(userData.avatar).then(res => {
            console.info("upload:", res);
            userData.avatar = res;
            if (oldFile)
              app.globalData.deleteFile(oldFile);
            resolve(userData);
          }).catch(err => {
            reject(err);
          })
        } else {
          resolve(userData);
        }
      }).then((userData) => {
        console.log(userData);
        wx.setStorageSync('userData', userData);
        if (_this.data.isNew) {
          app.globalData.insertDatabase(userData).then(v => {
            console.info("insert:", v);
            wx.showToast({
              title: '新增成功！',
            });
            wx.navigateBack({
              delta: 1,
            });
          })
        } else {
          app.globalData.updateDatabase(userData).then(v => {
            console.info("update:", v);
            wx.hideLoading({});
            wx.showToast({
              title: '更新成功！',
            });
            wx.navigateBack({
              delta: 1,
            });
          })
        }
      })
    }
  },

  handleSetAvatar: function () {
    wx.showLoading({
      title: '',
    });
    const oldAvatar = this.data.userData?.avatar;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: chooseResult => {
        this.setData({
          "userData.avatar": chooseResult.tempFilePaths[0],
          isSetNewAvatar: true,
          oldAvatar
        });
      },
      complete: () => {
        wx.hideLoading()
      }
    });
  }
})