let counter = 0;

function count() {
	counter++;
	document.querySelector('h1').innerHTML = counter;

	// ``代替引号，格式化内容加${}
	if(counter % 10 === 0){
		alert(`Count is now ${counter}`)
	}
}

//找到标签，定义事件，但到这行button还未被加载，所以会报错
//解决方法，把script定义放在body最后
//或者添加监听，当页面全部加载后再调用响应事件
document.addEventListener('DOMContentLoaded', function(){
	// document.querySelector('button').onclick = count;
	document.querySelector('button').addEventListener('click',count);
});