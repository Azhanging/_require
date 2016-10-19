_require.define("m1",function(){function n(n,e){var n=document.getElementById(n);n.innerHTML=t}function e(n){t=n,console.log(t)}function r(){return t}var t=1;return{a:n,c:e,bb:r}});
_require.define("m2",function(){var e=_require("m1"),r=e.a;return{b:r}});
_require.define("m3",function(){var e=(_require("m2"),_m2.b);return{b:e}});