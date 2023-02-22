// index.js
const app = getApp();
const { getTime, base64_encode } = require("../../utils/util");
import drawQrcode from '../../utils/weapp.qrcode';

Page({
  data: {
    userId: "",
    timer: "2022-05-10 18:00:00",
    timerInterval: null,
    statusInfo: "生成时间:",
    userData: {
      avatar: "",
      name: "",
      identity: "",
      cardId: "",
      schoolNum: "",
      status: true
    },
    clickCount: 0
  },

  onLoad: function (options) {
    this.getUserId();
    this.setTimer();
  },

  onShow: function () {
    const userId = this.data.userId;
    if (userId) {
      this.getUserData();
    }
    wx.setScreenBrightness({
      value: 1,
    });
  },

  onHide: function () {
    wx.setScreenBrightness({
      value: -1,
    })
  },

  onUnload: function () {
    this.clearTimer();
  },

  getUserId: function () {
    app.globalData.getOpenId().then(v => {
      this.setData({ userId: v.result.openid });
      wx.setStorageSync('userId', v.result.openid);
      console.info("userId:", v.result.openid);
      this.getUserData();
    });
  },

  getUserData: function () {
    const userData = wx.getStorageSync('userData') || null;
    if (userData) {
      this.setData({ userData })
      this.setId();
      this.setStaticTime();
      this.getQRCode();
    }
    app.globalData.getDatabase().then(({ data }) => {
      console.log(data);
      if (data.length < 1) {
        wx.setStorageSync('userData', null);
        wx.showModal({
          cancelText: '取消',
          confirmText: '确定',
          content: '无数据，是否新增数据？',
          editable: false,
          showCancel: true,
          title: '提示',
          success: (result) => {
            if (result.confirm) {
              wx.navigateTo({
                url: '../editUser/editUser',
              })
            } else {
              wx.showToast({
                title: '可以连点头像进入设置',
                icon: 'none'
              })
            }
          },
          fail: (res) => {},
          complete: (res) => {},
        })
      } else {
        this.setData({ userData: data[0] })
        this.setId();
        this.setStaticTime();
        this.getQRCode();
        wx.setStorageSync('userData', data[0]);
      }
    });
  },

  getQRCode: function () {
    const rpx2px = (rpx) => {
      const screenWidth = wx.getSystemInfoSync().windowWidth;
      const rate = screenWidth / 750;
      return rpx * rate;
    }
    const text = base64_encode(this.data.userData.schoolNum) + '_' + getTime() + '_' + this.data.userId;
    console.info("qrcode:", text);
    const [wid, hei] = [rpx2px(280), rpx2px(280)];
    drawQrcode({
      width: wid,
      height: hei,
      x: 6,
      y: 6,
      canvasId: 'myQRcode',
      text: text,
      foreground: this.data.userData.status ? '#52b65e' : '#000000',
      correctLevel: 2,
      image: {
        imageResource: '../../images/logo-center.png',
        dx: wid / 2 - 10,
        dy: hei / 2 - 10,
        dWidth: 36,
        dHeight: 36
      }
    })
  },

  setTimer: function () {
    const timerInterval = setInterval(() => {
      const timer = getTime();
      this.setData({
        timer
      })
    }, 1000);
    this.setData({
      timerInterval
    });
  },

  clearTimer: function () {
    const timer = this.data.timerInterval;
    clearInterval(timer);
  },

  setAvatar: function () {
    const userData = this.data.userData;
    const _this = this;
    wx.cloud.getTempFileURL({
      fileList: [userData.avatar],
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.err(err);
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    })
  },

  setId: function () {
    const userData = this.data.userData;
    userData.cardId = userData.cardId.split('#').join("*".repeat(12));
    this.setData({
      userData
    });
  },

  setStaticTime() {
    const status = this.data.userData.status;
    if (status) {
      let statusInfo = getTime();
      statusInfo = "生成时间: " + statusInfo;
      this.setData({
        statusInfo
      })
    } else {
      let statusInfo = '您的当前状态为<禁止通行>，如有疑问，请与本单位"通行管理员"联系';
      this.setData({
        statusInfo
      })
    }

  },

  handleSetAvatar() {
    const clickCount = this.data.clickCount + 1;
    console.info("Tap:", clickCount);
    setTimeout(() => {
      this.setData({ clickCount: 0 });
    }, 2000);
    if (clickCount >= 3) {
      wx.navigateTo({
        url: '../editUser/editUser',
      })
    } else {
      this.setData({ clickCount });
    }
  },

  handleNavi: function (e) {
    const { id } = e.currentTarget;
    switch (id) {
    case 'ques':
      wx.navigateTo({
        url: '../getMiniProgramCode/index?envId=' + app.globalData.envId,
      })
      break;
    case 'checkin':
      let scanData = "";
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      }).then(res => {
        console.info("qrcode:", res);
        scanData = res.result;
        wx.showModal({
          title: '扫描结果',
          content: scanData,
          showCancel: true,
          confirmText: '复制',
          cancelText: '取消',
        }).then(res => {
          if (res.confirm) {
            wx.setClipboardData({
              data: scanData,
            })
          }
        })
      })
    }
  }

});