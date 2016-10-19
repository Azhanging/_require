/*
 *2016-10-18 16:00:50 
 * fyc构建
 * */
(function(window) {
	//模块
	var _require,
		//模块列表
		modules = {
			//模块路径
			modulePaths: [],
			//模块id名
			moduleIdNames: [],
			//模块暴露接口
			moduleExports: {},
			//模块接口函数
			moduleFns: {}
		},
		//判断模块是否加载
		isLoadEnd = [],
		//获取对象
		_$;

	_$ = (function() {
		var getEls = (function() {
			if(typeof document.querySelectorAll === 'function') {
				return function(el) {
					return document.querySelectorAll(el)
				};
			} else {
				return function(el) {
					return document.getElementsByTagName(el)
				};
			}
		})();

		var getEl = (function() {
			if(typeof document.querySelector === 'function') {
				return function(el) {
					return document.querySelector(el)
				};
			} else {
				return function(el) {
					return document.getElementById(el)
				};
			}
		})();
		return {
			getEls: getEls,
			getEl: getEl
		}
	})(_$);

	/*引入模块文件*/
	_require = function(id) {
		if(typeof id === 'string') {
			//从模块中获取对象
			var moduleIndex = modules.moduleIdNames.indexOf(id);
			if(moduleIndex === -1) {
				console.warn('找不到' + id + '模块!');
			} else {
				//返回暴露的接口
				return new modules.moduleFns[id]();
			}
		} else {
			console.warn('文件引用id必须为字符串!');
		}
	}

	/*模块构建*/
	_require.define = function(id, fn) {
		//id不能为数字
		if(typeof id === 'string') {
			if(typeof fn === 'function') {
				//是否已存在同样id的模块名
				if(modules.moduleIdNames.indexOf(id) === -1) {
					//模块函数推入到临时的数组内,在调用结束后执行
					modules.moduleFns[id] = fn;

				} else {
					console.warn('存在相同' + id + '的模块!');
				}
			} else {
				console.warn('传入的第二参数不是函数类型');
			}
		} else {
			console.warn('模块id必须为字符串!');
		}
	}

	/*开始模块构建初始化引入模块文件*/
	_require.use = function(callback) {
			if(_require.config instanceof Object) {
				var jsPath = _require.config.path;
				if(jsPath instanceof Array) {
					var len = jsPath.length,
						i = 0;
					//把模块引入到文件中
					for(; i < len; i++) {
						var script = document.createElement('script');
						script.src = jsPath[i];
						_$.getEls('head')[0].appendChild(script);
						//把模块文件索引推送到模块列表,方便获取
						modules.modulePaths.push(jsPath[i]);
						//监听所有的script加载情况
						isLoadEnd.push(false);
						//加载模块成功
						script.onload = (function(i) {
							return function() {
								isLoadEnd[i] = true;
								//判断所有的模块加载是否完毕
								console.log(isLoadEnd);
								for(var j = 0, l = isLoadEnd.length; j < l; j++) {
									if(!isLoadEnd[j]) {
										return;
									}
								}
								//循环接口函数数组
								for(var k in modules.moduleFns) {
									//执行临时的接口函数,抛出接口
//									var exports = modules.moduleFns[k]();
									//储存模块名
									modules.moduleIdNames.push(k);
									//索引模块暴露的接口
//									modules.moduleExports[k] = exports;
								}
								//所有模块加载完毕后的回调函数
								callback();
							}
						})(i);
						//加载模块错误
						script.onerror = (function(i) {
							return function() {
								console.warn(jsPath[i] + '模块加载有误!');
							}
						})(i);
					}
				}
			} else {
				console.warn('_require.config配置有误!');
			}
		}
		/*当前库暴露*/
	window._require = _require;
})(window);