_require.define(function(){
	var b = 1;
	function a(el,text){
		var el = document.getElementById(el);
		el.innerHTML = text;
	}
	return{
		a:a
	}
});
