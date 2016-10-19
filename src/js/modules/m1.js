_require.define('m1',function(){
	var b = 1;
	function a(el,text){
		var el = document.getElementById(el);
		el.innerHTML = b;
	}
	function changeB(i){
		b = i;
		console.log(b);
		return b;
	}
	return{
		a:a,
		c:changeB,
		b:b
	}
});

