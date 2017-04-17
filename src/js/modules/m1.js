_require.define(function(){
	var b = 1;
	function a(el,text){
		var _m2 = _require('@js/modules/m2/m2.js');
		return _m2.b;
	}
	function changeB(i){
		b = i;
		console.log(b);
	}
	function bb(){
		return b;
	}
	return{
		a:a,
		c:changeB,
		bb:bb
	}
});

