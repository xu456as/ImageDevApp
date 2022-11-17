//app.js
const util = require('utils/util.js')
App({
  onLaunch: function (options) {
    util.globalData = this.globalData;
    let that = this;
    // 分享
    if (options.query.share_openid) {
      var share_openid = options.query.share_openid;
    } else if (options.query.scene) {
      var share_openid = options.query.scene;
    } else {
      var share_openid = '';
    }
    // 分享结束
    console.log('app onLauch', options.query.send_id);
    if (options.query.send_id) {
      util.add_login_callback(function () {
        var msg = {
          op: 'share_record',
          share_record_arrays: {
            'uid': options.query.send_id,
            'receive_uid': that.globalData.userInfo.mina_openid,
            'page_path': options.path
          }
        }
        util.post('action.php', msg, function (response) {})
      });
    }
    // util.login(share_openid);
    // setInterval(this.load_car,1000);
    this.updateManager();
    // 调用插件
    if (this.globalData.userInfo) {
    } else {
      util.add_login_callback(function () {
      })
    }
  },
  updateManager: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate, "hasUpdate")
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

  },
  onShow() {},
  globalData: {
    is_ios: wx.getSystemInfoSync().system.startsWith('iOS'),
    url_namespace: 'http://192.168.0.102:9090/api/serial/',
    url_domainname: 'http://192.168.0.102:9090/',
    login_code: '',
    userInfo: null,
    clear: false
  }
})