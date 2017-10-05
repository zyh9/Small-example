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
