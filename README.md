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
			
			// 浅拷贝，拷贝的是属性值
			// let arr1 = Object.assign(arr)
			
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
				
				*margin值的解析：左右边界累加，上下边界重合。
		
		2.margin叠压
			当父级容器包裹多个子元素时，子元素的margin-top，margin-bottom会叠压
			当上下margin值不一样时，叠压范围取最大值

### 数据转换

		let arr = [
				{name:'abc',age:'A'},
				{name:'def',age:'B'},
				{name:'ghi',age:'C'},
				{name:'jkl',age:'A'},
				{name:'mno',age:'B'}
			];
	//	let obj = {
	//			A:['abc','jkl'],
	//			B:['def','mno'],
	//			C:['ghi']
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

### HTML5，CSS3新增

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

### for循环、定时器、闭包

```
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<title></title>
		</head>
		<body>
			<script type="text/javascript">
	//			for(var i=0;i<5;i++){
	//				setTimeout(function(){
	//					console.log(new Date,i)
	//				},1000)
	//			}
				/*
					开了5个定时器，但定时器的延迟时间一致，
					所以new Data只是增加了1秒，输出5次，i一直输出为5
				*/
				
				
	//			for(var i=0;i<5;i++){
	//				setTimeout(function(){
	//					console.log(new Date,i)
	//				},1000*i)
	//			}
				/*
					开了5个定时器，但定时器的延迟时间不一致，
					所以new Data每次增加一秒，输出5次，i一直输出为5
				*/
				
				
	//			for(var i=0;i<5;i++){
	//				(function (i){
	//					setTimeout(function(){
	//						console.log(new Date,i)
	//					},1000)
	//				})(i)
	//			}
				/*
					利用闭包的特性来保存变量i不被销毁，
					定时器的延迟时间一致，所以输出时间一致，
					new Data只是增加了1秒，输出5次，
					而的值会随着变量值的改变而改变i = 0,1,2,3,4
				*/
				
				
				for(var i=0;i<5;i++){
					(function (i){
						setTimeout(function(){
							console.log(new Date,i)
						},1000*i)
					})(i)
				}
				/*
					利用闭包的特性来保存变量i不被销毁，
					定时器的延迟时间不一致，所以输出时间不一致，
					new Data每次增加一秒，输出5次，
					而的值会随着变量值的改变而改变i = 0,1,2,3,4
				*/
			</script>
		</body>
	</html>
```
