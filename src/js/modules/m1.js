_require.define(['@js/modules/m2/m2.js','m2'],function(m2Moudle,m2){
	function m1(i){
		i+=10;
		return m2Moudle.add(i);	
	}
	console.log(m2);
	return m1;
});

