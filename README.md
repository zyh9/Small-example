### 如何实现ajax请求

		通过实例化一个XMLHttpRequest对象得到一个实例，
		调用实例的open方法为这次ajax请求设定相应的http方法、相应的地址和以及是否异步，
		当然大多数情况下我们都是选异步， 以异步为例，之后调用send方法ajax请求，这个方法可以设定需要发送的报文主体，
		然后通过 监听readystatechange事件，通过这个实例的readyState属性来判断这个ajax请求的状态，
		其中分为0,1,2,3,4这四种 状态，当状态为4的时候也就是接收数据完成的时候，
		这时候可以通过实例的status属性判断这个请求是否成功
		
		var xhr = new XMLHttpRequest();
		xhr.open('get', '1.php', true);
		xhr.send(null);
		xhr.onreadystatechange = function() {
		  	if(xhr.readyState==4) {
		    	if(xhr.status==200) {
		      		console.log(xhr.responseText);
		    	}
		  	}
		}

### 简要介绍ES6

		ES6在变量的声明和定义方面增加了let、const声明变量，有局部变量的概念，赋值中有比较吸引人的结构赋值，
		同时ES6对字符串、 数组、正则、对象、函数等拓展了一些方法，
		如字符串方面的模板字符串、函数方面的默认参数、对象方面属性的简洁表达方式，
		ES6也引入了新的数据类型symbol，新的数据结构Set和Map,symbol可以通过typeof检测出来，
		为解决异步回调问题，引入了promise和generator，还有最为吸引人了实现Class和模块，
		通过Class可以更好的面向对象编程，使用模块加载方便模块化编程，
		当然考虑到浏览器兼容性，我们在实际开发中需要使用babel进行编译。

### 对js原型的理解

		我们知道在es6之前，js没有类和继承的概念，js是通过原型来实现继承的。
		在js中一个构造函数默认自带有一个prototype属性， 这个的属性值是一个对象，
		同时这个prototype对象自带有一个constructor属性，这个属性指向这个构造函数，
		同时每一个实例都有一个__proto__属性指向这个prototype对象，我们可以将这个叫做隐式原型，
		我们在使用一个实例的方法的时候，会先检查这个实例中是否有这个方法，
		没有则会继续向上查找这个prototype对象是否有这个方法，
		刚刚我们说到prototype是一个对象， 那么也即是说这个是一个对象的实例，
		那么这个对象同样也会有一个__proto__属性指向对象的prototype对象。

### 对js模块化的理解

		在ES6出现之前，js没有标准的模块化概念，这也就造成了js多人写作开发容易造成全局污染的情况，
		以前我们可能会采用立即执行 函数、对象等方式来尽量减少变量这种情况，
		后面社区为了解决这个问题陆续提出了AMD规范和CMD规范，
		这里不同于Node.js的 CommonJS的原因在于服务端所有的模块都是存在于硬盘中的，加载和读取几乎是不需要时间的，
		而浏览器端因为加载速度取决于网速，因此需要采用异步加载，
		AMD规范中使用define来定义一个模块，使用require方法来加载一个模块，
		现在ES6也推出了标准的模块加载方案，通过exports和require来导出和导入模块。

### 什么是深拷贝，什么是浅拷贝？

		浅拷贝是指仅仅复制对象的引用，而不是复制对象本身；深拷贝则是把复制对象所引用的全部对象都复制一遍。

### 如何阻止事件冒泡和默认事件？

		标准的DOM对象中可以使用事件对象的stopPropagation()方法来阻止事件冒泡，
		但在IE8以下中IE的事件对象通过设置事件对象的cancelBubble属性为true来阻止冒泡；
		 默认事件的话通过事件对象的preventDefault()方法来阻止，
		 而IE通过设置事件对象的returnValue属性为false来阻止默认事件。

### addEventListener有哪些参数？

		有三个参数，第一个是事件的类型，第二个是事件的回调函数，
		第三个是一个表示事件是冒泡阶段还是捕获阶段捕获的布尔值，true表示捕获，false表示冒泡(默认为false)

### 冒泡排序

```javascript
	    var arr = [1,2,5,3,8,7,6,4];
		//冒泡排序，两两比较，如果前边比后边大，就交换位置，大的放后边，最后得到从小到大排序后的数组
		//1,2,3,5,6,5,7,8
		var n = 0;
		function bubbleSort(arr){
			//比较多少轮，第一次得到最大，第二次得到第二大
			for(var i=0;i<arr.length;i++){
				//每一轮两两比较
				for(var j=0;j<arr.length;j++){
					//如果前边比后边大，交换位置
					if(arr[j]>arr[j+1]){
						var a = arr[j];
						arr[j] = arr[j+1];
						arr[j+1] = a;
					}
					n++;
				}
			}
			return arr;
		}
		console.log(bubbleSort(arr))
		console.log(n)
```

> 优化版

```javascript
		var arr = [1,2,5,3,8,7,6,4];
		//冒泡排序，两两比较，如果前边比后边大，就交换位置，大的放后边，最后得到从小到大排序后的数组
		//1,2,3,5,6,5,7,8
		var n = 0;
		function bubbleSort(arr){
			//比较多少轮，第一次得到最大，第二次得到第二大
			for(var i=0;i<arr.length-1;i++){
				//每一轮两两比较
				var onOff = true;
				for(var j=0;j<arr.length-1-i;j++){
					//如果前边比后边大，交换位置
					if(arr[j]>arr[j+1]){
						var a = arr[j];
						arr[j] = arr[j+1];
						arr[j+1] = a;
						//如果有交换，就变false
						onOff = false;
					}
					n++;
				}
				//如果这一轮都没有交换，证明已经排好了，break
				if(onOff){
					break;
				}
			}
			return arr;
		}
		console.log(bubbleSort(arr))
		console.log(n)
```

### 快速排序

