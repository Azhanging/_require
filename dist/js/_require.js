!function(e){function n(e,n){switch(e){case 0:console.warn("找不到"+n+"模块!");break;case 1:console.warn("文件引用id必须为字符串!");break;case 2:throw"存在相同"+n+"的模块!";case 3:console.warn("传入的第二参数不是函数类型");break;case 4:console.warn("模块id必须为字符串!");break;case 5:throw modulePaths[i]+"模块加载有误!";case 6:console.warn("_require.config配置路径类型为数组!");break;case 7:console.warn("_require.config配置有误!")}}var o,t,r={modulePaths:[],moduleIdNames:[],moduleFns:{}},u=[];t=function(){var e=function(){return"function"==typeof document.querySelectorAll?function(e){return document.querySelectorAll(e)}:function(e){return document.getElementsByTagName(e)}}(),n=function(){return"function"==typeof document.querySelector?function(e){return document.querySelector(e)}:function(e){return document.getElementById(e)}}();return{getEls:e,getEl:n}}(t),o=function(e){if("string"==typeof e){var o=r.moduleIdNames.indexOf(e);if(o!==-1)return new r.moduleFns[e];n(0,e)}else n(1)},o.define=function(e,o){"string"==typeof e?"function"==typeof o?r.moduleIdNames.indexOf(e)===-1?(r.moduleIdNames.push(e),r.moduleFns[e]=o):n(2,e):n(3):n(4)},o.use=function(e){if(o.config instanceof Object){var c=o.config.path;if(c instanceof Array)for(var i=c.length,a=0;a<i;a++){var s=document.createElement("script");s.src=c[a],t.getEls("head")[0].appendChild(s),r.modulePaths.push(c[a]),u.push(!1),s.onload=function(n){return function(){u[n]=!0;for(var o=0,t=u.length;o<t;o++)if(!u[o])return;e()}}(a),s.onerror=function(e){return function(){n(5)}}(a)}else n(6)}else n(7)},e._require=o}(window);