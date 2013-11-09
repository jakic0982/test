;(function($) {

  

  $.fn.scrollads = function() {
    return this.each(function() {
      var $ul = $(this),num = 0

      $ul.addClass('scrollads')

      function init() {
        var $li
        
        var ads = ['世纪佳缘在相亲!','京东双11特价!','淘宝最新女款卖疯了!','大家都在用微信!'], 
          lineHeight = 20
        num = ads.length
        ads.forEach(function(elem, index) {
          $li = $('<li></li>')
          $li.css({
            'top': index * lineHeight + 'px'
          }).text(elem)

          $ul.append($li)
        })
      }

      function startSlide() {
        $ul.children().forEach(function(el, index) {
          var lineHeight = 20,time = 1000, delay = 3000
          var count = el.myScrollData || 0
          count++
          var finishCallback = function(event) {
            el.removeEventListener("webkitTransitionEnd", finishCallback, false)
            if (index == 0) {
              count = 0 // 重置滚动次数
              el.style.top = lineHeight * (num - 1) + "px" //移动到最后

              el.style.webkitTransform = "translate(0px, 0px)"
              el.style.webkitTransitionDuration = "1ms"

              el.parentNode.appendChild(el) //移动到最后
              setTimeout(startSlide, delay)
            }
            el.myScrollData = count
          }
          el.addEventListener("webkitTransitionEnd", finishCallback, false)
          window.setTimeout(function() {
            el.style.webkitTransform = "translate(0px, " + count * (-lineHeight) + "px)"
            el.style.webkitBackfaceVisiblity = "hidden"
            el.style.webkitTransitionDuration = time + "ms"
            el.style.webkitTransitionTimingFunction = "linear"
            el.style.webkitTransformOrigin = "0% 0%"
          }, 1)
        })
      }

      init()
      startSlide()

    })
  }
})(Zepto)
