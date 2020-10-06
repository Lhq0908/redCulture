// +----------------------------------------------------------------------
// | 广西西途比网络科技有限公司 www.c2b666.com
// +----------------------------------------------------------------------
// | 功能描述:发现
// +----------------------------------------------------------------------
// | 时　　间: 2019/10/30 12:00
// +----------------------------------------------------------------------
// | 代码创建:  黄家桂 
// +----------------------------------------------------------------------
// | 版本信息: V1.0.0
// +----------------------------------------------------------------------
// | 代码修改:(廖惠琼 - 2019/11/22 16:05）
//   1.添加页面加载中
//   2.修改发布，置顶图标
// +----------------------------------------------------------------------
import Resource from '../../../api/resource.js'
let globalData = getApp().globalData,
  App = getApp();
Page({
  data: {
    // 当前模块
    current: 0,
    // 搜索
    search: '',
    // 关键字
    keyword: '',
    // 页码
    page: 1,
    // 页大小
    size: 10,
    // 列表数据
    dataList: [],
    //导航栏初始化距顶部的距离
    navbarInitTop: 0,
    //是否固定顶部
    isFixedTop: false,
    // 到底显示
    over: false,
    // 总数
    total: 0,
    // 悬浮球显示隐藏
    floorstatus: false,
    topNum: 0,
    inReachBottom: false,
    upDataLength: 0,
    // 加载中
    item: true,
    loading: false
  },
  //  生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    // 重置参数
    that.setData({
      page: 1,
      over: false,
      upDataLength: 0,
      dataList: []
    })
    // 获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 55
        });
      }
    });
    that.data.resource = new Resource();
    // 初始化
    that.init();
  },
  init: function () {
    let _this = this,
      pamrs = {
        isHot: _this.data.current,
        page: _this.data.page,
        size: _this.data.size
      }
    if (_this.data.keyword != '') {
      pamrs.keyword = _this.data.keyword
    }
    // 请求数据
    _this.data.resource.bbsList(pamrs).then((data) => {
      if (_this.data.pullIn) {
        // 显示下拉刷新
        _this.setData({
          inReachBottom: true
        })
        setTimeout(() => {
          _this.setData({
            inReachBottom: false
          })
        }, 1500)
        // 停止下拉刷新动画
        wx.stopPullDownRefresh()
        _this.setData({
          pullIn: false
        })
      }
      if (data.code == 200) {
        // 设置最大条数
        _this.setData({
          total: data.result.total,
          item: false,
          loading: true
        })
        // 是否获取完内容
        if (_this.data.total <= _this.data.dataList.length) {
          _this.setData({
            over: true
          })
        } else {
          // 处理数据
          for (let item of data.result.records) {
            item.content = item.content.length <= 100 ? item.content : item.content.substr(0, 100) + '...';
          }
          // 更新数据
          _this.setData({
            dataList: [..._this.data.dataList, ...data.result.records],
            reLoadding: false,
            upDataLength: data.result.records.length,
            total: data.result.total
          })
        }

      }
    });
  },
  // 点击图片放大
  previewImage: function (event) {
    let current = event.currentTarget.dataset.src,
      webHost = this.data.webHost,
      index = event.currentTarget.dataset.index,
      list = [];
    for (let item of this.data.dataList[index].resources) {
      list.push(webHost + item.url)
    }
    wx.previewImage({
      // 当前显示图片的http链接
      current: current,
      // 需要预览的图片http链接列表
      urls: list
    })
  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    if (that.data.navbarInitTop == 0) {
      //获取节点距离顶部的距离
      wx.createSelectorQuery().select('#navbar').boundingClientRect(function (rect) {
        if (rect && rect.top > 0) {
          var navbarInitTop = parseInt(rect.top);
          that.setData({
            navbarInitTop: navbarInitTop
          });
        }
      }).exec();
    }

  },
  // 点击切换
  clickTab: function (e) {
    let that = this;
    if (this.data.current === e.target.dataset.current) {
      return false;
    } else {
      // 重置参数
      that.setData({
        current: e.target.dataset.current,
        page: 1,
        over: false,
        upDataLength: 0,
        dataList: []
      })
      this.init()
    }
  },
  // 搜索
  getSearch: function (e) {
    this.setData({
      keyword: e.detail.value,
      page: 1,
      over: false,
      dataList: []
    })
    this.init();
  },
  // 绑定键输入
  bindKeyInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  // 清空搜索
  empty: function () {
    this.setData({
      keyword: '',
      page: 1,
      over: false,
      dataList: []
    })
    this.init();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    if (!this.data.over) {
      this.setData({
        page: ++this.data.page
      })
      this.init()
    }
  },
  // 下拉刷新
  onPullDownRefresh(e) {
    // 重置参数
    this.setData({
      pullIn: true,
      page: 1,
      over: false,
      dataList: []
    })
    this.init()
  },
  //回到顶部
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 滚动
  onPageScroll: function (e) {
    let that = this;
    //滚动条距离顶部高度
    let scrollTop = parseInt(e.scrollTop);
    that.setData({
      floorstatus: scrollTop >= 200 ? true : false
    });
    //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
    let isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
    //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
    if (that.data.isFixedTop === isSatisfy) {
      return false;
    }
    that.setData({
      isFixedTop: isSatisfy
    });
  }
})