```javascript
	    var arr = [1,2,5,3,8,7,6,4];
	    function quickSort(arr){
	    	//如果空数组或只有1项终止递归
	    	if(arr.length<=1){
	    		return arr;
	    	}
	    	//删除第一项，当目标值
	    	var cur = arr.shift();
	    	var left = [];
	    	var right = [];
	    	while(arr.length){
	    		//第一位和目标值比，切出来放在left或right里，比目标小的放left,大的放right
	    		if(cur>arr[0]){
	    			left.push(arr.shift());
	    		}else{
	    			right.push(arr.shift());
	    		}	
	    	}
	    	//返回left+cur+right连接的新数组，即排好顺序的数组，left,right递归继续拆分
	    	return quickSort(left).concat(cur,quickSort(right))
	    }
	    console.log(quickSort(arr))
```

### 深度克隆

```javascript
		var arr = [1,2,3,4,[0,1,2],{name:'leo'},function fn(){}];
		
		//如果数据为纯数据：没有function(){}
		//var arr2 = JSON.parse(JSON.stringify(arr));
		
		function deepclone(obj){
			var toSting = Object.prototype.toString;
			var o = obj.push?[]:{};
			for(var attr in obj){
				if(toSting.call(obj[attr]) === '[object Object]' || toSting.call(obj[attr]) === '[object Array]'){
					o[attr] = deepclone(obj[attr]);
				}else{
					o[attr] = obj[attr];
				}
			}
			return o;
		}
		var arr2 = deepclone(arr);
		arr2[4].push('x');
		console.log(arr2);
```

### 数组去重

```javascript
		var arr=[1,2,3,4,5,22,33,33,98,108,98]
		function Duplicate(arr){
			// slice 不传参数返回完整新数组
			// let arr1 =arr.slice();
			
			// filter 可接收return布尔值
			// true返回完整新数组  false返回新的空数组
			let arr1 = arr.filter(e=>true);
			
			let arr2=[];
			arr1.forEach((e)=>{
				if(!arr2.includes(e)){
					arr2.push(e)
				}
			})
			return arr2;
		}
		console.log(Duplicate(arr))
```

### 随机排序

```javascript
		arr=[1111,33,25,79,2,6,8,99,333]
		arr.sort(_=>Math.random()-0.5)
		console.log(arr)
```

### 数据转换

> 在面对数据转换的时候，别看每项的数据有多复杂或者多难处理（可先忽视每项内容），交给循环

```javascript
		<script type="text/javascript">
			let arr = [
					{name:'abc',age:'A'},
					{name:'def',age:'B'},
					{name:'ghi',age:'C'},
					{name:'jkl',age:'A'},
					{name:'mno',age:'B'}
					];
		//	let obj = {
		//		A:['abc','jkl'],
		//		B:['def','mno'],
		//		C:['ghi']
		//		}
			
			function fn(arr){
				let obj = {};
				arr.forEach(e=>{
					if(!(e.age in obj)){
						obj[e.age] = [];
						obj[e.age].push(e.name)
					}else{
						obj[e.age].push(e.name)
					}
				})
				return obj;
			}
			console.log(fn(arr))
		</script>
```

### 单个for循环排序

```html
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<title></title>
		</head>
		<body>
			<script type="text/javascript">
				let arr = [1,3,7,8,4,6,2,5];
				let n = 0;
				let len = arr.length;
				for(let i=0;i<len-1;i++){
					//如果前边比后边大，交换位置
					if(arr[i]>arr[i+1]){
						let item = arr[i];
						arr[i] = arr[i+1];
						arr[i+1] = item;
					}
					//如果i==len-2，给i赋值为0，继续执行循环
					if(i==len-2){
						i = 0;
						len--;
					}
					n++;
				}
				console.log(arr)
				console.log(n)
			</script>
		</body>
	</html>
```

### 定位

		position:relative  (相对定位)
		position:absolute  (绝对定位)
		position:fixed     (固定定位)

		相对定位的特性：
		    a、不影响元素本身的特性；
		    b、不会使元素脱离文档流（元素移动之后原始位置会被保留）；
		    c、如果没有定位偏移量，对元素本身没有任何影响；
		    d、提升层级
		
		绝对定位的特性：
		    a、使元素完全脱离文档流；
		    b、使内嵌元素支持宽高；
		    c、让块元素默认由内容撑开宽度；
		    d、如果有定位父级相对于定位父级发生偏移，没有定位父级相对于document发生偏移；
		    e、相对定位一般都是配合绝对定位元素使用；
		    f、提升层级
		
		固定定位的特性：
		    与绝对定位的特性基本一致，差别是始终相对浏览器窗口进行定位；
		
		所以当元素决定定位之后，如果有定位父级，则相对定位的父级来计算自己的left、top
		如果没有定位父级，则相对于document来计算自己的left、top

### margin

		1.margin-top传递
			当父级元素包裹子元素时，子元素有margin-top，
			那么第一个子元素的margin-top，会传递给父级元素
			
			解决办法 如下：
				1.给父级添加border
				2.父级使用overflow:hidden
		
		2.margin叠压
			当父级容器包裹多个子元素时，子元素的margin-top，margin-bottom会叠压
			当上下margin值不一样时，叠压范围取最大值
		
		*margin值的解析：左右边界累加，上下边界重合

### position和float的区别

		float和position这两者并没有孰好孰不好的问题，两者按需使用，各得所需的效果。
		
		float从字面上的意思就是浮动，这种在印刷排版之类中可能解释的更加贴切。float能让元素从文档流中抽出，
		它并不占文档流的空间，典型的就是图文混排中文字环绕图片的效果了。并且float这也是目前使用最多的网页布局方式。
		不过需要注意的是清除浮动是你可能需要注意的地方。并且如果你要考虑到古老的IE6之类的还会有一些bug诸如双边距等等问题。
		
		而position顾名思义就是定位。他有以下这几种属性：static(默认)，relative(相对定位)，
		absolute(绝对定位)和fixed(固定定位)。其中static和relative会占据文档流空间，他们并不是脱离文档的。
		absolute和fixed是脱离文档流的，不会占据文档流空间。
		
		比较可以发现，float和position最大的区别其实是是否占据文档流空间的问题。
		虽然position有absolute和fixed这两个同样不会占据文档流的属性，但是这两个并不适合被用来给整个网页做布局。
		为什么？因为这样你就得为页面上的每一个元素设置一个xy坐标来定位。
		
		float布局就显得灵活多了。但是一些特殊的地方搭配relative和absolute布局可以实现更好的效果。
		因为absolute是基于父级元素的定位，当父级元素是relative的时候，absolute的元素就会是基于它的定位了。
		比如你可以让一个按钮始终显示在一个元素的右下角。
		
		如果说到性能问题reflow（回流）问题，将元素的position设置为absolute和fixed可以使元素从DOM树结构中脱离出来独立的存在，
		而浏览器在需要渲染时只需要渲染该元素以及位于该元素下方的元素，从而在某种程度上缩短浏览器渲染时间。
		所以如果是制作js动画等，用absolute或者fixed定位会更好。

