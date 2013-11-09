$(document).ready(function(){
  $('#hot').collapse();
  $('#shop').collapse();
  $('#information').collapse();
  $('#entertainment').collapse();
  $('#social').collapse();

  $('.ads').scrollads();
  

  var cq = 0;
  $('#nav-top li').tap(function() {
      var index = $(this).index();
	  cq = 100*index + "%";
	  $(this).parents('#top-box').find('.line').css({'-webkit-transform':'translate('+cq+')'} );
  });
  
  restoreFormSetting();
  
  //根据最后一次打开情况来决定各标签的开展状况
  function restoreFormSetting() {
	var stateStoreArray = new Array();
	var pageCollapseState = localStorage.getItem('pageCollapseState');
	if (pageCollapseState != null && pageCollapseState != '') {
		stateStoreArray = JSON.parse(pageCollapseState);
	}
	for (var i = 0; i < stateStoreArray.length; i++) {
		var stateStore = stateStoreArray[i];
		var id = stateStore.id;
		var collapseState = stateStore.collapseState;
		id = '#' + id;
		var body = $(id).find('.body');
		if (collapseState) {
			body.hide();
		} else {
			body.show();
		}
	}     
  }
  
})