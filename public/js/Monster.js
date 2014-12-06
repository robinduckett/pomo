function Monster(game) {
    this.game = game;
    this.char = 0;

    this.x = 64;
    this.y = 64;

    this.dir = 3;
    this.anim = 'walk';
    this.frame = 0;

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
            [5, 7], // rgt // 3
        ]
    };
}

Monster.prototype.tick = function(ticks) {
    var dirgo = [[0, -1], [-1, 0], [0, 1], [1, 0]];

    if (ticks % this.distance === 0) {
        this.dir = (Math.random() * 3).toFixed(0);
        this.distance = 1 + Math.round(Math.random()*100);
    }

    var border = [
            this.y + dirgo[0][1] * 2 < 0,
            this.x + dirgo[1][0] * 2 < 0,
            this.y + dirgo[2][1] * 2 > 600 - 32,
            this.x + dirgo[3][0] * 2 > 800 - 32
    ];

    for (var d = 0; d < 4; d++) {
        if (border[d]) {
            this.distance = 19
            this.dir = (d + 2) % 4;

            break;
        }
    }

    this.x += dirgo[this.dir][0];
    this.y += dirgo[this.dir][1];
};

Monster.prototype.render = function(ctx, ticks) {
    var frames = this.anims[this.anim][this.dir].length;

    if (ticks % (60 / 10) === 0) {
        this.frame = (this.frame + 1) % frames;
    }

    var animation = this.anims[this.anim][this.dir][this.frame];

    var xpos = animation % 2;
    var ypos = Math.floor(animation / 2);

    var sx = (this.char % 15) * this.sprite.width * 2;
    var sy = Math.floor(this.char / 15) * this.sprite.height * 4;

    ctx.drawImage(
        this.game.images.pokemon,
        sx + (xpos * this.sprite.width) + (this.char % 15),
        sy + (ypos * this.sprite.height) + Math.floor(this.char / 15),
        this.sprite.width,
        this.sprite.height,
        this.x,
        this.y,
        this.sprite.width,
        this.sprite.height
    );
};