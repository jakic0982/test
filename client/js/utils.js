var AwPhenix = AwPhenix || {}

AwPhenix.reqNo = 0

var fkIE6 = false
if (/\bMSIE 6/.test(navigator.userAgent) && !window.opera) {
  fkIE6 = true
} 

var console = console || {}
console.log = console.log || function (text) {
  
}

// 面包屑控件  start ################################################################

var breadcrumb = [
  // {
  //   text: '游戏中心',
  //   pageId: 'page1#k=v&k=v'
  // }
]

function hideBreadcrumb() {
  $('#bread_container').empty()
}

function refreshBreadcrumb () {
  $con = $('#bread_container')
  $con.empty()
  for ( var i = 0 ; i < breadcrumb.length ; i ++ ) {
    if ( i ) $con.append('<span>&nbsp;&gt;&nbsp;</span>')
    if ( i < breadcrumb.length - 1 )
      $con.append('<span class="b-link" pageId='+breadcrumb[i].pageId+'>' + breadcrumb[i].text + '</span>')
    else
      $con.append('<span>' + breadcrumb[i].text + '</span>')
  }
}


function collectBreadcrumb (text, page) {
  if ( breadcrumb.length >= 1 
    && ( breadcrumb.slice(-1)[0].pageId == page 
      || breadcrumb.slice(-1)[0].text == text ) ) { 
    return 
  }

  breadcrumb.push( {text: text, pageId: page } )
}

function consumeBreakcrumb (pageId, clearNextStack) {
  if ( clearNextStack == undefined ) clearNextStack = true
  for ( var i = 0 ; i < breadcrumb.length ; i ++ ) {
    if ( breadcrumb[i].pageId == pageId ) { breadcrumb.splice( i, breadcrumb.length - i + 1 ) }
  }

  loadPage.apply(undefined, pageId.split('#').concat(clearNextStack))

}

$(function bindBreadcrumbEvent() {
  $('#bread_container').on('click', '.b-link', function () {
    var currentPageId = breadcrumb.slice(-1)[0].pageId
    nextPageStack.push(currentPageId)
    consumeBreakcrumb($(this).attr('pageId'), /*clearNextStack=*/false)
  })
})
// 面包屑控件  end   ################################################################



// 左右导航控件 start    ################################################################


// 页面
// 前向页面栈。 
// 当产生面包屑的时候，清空前向页面栈
// 当消耗面包屑的时候，压入一个页面。
// 当点击后退按钮时， 压入一个页面。
// 当点击前进按钮时， 弹出一个页面。

var nextPageStack = []


var currentPage = ''

function destroyCurrentPage() {
  if ( currentPage && PageMap[currentPage].destroy ) {
    PageMap[currentPage].destroy()
  }
}

function hideNavigation() {
  $('#nav-container').hide()
}

function refreshNavigation() {
  $('#nav-container').show()

  if ( !breadcrumb.length ) { return }
  var homePageId = breadcrumb[0].pageId
  var currentPageId = breadcrumb.slice(-1)[0].pageId

  // 后退

  $('#nav-container #nav-left').removeAttr('class')
  $('#nav-container #nav-left').unbind()
  if ( breadcrumb.length > 1 ) {
    var parentPageId = breadcrumb.slice( -2,-1 )[0].pageId
    $('#nav-container #nav-left').addClass('active')
    $('#nav-container #nav-left').bind('click', function () {
      nextPageStack.push(currentPageId)
      consumeBreakcrumb(parentPageId, /*clearNextStack=*/false)
    })
  }

  //前进

  $('#nav-container #nav-right').removeAttr('class')
  $('#nav-container #nav-right').unbind()

  if ( nextPageStack.length > 0 ) {
    var nextPageId = nextPageStack.slice(-1)[0]
    $('#nav-container #nav-right').addClass('active')
    $('#nav-container #nav-right').bind('click', function () {
      nextPageStack.pop()
      loadPage.apply(undefined, nextPageId.split('#').concat(false))
    }) 
  }

  //reload

  $('#nav-container #nav-reload').unbind()
  $('#nav-container #nav-reload').bind('click', function () {
    loadPage.apply(undefined, currentPageId.split('#').concat(false))
  })

  //homepage

  $('#nav-container #nav-home').unbind()
  $('#nav-container #nav-home').bind('click', function () {
    breadcrumb = []
    loadPage.apply(undefined, homePageId.split('#').concat(true))
  })

  $('#nav-container > div.active')
    .bind('mouseover', function () { $(this).addClass('hover') })
    .bind('mouseout', function () { $(this).removeClass('hover') })
    .bind('mousedown', function () { $(this).addClass('pressed') })
    .bind('mouseup', function () { $(this).removeClass('pressed') })

}

