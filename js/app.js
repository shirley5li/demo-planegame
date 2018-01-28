//初始化常用元素和变量
var $body = $(document.body);

//初始化canvas相关
var $canvas = $("#game");
var canvas = $canvas[0];
var context = canvas.getContext("2d");
//设置画布的宽度和高度，window.innerWidth表示可见视口的大小，即屏幕宽度
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//获取canvas画布内容及内边距的大小（不包括垂直滚动条、边框、外边距）
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;


//判断是否有requestAnimationFrame方法(H5新增的定时器API)，用来实现动画的定时操作，若无则模拟实现该方法
// 避免过度绘制的问题，动画不会掉帧
window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

/********基本事件绑定*********/
/***用于游戏状态切换***/
function bindEvent() {
	//绑定事件
	var self = this;
	// 点击开始按钮，采用事件委托的方式，委托给body了。
	$body.on('click', '.js-start', function() {
		// 鼠标点击声音
		resourceHelper.getSound('buttonSound').play();
		// 点击"开始游戏"按钮，进入正式游戏界面
		$body.attr('data-status', 'start'); //'data-status'设置为'start'，其他的.ui-index,.ui-setting,.ui-rule,.ui-end 即为display:none
		//开始游戏
		GAME.start();
	});

	// 点击"游戏设置"按钮，进入游戏设置界面
	$body.on('click', '.js-setting', function() {
		// 鼠标点击声音
		resourceHelper.getSound('buttonSound').play();
		$body.attr('data-status', 'setting');
		// SET.start();
		// // 设置各种声音
		SET.music();
		// // 设置背景图片
		SET.background();
		// // 设置战机型号
		SET.fighter();

	});
	// 点击游戏设置界面的"确认设置"按钮
	$body.on('click', '.js-confirm-setting', function() {
		// 鼠标点击声音
		resourceHelper.getSound('buttonSound').play();
		// 设置各种声音
		SET.music();
		// // 设置背景图片
		SET.background();
		// // 设置战机型号
		SET.fighter();

		// 返回游戏主页面
		$body.attr('data-status', 'index');
		//设置游戏初始化
		 GAME.init();
	});

	// 点击"游戏说明"按钮，进入游戏规则说明界面
	$body.on('click', '.js-rule', function() {
		// 鼠标点击声音
		resourceHelper.getSound('buttonSound').play();
		$body.attr('data-status', 'rule');
	});
	// 点击游戏规则说明界面的"我知道了"按钮
	$body.on('click', '.js-confirm-rule', function() {
		// 鼠标点击声音
		resourceHelper.getSound('buttonSound').play();
		// 返回主页面
		$body.attr('data-status', 'index');
	})
}

 /******设置对象，在游戏设置界面，用于设置声音、背景、战机******/
 var SET = {
 	start: function() {
 
 	},
 	music: function() {
 		var musicVal = $('#musicSet').val();
 		switch(musicVal) {
 			// 开启声音
 			case "0":
 			resourceHelper.getSound('gameSound').loop = "loop"; //循环播放
 			resourceHelper.getSound('gameSound').play();
 			break;
 			// 关闭声音
 			case "1":
 			resourceHelper.getSound('gameSound').pause();
 		}
 	},
 	background: function() {
 		var bgVal = $('#bgSet').val();
 		switch(bgVal) {
 			case "1":
 			$body.css("background-image", "url(./images/bg_1.jpg)");
 			break;
 			case "2":
 			$body.css("background-image", "url(./images/bg_2.jpg)");
 			break;
 			case "3":
 			$body.css("background-image", "url(./images/bg_3.jpg)");
 			break;
 			case "4":
 			$body.css("background-image", "url(./images/bg_4.jpg)");
 		}
 	},
 	fighter: function() {
 		var planeVal = $('#planeSet').val();
 		switch(planeVal) {
 			case "bluePlaneIcon":
 			var planeIcon = resourceHelper.getImage('bluePlaneIcon');
 			return planeIcon;
 			case "pinkPlaneIcon":
 			var planeIcon = resourceHelper.getImage('pinkPlaneIcon');//得到img元素
 			return planeIcon;
 		}
 	}
 };

 /******游戏对象******/
