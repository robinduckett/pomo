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

Player.prototype.tick = function(ticks) {
    var dirgo = [[0, -1], [-1, 0], [0, 1], [1, 0]];

    var keys = KeyboardJS.activeKeys();

    var check = ["up", "left", "down", "right"];

    var runWalk = keys.indexOf('shift') > -1 ? 'run' : 'walk';

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

        this.x += dirgo[this.dir][0] * this.speed[runWalk] / 2;
        this.y += dirgo[this.dir][1] * this.speed[runWalk] / 2;

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    } else {
        this.setAnim('idle');
    }

    var dx = this.start.x - this.x,
        dy = this.start.y - this.y;

    var d2 = Math.sqrt((dx * dx) + (dy * dy));

    this.status = keys.join(' ') + ' ' + runWalk;

    this.moving = d2 > 0 && d2 < 16;

    this.render();
};

Player.prototype.setAnim = function(anim) {
    if (this.anim !== anim) {
        this.anim = anim;
        this.frame = 0;
    }
};

Player.prototype.render = function() {
    var ctx = this.game.ctx;
    var ticks = this.game.ticks;

    var sheet = this.anims[this.anim][this.dir];

    var frames = sheet.length;

    if (ticks % 6 === 0) {
        this.frame = (this.frame + 1) % frames;
    }

    if (this.frame > frames) {
        this.frame = frames - 1;
    }

    var animation = sheet[this.frame];

    var xpos = animation % 3;
    var ypos = Math.floor(animation / 3);

    var sx = (this.char % 10) * this.sprite.width * 3;
    var sy = Math.floor(this.char / 10) * this.sprite.height * 4;

    if (this.visible === true) {
        ctx.drawImage(
            this.game.images.actors,
            sx + (xpos * this.sprite.width),
            sy + (ypos * this.sprite.height),
            this.sprite.width,
            this.sprite.height,
            Math.round(this.x) - (this.sprite.width / 4),
            Math.round(this.y) - (this.sprite.height / 2),
            this.sprite.width,
            this.sprite.height
        );
    }
};