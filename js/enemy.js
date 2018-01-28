/***
*子类 Enemy 射击目标对象
***/
var Enemy = function(opts) {
	var opts = opts || {};
	// 调用父类Element的方法，通过call方法，将父类Element的opts传给this
	Element.call(this, opts);


	// 特有属性，状态和图标
	this.status = 'normal';//status可为normal、booming、boomed
	this.icon = opts.icon;
	this.live = opts.live;
	this.type = opts.type;
	// 特有属性，爆炸相关
	this.boomIcon = opts.boomIcon;
	this.boomCount = 0;	
};
// 继承父类Element的方法，通过原型链，使子类构造函数的原型指向父类的实例
Enemy.prototype = new Element();

// down方法，向下移动
Enemy.prototype.down = function() {
	this.move(0, this.speed);
};

//booming 方法，正在爆炸中
Enemy.prototype.booming = function() {
	//设置状态为booming
	this.status = 'booming';
	this.boomCount += 1;
	//如果已经booming了6次，则设置状态为boomed
	if(this.boomCount > 6) {
		this.status = 'boomed';
	}
};
// draw方法
Enemy.prototype.draw = function() {
	// 绘制敌人
	switch(this.status) {
		case 'normal':
		context.drawImage(this.icon, this.x, this.y, this.width, this.height);
		break;
		case 'booming':
		context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
		break;
	}

};

