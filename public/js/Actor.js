function Actor(game) {
    this.game = game;
    this.char = 0;

    this.x = 64;
    this.y = 64;

    this.dir = 2;
    this.anim = 'walk';
    this.frame = 0;

    this.distance = Math.round(Math.random()*20);

    this.speed = {
        walk: 3.75
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
            [  7, 1, 4, 1 ], // rgt // 3
        ]
    };
}

Actor.prototype.tick = function(ticks) {
    var dirgo = [[0, -1], [-1, 0], [0, 1], [1, 0]];
//
//    if (ticks % this.distance === 0) {
//        this.dir = Math.floor(Math.random() * 3);
//        this.distance = 1 + Math.round(Math.random()*20);
//    }
//
//    var border = [
//        this.y + dirgo[0][1] * 2 < 0,
//        this.x + dirgo[1][0] * 2 < 0,
//        this.y + dirgo[2][1] * 2 > 600 - 32,
//        this.x + dirgo[3][0] * 2 > 800 - 32
//    ];
//
//    for (var d = 0; d < 4; d++) {
//        if (border[d]) {
//            this.distance = 19;
//            this.dir = (d + 2) % 4;
//
//            break;
//        }
//    }
//
//    this.x += dirgo[this.dir][0];
//    this.y += dirgo[this.dir][1];

    if (ticks % 60 === 0) {
        this.dir = (this.dir + 1) % 4;
    }

    if (ticks % 6 === 0) {
        this.x += dirgo[this.dir][0] * (16 / 10);
        this.y += dirgo[this.dir][1] * (16 / 10);
    }
};

Actor.prototype.render = function(ctx, ticks) {
    var frames = this.anims[this.anim][this.dir].length;

    if (ticks % (60 / 6) === 0) {
        this.frame = (this.frame + 1) % frames;
    }

    var animation = this.anims[this.anim][this.dir][this.frame];

    var xpos = animation % 3;
    var ypos = Math.floor(animation / 3);

    var sx = (this.char % 10) * this.sprite.width * 3;
    var sy = Math.floor(this.char / 10) * this.sprite.height * 4;

    ctx.drawImage(
        this.game.images.actors,
        sx + (xpos * this.sprite.width),
        sy + (ypos * this.sprite.height),
        this.sprite.width,
        this.sprite.height,
        Math.floor(this.x),
        Math.floor(this.y),
        this.sprite.width,
        this.sprite.height
    );

    ctx.textAlign = 'center';

    ctx.fillStyle = '#000';

    ctx.font = '10px Helvetica';

    for (var i = 0; i < 4; i++) {
        var pos = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        ctx.fillText([
            this.name
        ].join(' '), this.x + (this.sprite.width / 2) + pos[i][0], this.y + this.sprite.height + 8 + pos[i][1]);
    }

    ctx.fillStyle = '#fff';

    ctx.fillText([
        this.name
    ].join(' '), this.x + (this.sprite.width / 2), this.y + this.sprite.height + 8);

    if (this.name === 'npc0') {
        ctx.strokeStyle = '#f00';
        ctx.strokeRect(Math.ceil(this.x) - 0.5, Math.ceil(this.y) - 0.5, this.sprite.width, this.sprite.height);
        ctx.strokeStyle = '#000';
    }
};