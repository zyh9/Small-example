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

```
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
						var b = arr[j+1];
						arr[j] = b;
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

```
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
						var b = arr[j+1];
						arr[j] = b;
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

```	
	    var arr = [1,2,5,3,8,7,6,4];
	    function quick(arr){
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
	    	return quick(left).concat(cur,quick(right))
	    }
	    console.log(quick(arr))
```

### 深度克隆

```
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

```
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

```
		arr=[1111,33,25,79,2,6,8,99,333]
		arr.sort(()=>Math.random()-0.5)
		console.log(arr)
```

### 数据转换

> 在面对数据转换的时候，别看每项的数据有多复杂或者多难处理（可先忽视每项内容），交给循环

```
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

```
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

        relative、absolute、fixed的定位原点
		
		relative{
			自己
		}
		
		absolute{
			有定位父级走父级
			没有走document
		}
		
		fixed{
			跟可视区窗口
		}

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

```
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

<table>
    <tr>
        <th style = "text-align:center">原始数据类型</th>
        <th style = "text-align:center">目标类型Number</th>
    </tr>
    <tr>
        <td style = "text-align:center">undefined</td>
        <td style = "text-align:center">NaN</td>
    </tr>
    <tr>
        <td style = "text-align:center">null</td>
        <td style = "text-align:center">0</td>
    </tr>
    <tr>
        <td style = "text-align:center">false</td>
        <td style = "text-align:center">0</td>
    </tr>
    <tr>
        <td style = "text-align:center">true</td>
        <td style = "text-align:center">1</td>
    </tr>
    <tr>
        <td style = "text-align:center">数字串</td>
        <td style = "text-align:center">相应的数字</td>
    </tr>
    <tr>
        <td style = "text-align:center">不能转化的字符串</td>
        <td style = "text-align:center">NaN</td>
    </tr>
</table>

<table>
    <tr>
        <th style = "text-align:center">原始数据类型</th>
        <th style = "text-align:center">目标类型String</th>
    </tr>
    <tr>
        <td style = "text-align:center">undefined</td>
        <td style = "text-align:center">undefined</td>
    </tr>
    <tr>
        <td style = "text-align:center">null</td>
        <td style = "text-align:center">null</td>
    </tr>
    <tr>
        <td style = "text-align:center">false</td>
        <td style = "text-align:center">false</td>
    </tr>
    <tr>
        <td style = "text-align:center">true</td>
        <td style = "text-align:center">true</td>
    </tr>
    <tr>
        <td style = "text-align:center">数字</td>
        <td style = "text-align:center">数字字符串</td>
    </tr>
</table>

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

		记录于2017-12-01
		
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
		
		max-width	分辨率宽度小于等于设置值的时候识别

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

### Array.sort

		let a =[
	        {id: 2, team_name: "夏威夷草裙队", team_score: 2041, leader_id: 0},
	        {id: 1, team_name: "香水皇宫大保健", team_score: 582, leader_id: 0},
	        {id: 7, team_name: "云南艳遇队", team_score: 457, leader_id: 0},
	        {id: 9, team_name: "杭州白娘子队", team_score: 334, leader_id: 0},
	        {id: 8, team_name: "沙滩比基尼队", team_score: 134, leader_id: 0},
	        {id: 6, team_name: "泰国人妖队", team_score: 63, leader_id: 0},
	        {id: 5, team_name: "西藏高原红队", team_score: 43, leader_id: 0},
	        {id: 4, team_name: "办公室加班队", team_score: 39, leader_id: 0},
	        {id: 3, team_name: "撒哈拉骆驼队", team_score: 34, leader_id: 0}
        ]
        
		请求到这样一组数据，数组每项的team_score为每个队伍的分数，现要求分数从大到小排列。
		