// 左右导航控件 end   ################################################################
// 如果不传入options, 则默认 显示面包屑 应用类型 左右导航栏
// 可以通过传入 { hideBreadcrumb: boolean, hideAppTypes: boolean, hideNavigation: boolean } 
// 来修改默认行为
function refreshPageHeader(options) {
  var o = options || {}

  o.hideBreadcrumb = !!o.hideBreadcrumb
  o.hideAppTypes = !!o.hideAppTypes
  o.hideNavigation = !!o.hideNavigation

  if ( o.hideNavigation ) { hideNavigation() }
  if ( o.hideBreadcrumb ) { hideBreadcrumb() }
  if ( o.hideAppTypes ) { hideAppTypes() }

  if ( !o.hideNavigation ) { refreshNavigation() }
  if ( !o.hideBreadcrumb)  { refreshBreadcrumb() }
  if ( !o.hideAppTypes ) { refreshAppTypes() }
}




// 应用分类导航控件 start ############################################################

//顶部的分类导航
// typeId, typeName
var appTypes = []

// 当前应用分类
var currentAppTypeId = ''


function hideAppTypes() {
  $('#app-type-navigation').empty()
}

function refreshAppTypes() {
  if ( appTypes.length == 0 ) { return }
  var tpl        = '<div class="app-type" typeId=#{typeId}>#{typeName}</div>',
      $container = $('#app-type-navigation')

  $container.empty()
  for ( var i = 0 ; i < appTypes.length ; i ++ ) {
    var $compiledTpl = $(tpl.replace('#{typeId}', appTypes[i].typeId).replace('#{typeName}', appTypes[i].typeName))
    if ( currentAppTypeId == appTypes[i].typeId ) { $compiledTpl.addClass('active') }
    $container.append( $compiledTpl )
  }

  var w = $container.width(),
      pw = $container.parent().innerWidth(),
      lw = $container.prev().width(),
      lMargin = (pw - lw - w - 22 ) / 2
  $container.css('margin-left', lMargin + 'px')

}


// 应用分类导航控件 end   ############################################################





// 通用工具方法 start  ################################################################


function createMask ($container) {
  loadingText = LOADING_TEXT || '正在加载精彩游戏...'
  $container.append('<div id="load-mask"><div id="load-mask-text">'+loadingText+'</div></div>')
}
function removeMask () {
  $('#load-mask').fadeOut(function () {
    $('#load-mask').remove()
  })
}
function createFetchMore($container) {
  loadingText = FETCHING_MORE_TEXT || '正在加载更多游戏...'
  $container.append('<div id="fetch-more"><div id="fetch-more-text">'+loadingText+'</div></div>')
}
function removeFetchMore() {
  $('#fetch-more').remove()
}

function showErrorPage( errorWord, errorBtnWord, clickFn ) {
  errorWord    = errorWord || '发生错误了'
  errorBtnWord = errorBtnWord || '返回首页'
  clickFn      = clickFn || function () { loadPage('page1') }

  var template = $('script.errorpage').html()
  template = template.replace('#{errorWord}', errorWord).replace('#{errorBtnWord}', errorBtnWord )

  $('#content').html(template)
  $(".nano").nanoScroller({ scroll: 'top' })
  refreshPageHeader({ hideNavigation: true, hideBreadcrumb: true, hideAppTypes: true })

  $('.error-page #error-btn').bind('mouseover', function () { $(this).addClass('hover') })
    .bind('mouseout', function () { $(this).removeClass('hover') })
    .bind('mousedown', function () { $(this).addClass('pressed') })
    .bind('mouseup', function () { $(this).removeClass('pressed') })
    .bind('click', clickFn )

  removeMask()
}

function handleServerError () {
  showErrorPage( '服务器内部错误', '回到首页', function () {
    var pageParams = ['page1', '']
    loadPage.apply(undefined, pageParams )

  } )
}

function handleNetworkError() {
  
  showErrorPage( '网络连接异常，请检查网络后重试', '重试', function () {
    var pageParams = ['page1', '']
    if ( penddingPage.length > 0 ) { pageParams = penddingPage }
    loadPage.apply(undefined, pageParams )

  } )

}


function handleIe6Error() {
  showErrorPage( '您使用的IE浏览器版本(ie6)过低，请下载新版本的ie浏览器', '前往下载', function () {
    window.open("http://www.microsoft.com/zh-cn/download/confirmation.aspx?id=43")
    // if ( AwPhenix.clientOS.isWinXP ) {
      
    // }
  } )

}


// 通用工具方法 end  ################################################################

var penddingPage = []

function clearPenddingPage() {
  penddingPage = []
}
function addPenddingPage(page, params) {
  penddingPage.splice(0, 0, page, params)
  // 现在 penddingPage : [page, params]
}


// 加载页面.
// 字符串 page: 页面的id
// 字符串 params: 'key=value&key=value'
// boolean clearNextStack: 是否清除 前向页面栈. 该栈保存了点击"下一页"时需要载入的页面. 默认值为true. 清除.

