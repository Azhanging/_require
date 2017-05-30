/*
 *	加载更多模块
 * 	依赖vue
 * 	参数配置：
 * 	{
 * 		el:'#app',		//数据绑定节点
 * 		url:'请求的数据方法'，
 * 		data:{
 * 			page:0   //页码默认为0，可配置为对应的页码
 * 			otherInit:... //其他的请求参数
 * 		},
 * 		isInit:false,		//是否默认初始化 默认为false
 * 		moreBtnEl:'按钮的element',	//如果设置了初始化，需要设置这个值来指引提示内容的变化
 * 		noMoreMsg:'没有更多数据了'		//设置按钮没有数据时显示的文字信息{@type string}
 * 	}
 * 
 * 	//由于vue在初始化的时候会看到默认dom为编译的状态，所以给数据列表的父级添加v-show="ready"来display回来
 * 	
 * 	//模板数据依赖md参数，循环md参数中的item为列表项的值
 * 	<li v-for="item in md">
		<h3>{{item.title}}</h3>
		<p>{{item.content}}</p>
		<time>{{item.time}}</time>
	</li>
 * 
 * */
_require.define('more_data',function(){
	function moreData(options){
		/*如果配置参数为空，不执行任何的操作*/
		if(Object.keys(options).length == 0){
			return function (){};
		}
		
		/*配置信息*/
		var config = {
			url:'',
			data:{
				page:0
			},
			type:'get',
			isInit:false,
			noMoreMsg:'没有更多数据了'
		}
		
		/*请求的数据信息初始化*/
		var initOps = $.extend(config,options?options:{});
		
		//实例接口
		var moreData = new Vue({
			el:initOps.el,
			data:{
				page:initOps.data.page,
				md:[],
				ready:false
			},
			methods:{
				more:function(is_event){
					if(is_event.target){						
						this.getPageContent(event.target);
					}else{
						this.getPageContent(is_event);
					}
					this.ready = true;
				},
				getPageContent:function(btnEl){
					var _this = this;
					$.ajax({
						url:initOps.url,
						type:initOps.type,
						data:initOps.data,
						success:function(data){
							data = getData();
							if(data.length > 0 && data != null){
								initOps.data.page++;
								_this.md = _this.md.concat(data);
							}else{
								//显示没有数据的提示，并且禁止点击
								btnEl.innerHTML = initOps.noMoreMsg;
								btnEl.disable = true;
							}
						}
					});
				}
			}
		});
		
		/*如果存在初始化参数，默认初始化*/
		if(initOps.isInit === true){
			moreData.more(initOps.moreBtnEl);
		}
	}
	return moreData;
});