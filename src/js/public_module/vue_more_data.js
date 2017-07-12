/*
 *	加载更多模块
 * 	依赖vue
 * 	参数配置：
  	{
  		el:'#app',		//数据绑定节点
  		url:'请求的数据方法'，
  		data:{
  			page:0   //页码默认为0，可配置为对应的页码
  			otherInit:... //其他的请求参数
  		},
  		isInit:false,		//是否默认初始化 默认为false
  		moreBtnEl:'按钮的element',		//如果设置了初始化，需要设置这个值来指引提示内容的变化，
  		noMoreMsg:'没有更多数据了'，		//设置按钮没有数据时显示的文字信息{@type string}
  		isMoveLoad：{					
  			type:'move',				//move：touchmove事件		scroll：scroll事件
  			state:false					//是否滑动触发
  		}
  	}
  	
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
_require.define('vue_more_data', function() {
	function moreData(options) {
		/*如果配置参数为空，不执行任何的操作*/
		if(Object.keys(options).length == 0) {
			return function() {};
		}

		/*配置信息*/
		var config = {
			url: '',			//请求数据方法
			data: {				//发送请求的数据
				page: 0,
				p:0
			},
			type: 'get',		//请求方法
			isInit: false,		//是否默认初始化
			noMoreMsg: '没有更多数据了',		//没有数据时显示的信息
			isMoveLoad:{					//是否滚动触发
				type:'move',
				state:false
			}				
		}

		/*请求的数据信息初始化*/
		var initOps = $.extend(config, options ? options : {});

		//实例接口
		var moreData = new Vue({
			el: initOps.el,
			data: {
				page: initOps.data.page,		//页码
				md: [],							//数据代理
				ready: false,					//初始显示
				ajaxLoad:false					//防止多次请求数据
			},
			methods: {
				more: function(is_event) {
					//存在按钮
					if(is_event && is_event.target) {
						this.getPageContent(event.target);
					} else {
						//没有通过按钮触发
						this.getPageContent();
					}
					this.ready = true;
				},
				getPageContent: function(btnEl) {
					var _this = this;
					$.ajax({
						url: initOps.url,
						type: initOps.type,
						data: initOps.data,
						success: function(data) {
							if(data != null && data.length > 0) {
								initOps.data.page++;
								initOps.data.p++;
								_this.md = _this.md.concat(data);
							} else {
								//显示没有数据的提示，并且禁止点击
								if(btnEl) {
									btnEl.innerHTML = initOps.noMoreMsg;
									btnEl.disabled = true;
								} else {
									layer.open({
										content: initOps.noMoreMsg,
										skin: 'msg',
										time: 2
									});
								}
								window.removeEventListener('touchmove', _this.touchmoveHandler, false);
								window.removeEventListener('scroll', _this.touchmoveHandler, false);
							}
							
							//防止多次请求数据
							_this.ajaxLoad = false;
						}
					});
				},
				touchmoveHandler() {
					if(this.matchLoad() && !this.ajaxLoad) {
						this.ajaxLoad = true;
						this.more();
					}
				},
				matchLoad: function() {
					var $lastItem = $(this.$el).children().last(),
						lastTop = $lastItem.offset().top + Math.floor($lastItem.outerHeight() / 2),
						scrollTop = $(window).scrollTop(),
						windowHeight = $(window).height();
					return(lastTop < (scrollTop + windowHeight) ? true : false);
				}
			},
			mounted: function() {
				/*如果存在初始化参数，默认初始化*/
				if(initOps.isInit === true) {
					this.more(initOps.moreBtnEl);
				}
				/*下拉加载,选择的是滑动还是滚动*/
				if(initOps.isMoveLoad.state && initOps.isMoveLoad.type == 'move') {
					window.addEventListener('touchmove', this.touchmoveHandler, false);
				}else if(initOps.isMoveLoad.state && initOps.isMoveLoad.type == 'scroll'){
					window.addEventListener('scroll', this.touchmoveHandler, false);
				}
			}
		});
	}
	return moreData;
});