$(function() {
  // 个人资料切换
  $(".nav-toggle li").click(function() {
    $(this).addClass("active").siblings().removeClass("active");
    var index = $(this).index();
    $(".content-item dd").eq(index).addClass("active").show().siblings("dd").removeClass("active").hide();
  }).eq(0).trigger('click');

  // 内容页二级导航切换
  $(".nav li").click(function() {
    $(this).addClass("active").siblings().removeClass("active");
    var index = $(this).index();
    $(".details-content dd").eq(index).addClass("active").show().siblings("dd").removeClass("active").hide();
  }).eq(0).trigger('click');

  // 列表页二级导航切换
  // $(".nav li").click(function() {
  //   $(this).addClass("active").siblings().removeClass("active");
  //   var index = $(this).index();
  //   $(".list-content dd").eq(index).addClass("active").show().siblings("dd").removeClass("active").hide();
  // }).eq(0).trigger('click');

  $(".page-item li").click(function() {
    $(this).addClass("active").siblings().removeClass("active");
  })

})