### HTML5、CSS3新增

		CSS3选择器有哪些？
		
			答：属性选择器、伪类选择器、伪元素选择器。
		
		CSS3新特性有哪些？
		
			1.颜色：新增RGBA，HSLA模式
			2.文字阴影（text-shadow）
			3.边框： 圆角（border-radius）边框阴影： box-shadow
			4.盒子模型：box-sizing
			5.背景：background-size 设置背景图片的尺寸background-origin 设置背景图片的原点
				background-clip 设置背景图片的裁切区域，以","分隔可以设置多背景，用于自适应布局
			6.渐变：linear-gradient、radial-gradient
			7.过渡：transition，可实现动画
			8.自定义动画
			9.在CSS3中唯一引入的伪元素是::selection.
			10.媒体查询，多栏布局
			11.border-image
			12.2D转换：transform：translate(x，y) rotate(x，y) skew(x，y) scale(x，y)
			13.3D转换
			
		CSS3新增伪类有那些？
		
			p:first-of-type 选择属于其父元素的首个 <p>元素的每个 <p>元素。
			p:last-of-type  选择属于其父元素的最后 <p>元素的每个 <p>元素。
			p:only-of-type  选择属于其父元素唯一的 <p>元素的每个 <p>元素。
			p:only-child    选择属于其父元素的唯一子元素的每个 <p>元素。
			p:nth-child(2)  选择属于其父元素的第二个子元素的每个 <p>元素。
			:enabled  :disabled  控制表单控件的禁用状态。
			:checked  单选框或复选框被选中。
			
		HTML5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分HTML和HTML5？
		
			新特性：
				1.拖拽释放(Drag and drop) API
				2.语义化更好的内容标签（header,nav,footer,aside,article,section）
				3.音频、视频API(audio,video)
				4.画布(Canvas) API
				5.地理(Geolocation) API
				6.本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失
				7.sessionStorage 的数据在浏览器关闭后自动删除
				8.表单控件，calendar、date、time、email、url、search
				9.新的技术webworker, websocket, Geolocation
				10.获取class列表属性(classList)
					length :  class的长度
					add()  :  添加class方法
					remove()  :  删除class方法
					toggle() :  切换class方法
				11.history在h5中新增的属性和方法
					h5中的history对象新增了两个新方法：
						history.pushState()和history.replaceState()
					push	直接添加一个路由，本质往历史记录里面添加一个
					replace	替换路由，不会往历史记录里面添加
					
			支持HTML5新标签：
				* IE8/IE7/IE6支持通过document.createElement方法产生的标签，
					可以利用这一特性让这些浏览器支持HTML5新标签，
					浏览器支持新标签后，还需要添加标签默认的样式
				* 当然最好的方式是直接使用成熟的框架、使用最多的是html5shim框架
			<!--[if lt IE 9]>
				<script> src="网页链接
			<![endif]-->

### 作用域

 		变量和函数起作用的范围，js只有函数作用域，在变量和函数创建时决定了作用域
 		
 		全局作用域
 		
 			全局变量，全局函数，全局可以访问
 			
 		局部作用域(函数作用域)
 		
 			写在函数内的
 			
 			局部变量/函数只能在该函数内部访问，外部不可访问
 			
 		作用域链
 		
 			使用变量/函数时，查找规则
 			函数内部->形参->函数外部

### 预解析

		1.找var，有名函数，形参，提前创建，默认值是undefined，
			有名函数默认值为函数块，有名字重复的只留一个
			
	 	2.赋值，形参赋值，小括号
	 	
	 	3.大括号，如果有有名函数，优先赋值给变量
	 	
	 	4.逐行执行代码，开始执行写的代码

### 一些css的问题（无实际意义）

```html
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<title></title>
			<style type="text/css">
				p{
					/*display: inline-block;*/
					float: left;
				}
				#p1{
					line-height: 50px;
					background: red;
				}
				#p2{
					background: yellow;
				}
				/*body{
					display: flex;
				}*/
			</style>
		</head>
		<body>
			<p id="p1">123</p>
			<p id="p2">456</p>
			<!--
				1.让两个p标签在一行居左显示
					浮动、行内块、弹性盒模型都可以
				2.假使给第一个p标签line-height: 50px;
				  那么第二个p的内容在第一个p内容的上方、中间、还是下方？
					float: left;第二个在第一个上方
					display: inline-block;第二个在第一个中间
					body{
						display: flex;//撑起第二个高度为50px，但仍在上方
						justify-content: flex-start;
					}
			-->
		</body>
	</html>
```

### 一道预解析引出的问题

		let n;
		let res = n*2;
		if(res==res){ //NaN不等于自己
			alert(res+'1'+0+2)
		}else{ //NaN为false
			alert(!res*2+'1'+0+2) //2102
		}

> 此题涉及到隐式类型转换

		显式类型转换(强制类型转换)：
		
			Number();
			parseInt();
			parseFloat();
		
		隐式类型转换：
		
			减(-)、乘(*)、除(/)、取模(%)可以将字符串转成数字
			+ 加号可以将数字转成字符串
			++ -- 加加、减减运算符可以把字符串转成数字
			< > 大于号、小于号可以把字符串转成数字，一定要注意是进行数字的比较还是字符串的比较
			! 取反  把右边的数据类型转成布尔值
			== 比较两边的值，如果数据类型不同，会先转成相同类型，再比较值是否相等
			注意：undefined == null 结果为true

> 另外还涉及到数据类型的转换

