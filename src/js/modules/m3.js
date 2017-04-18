_require.define('m3',function(){
	var greater = function(i){
		if(i>0){
			return true;
		}
		return false;
	};
	return {
		greater:greater
	}
});   