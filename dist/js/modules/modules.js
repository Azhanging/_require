_require.define("m1",function(){function e(e,n){var e=document.getElementById(e);e.innerHTML=n}return{a:e}});
_require.define("m2",function(){var e=_require("m1"),r=e.a;return{b:r}});