|原始数据类型|目标类型Number|
|---|---|
|undefined|NaN|
|null|0|
|false|0|
|true|1|
|数字|相应的数字|
|不能转化的字符串|NaN|

|原始数据类型|目标类型String|
|---|---|
|undefined|undefined|
|null|null|
|false|false|
|true|true|
|数字|数字字符串|

### IE和火狐的事件机制有什么区别？如何阻止冒泡？

		1.事件流描述的是从页面中接受事件的顺序，分为冒泡流和捕获流
		
		2.事件冒泡是指事件从最具体的元素接收，然后逐级向上传播，直到不具体的节点（通常指文档节点），
		  而事件捕获相反，它是从不具体的节点开始，逐步到最具体的节点
		
		3.IE的事件流是冒泡流，而火狐同时支持冒泡流和捕获流
		
		4.阻止事件冒泡：ev.stopPropagation()，IE则是使用ev.cancelBubble = true

### RGBA与opacity区别

		rgba(r,g,b,a)
		
			R：红色值。正整数 | 百分数
			G：绿色值。正整数 | 百分数
			B：蓝色值。正整数 | 百分数
			A：Alpha透明度。取值0~1之间。
			
			正整数为十进制0~255之间的任意值，百分数为0%~100%之间的任意值。
			RGBA是在R（Red）G（Green）B（Blue）模式上增加了alpha通道，alpha通道是不透明度。
		
		opacity: value | inherit;		
		
			value:不透明度，从 0.0 （完全透明）到 1.0（完全不透明）。
			
			Tip：IE8 以及更早的版本支持替代的 filter属性。例如：filter:Alpha(opacity=50)。
		
		区别
		
			opacity会继承父元素的 opacity属性，而RGBA设置的元素的后代元素不会继承不透明属性。

### em小例子

		<div class="p1">
		    <div class="s1">1</div>
		    <div class="s2">1</div>
		</div>
		<div class="p2">
		    <div class="s5">1</div>
		    <div class="s6">1</div>
		</div>
		.p1 {font-size: 16px; line-height: 32px;}
		.s1 {font-size: 2em;}
		.s2 {font-size: 2em; line-height: 2em;}
		
		.p2 {font-size: 16px; line-height: 2;}
		.s5 {font-size: 2em;}
		.s6 {font-size: 2em; line-height: 2em;}
		先来看第一组的答案
		
		p1：font-size: 16px; line-height: 32px
		s1：font-size: 32px; line-height: 32px
		s2：font-size: 32px; line-height: 64px
		和你的答案一样吗？下面来解释下
		
		p1 无需解释
		s1 em作为字体单位，相对于父元素字体大小；line-height继承父元素计算值
		s2 em作为行高单位时，相对于自身字体大小
		再来看看第二组的答案
		
		p2：font-size: 16px; line-height: 32px
		s5：font-size: 32px; line-height: 64px
		s6：font-size: 32px; line-height: 64px
		意不意外？惊不惊喜？下面来解释下
		
		p2 line-height: 2自身字体大小的两倍
		s5 数字无单位行高，继承原始值，s5的line-height继承的2，自身字体大小的两倍
		s6 无需解释

