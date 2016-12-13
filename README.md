# _require
小型模块构建器

###_require(moduleId):

	moduleId:string类型,获取moduleId对应的模块;

***
###_require.define(id,fn):
	
	id为字符串类型,通过_require(id)可以获取到暴露的接口;
	fn为模块的执行函数,内部定义暴露的接口;
***
###_require.config = {}
	path(数组类型):引入模块的路径
	
###_require.use(callback);
	加载模块，所有的模块加载完毕后，执行回调函数；
	
###G变量代理
	例如：G['id'] = 1;
	G为全局定义，不可重新赋值，只能在它身上添加变量代理的key和val；
	

