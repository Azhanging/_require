/*
 * 2016-10-18 16:00:50 fyc构建 
 * 
 * 2016-11-5 10:21:27 拆分提示,添加path必须为数组类型
 * 
 * 2016-11-16 09:45:01 修改提示错误问题
 * 
 * 2016-12-11 09:50:44 修复提示错
 * */
(function(global, factory) {
	//不引入两次
	if(!(typeof global._require == 'function')){
		global._require = factory(global);
	}
})(typeof window !== 'undefined' ? window : this, function(global) {
		//模块列表
	var	modules = {
			//模块路径
			modulePathFile: {},
			//模块id名
			moduleIdNames: [],
			//已经引入的模块
			isLoadmodulePaths: [],
			//模块接口函数
			moduleFns: {},
			//模块注释
			modulesComment:{},
			//useList待处理的队列
			useList:[]
		},
		//判断模块是否加载
		isLoadEnd = [];

	var _$ = (function() {
		var getEls = (function() {
			return function(el) {
				return document.getElementsByTagName(el)
			};
		})();

		var getEl = (function() {
			return function(el) {
				return document.getElementById(el)
			};
		})();
		return {
			getEls: getEls,
			getEl: getEl
		}
	})();
	
	function setComment(id,comment){
		if(comment && typeof comment == 'string'){
			modules.modulesComment[id] = comment;
		}else{
			modules.modulesComment[id] = '该模块没有设置注释';
		}
	}
	
	//兼容性IE8
	(function compatibility(){
		//不兼容IE8代理数据
		if(navigator.userAgent.indexOf('MSIE 8.0') == -1){
			//共享变量
			Object.defineProperty(global,'G',{
				value:{},
				enumerable: true,
				configurable: false,
				writable:false
			});
		}
		//兼容IE8中 的indexOf
		if(!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(val) {
				for(var index = 0, len = this.length; index < len; index++) {
					if(this[index] === val) {
						return index;
					}
				}
				return -1;
			}
		}
	})();

	/*引入模块文件*/
	function _require(id) {
		if(typeof id === 'string') {
			//从模块中获取对象
			if(modules.moduleIdNames.indexOf(id) === -1) {
				_require.error(0, id);
			} else {
				//返回暴露的接口
				return new modules.moduleFns[id]();
			}
		} else {
			_require.error(1);
		}
	}

	/*模块构建*/
	_require.define = function(id, fn,comment) {
		//id不能为数字
		if(typeof id === 'string') {
			if(typeof fn === 'function') {
				//是否已存在同样id的模块名
				if(modules.moduleIdNames.indexOf(id) === -1) {
					//储存模块名
					modules.moduleIdNames.push(id);
					//模块函数推入到临时的数组内,在调用结束后执行
					modules.moduleFns[id] = fn;
					//存在注释的话添加注释到的模块列表中
					setComment(id,comment);
					/*--------------------------错误警告--------------------------*/
				} else {
					_require.error(2, id);
				}
			} else {
				_require.error(3);
			}
		} else {
			_require.error(4);
		}
	}

	/*开始模块构建初始化引入模块文件*/
	_require.use = function(callback) {
		//查看是否存在配置文件
		if(_require.config instanceof Object && typeof callback == 'function') {
			//取出配置文件的模块路径
			var modulePaths = _require.config.path;
			//模块路径为一个数组
			if(modulePaths instanceof Array) {
				//use列表
				modules.useList.push(callback);
				//把模块引入到文件中
				for(var i = 0,len = modulePaths.length; i < len; i++) {
					//判定是否又重复引入的模块
					if(isLoadModules(modulePaths[i])) {
						var script = document.createElement('script');
						script.src = modulePaths[i];
						_$.getEls('head')[0].appendChild(script);
						
						//把模块文件索引推送到模块列表,方便获取
						modules.modulePathFile[modulePaths[i]] = {
							isLoad:false,
							path:modulePaths[i]
						};
						//已加载的模块路径
						modules.isLoadmodulePaths.push(modulePaths[i]);
						//加载模块成功
						script.onload = (function(path) {
							return function() {
								modules.modulePathFile[path].isLoad = true;
								//判断所有的模块加载是否完毕
								if(!checkIsLoad()){
									return;
								}
								//所有模块加载完毕后的回调函数
								for(var j = 0,len = modules.useList.length; j<len;j++){
									modules.useList.shift()();
								}
							}
						})(modulePaths[i]);
						//加载模块错误
						script.onerror = (function(path) {
							return function() {
								_require.error(5,path);
							}
						})(modulePaths[i]);
					}
				}
				//如果当前的use为后面加入的，进入队列中
				//判断所有的模块加载是否完毕
				if(!checkIsLoad()){
					return;
				}else{
					modules.useList.shift()();
				}
			} else {
				_require.error(6);
			}
			/*--------------------------错误警告--------------------------*/
		} else {
			_require.error(7);
		}
	}

	_require.error = function(errorStatus, id) {
		switch(errorStatus) {
			case 0:
				console.warn('找不到' + id + '模块!');
				break;
			case 1:
				console.warn('文件引用id必须为字符串!');
				break;
			case 2:
				throw('存在相同' + id + '的模块!');
				break;
			case 3:
				console.warn('传入的第二参数不是函数类型');
				break;
			case 4:
				console.warn('模块id必须为字符串!');
				break;
			case 5:
				throw(modules.modulePathFile[id].path + '模块加载有误!');
				break;
			case 6:
				console.warn('_require.config配置路径类型为数组!');
				break;
			case 7:
				console.warn('_require参数配置有误!');
				break;
			default:
				;
		}
	}
	
	//模块列表
	_require.modulesList = modules.moduleIdNames;
	//模块注释信息查询
	_require.modulesComment = modules.modulesComment;

	//判定是否多次使用use，以及多次引入相同的模块
	function isLoadModules(path) {
		if(modules.isLoadmodulePaths.indexOf(path) != -1){
			return false;
		}else{
			return true;
		}
	}
	
	//判断是否加载模块完毕
	function checkIsLoad(){
		for(var path in modules.modulePathFile){
			if(modules.modulePathFile.hasOwnProperty(path)){
				if(modules.modulePathFile[path].isLoad == false){
					return false;
				}
			}
		}
		return true;
	}
	
	_require.version = '1.0.7';
	
	return _require;
});