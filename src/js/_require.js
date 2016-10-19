/*
 *2016-10-18 16:00:50 
 * fyc构建
 * */
(function(window) {
	//模块
	var _require,
		//模块列表
		moduleLists = {
			modulePath: [],
			moduleExports: []
		},
		i = 0,
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
	_require = function(jsFile) {
		if(typeof jsFile === 'string') {
			//从模块中获取对象
			var moduleIndex = moduleLists.modulePath.indexOf(jsFile);
			if(moduleIndex === -1) {
				console.warn('找不到' + jsFile + '模块!');
			} else {
				return moduleLists.moduleExports[moduleIndex];
			}
		} else {
			console.warn('文件引用路径应该为字符串!');
		}
	}

	/*模块构建*/
	_require.define = function(fn) {
		var exports = new fn();
		//索引模块暴露的接口
		moduleLists.moduleExports.push(exports);
	}

	/*开始模块构建初始化引入js文件*/
	_require.use = function(callback) {
		if(_require.config instanceof Object) {
			var jsPath = _require.config.path,
				//判断模块是否加载
				isLoadEnd = [];
			if(jsPath instanceof Array) {
				var len = jsPath.length,
					i = 0;
				//把模块引入到文件中
				for(; i < len; i++) {
					var script = document.createElement('script');
					script.src = jsPath[i];
					_$.getEls('head')[0].appendChild(script);
					//把模块文件索引推送到模块列表,方便获取
					moduleLists.modulePath.push(jsPath[i]);
					//监听所有的script加载情况
					isLoadEnd.push(false);
					script.onload = (function(i) {
						return function() {
							isLoadEnd[i] = true;
							for(var j = 0, l = isLoadEnd.length; j < l; j++) {
								if(!isLoadEnd[j]) {
									return;
								}
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