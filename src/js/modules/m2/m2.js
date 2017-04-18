_require.define('m2',['@js_1/js/modules/m3.js'],function(m3){
	function add(i){
		if(m3.greater(i)){			
			return i++;
		}
	}
	return {
		add:add
	}
});