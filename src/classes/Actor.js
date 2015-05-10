function Actor(game) {
    this.game = game;
    this.char = 0;

    this.x = 64;
    this.y = 64;

    this.start = {x: this.x, y: this.y};

    this.dir = 2;
    this.anim = 'idle';
    this.frame = 0;

    this.runWalk = 'walk';

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

Actor.prototype.tick = function(ticks) {
    var dirgo = [[0, -1], [-1, 0], [0, 1], [1, 0]];

    if (this.moving === true) {
        this.setAnim('walk');

        this.x += dirgo[this.dir][0] * this.speed[this.runWalk] / 2;
        this.y += dirgo[this.dir][1] * this.speed[this.runWalk] / 2;

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    } else {
        this.setAnim('idle');
    }

    var dx = this.start.x - this.x,
        dy = this.start.y - this.y;

    var d2 = Math.sqrt((dx * dx) + (dy * dy));

    this.moving = d2 > 0 && d2 < (this.distance - (this.distance % 16));

    this.status = this.dir + ' ' + this.runWalk + ' ' + this.moving.toString();
    this.game.context.fillText(
        this.status,
        this.x - this.game.camera.x,
        this.y - this.game.camera.y
    );

    this.render();
};

Actor.prototype.setAnim = function(anim) {
    if (this.anim !== anim) {
        this.anim = anim;
        var frames = this.anims[this.anim][this.dir].length;

        if (this.frame > frames) {
            this.frame = 0;
        }
    }
};

Actor.prototype.isRetina = function() {
    return window.devicePixelRatio !== 1;
};

Actor.prototype.animate = function() {
    var ticks = this.game.ticks;

    var sheet = this.anims[this.anim][this.dir];

    var frames = sheet.length;

    if (ticks % 6 === 0) {
        this.frame = (this.frame + 1) % frames;
    }

    if (this.frame > frames) {
        this.frame = frames - 1;
    }

    return sheet[this.frame];
};

Actor.prototype.render = function() {
    var animation = this.animate();

    var xpos = animation % 3;
    var ypos = Math.floor(animation / 3);

    var sx = (this.char % 10) * this.sprite.width * 3;
    var sy = Math.floor(this.char / 10) * this.sprite.height * 4;

    if (this.visible === true) {
        this.renderChar('actors', {
            srcx: (sx + (xpos * this.sprite.width)),
            srcy: (sy + (ypos * this.sprite.height))
        });
    }
};

Actor.prototype.renderChar = function(img, opts) {
    this.draw({
        image: img,
        srcx: opts.srcx,
        srcy: opts.srcy,
        srcw: this.sprite.width,
        srch: this.sprite.height,
        desx: Math.round(this.x) - (this.sprite.width / 4),
        desy: Math.round(this.y) - (this.sprite.height / 2)
    });
};

Actor.prototype.draw = function(opts) {
    if(!opts.image) {
        throw("Image is required");
    }

    // get the canvas and context
    var canvas = this.game.canvas,
        context = canvas.getContext('2d'),

        // now default all the dimension info

        srcx = opts.srcx || 0,
        srcy = opts.srcy || 0,
        srcw = opts.srcw || image.naturalWidth,
        srch = opts.srch || image.naturalHeight,
        desx = opts.desx || srcx,
        desy = opts.desy || srcy,
        desw = opts.desw || srcw,
        desh = opts.desh || srch,

        // finally query the various pixel ratios
        dpr = window.devicePixelRatio || 1;

    var image = this.game.images[opts.image + (this.isRetina() ? '@2x' : '')];

    context.drawImage(
        image,
        srcx * dpr,
        srcy * dpr,
        srcw * dpr,
        srch * dpr,
        desx - this.game.camera.x,
        desy - this.game.camera.y,
        desw,
        desh
    );
};

module.exports = Actor;