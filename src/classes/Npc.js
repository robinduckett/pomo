var Monster = require('./Monster'),
    Actor = require('./Actor');

function Npc(game) {
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
            [0], [6], [5], [1]
        ],
        walk: [
            [ 10, 0, 2, 0 ], // up, // 0
            [  3, 6, 9, 6 ], // lft // 1
            [ 11, 5, 8, 5 ], // dwn // 2
            [  7, 1, 4, 1 ] // rgt // 3
        ]
    };
}

Npc.prototype = new Monster();

Npc.prototype.render = Actor.prototype.render;

module.exports = Npc;