[参考链接，请戳我](https://yanhaijing.com/css/2017/09/29/principle-of-rem-layout/)

### CSS如何实现文字两端对齐

		div{
		  width:500px;
		  border:1px solid red;
		  text-align: justify;
		}
		
		text-align: justify这是什么东西？CSS2中text-align有一个属性值为justify，为对齐之意
		其实现的效果就是可以让一行文字两端对齐显示（文字内容要超过一行）。
		
		要使文字两端对齐，我们还得使用一个行内空标签来助阵，比如<span>、<i>等等，这里是我用<i>标签
		
		<div>这世间唯有梦想和好姑娘不可辜负！<i></i></div>
		给这个i标签设置如下样式
		
		div i{
		  display:inline-block;
		  /*padding-left: 100%;*/
		  width:100%;
		}
		padding-left: 100%和width:100%都可以达到效果，选用其一即可
		
		但是加入HTML元素又违反了结构表现分离的原则，我们可以改用after、before伪元素：
		
		div:after {
		    content: " ";
		    display: inline-block;
		    width: 100%;
		}

### 递归小例子

		有三级数据，数组包对象的形式，每一级的每个对象里都有一个name的key，
		现要将name的值拿到，并给其自身增加两个key，一个是text，一个是value
		
		let data = [
					{
						name:"a",
						data:[
							{
								name:"a",
								data:[{
										name:"a"
									},
									{
										name:"a"
									}
								]
							},
							{
								name:"a",
								data:[
									{
										name:"a"
									},
									{
										name:"a"
									}
								]
							}
						]
					},
					{
						name:"a",
						data:[
							{
								name:"a",
								data:[{
										name:"a"
									},
									{
										name:"a"
									}
								]
							},
							{
								name:"a",
								data:[
									{
										name:"a"
									},
									{
										name:"a"
									}
								]
							}
						]
					}
				]
		
		想到用递归来解决，但是有思路却无法下手
		感觉自己脑子瓦特了（你没有看错，只有这么几行）
		
		function fn(arr){
			arr.forEach(e=>{
				e.text = e.value = e.name;
				if(!e.data)return;
				fn(e.data);
			})
		}
		fn(data)
		console.log(data)

### min-width

		@media (min-width:400px){
				div{
					background: green;
				}
		}
		
		min-width	分辨率宽度大于等于设置值的时候识别

### max-width

		@media (max-width:400px){
				div{
					background: green;
				}
		}
		
		max-width	分辨率宽度小于设置值的时候识别

### 浏览器访问一个网站所经历的步骤

		1.Chrome搜索自身的DNS缓存
		
		2.搜索操作系统自身的DNS缓存（浏览器没有找到缓存或缓存已经失效）
		  查看Chrome浏览器的DNS缓存信息(chrome://net-internals/#dns)
		
		3.读取本地HOST文件
		
		4.浏览器发起一个DNS的一个系统调用
		
			宽带运营商服务器查看本身缓存
			运营商服务器发起一个迭代DNS解析的请求
			运营商服务器把结果返回操作系统内核同时缓存起来
			操作系统内核把结果返回浏览器
			最终浏览器拿到网站对应的IP地址
			
		5.浏览器获得域名对应的IP地址后，发起HTTP“三次握手”
		
		6.TCP/IP连接建立起来后，浏览器就可以向服务器发送HTTP请求了
		
		7.服务器端接受到了这个请求，根据路径参数，经过后端的一些处理之后，把处理后的一个结果的数据返回给浏览器
		
		8.浏览器拿到了网站的完整的HTML页面代码，在解析和渲染这个页面的时候，里面的JS、CSS、图片静态资源，
		  他们同样也是一个个HTTP请求都需要经过上面的主要的七个步骤
			
		9.浏览器根据拿到的资源对页面进行渲染，最终把一个完整的页面呈现给了用户

### 数据请求的问题

		很多时候我们在请求数据时，会遇到这样一个问题：
		
			调用的时候是空数组，内容后加进去的，所以外表看是空，内有东西
		
		解决办法：
			
			通常会加一个延时定时器，毫秒在（0-20）都可以
		
		Javascript是单线程执行的，也就是无法同时执行多段代码，当某一段代码正在执行的时候，
		所有后续的任务都必须等待，形成一个队列，一旦当前任务执行完毕，再从队列中取下一个任务，这也常被称为“阻塞式执行”

### 禁用F12和右键菜单

		// 禁用F12方法1
		document.onkeydown = function(){
			if(window.event && window.event.keyCode == 123){
				event.keyCode = 0;
				event.returnValue = false;
				return false;
			}
		}
		
		
		// 禁用F12方法2
		document.onkeydown = function(e){
			var currKey = 0,evt = e||window.event;
			currKey = evt.keyCode||evt.which||evt.charCode;
			if(currKey == 123){
				window.event.cancelBubble = true;
				window.event.returnValue = false;
			}
		}
		
		
		// 禁用右键菜单
		document.oncontextmenu = function(ev){
			ev.preventDefault()
		}

### 提高首屏性能

		前端渲染常使用的 SPA 会把所有 JS 整体打包，无法忽视的问题就是文件太大，
		会导致页面加载后花费很长的时间来解析，特别是网速差的时候，
		也就造成了白屏问题。让用户等待白屏结束并非一个很好的体验。
		服务端渲染可以预先使获取到的数据渲染成最终 HTML 直接展示，理想情况下能避免白屏问题。
		
		解决方法：
			
			首屏数据渐进式预加载
			
			绝大多数的单页式应用都符合 Application Shell 架构，
			根据这个架构我们可以看出一个应用首屏呈现节点可以分解为：
				请求入口页 -> 渲染应用外壳 -> 渲染首屏片段
			在此基础上进一步将三个节点细分如下：
				即对渲染应用外壳和渲染片段这块细分为：应用资源加载，应用初始化，
				片段资源加载，片段初始化，片段数据加载，片段渲染这些节点。
				
			根据上面的节点数据，首屏数据渐进式预加载的优化思路也得到了体现：
				1.优化首屏数据加载节点的速度。
				2.预先加载首屏数据，使得多个串行节点并行化。
			
			Step1：资源文件下载与首屏数据请求节点并行
			Step2：应用初始化，资源文件下载，首屏数据请求节点并行
			
		首屏呈现耗时的通用计算公式变为：
			
			下载静态片段 + Max(下载资源文件 + 应用初始化，请求首屏数据) + 首屏初始化 + 首屏渲染

> [知乎专栏文章链接](https://zhuanlan.zhihu.com/p/26543645)

> [App Shell 模型](https://developers.google.cn/web/fundamentals/architecture/app-shell?hl=zh-cn)

### 单页面应用路由实现原理

		hash 的历史
		
			最开始的网页是多页面的，后来出现了 Ajax 之后，才慢慢有了 SPA。然而，那时候的 SPA 有两个弊端：
			
				1.用户在使用的过程中，url 不会发生任何改变。当用户操作了几步之后，一不小心刷新了页面，又会回到最开始的状态。
				2.由于缺乏 url，不方便搜索引擎进行收录。
				
			怎么办呢？ -- 使用 hash
			
				url 上的 hash 本意是用来作锚点的，方便用户在一个很长的文档里进行上下的导航，用来做 SPA 的路由控制并非它的本意。
				然而，hash 满足这么一种特性：改变 url 的同时，不刷新页面，再加上浏览器也提供 onhashchange 这样的事件监听，
				因此，hash 能用来做路由控制。后来，这种模式大行其道，onhashchange 也就被写进了 HTML5 规范当中去了。
			
			的确可以通过 hash 的改变来对页面进行局部刷新。
			尤其需要注意的是：在第一次进入页面的时候，也会触发一次 onhashchange 事件，这保证了一开始的 hash 就能被识别。
			问题：虽然 hash 解决了 SPA 路由控制的问题，但是它又引入了新的问题 → url 上会有一个 # 号，很不美观
			
			解决方案：抛弃 hash，使用 history
		
		
		history 的演进
		
			很早以前，浏览器便实现了 history。然而，早期的 history 只能用于多页面进行跳转，比如：
			
			history.go(-1);       // 后退一页
			history.go(2);        // 前进两页
			history.forward();     // 前进一页
			history.back();      // 后退一页
			
			在 HTML5 规范中，history 新增了以下几个 API
			
				history.pushState();         // 添加新的状态到历史状态栈
				history.replaceState();     // 用新的状态代替当前状态
				history.state             // 返回当前状态对象
				
			通过history.pushState或者history.replaceState，也能做到：改变 url 的同时，不会刷新页面。所以 history 也具备实现路由控制的潜力。
			然而，还缺一点：hash 的改变会触发 onhashchange 事件，history 的改变会触发什么事件呢？ -- 很遗憾，没有。
			怎么办呢？ -- 虽然我们无法监听到 history 的改变事件，然而，如果我们能罗列出所有可能改变 history 的途径，
			然后在这些途径一一进行拦截，不也一样相当于监听了 history 的改变吗？
			
			对于一个应用而言，url 的改变只能由以下 3 种途径引起：
			
				1.点击浏览器的前进或者后退按钮
				2.点击 a 标签
				3.在 JS 代码中直接修改路由
				
			第 2 和第 3 种途径可以看成是一种，因为 a 标签的默认事件可以被禁止，进而调用 JS 方法。
			关键是第 1 种，HTML5 规范中新增了一个 onpopstate 事件，通过它便可以监听到前进或者后退按钮的点击。
			要特别注意的是：调用history.pushState和history.replaceState并不会触发 onpopstate 事件。
			
			总结：经过上面的分析，history 是可以用来进行路由控制的，只不过需要从 3 方面进行着手。

### mouseover和mouseenter

		当定点设备（通常指鼠标）移动到元素上时就会触发 mouseenter 事件
		
		类似 mouseover，它们两者之间的差别是 mouseenter 不会冒泡（bubble）
		
		也就是说当指针从它的子层物理空间移到它的物理空间上时不会触发

> [可参考MDN的详细介绍](https://developer.mozilla.org/zh-CN/docs/Web/Events/mouseenter)

###  八种经典排序算法

		八种排序算法分别是： 
			1.冒泡排序
			2.选择排序
			3.插入排序
			4.快速排序
			5.归并排序
			6.希尔排序
			7.二叉排序
			8.计数排序
			
		其中冒泡排序和快速排序在面试题中屡见不鲜
		
		最基础的排序 -- 冒泡排序
		
			两两比较，如果前边比后边大，就交换位置，大的放后边，最后得到从小到大排序后的数组
			冒泡排序的时间复杂度是-O(N^2)
			
		最快的排序 -- 快速排序
		
			1.在数据集之中，选择一个元素作为"基准"（pivot）。
			2.所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
			3.对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
			
			快速排序的时间复杂度是-O(N * log N)
			
		最易理解的排序 -- 选择排序
		
			遍历一遍找到最小的，放在第一个位置。在遍历一遍找到第二小的，放在第二个位置。
			看起来比较像冒泡，但它不是相邻数据交换的。
			选择排序的时间复杂度是-O(N^2)
			
		扑克牌法排序 -- 插入排序
		
			1.初始时，第一个数据arr[0]自成有序数组，后面的arr[1]~arr[N-1]为无序数组。令 i = 1; 
			2.将第二个数据arr[1]加入有序序列arr[0]中，使arr[0]~arr[1]变为有序序列。i++; 
			3.重复循环第二步，直到将后面的所有无序数插入到前面的有序数列内，排序完成。
			
			插入排序的时间复杂度是-O(N^2)
			
		分而治之 -- 归并排序
		
			归并排序的时间复杂度是拆分的步数 log N 乘以排序步数 N ，为-O(N * log N)。
			也是高级别的排序算法(-O(N ^ 2)为低级别)。
			
		缩小增量——希尔排序
		
			希尔排序的时间复杂度是-O(N * log N)
			
		集中数据的排序——计数排序
		
			计数排序的时间复杂度：-O(N) + -O(N) = -O(N)
			
		构造树——二叉堆排序
		
			二叉堆排序的时间复杂度是-O(N * log N)

> [日本程序员norahiko排序算法的动画演示](http://jsdo.it/norahiko/oxIy/fullscreen)

### WebSocket

> 为什么需要 WebSocket？

		因为 HTTP 协议有一个缺陷：通信只能由客户端发起。
		HTTP 协议做不到服务器主动向客户端推送信息。
		
		而WebSocket：
			服务器可以主动向客户端推送信息，
			客户端也可以主动向服务器发送信息，是真正的双向平等对话

> WebSocket特点

		1.建立在 TCP 协议之上，服务器端的实现比较容易。
		
		2.与 HTTP 协议有着良好的兼容性。默认端口也是80和443，
		  并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
		
		3.数据格式比较轻量，性能开销小，通信高效。
		
		4.可以发送文本，也可以发送二进制数据。
		
		5.没有同源限制，客户端可以与任意服务器通信。
		
		6.协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。

> 客户端的简单示例

```javascript
	var ws = new WebSocket("wss://echo.websocket.org");
	
	ws.onopen = function(evt) { 
	  	console.log("连接打开..."); 
	  	ws.send("Hello WebSockets!");
	}
	
	ws.onmessage = function(evt) {
	  	console.log( "收到消息: " + evt.data);
	  	ws.close();
	}
	
	ws.onclose = function(evt) {
	  	console.log("连接关闭");
	}
```

[详细内容可参考：阮一峰WebSocket教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

### if...if和if else的区别

		if (条件1){
		    //语句1
		}
		
		if (条件2){
		    //语句2
		}
		
		这种格式中，程序会依次判断条件1和条件2是否成立并根据结果决定是否执行语句1和语句2，
		也就是说，第一个 if 块和第二个 if 块没有影响（除非在执行第一个 if 块的时候就凶残地 return 了）
		
		if (条件1) {
		    //语句1
		}
		else if (条件2){
		    //语句2
		}
		
		if 块和 else if 块本质上是互斥的！也就是说，一旦语句1得到了执行，程序会跳过 else if 块，
		else if 块中的判断语句以及语句2一定会被跳过；同时语句2的执行也暗含了条件1判断失败和语句1没有执行；
		当然还有第3个情况，就是条件1和条件2都判断失败，语句1和语句2都没有得到执行。

### 使用.gitignore文件

> 因为Windows系统强制要求有.后缀的文件应该有个文件名，所以可以在编辑器里创建该文件

> 如果我的项目想忽略掉node_modules这个文件夹，直接输入：

		node_modules/
		
		再次commit的时候就会忽略掉这个文件夹

> 如果想忽略一个文件data.json，再输入：

		data.json
		node_modules/

> 如果想忽略掉所有的后缀为json的文件，那么就输入：

		*.json
		data.json
		node_modules/
		
		那么这样所有的.json的文件就会被全部忽略，git就不会扫描和提交这些文件了

### Chrome浏览器下小于12号字的解决方案

		可以使用transform: scale来解决
		
		想要支持IE8及以下，给其添加一个真实的字体大小
		
		.text1{
			font-size: 12px;
			transform: scale(0.75);
			transform-origin: 0;
		}
		.text2{
			font-size: 9px;
		}

### 控制台版本号

```javascript
	console.log(
		`%c WEB %c zhangyanhui %c`,
		"background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
		"background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
		"background:transparent"
	)
```

> 用法说明

		第一个参数可以包含一些格式化的指令比如%c
		
		第二个参数全是纯CSS用来控制样式的

> 占位符介绍
 
|格式化符号|实现的功能|
|--|--|
|%s|格式化成字符串输出|
|%d or %i|格式化成数值输出|
|%f|格式化成浮点数输出|
|%o|转化成展开的DOM元素输出
|%O|转化成JavaScript对象输出
|%c|把字符串按照你提供的样式格式化后输出|

### 文字竖向排列

> 结合css来控制文字竖向排列

```html
	.element{
		width:20px;
		text-align:center;
		line-height:20px;
	}
```

### 遮罩的另一种写法

		第一层给定位（负数），也可以达到遮罩的效果，而我们通常是给遮罩定位
		
		而这这方法反其道而行之，也是可以的

```html
	.con {
		width: 100%;
		position: absolute;
		opacity: 0;
		height: 100%;
		overflow: hidden;
		z-index: -1;
	}
```

### map的另一种用法

		map方法通常给人的感觉就是映射，将数组每项做处理后，返回新数组
		
		但这一种写法，有点颠覆认知的感觉，返回你所需要的key组成新数组

```javascript
	let arr = [
		{text:1,value:1},
		{text:2,value:2},
		{text:3,value:4},
		{text:4,value:4}
	]
	let array = arr.map(({text})=>({text}))
	console.log(array)
```

### 文字渐变

```html
	.ele{
        background-image: linear-gradient(to right, red, blue);
        -webkit-background-clip: text;
        color: transparent;
    }
```

[background-clip](http://www.w3school.com.cn/cssref/pr_background-clip.asp)


		-webkit-background-clip: text;
		
		background-clip		规定背景的绘制区域
		
		background-clip: border-box|padding-box|content-box;
		
		上面没有说取值 text 的情况，看到前面的前缀，大家应该也能想到，它的兼容性问题了，目前还不是能所有浏览器都支持。
		
		取值为text的意思，就是以区块内的文字作为裁剪区域向外裁剪，文字的背景即为区块的背景，文字之外的区域都将被裁剪掉。
		
		所以，我们最后写color: transparent; 让文字为透明色，就是让后面背景色显示出来。

### 长按事件

```javascript
	//按下
	gtouchstart(){
		this.timer = setTimeout(this.longPress,800);   
	},
	//抬起
	gtouchend(){   
		clearTimeout(this.timer);//清除定时器   
		if(this.timer!=0){ 
			console.log("你这是点击");   
		} 
	},
	//移动
	gtouchmove(){   
		clearTimeout(this.timer);//清除定时器   
		this.timer = 0;
		console.log('你移动手指了')
	},
	//长按
	longPress(){   
		clearTimeout(this.timer);//清除定时器   
		this.timer = 0;   
		console.log("长按事件触发");
	}  
```

### 图片压缩网站（极致PNG压缩插件分享）

[TinyPNG，请戳我](https://tinypng.com/)

### 如何优雅地无报错链式取值

[github链接，请戳我](https://github.com/huruji/chain-get)

### package.json中的波浪号（〜）和插入符号（^）有什么区别？

		~的意思是匹配最近的小版本 比如~1.2.3将会匹配所有的1.2.x版本，但不匹配1.3.0

		^的意思是最近的一个大版本 比如1.2.3 将会匹配 所有 1.x.x 包括1.3.0 但不包括2.0
		
> 提示：node的各种包都有版本控制，迭代都非常快，版本号用用三个数字分别用.分割来标记每个版本

> 比如1.2.3 其中第三位3表示微小的变动，2表示比较大的变动，1表示升级

[stackoverflow地址，请戳我](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json)

### vscode占用cpu特别高是什么原因

> vscode设置中有"search.followSymlinks"这个属性，将其改为：false

[github链接，请戳我](https://github.com/Microsoft/vscode/issues/35659)

### Settings Sync

[Visual Studio Code如何备份，请戳我](https://blog.csdn.net/txw0415/article/details/80424895)

### 当 async/await 遇上 forEach

[参考链接，请戳我](https://objcer.com/2017/10/12/async-await-with-forEach/)

### 5种滚动吸顶实现方式的比较

[参考链接，请戳我](https://juejin.im/post/5caa0c2d51882543fa41e478)

### “节流”与“防抖”的本质

这两个东西都以闭包的形式存在。它们通过对事件对应的回调函数进行包裹、以自由变量的形式缓存时间信息，最后用 setTimeout 来控制事件的触发频率。

### Throttle：第一个人说了算

throttle（节流 ）的中心思想在于：在某段时间内，不管你触发了多少次回调，我都只认第一次，并在计时结束时给予响应。所谓的“节流”，是通过在一段时间内无视后来产生的回调请求来实现的。简单小示例：滴，滴滴

现在有一个旅客刚下飞机需要用车，于是打电话叫了该机场唯一的一辆机场大巴来接。司机开到机场，心想来都来了，多接几个人一起走吧，这样这趟才跑得值，我等个十分钟看看。于是司机一边打开了计时器，一边招呼后面的客人陆陆续续上车。在这十分钟内，后面下飞机的乘客都只能乘这一辆大巴，十分钟过去后，不管后面还有多少没挤上车的乘客，这班车都必须发走。

```javascript
// fn是我们需要包装的事件回调, interval是时间间隔的阈值
function throttle(fn, interval) {
  // last为上一次触发回调的时间
  let last = 0
  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()   
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
    // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now;
      fn.apply(context, args);
    }
  }
}
```

### Debounce：最后一个人说了算

防抖（debounce）的中心思想在于：我会等你到底。在某段时间内，不管你触发了多少次回调，我都只认最后一次。简单小示例：滴，滴滴

这次的司机比较有耐心。第一个乘客上车后，司机开始计时，十分钟之内，如果又上来了一个乘客，司机会把计时器清零，重新开始等另一个十分钟。直到有这么一位乘客，从他上车开始，后续十分钟都没有新乘客上车，司机会认为确实没有人需要搭这趟车了，才会把车开走。

```javascript
// fn是我们需要包装的事件回调, delay是每次推迟执行的等待时间
function debounce(fn, delay) {
  // 定时器
  let timer = null
  // 将debounce处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 每次事件被触发时，都去清除之前的旧定时器
    if(timer) {
      clearTimeout(timer)
    }
    // 设立新定时器
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
```

### 用 Debounce 来优化 Throttle

如果用户的操作十分频繁，他每次都不等 debounce 设置的 delay 时间结束就进行下一次操作，于是每次 debounce 都为该用户重新生成定时器，回调函数被延迟了不计其数次。频繁的延迟会导致用户迟迟得不到响应，用户同样会产生“这个页面卡死了”的直观感受。

为了避免弄巧成拙，我们需要借力 throttle 的思想，打造一个“有底线”的 debounce。但我有我的原则：delay 时间内，我可以为你重新生成定时器；但只要delay的时间到了，我必须要给用户一个响应。

```javascript
// fn是我们需要包装的事件回调, delay是时间间隔的阈值
function throttle(fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0, timer = null
  // 将throttle处理结果当作函数返回
  return function () { 
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()  
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值
      // 则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值
      // 无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}
```

### 相关链接

[30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code/tree/master/snippets)

### 几款实用的谷歌浏览器插件

> 1.鼠标悬停快速预览——GitHub Hovercard

GitHub Hovercard是一款可以使用鼠标悬停快速浏览项目信息/用户信息/项目讨论的Chrome扩展，无论在GitHub的哪一个界面，只要鼠标停驻在链接上面，就可以快速查看有关信息，而无需点击进去。

> 2.实现树状文件列表——Octotree

Octotree这款插件就如同名字一样，在页面左端提供了一个树状的文件列表（类似Windows资源管理器的左栏），从而让所有文件的位置一目了然，并可以快速点击查看。

> 3.直观衡量你的工作量——Isometric Contributions

Isometric Contributions是一款可以将冷冰冰的数据转化为生动图形的Chrome扩展程序。它可以将你每天的contributions数目（可以理解为提交GitHub的数目）转化为颜色不一的立体柱状图，并给出自己的统计数据。

> 4.用户头像展示——Avatars for Github

一款从名字就能看出功能的Chrome拓展，它可以实现一个简单的功能：显示出GitHub用户的头像。貌似现在github新闻页已经可以显示头像了，所以就不再展示了。

> 5.GitHub夜间主题——Stylus

安装完Stylus插件之后，请移步至github仓库进行样式安装，以下是仓库链接：

https://github.com/StylishThemes/Github-Dark

> 6.文件大小展示——Enhanced Github

这个插件可以显示仓库大小，每个文件的大小，下载链接和复制文件内容的选项。

> 7.即时搜索——Awesome Autocomplete for GitHub

将即时搜索功能添加到GitHub的搜索栏

> 8.最强的浏览器插件——油猴

插件安装地址：http://www.tampermonkey.net/

获取安装脚本：https://greasyfork.org/zh-CN

> 9.下载次数——Refined GitHub

显示 GitHub 仓库的静态资源的下载次数

### “30秒系列”专门收集30秒以内可以解答的问题，目前有以下6个库

[30秒JS](https://github.com/30-seconds/30-seconds-of-code)
[30秒CSS](https://30-seconds.github.io/30-seconds-of-css/)
[30秒面试](https://30secondsofinterviews.org/)
[30秒React](https://github.com/30-seconds/30-seconds-of-react)
[30秒Python](https://github.com/kriadmin/30-seconds-of-python-code)
[30秒PHP](https://github.com/appzcoder/30-seconds-of-php-code)

### 走进CSS的世界

[A Single Div](https://a.singlediv.com/)

### 缓存详解

[缓存深入了解，请戳我](https://github.com/amandakelake/blog/issues/43)

### 深入理解TypeScript

[github链接，请戳我](https://github.com/jkchao/typescript-book-chinese)

### 30-days-of-react

[30-days-of-react](https://github.com/fullstackreact/30-days-of-react)

### cookie增删查

```javascript
//增
function setCookie(key, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = key + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

//删
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
  }
}

//查
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = document.cookie.match(reg)){
    return (arr[2])
  } else{
    return null
  }
}
```

### 数字千分位分割

```javascript
	//针对toLocaleString 参考链接：https://juejin.im/post/5ac7079f5188255c637b3233
	function commafy(num) {
		return (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
	}
```

### 生成随机数

```javascript
	function randomNum(min, max) {
		switch (arguments.length) {
			case 1:
			return parseInt(Math.random() * min + 1, 10)
			case 2:
			return parseInt(Math.random() * (max - min + 1) + min, 10)
			default:
			return 0
		}
	}
```

### 浏览器对象 BOM

#### 滚动到页面顶部

```javascript
	function scrollToTop() {
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		if (scrollTop > 0) {
			window.requestAnimationFrame(scrollToTop)
			window.scrollTo(0, scrollTop - scrollTop / 8)
		} else {
			window.cancelAnimationFrame(scrollToTop)
		}
	}
```

#### 复制文本

```javascript
	function copy(str) {
		const el = document.createElement('textarea')
		el.value = str
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		el.style.top = '-9999px'
		document.body.appendChild(el)
		const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
		if (selected) {
			document.getSelection().removeAllRanges()
			document.getSelection().addRange(selected)
		}
	}
```

#### 获取url中的参数

```javascript
	function getURLParameters(url) {
		const params = url.match(/([^?=&]+)(=([^&]*))/g)
		return params?params.reduce(
			(a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {}
		):[]
	}
```

#### 获取滚动条位置

```javascript
	function getScrollPosition(el = window) {
		return {
			x: (el.pageXOffset !== undefined) ? el.pageXOffset : el.scrollLeft,
			y: (el.pageYOffset !== undefined) ? el.pageYOffset : el.scrollTop
		}
	}
```
