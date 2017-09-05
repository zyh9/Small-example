## 一些小例子
### 冒泡排序
```
	var	arr=[1111,33,25,79,2,6,8,99,333]
	function bubbleSort(arr1){
		var arr=arr1.slice();
		for(var i=0;i<arr.length-1;i++){
			for(var j=0;j<arr.length-1-i;j++){
				if(arr[j]>arr[j+1]){
					var a=arr[j];
					var b=arr[j+1];
					arr[j+1]=a;
					arr[j]=b;
				}
			}
		}
		return arr
	}
```

```	
	var arr1=[1111,33,25,79,2,6,8,99,333]
	//快速排序
	function quick(arr){
		if(arr.length<=1){
			return arr
		}
		//第一位做参考
		var cur=arr.shift();
		var right=[];
		var left=[];
		while(arr.length){
			if(arr[0]<cur){
				left.push(arr.shift())
			}else{
				right.push(arr.shift())
			}
			
			
		}
		return quick(left).concat(cur,quick(right))
		
	}
	console.log(quick(arr1))
```
### 深度克隆
```
	var obj={
		person:{
			name:"nizp",
			age:"18"
		},
		sex:"man",
		hobby:["js","css","html"]
		
	}
	
	function deepClone(obj){
		var obj1={};
		for(var item in obj){
			console.log(Object.prototype.toString.call(obj[item]))
		if(Object.prototype.toString.call(obj[item])=="[object Object]"||Object.prototype.toString.call(obj[item])=="[object Array]"){
				obj1[item]=obj[item];
				deepClone(obj1[item])
				
			}else{
				obj1[item]=obj[item]
			}
		}
		return obj1
	}
	let deeC=Object.assign(obj)
	console.log(deeC)
```
### 数组去重
```
	var arr=[1,2,3,4,5,22,33,33,98,108,98]
	function Duplicate(arr){
		let arr1=arr.slice();
		
		let arr2=[];
		arr1.forEach((e,i)=>{
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