function loadPage (page, params, clearNextStack) {
  clearPenddingPage()
  addPenddingPage(page, params)

  clearStillLoadingImages()

  destroyCurrentPage()

  if ( clearNextStack == undefined ) clearNextStack = true
  
  // page: id of dom
  // params: k=v&k=v
  var template = $('script.' + page ).html()

  //load mask
  createMask( $('body') )

  $('#content').html(template)

  currentPage = page

  var pageObj = PageMap[page]

  var url = pageObj.url
  if ( params ) { url += '?' + params }

  $(".nano").nanoScroller({ scroll: 'top' });


  function finalize() {
    clearPenddingPage()
    // 删除 load mask
    removeMask()
    // 创建滚动条
    $('.nano').nanoScroller({ alwaysVisible: true })
    // 如果当前页面跳转不是靠的消耗面包屑来达到的（比如点击页面上的按钮，或者图片），则清空前向页面栈
    if ( clearNextStack == true ) nextPageStack = []
    // 刷新顶部菜单
    refreshPageHeader()
    $(window).focus()
  }

  // load json.
  AwGetJSON( url , function (data) {
    if ( data.status == 'error' ) {
      handleServerError()
      finalize()
    } else {
      pageObj.setup(data)
      pageObj.addEvent()
      //每次加载完成后，将当前页面加到面包屑中
      collectBreadcrumb(data.title, [page, params].join('#'))
      finalize()
      if ( pageObj.loadComplete ) { pageObj.loadComplete(data, page, params) }
    }
  })

}

// ajax网络请求 20s 后超时
var GETJSON_TIMEOUT = 20000

function AwGetJSON(url, data, successCb) {
  if ( $.isFunction(data) ) {
    successCb = data
    data = {}
  }
  
  // 
  // 设置所有请求共同的参数
  // 设置 pkglist
  // 
  data.pkglist = JSON.stringify(AwPhenix.PkgInstallingInfos)
  data.reqNo = AwPhenix.reqNo++

  var options = {
    url: url,
    type: 'POST',
    dataType: 'json',
    data: data,
    success: successCb
  }

  $.extend( options , { timeout: GETJSON_TIMEOUT } )

  var ajax = $.ajax( options ).fail(function ( ) {
    console.log("error happended")
    handleNetworkError()
  })

  return ajax
}


// nano : nano滚动控件,监听scrollend
// container : loadMask 的容器
// remoteUrl : 远程url，可以为function， 但函数必须返回一个字符串
// successCb : 成功的回调函数

var SCROLLEND_TIMEOUT = 20000

// 防止加载太快, 提示信息闪烁
var SCROLLEND_MIN_TIME = 1000

function bindNanoScrollEndFetchMore(nano, container, remoteUrl, successCb) {
  // 拉到最下面 再加载30条
  var isLoading = false, url = remoteUrl
  nano.bind("scrollend", function(){
    console.log('in scrollend callback, but isLoading is: ' + isLoading )

    if ( !$('.pane').is(':visible') ) { return }

    if ( isLoading ) { return }
    isLoading = true

    //显示一行正在获取更多游戏
    createFetchMore( container )

    nano.nanoScroller({ scroll: 'bottom' });

    if ( $.isFunction(remoteUrl) ) { url = remoteUrl() }
    if ( !url ) { throw '必须指定url 字符串, 如果为函数, 则函数必须返回一个 url 字符串 ' }


    function finalize () {
      removeFetchMore()
      nano.nanoScroller({ alwaysVisible: true })
      isLoading = false
    }

    var startTime = new Date().getTime()

    $.ajax({ url: url, type: 'POST', dataType: 'json',
      timeout: SCROLLEND_TIMEOUT,
      success: function (data) {
        var elapse    = new Date().getTime() - startTime
          padding = elapse > SCROLLEND_MIN_TIME ? 1 : ( SCROLLEND_MIN_TIME - elapse )

        window.setTimeout(function () {
          if ( $.isFunction(successCb) ) { successCb(data) }
          finalize()
        }, padding )
      }
    })
    .fail(function () {
      var elapse  = new Date().getTime() - startTime
          padding = elapse > SCROLLEND_MIN_TIME ? 1 : ( SCROLLEND_MIN_TIME - elapse )

      window.setTimeout(function () { 
        console.log('网络异常了')
        finalize()
      }, padding )
    })

  });
}

function unbindNanoScrollEndEvent(nano) {
  nano.unbind()
}




// 公用的 PageMap   start #################################################################

// 游戏中心和 应用中心 都有应用详情

var PageMap = {}

