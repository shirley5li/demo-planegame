/***
* 父类element对象，飞机类、敌人类、子弹类继承自element对象
***/
var Element = function(opts)  {
	var opts = opts || {};
	// 设置坐标和尺寸，即父对象上的一些属性
	this.x = opts.x;
	this.y = opts.y;
	this.width = opts.width;
	this.height = opts.height;
	this.speed = opts.speed;
};

// 对象原型,即父对象上的一些方法
Element.prototype = {
	// 原型方法
	move: function(x, y) {
		var addX = x || 0;
		var addY = y || 0;
		this.x += x;
		this.y += y;
	},
	draw: function() {

	}
};