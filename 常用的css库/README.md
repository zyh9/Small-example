### 样式重置

[github地址，请戳我](https://github.com/necolas/normalize.css/)

[中文翻译，请戳我](http://jerryzou.com/posts/aboutNormalizeCss/)

> uufe-reset为常用的样式重置，仅供参考

### Animate.css

[github地址，请戳我](https://github.com/daneden/animate.css)

[DEMO地址，请戳我](https://daneden.github.io/animate.css/)

### Hover.css

[github地址，请戳我](https://github.com/IanLunn/Hover)

[DEMO地址，请戳我](http://ianlunn.github.io/Hover/)

### 移动端模拟hover效果

> 1.直接在body上添加ontouchstart  =>  （需添加:active伪类）

> 2.document.addEventListener("touchstart", function(){}, true)  =>  （需添加:active伪类）

> 3.添加class（推荐使用，具有良好的兼容性）

```javascript
    var btn = document.querySelector(".btn");
    btn.ontouchstart = function(){
        this.className = "btn btn-hover"
    }
    btn.ontouchend = function(){
        this.className = "btn"
    }
```
