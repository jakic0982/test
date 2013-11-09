;(function($){

  $.fn.collapse = function(){
    return this.each(function(){
      var h = $(this).find('.header');
      var b = $(this).find('.body');	  
      b.addClass('default')
	  
      h.tap(function () {
        //b.toggleClass('collapsed').toggle();
		
		//切换图标
		var parent = b.parent();
		var img = parent.find('.headerImage');
		var imgName = img.attr("src");
		
		var arrowDown = "arrow-down.png";
		var arrowUp = "arrow-up.png";
		
		//转换成正规表达式，以方便下面进行替换
		var arrowDownRex = new RegExp(arrowDown);
		var arrowUpRex = new RegExp(arrowUp);
	    if (imgName.indexOf(arrowDown) != -1) {
		    imgName = imgName.replace(arrowDownRex, arrowUp);
		} else if (imgName.indexOf(arrowUp) != -1) {
		    imgName = imgName.replace(arrowUpRex, arrowDown);
		}		
		img.attr("src", imgName);
		
		b.toggle();
		//alert(isCollapse());
		writeCollapseStateToSetting();
      })
	  
	  //判断页签是否收叠
	  function isCollapse() {
		var display = b.css('display');
		if (display == 'none') {
		   return true;
		} else {
		   return false;
		}
	  }
	  
	  function writeCollapseStateToSetting() {
		var id = b.parent().attr('id');
		var collapseState = isCollapse();
		//alert(collapseState);
		
		var pageCollapseState = localStorage.getItem('pageCollapseState');
		var collapseStateArray = new Array();
		if (pageCollapseState != null && pageCollapseState != '') {
			collapseStateArray = JSON.parse(pageCollapseState);
		}

	    var stateStore = find(collapseStateArray, id);
		if (stateStore) {
		    stateStore.collapseState = collapseState;
		} else {
			var stateStore = new Object();
			stateStore.id = id;
			stateStore.collapseState = collapseState;
			collapseStateArray.push(stateStore);
		}
		
		localStorage.setItem('pageCollapseState', JSON.stringify(collapseStateArray));
		//alert(localStorage.getItem('pageCollapseState'));
		
	  }
	  
	  function find(array, id) {
	    if (array == null) {
		   return null;
		}
	    for (var i = 0; i < array.length; i++) {
		    var stateStore = array[i];
			if (stateStore.id == id) {
			    return stateStore;
			}
		}
	  }
	  
	  
    })
  }
  
})(Zepto)