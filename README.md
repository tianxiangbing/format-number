<!--
 * @Author: 田想兵
 * @Date: 2021-04-14 15:37:26
 * @LastEditTime: 2021-04-15 10:09:31
 * @github: https://github.com/tianxiangbing
 * @Contact: 55342775@qq.com
-->
# format-number
文本框数字或金额格式化
效果如下图:

![数字格式化](./example/format-number.jpg)

Demo请点击[数字格式化demo](http://www.lovewebgames.com/jsmodule/format-number.html "数字格式化demo")
# 演示代码
	<script src="../src/jquery-1.11.2.js"></script>
	<script src="../src/format-number.js"></script>
	<div>整数：<input type="text" data-type="int" data-name="int"/></div>
	<script>
		var n1 = new FormatNumber();
		n1.init({trigger:$('[data-type="int"]'),decimal:0});
	</script>
	<div>整数可为负：<input type="text" data-type="int2" data-name="int"/></div>
	<script>
		var n2 = new FormatNumber();
		n2.init({trigger:$('[data-type="int2"]'),decimal:0,minus:true});
	</script>
	<div>两位小数(默认)：<input type="text" class="has-minus" value="1112212.221" data-type="number" data-name="as"/></div>
	<script>
		var n3 = new FormatNumber();
		n3.init({trigger:$('[data-type="number"]')});
	</script>
	<div>3位小数并且可为负数：<input type="text" data-name="pc" data-type="pecent"/></div>
	<script>
		var n4 = new FormatNumber();
		n4.init({trigger:$('[data-type="pecent"]'),decimal:3,minus:true});
	</script>
	<div>4位小数并且不可为负数：<input type="text" data-name="pc" data-type="pecent2"/></div>
	<script>
		var n5 = new FormatNumber();
		n5.init({trigger:$('[data-type="pecent2"]'),decimal:4});
	</script>
	<div>标签：123123123.13211=<span id="sp_number">123123123.13211</span></div>
	<script>
	$('#sp_number').FormatNumber({decimal:4})
	</script>
# API
## 属性
### trigger:dom|string
	触发器元素，可为input或标签元素(span/div)
### parent	:dom|string
	委托对象，由于本插件对事件的绑定都以委托为主，如不传，默认代理到body上
### decimal:	int
	小数位数，默认2位
### minus: bool
	是否支持负数，默认为false不支持
### update:function
	动态更新参数
