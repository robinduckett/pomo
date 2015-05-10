var Actor = require('./Actor');

function Monster(game) {
    this.game = game;
    this.char = 0;

    this.x = 64;
    this.y = 64;

    this.start = {x: this.x, y: this.y};

    this.dir = (Math.random() * 3).toFixed(0);
    this.anim = 'idle';
    this.frame = 0;
    this.frameCount = 2;
    this.framesWide = 2;
    this.framesHigh = 4;

    this.pauseTime = Math.round(Math.random() * 500);

    this.visible = true;

    this.distance = Math.round(Math.random()*20);

    this.sprite = {
        width: 32,
        height: 32
    };

    this.anims = {
        idle: [
            //  up,  lft  dwn  rgt
            //   0    1    2    3
            [2], [3], [6], [7]
        ],
        walk: [
            [0, 2], // up, // 0
            [1, 3], // lft // 1
            [4, 6], // dwn // 2
            [5, 7]  // rgt // 3
        ]
    };
}

Monster.prototype = new Actor();

Monster.prototype._tick = Monster.prototype.tick;

Monster.prototype.tick = function() {
    var ticks = this.game.ticks;

    if (ticks % this.pauseTime === 0) {
        this.runWalk = Math.random() < 0.5 ? 'walk' : 'walk';
        this.dir = Math.round(Math.random() * 3);
        this.moving = true;
        this.start.x = this.x;
        this.start.y = this.y;
        this.distance = Math.round(Math.random() * 64);
        this.distance -= this.distance % 16;
        this.pauseTime = Math.round(Math.random() * 500);
    }

    this._tick();
};

Monster.prototype.render = function() {
    var animation = this.animate();

    var xpos = animation % this.frameCount;
    var ypos = Math.floor(animation / this.frameCount);

    var sx = (this.char % 15) * this.sprite.width * this.framesWide;
    var sy = Math.floor(this.char / 15) * this.sprite.height * this.framesHigh;

    if (this.visible) {
        this.renderChar('pokemon', {
            srcx: (sx + (xpos * this.sprite.width) + (this.char % 15)),
            srcy: (sy + (ypos * this.sprite.height) + Math.floor(this.char / 15))
        });
    }
};

module.exports = Monster;