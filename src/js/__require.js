(function(global, factory) {
	//不引入两次
	if(!(typeof global._require == 'function')) {
		global._require = factory(global);
	}
})(typeof window !== 'undefined' ? window : this, function(global) {
	
	//http、https链接
	var HTTP_PATH = /^http(s)?:\/\//;
	//相对路径
	var RELATIVE_PATH = /^\./;
	//别名路径
	var ALIAS_PATH = /^@[^\/]*/;
	
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

	//获取模块
	function _require(path) {
		var getModules = _require.modules.installedModules[getUrl(path)];
		if(!getModules){
		//获取的可能是id
			return new _require.modules.installedModules[path].path();
		}else if(getModules) {
			return getModules.path();
		} else {
			_require.error(1, path);
		}
	}

	//模块信息
	_require.modules = {
		//路径模块加载
		installedModules: {},
		//模块列表
		modulesLists: [],
		//已经加载的模块列表
		isLoadModules: {},
		//执行use队列
		installUse: [],
		//最后加载成功的模块路径
		lastLoadModuleHandler: null,
		//最后加载模块设置的id值
		lastLoadId: null,
		//最后加载模块依赖
		lastDepModules: []
	};

	//设置配置信息,并且初始化
	_require.config = function(options) {
		_require.baseUrl = options.baseUrl;
		_require.alias = options.alias;
		//加载模块
		loadModules(setUrl(options.paths));
	}

	//定义模块
	_require.define = function(id, callback) {
		var modules = _require.modules;
		var hasLastModuleHandler = false;
		var arg_0 = arguments[0],
			arg_1 = arguments[1],
			arg_2 = arguments[2];

		//默认设置了id
		if(typeof arg_0 === 'string') {
			//如果第二个参数是依赖，先设置依赖
			if(arg_1 instanceof Array) {
				loadModules(arg_1);
				modules.lastLoadId = arg_0;
				modules.lastLoadModuleHandler = arg_2;
				modules.lastDepModules = arg_1;
			} else if(typeof arg_1 === 'function') {
				//如果第二个参数是模块函数
				modules.lastLoadId = arg_0;
				modules.lastLoadModuleHandler = arg_1;
			}
		} else {
			//非id模块
			if(arg_0 instanceof Array) {
				loadModules(arg_0);
				modules.lastLoadModuleHandler = arg_1;
				modules.lastDepModules = arg_0;
			} else if(typeof arg_0 === 'function') {
				//如果第二个参数是模块函数
				modules.lastLoadModuleHandler = arg_0;
			}
		}
	}

	//运行模块
	_require.use = function(callback) {
		_require.modules.installUse.push(callback);
	};

	//设置路径
	function setUrl(paths) {
		var _paths = [];
		for(var index = 0; index < paths.length; index++) {
			_paths.push(getUrl(paths[index]));
		}
		return _paths;
	}
	
	function getUrl(path){
		//http链接
		if(HTTP_PATH.test(path)){
			return path;
		}else if(RELATIVE_PATH.test(path)){ 
		//相对路径
			return _require.baseUrl + path.replace(/^\./,'');
		}else if(ALIAS_PATH.test(path)){	
		//别名路径
			var replaceString = path.match(ALIAS_PATH)[0];
			var aliasKey = replaceString.replace('\@',''); 
			return _require.baseUrl + path.replace(replaceString,_require.alias[aliasKey]);
		}
	}

	//加载模块
	function loadModules(paths) {
		var modules = _require.modules;
		if(!(paths instanceof Array)) {
			return;
		}
		for(var index = 0; index < paths.length; index++) {
			var path = paths[index]; //获取加载模块的列表
			if(hasModule(path)) { //查看当前的路径是否已经记载的模块					
				continue;
			}
			var scriptElement = document.createElement('script');
			scriptElement.src = path;
			document.getElementsByTagName('head')[0].appendChild(scriptElement);
			//当前模块添加到列表中
			modules.modulesLists.push(path);
			//设置当前模块加载状态
			modules.isLoadModules[path] = false;
			//监听模块状态
			(function(index, path) {
				scriptElement.onload = function() {
					//设置最后加载的模块已经模块路径
					modules.installedModules[path] = {};
					modules.installedModules[path].path = modules.lastLoadModuleHandler;
					modules.installedModules[path].dep = modules.lastDepModules;

					//修改当前模块加载状态
					modules.isLoadModules[path] = true;
					//书否存在设置id的模块
					if(modules.lastLoadId) {
						modules.installedModules[modules.lastLoadId] = {};
						//设置id的模块
						modules.installedModules[modules.lastLoadId].path = modules.lastLoadModuleHandler;
						modules.installedModules[modules.lastLoadId].dep = modules.lastDepModules;
						//初始化id的选项
						modules.lastLoadId = null;
					}
					modules.lastDepModules = [];
					//检查当前模块是全部否完成
					if(isLoad()) {
						runUse();
					}
				};
				scriptElement.onerror = function() {
					_require.error(1, path);
				};
			})(index, path);
		}
	}

	//检测是否存在了模块
	function hasModule(path) {
		if(_require.modules.modulesLists.indexOf(path) === -1) {
			return false;
		}
		return true;
	}

	//检测模块是否全部完毕
	function isLoad() {
		var modules = _require.modules;
		var isLoad = Object.keys(modules.isLoadModules);
		for(var index = 0; index < isLoad.length; index++) {
			if(modules.isLoadModules[isLoad[index]] === false) {
				return false;
			}
		}
		return true;
	}

	//运行use
	function runUse() {
		var uses = _require.modules.installUse;
		for(var index = 0, len = uses.length; index < len; index++) {
			uses.shift()();
		}
	}

	//错误处理
	_require.error = function(errorCode, msg) {
		switch(errorCode) {
			case 1:
				console.warn('加载' + msg + '加载有误');
				break;
			case 2:
				console.warn('存在相同' + msg + '模块');
				break;
			case 3:
				console.warn(msg + '模块参数有误');
				break;
			default:;
		}
	}

	return _require;
});