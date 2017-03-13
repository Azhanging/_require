_require.define('m1',function(){
	var b = 1;
	function a(el,text){
		var el = document.getElementById(el);
		el.innerHTML = b;
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
},"测试模块的注释内容1");