var GAME = {
	// 游戏初始化
	// 初始化时可以传递配置参数opts对象进去
	init: function(opts) {
		// 设置配置参数 opts， Object.assign()方法用来浅拷贝、对象属性的合并，即将opts和CONFIG对象的属性合并
		var opts = Object.assign({}, opts, CONFIG);
		this.opts = opts;

		// 计算飞机对象初始横纵坐标
		this.planePosX = canvasWidth / 2 - opts.planeSize.width / 2;
		this.planePosY = canvasHeight - opts.planeSize.height - 50;
	},
	    //生成敌人
	createEnemy: function(enemyType) {
    	var enemies = this.enemies;
    	var opts = this.opts;
    	var images = this.images || {};
    	var enemySize = opts.enemySmallSize;
    	var enemySpeed = opts.enemySpeed;
    	var enemyIcon = resourceHelper.getImage('enemySmallIcon');
    	var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon'); 
    	var enemyLive = 1; 
  
    	// 大型敌人的参数
    	if (enemyType === 'big') {
      		enemySize = opts.enemyBigSize;
      		enemyIcon = resourceHelper.getImage('enemyBigIcon');
      		enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
     		enemySpeed = opts.enemySpeed * 0.6;
      		enemyLive = 10;
    	} 
  
    	// 综合元素的参数
    	var initOpt = {
     		 x: Math.floor(Math.random() * (canvasWidth - enemySize.width)), 
     		 y: -enemySize.height,
     		 type: enemyType,
      		 live: enemyLive,
      		 width: enemySize.width,
     		 height: enemySize.height,
     		 speed: enemySpeed,
      		 icon: enemyIcon,
      		 boomIcon: enemyBoomIcon
    	}

    	// 敌机的数量不大于最大值则新增一个敌机
    	if (enemies.length < opts.enemyMaxNum) {
     		 enemies.push(new Enemy(initOpt));
    	}

  		// console.log(enemies);//此句用来调试
  
  },

	// 开始游戏
	start: function() {
		// 获取游戏初始化level
		var self = this;//保存函数调用对象（即GAME）
		var opts = this.opts;
		var images = this.images;
		//清空射击目标对象数组和分数设置为0
		this.enemies = [];
		this.score = 0;

		//随机生成大小战机
		this.createSmallEnemyInterval = setInterval(function() {
			self.createEnemy('normal');
		}, 500);
		this.createBigEnemyInterval = setInterval(function() {
			self.createEnemy('big');
		}, 1500);

		// 创建主角英雄 飞机
		this.plane = new Plane({
			x: this.planePosX,
			y: this.planePosY,
			width: opts.planeSize.width,
			height: opts.planeSize.height,
			// 子弹尺寸、速度
			bulletSize: opts.bulletSize,
			bulletSpeed: opts.bulletSpeed,
			// 图标相关
			icon: SET.fighter(),
			bulletIcon: resourceHelper.getImage('fireIcon'),
			boomIcon: resourceHelper.getImage('enemyBigBoomIcon')
		});
		//飞机开始射击
		this.plane.startShoot();

		// 开始更新游戏
		this.update();

	},
	

	/***
	*绑定手指触摸
	***/
	bindTouchAction: function() {
		var opts = this.opts;
		var self = this;
		//飞机极限横纵坐标
		var planeMinX = 0;
		var planeMinY = 0;
		var planeMaxX = canvasWidth - opts.planeSize.width;
		var planeMaxY = canvasHeight -opts.planeSize.height;
		// 手指初始位置坐标
		var startTouchX;
		var startTouchY;
		//飞机初始位置
		var startPlaneX;
		var startPlaneY;
		// 首次触屏
		$canvas.on('touchstart', function(e) {
			var plane = self.plane;
			// 记录首次触摸的位置
			startTouchX = e.touches[0].clientX;
			startTouchY = e.touches[0].clientY;
			// console.log('touchstart', startTouchX, startTouchY);
			//记录飞机的初始位置
			startPlaneX = plane.x;
			startPlaneY = plane.y;
		});
		//滑动屏幕
		$canvas.on('touchmove', function(e) {
			var newTouchX = e.touches[0].clientX;
			var newTouchY = e.touches[0].clientY;
			// console.log('touchmove', newTouchX, newTouchY);
			//新的飞机坐标等于手指滑动的距离加上飞机初始位置
			var newPlaneX = startPlaneX + newTouchX - startTouchX;
			var newPlaneY = startPlaneY + newTouchY - startTouchY;
			//判断是否超出位置
			if(newPlaneX < planeMinX) {
				newPlaneX = planeMinX;
			}
			if(newPlaneX > planeMaxX) {
				newPlaneX = planeMaxX;
			}
			if(newPlaneY < planeMinY) {
				newPlaneY = planeMinY;
			}
			if(newPlaneY > planeMaxY) {
				newPlaneY = planeMaxY;
			}
			//更新飞机的位置
			self.plane.setPosition(newPlaneX, newPlaneY);
			//禁止默认事件

		});
	},

		//更新当前所有元素的状态
	updateElement: function() {
		var opts = this.opts;
		var enemySize = opts.enemySize;
		var enemies = this.enemies;
		var plane = this.plane;
		var i = enemies.length;
		var score = this.score;

		if(plane.status === 'booming') {
			plane.booming();
			// 飞机爆炸声音
			resourceHelper.getSound('boomSound').play();
			return;
		}

		//循环更新敌机
		while(i--) {
			var enemy = enemies[i];
			enemy.down();
			if(enemy.y >= canvasHeight) {
				this.enemies.splice(i, 1);
			} else {
				//判断飞机状态
				if(plane.status === 'normal') {
					if(plane.hasCrash(enemies)) {
						// 飞机撞上敌机死掉的声音
						resourceHelper.getSound('dieSound').play();
						plane.booming();
					}
				}
				//根据敌机状态判断是否被击中
				switch(enemy.status) {
					case 'normal': 
						if(plane.hasHit(enemy)) {
							// 飞机击中敌机的声音
							resourceHelper.getSound('shootSound').play();
							enemy.live -= 1;
							if(enemy.live === 0) {
								// 敌机被击毁爆炸的声音
								resourceHelper.getSound('boomSound').play();
								enemy.booming();
							}
						}
					break;
					case 'booming':
						enemy.booming();
					break;
					case 'boomed':
						enemies.splice(i, 1);
						score = (enemy.type === 'big') ? (score + 1000) : (score + 100);
						this.score = score;
						// console.log("得分： "+ score);
						return this.score;
					break;
				}
			}
		}
	},

	// 更新
	update: function() {
		var self = this;
		var opts = this.opts;
		// 更新飞机、敌人
		this.updateElement();
		// 先清理画布
		context.clearRect(0, 0, canvasWidth, canvasHeight);

		if(this.plane.status === 'boomed') {
			this.end();
			return;
		}

		// 绘制画布
		this.draw();
		// 不断循环 update
    	requestAnimFrame(function() {
      	self.update()
    	});

	},

	// 绘制敌人和飞机
	draw: function() {
		this.enemies.forEach(function(Enemy) {
			Enemy.draw();
		});
		this.plane.draw();
	},
	// 结束
	end: function() {
		var score = this.score;
		window.clearInterval(this.createSmallEnemyInterval); 
		window.clearInterval(this.createBigEnemyInterval); 
		this.enemies = [];
		this.score = 0;
		 $('.ui-end p').html("游戏结束，游戏得分为: " + score);
		$body.attr('data-status', 'end');
		/***每点击再玩一次时，敌机往下移动的速度越来越快，
		到第三次点击再玩一次时，已经快的没法击中敌机，目前还没找到原因，找到原因再来补全这一功能***/
		// 当点击再玩一次时，游戏再次start
	/**	$body.on('click', '.js-playAgain', function() {
			// 鼠标点击声音
			resourceHelper.getSound('buttonSound').play();
			//再次开始游戏
			GAME.init();
			$body.attr('data-status', 'start');
			GAME.start();

		}); **/

		// 当点击退出游戏时，回到游戏主页面
		$body.on('click', '.js-exitGame', function() {
			// 鼠标点击声音
			resourceHelper.getSound('buttonSound').play();
			$body.attr('data-status', 'index');
			//游戏初始化
			GAME.init();
		});
	}
};


// ***页面主入口**/
function init() {
	// 加载图片资源，加载完成才能交互
	resourceHelper.load(CONFIG.resources, function(resources) {
	//加载完成
	GAME.init();
	// 绑定手指触摸事件
	GAME.bindTouchAction();
	// 绑定更改游戏状态事件
	bindEvent();
	});

}

/***** 游戏初始化 ****/
init();