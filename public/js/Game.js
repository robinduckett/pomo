/*global Stats */

function Game() {
    this.images = {};
    this.loaded = -1;
    this.loading = 0;
    this.oldTimestamp = 0;
    this.ticks = 0;

    this.actors = [];
    this.fps = 60;
    this.then = Date.now();
    this.first = this.then;

    this.width = 800;
    this.height = 600;

    window.onload = this._incLoad.bind(this);
}

Game.prototype._incLoad = function() {
    console.log('Loading percentage: ');
    var perc = ((this.loading - Math.abs(this.loaded + 1)) / this.loading) * 100;
    console.log(perc.toFixed(2), '%');

    this.loaded ++;
};

Game.prototype.preload = function(key, src) {
    this.loaded --;
    this.loading ++;

    this.images[key] = new Image();
    this.images[key].onload = this._incLoad.bind(this);

    this.images[key].src = src;
};

Game.prototype.ready = function(done) {
    if (this.loaded === 0) {
        done.call(this);
    } else {
        setTimeout(arguments.callee.bind(this, done), 10);
    }
};

Game.prototype.start = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    document.body.appendChild( this.stats.domElement );

    requestAnimationFrame(this.render.bind(this));
};

Game.prototype.render = function(timestamp) {
    this.stats.begin();

    var now = Date.now();

    var delta = now - this.then;
    var interval = 1000 / this.fps;

    if (delta > interval) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ticks ++;
        this.then = now - (delta % interval);

        this.renderMap();

        this.actors.forEach(function(item) {
            item.tick(this.ticks);
        }.bind(this));
    }

    this.stats.end();

    requestAnimationFrame(this.render.bind(this));
};

Game.prototype.renderMap = function() {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

    for (var x = 0; x < this.width; x += 16) {

        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

        if (x % 32 === 0) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        }

        this.ctx.beginPath();
            this.ctx.moveTo(x - 0.5, 0);
            this.ctx.lineTo(x - 0.5, this.height);
        this.ctx.stroke();
    }

    for (var y = 0; y < this.height; y += 16) {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

        if (y % 32 === 0) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        }

        this.ctx.beginPath();
            this.ctx.moveTo(0, y - 0.5);
            this.ctx.lineTo(this.width, y - 0.5);
        this.ctx.stroke();
    }
};

Game.prototype.add = function(type, name, opts) {
    switch (type) {
        case 'actor':
            var actor = new Actor(this);

            actor.x = opts.x;
            actor.y = opts.y;

            actor.char = opts.char;
            actor.name = name;

            this.actors.push(actor);
            break;

        case 'monster':
            var monster = new Monster(this);

            monster.x = opts.x;
            monster.y = opts.y;

            monster.char = opts.char;
            monster.name = name;

            this.actors.push(monster);
            break;
    }
};