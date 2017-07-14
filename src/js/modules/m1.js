_require.define('haha',['@js/@js_2/modules/m2/m2.js','m2'],function(m2Moudle,m2){
	function m1(i){
		i+=10;
		return m2Moudle.add(i);	
	}
	console.log(m2 === m2Moudle);
	return m1;
});


_require.define('m10',['@js/@js_2/modules/m2/m2.js','m2'],function(m2Moudle,m2){
    function m1(i){
        i+=10;
        return m2Moudle.add(i); 
    }
    console.log(m2 === m2Moudle);
    return m1;
});

