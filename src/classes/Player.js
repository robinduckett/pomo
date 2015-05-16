var KeyboardJS = require('keyboardjs');

var Actor = require('./Actor');

function Player(game) {
    this.game = game;
    this.char = 0;

    this.x = 64;
    this.y = 64;

    this.start = {x: this.x, y: this.y};

    this.dir = 2;
    this.anim = 'idle';
    this.frame = 0;
    this.visible = true;

    this.distance = 16;

    this.moving = false;

    this.speed = {
        walk: 1.6,
        run: 3.2
    };

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

Player.prototype = new Actor();

Player.prototype.clamp = function(number, min, max) {
    return Math.max(min, Math.min(number, max));
};

Player.prototype.tick = function() {
    this.dirgo = [[0, -1], [-1, 0], [0, 1], [1, 0]];

    var keys = KeyboardJS.activeKeys();

    var check = ["up", "left", "down", "right"];

    this.runWalk = keys.indexOf('shift') > -1 ? 'run' : 'walk';

    if (this.moving === false) {
        if (keys.length > 0) {
            var key = null;

            if (keys[0] === 'shift') {
                key = keys[1];
            } else {
                key = keys[0];
            }

            if (check.indexOf(key) > -1) {
                this.dir = check.indexOf(key);

                this.start.x = this.x;
                this.start.y = this.y;
                this.moving = true;
            }
        }
    }

    if (this.moving === true) {
        this.setAnim('walk');

        this.x += this.dirgo[this.dir][0] * this.speed[this.runWalk] / 2;
        this.y += this.dirgo[this.dir][1] * this.speed[this.runWalk] / 2;

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        this.handleCamera();
    } else {
        this.setAnim('idle');
    }

    var dx = this.start.x - this.x,
        dy = this.start.y - this.y;

    var d2 = Math.sqrt((dx * dx) + (dy * dy));

    this.status = keys.join(' ') + ' ' + this.runWalk;

    this.moving = d2 > 0 && d2 < 16;

    this.game.context.fillText(this.game.camera.x + ',' + this.game.camera.y, 200, 200);

    this.render();
};

Player.prototype.handleCamera = function() {
    if (this.x - this.game.camera.x > this.game.canvas.width / (2 * window.devicePixelRatio)) {
        this.game.camera.x += this.dirgo[this.dir][0] * this.speed[this.runWalk] / 2;
    }

    if (this.y - this.game.camera.y > this.game.canvas.height / (2 * window.devicePixelRatio)) {
        this.game.camera.y += this.dirgo[this.dir][1] * this.speed[this.runWalk] / 2;
    }

    if (this.game.camera.y > 0 && (this.y - this.game.camera.y) < this.game.canvas.height / (2 * window.devicePixelRatio)) {
        this.game.camera.y += this.dirgo[this.dir][1] * this.speed[this.runWalk] / 2;
    }

    if (this.game.camera.x > 0 && (this.x - this.game.camera.x) < this.game.canvas.width / (2 * window.devicePixelRatio)) {
        this.game.camera.x += this.dirgo[this.dir][0] * this.speed[this.runWalk] / 2;
    }

    this.game.camera.x = this.clamp(this.game.camera.x, 0, this.game.map.width * 16 - (this.game.canvas.width / window.devicePixelRatio));
    this.game.camera.y = this.clamp(this.game.camera.y, 0, this.game.map.height * 16 - (this.game.canvas.height / window.devicePixelRatio));

    this.game.camera.x = Math.round(this.game.camera.x);
    this.game.camera.y = Math.round(this.game.camera.y);
};

Player.prototype.setAnim = function(anim) {
    if (this.anim !== anim) {
        this.anim = anim;
        this.frame = 0;
    }
};

module.exports = Player;