PageMap['page3']  = {
  url: 'api/app_detail',
  setup: function (data) {

    $('#app-detail-title').text(data.appName)
    $('#app-intro p').text(data.appDesc)
    if ( $('#app-intro p').height() <= 75 ) { $('#app-intro-more').hide() }

    var tpl1 = $('script[name=app-detail-sidebar]').html()
    for ( var p in data ) {
      if ( data.hasOwnProperty(p) ) {
        tpl1 = tpl1.replace('#{' + p + '}', data[p])
      }
    }
    var $tpl1 = $(tpl1)
    $tpl1.find('#app-detail-icon-75').loadImage({ src: data['url'] })

    if( data.install == '已安装' ) {
      $tpl1.find('.install-pkg-button').addClass('status-installed').removeClass('install-pkg-button')
    } else if ( data.install == '升级' ) {
      $tpl1.find('.install-pkg-button').addClass('status-upgradable')
    }

    $('#app-detail-sidebar').html($tpl1)

    if ( data.updateDesc ) {
      var tpl2 = $('script[name=app-detail-wrap-info]').html()
      $('#app-detail-wrap-info').html(tpl2.replace('#{updateDesc}', data.updateDesc))
    }

    // 游戏截图
    var imgTpl = $('script[name=scrollable-img]').html()
        // images = []
    
    
    // 先使用默认的图片
    for ( var i = 0 ; i < data.appPicUrl.length ; i ++ ) {
      var $imgTpl = $(imgTpl)
      $imgTpl.find('img').attr({ src: AwPhenix.default_scrollable_img}).removeClass().addClass('image-236-365')
      $('#makeMeScrollable').append($imgTpl)
    }
    $('#makeMeScrollable').slider({ speed: 200 });

    // 完全加载完成后，重新生成滚动条
    $.loadScrollableImages(data.appPicUrl, function (width) {
      $('#makeMeScrollable').removeClass().empty()
      for ( var i = 0 ; i < data.appPicUrl.length ; i ++ ) {
        var $imgTpl = $(imgTpl)
        $imgTpl.find('img').attr({ src: data.appPicUrl[i] }).removeClass().addClass('image-height-365')
        $('#makeMeScrollable').append($imgTpl)
      }
      $('#makeMeScrollable').slider({ speed: 200 });
    })



    // 左边的高度跟右边一样高
    $('#app-detail-wrap').parent().height( $('#app-detail-wrap').outerHeight(true) )
  },

  addEvent: function () {
    $('#app-intro-more').click(function () {
      $('#app-intro').toggleClass('full-text')

      $('#app-detail-wrap').parent().height( $('#app-detail-wrap').outerHeight(true) )

      if ( $('#app-intro').hasClass('full-text') ) {
        $('#app-intro-more').text('收起全部')
      } else {
        $('#app-intro-more').text('查看全部')
      }
    })

    $('#app-detail-install:not(.status-installed) ').bind('mouseover', function () { $(this).addClass('hover') })
      .bind('mouseout', function () { $(this).removeClass('hover') })
      .bind('mousedown', function () { $(this).addClass('pressed') })
      .bind('mouseup', function () { $(this).removeClass('pressed') })

  },
  destroy: function () {
    $('#app-intro-more').unbind()
    $('#app-detail-install').unbind()
  }
}

// 公用的 PageMap   end ###################################################################





// 将url的参数解压出来
// 返回一个数组 [{packageName: 'com.a.b', packageVersion: 400 }]
// function parsePkgsFromUrl() {
//   var query = window.location.search.substring(1);
//   if ( !!query ) {
//     var args = query.split('&'),
//         pkgListKey = 'applist',
//         pkgs
//     for ( var i = 0 ; i < args.length ; i ++ ) {
//       var pair = args[i].split('=')
//       if ( decodeURIComponent(pair[0] ) == pkgListKey ) {
//         pkgs = JSON.parse( decodeURIComponent(pair[1]) )
//         break;
//       }
//     }
//     return pkgs
//   }
// }

// function parsePkgsFromHiddenInput() {
//   var pkgs = $('input[type=hidden]#pkgs-hidden-input').val()
//   return JSON.parse(pkgs)
// }

// AwPhenix.PkgInstallingInfos
// 全局变量. 在 utils.js 中定义
// 当前页面中涉及到的所有pkg的版本情况,安装情况
/* 示例

AwPhenix.PkgInstallingInfos = {
  'com.a.b' : { packageVersion: 400 }
}

*/
// AwPhenix.PkgInstallingInfos = {}
// ;(function () {
//   var parsedPkgs = parsePkgsFromHiddenInput()
//   if ( !parsedPkgs ) { return }

//   var pkgInfos = AwPhenix.PkgInstallingInfos
  
//   for ( var i = 0 ; i < parsedPkgs.length ; i ++ ) {
//     var pkg = parsedPkgs[i]
//     pkgInfos[pkg.packageName] = {
//       packageVersion: pkg.packageVersion
//     }
//   }
// })()

