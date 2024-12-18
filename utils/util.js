import {
    store
} from '../store/store'
Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

function object_length(obj) {
    var c = 0;
    for (var k in obj) {
        c++;
    }
    return c;
}

function formatTime(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatDate(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

function post(api, params, callback, callback_fail = null, header = {}) {
    var apiurl = module.exports.globalData.url_namespace + api;
    header["content-type"] = "application/x-www-form-urlencoded"
    wx.request({
        url: apiurl,
        data: params,
        header: header,
        method: 'POST',
        dataType: 'json',
        success: function (data) {
            console.log('post res', apiurl, params, data);
            if (data.statusCode == 200) {
                callback && callback(data.data);
            } else {
                callback_fail && callback_fail(data.data);
            }
        },
        fail: function (data) {
            console.log(data);
            callback_fail && callback_fail(data);
        }
    })
}

function get(api, callback, callback_fail = null, header = {}) {
    var apiurl = module.exports.globalData.url_namespace + api;
    wx.request({
        url: apiurl,
        header: header,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('get res', apiurl, data);
            if (data.statusCode == 200) {
                callback && callback(data.data);
            } else {
                callback_fail && callback_fail(data.data);
            }
        },
        fail: function (data) {
            console.log(data);
            callback_fail && callback_fail(data);
        }
    })
}

function upload(file, fn_suc, fn_fail) {
    wx.uploadFile({
        filePath: file,
        name: 'file',
        url: module.exports.globalData.url_namespace + 'image/upimg',
        success: function (ret) {
            console.log('upload', file, ret);
            if (ret.statusCode == 200) {
                fn_suc && fn_suc(JSON.parse(ret.data))
            } else {
                fn_fail && fn_fail(ret.data);
            }
        },
        fail: function (ret) {
            fn_fail && fn_fail(ret);
        }
    })
}

function updateWx(filePath, groupId, token, formData, fn_suc, fn_fail) {
    console.log("updateWx groupId:", groupId)
    console.log("updateWx token:", token)
    console.log("filePath: ", filePath)
    let urlNamespace = module.exports.globalData.url_namespace
    if (filePath != null) {
        wx.uploadFile({
            filePath: filePath,
            name: 'image',
            header: {
                "groupId": groupId,
                "token": token
            },
            formData: formData,
            url: urlNamespace + 'image/updateWx',
            success: function (ret) {
                console.log('upload ok');
                if (ret.statusCode == 200) {
                    fn_suc && fn_suc(JSON.parse(ret.data))
                } else {
                    fn_fail && fn_fail(ret.data);
                }
            },
            fail: function (ret) {
                fn_fail && fn_fail(ret);
            }
        })
    } else {
        wx.request({
            url: urlNamespace + 'image/updateWx',
            data: formData,
            header: {
                "groupId": groupId,
                "token": token,
                "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            dataType: 'json',
            success: function (ret) {
                console.log('upload ok');
                if (ret.statusCode == 200) {
                    fn_suc && fn_suc(JSON.parse(ret.data))
                } else {
                    fn_fail && fn_fail(ret.data);
                }
            },
            fail: function (ret) {
                fn_fail && fn_fail(ret);
            }
        })
    }
}

function uploadWx(filePath, groupId, token, formData, fn_suc, fn_fail) {
    console.log("groupId:", groupId)
    console.log("token:", token)
    let urlNamespace = module.exports.globalData.url_namespace
    wx.uploadFile({
        filePath: filePath,
        name: 'image',
        header: {
            "groupId": groupId,
            "token": token
        },
        formData: formData,
        url: urlNamespace + 'image/uploadWx',
        success: function (ret) {
            console.log('upload ok');
            if (ret.statusCode == 200) {
                fn_suc && fn_suc(JSON.parse(ret.data))
            } else {
                fn_fail && fn_fail(ret.data);
            }
        },
        fail: function (ret) {
            fn_fail && fn_fail(ret);
        }
    })
}

var login_callback = [];

function add_login_callback(fn) {
    login_callback.push(fn);
}

var login_callback_fail = [];

function add_login_callback_fail(fn) {
    login_callback_fail.push(fn);
}

function add_footer(goods_id, page, action) {
    if (!module.exports.globalData.userInfo) {
        add_login_callback(function () {
            add_footer(goods_id, page, action);
        })
    } else {
        var msg = {
            op: 'add_footer',
            uid: module.exports.globalData.userInfo.id,
            goods_id: goods_id,
            page: page,
            action: action
        }
        post('action.php', msg, function () {});
    }
}

function login() {
    if (store.groupId == null || store.groupToken == null) {
        return
    }
    post('login', {}, function (response) {

    }, null, {
        "groupId": store.groupId,
        "token": store.groupToken
    })
    // wx.login({
    //   success: res => {
    //     let userInfo = module.exports.globalData.userInfo;
    //     var msg = {
    //       code: res.code,
    //     }

    //     if (userInfo) {
    //       msg['username'] = userInfo.username;
    //       msg['password'] = userInfo.password;
    //     }

    //     post('login', msg, function (response) {
    //       if (response.code == 0) {
    //         module.exports.globalData.userInfo = response.content;
    //         for (var i = 0; i < login_callback.length; i++) {
    //           login_callback[i]();
    //         }
    //         login_callback = [];
    //       } else {
    //         for (var i = 0; i < login_callback_fail.length; i++) {
    //           login_callback_fail[i]();
    //         }
    //         login_callback_fail = [];
    //       }
    //     }, function () {});

    //   }
    // })
}

function load_car() {
    var car = wx.getStorageSync('car');
    var car_count = object_length(car);
    if (car_count) {
        wx.setTabBarBadge({
            index: 3,
            text: car_count + ''
        })
    } else {
        wx.removeTabBarBadge({
            index: 3,
        })
    }
}

function load_conf(that, op = 'get_index_conf', fn = '') {
    post('action.php', {
        op: 'get_index_conf'
    }, function (response) {
        response.content.hot_msg = response.content.hot_msg.split(':');
        that.setData({
            conf: response.content
        })
        fn && fn(response.content)
        if (response.content.background_color) {
            var back = response.content.background_color;
        } else {
            var back = '#FFFFFF';
        }
        if (response.content.color) {
            var color = response.content.color;
        } else {
            var color = '#000000';
        }
        wx.setNavigationBarColor({
            backgroundColor: back,
            frontColor: color,
            animation: {
                duration: 1000,
                timingFunc: 'linear'
            }
        })
    })
}

function loadData_login(op, page, that) {
    wx.showLoading({
        title: '加载中',
    })
    wx.login({
        success(res) {
            var msg = {
                code: res.code,
                op: op,
                page: page,
                page_size: 10
            }
            post('user.php', msg, function (response) {
                wx.hideLoading({
                    complete: (res) => {},
                })
                wx.stopPullDownRefresh({
                    complete: (res) => {},
                })
                if (response.ret == 0 && response.content.length > 0) {
                    if (page > 1) {
                        var data = that.data.list;
                        for (var i = 0; i < response.content.length; i++) {
                            data.push(response.content[i])
                        }
                    } else {
                        data = response.content;
                    }
                    that.setData({
                        list: data,
                        page: page
                    })
                }
            })
        }
    })
}

function loadData(op, page, that) {
    wx.showLoading({
        title: '加载中',
    })
    var msg = {
        op: op,
        page: page,
        page_size: 10
    }
    post('user.php', msg, function (response) {
        wx.hideLoading({
            complete: (res) => {},
        })
        wx.stopPullDownRefresh({
            complete: (res) => {},
        })
        if (response.ret == 0 && response.content.length > 0) {
            if (page > 1) {
                var data = that.data.list;
                for (var i = 0; i < response.content.length; i++) {
                    data.push(response.content[i])
                }
            } else {
                data = response.content;
            }
            that.setData({
                list: data,
                page: page
            })
        }
    })
}

function share_function(title = '') {
    if (module.exports.globalData.userInfo.is_proxy != 2) {
        return;
    }
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = currentPage.route;
    if (title) {
        console.log('at 1');
        return {
            title: title,
            path: url + '?send_id=' + module.exports.globalData.userInfo.mina_openid
            //imageUrl: '' // 图片 URL
        }
    }
    console.log('at 2')
    return {
        path: url + '?send_id=' + module.exports.globalData.userInfo.mina_openid
        //imageUrl: '' // 图片 URL
    }
}

function openLocation(locate) {
    wx.getLocation({
        type: 'gcj02',
        success(res) {
            const latitude = res.latitude
            const longitude = res.longitude
            wx.openLocation({
                latitude: locate.currentTarget.dataset.lat * 1,
                longitude: locate.currentTarget.dataset.lng * 1,
                name: locate.currentTarget.dataset.addr,
                address: locate.currentTarget.dataset.area,
                scale: 18
            })
        }
    })
}
module.exports = {
    object_length: object_length,
    formatTime: formatTime,
    formatDate,
    formatNumber,
    get: get,
    post: post,
    upload: upload,
    uploadWx: uploadWx,
    updateWx: updateWx,
    login: login,
    add_login_callback: add_login_callback,
    add_login_callback_fail: add_login_callback_fail,
    load_car: load_car,
    load_conf: load_conf,
    loadData: loadData,
    loadData_login: loadData_login,
    add_footer: add_footer,
    share: share_function,
    openLocation: openLocation,
}