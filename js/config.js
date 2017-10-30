/***
*游戏相关配置
*@type {Object}
***/
var CONFIG = {
	planeSize: {
		width: 60,
		height: 45
	},
	planeType: 'bluePlaneIcon',//默认机型为蓝色
	bulletSize: {
		width: 20,
		height: 20
	},
	enemySpeed: 3,//默认敌人移动速度
	enemyMaxNum: 5,//敌人最大数目
	enemySmallSize: {
		width: 54,
		height: 40
	},
	enemyBigSize: {
		width: 100,
		height: 70
	},
	bulletSpeed: 10,//默认子弹移动速度
	resources: {
		images: [
			{src: './images/plane_1.png',
		  	 name: 'bluePlaneIcon'
			},
			{src: './images/plane_2.png',
			 name: 'pinkPlaneIcon'
			},
			{src: './images/fire.png',
			 name: 'fireIcon'
			},
			{src: './images/enemy_big.png',
			 name: 'enemyBigIcon'
		    },
			{src: './images/enemy_small.png',
		     name: 'enemySmallIcon'
			},
			{src: './images/boom_big.png',
			 name: 'enemyBigBoomIcon'
			},
			{src: './images/boom_small.png',
			name: 'enemySmallBoomIcon'
		    }
		],
		sounds: [
      		{src: './sound/biubiubiu.mp3',
        	name: 'shootSound'
     		 },
     		{src: './sound/music.mp3',
        	 name: 'gameSound'
      		},
      		{src: './sound/die.mp3',
        	 name: 'dieSound'
      		},
      		{src: './sound/button.mp3',
        	name: 'buttonSound'
      		},
      		{src: './sound/boom.mp3',
        	name: 'boomSound'
      		}
    	]
	}
};