# _require
小型模块构建器

###_require(moduleId):

	moduleId:string类型,获取moduleId对应的模块;

***
###_require.define(id,fn):
	
	id为字符串类型,通过_require(id)可以获取到暴露的接口;
	fn为模块的执行函数,内部定义暴露内部的接口;
***
###_require.config = {}
	path(数组类型):引入模块的路径
	

