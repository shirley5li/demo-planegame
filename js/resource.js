/***
 * 资源管理器
 ***/
var resourceHelper = {
  // 加载图片   
  imageLoader: function(src, callback) {
    var image = new Image();
    // 图片加载完成
    image.addEventListener('load', callback);
    image.addEventListener('error', function() {
      console.log('imgerror');
    });
    image.src = src;
    return image;
  },
  // 加载音乐   
  soundLoader: function(src, callback) {
    var sound = document.createElement("audio");
    // 音乐加载完成
    sound.addEventListener('load', callback);
    sound.addEventListener('error', function() {
      console.log('sounderror');
    });
    sound.src = src;
    return sound;
  },
  // 根据名称返回图片对象
  getImage: function(imageName) {
    return  this.resources.images[imageName];
  },
  // 根据名称返回音频对象
  getSound: function(soundName) {
    return  this.resources.sounds[soundName];
  },
  /**
   * 资源加载
   * @param  {Array} resources 资源列表
   */
  load: function(resources, callback) {
    var images = resources.images;
    var sounds = resources.sounds;
    var totalImg = images.length;
    var totalSnd = sounds.length;
    var finishImg = 0; // 已完成的个数
    var finishSnd = 0;
    // 保存加载后的图片对象和声音对象
    this.resources = {
      images: {},
      sounds: {}
    };
    var self = this;
    // 遍历加载图片
    for(var i = 0 ; i < images.length; i++) {
      var name = images[i].name;
      var src = images[i].src;
      self.resources.images[name] = self.imageLoader(src, function() {
        // 加载完成
        finishImg++;
        if( finishImg == totalImg){
          //全部加载完成
          callback(self.resources);
        }
      });
    }
      for(var i = 0 ; i < sounds.length; i++) {
      var name = sounds[i].name;
      var src = sounds[i].src;
      self.resources.sounds[name] = self.soundLoader(src, function() {
        // 加载完成
        finishSnd++;
        if( finishSnd == totalSnd){
          //全部加载完成
          callback(self.resources);
        }
      });
    }
  }
}

