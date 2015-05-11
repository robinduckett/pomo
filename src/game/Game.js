var KeyboardJS = require('keyboardjs'),
    Stats = require('stats.js');

var Actor = require('../classes/Actor'),
    Monster = require('../classes/Monster'),
    Player = require('../classes/Player');

require('canvas.scss');
require('main.scss');

function Game() {
    this.loaded = -1;
    this.loading = 0;

    this.images = {};
    this.actors = [];

    this.fps = 60;
    this.then = Date.now();
    this.first = this.then;

    this.camera = {
        x: 0,
        y: 0
    };

    this.map = {};

    this.ticks = 0;

    window.addEventListener('load', this.onload.bind(this), false);
}

Game.prototype.onload = function() {
    var percent = ((this.loading - Math.abs(this.loaded + 1)) / this.loading) * 100;

    if (isNaN(percent)) percent = 0;

    console.log('Loading percentage: %d%', percent);

    this.loaded ++;
};

Game.prototype.onresize = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 50;

    this.updateCanvasScale();
};

Game.prototype.updateCanvasScale = function() {
    var devicePixelRatio = window.devicePixelRatio || 1,
        context = this.context, canvas = this.canvas,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

    //var oldWidth = canvas.width;
    //var oldHeight = canvas.height;

    var oldWidth = window.innerWidth;
    var oldHeight = window.innerHeight - 30;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    console.log('scaling');

    context.scale(ratio, ratio);
};

Game.prototype.preload = function(key, src) {
    this.loaded --;
    this.loading ++;

    this.images[key] = new Image();
    this.images[key].onload = this.onload.bind(this);

    this.images[key].src = src;
};

Game.prototype.add = function(type, name, opts) {
    switch (type) {
        case 'player':
            var player = new Player(this);
            player.x = opts.x;
            player.y = opts.y;
            player.char = opts.char;
            player.name = name;

            this.actors.push(player);
            break;

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

Game.prototype.start = function() {
    this.canvas = document.createElement('canvas');

    document.body.appendChild( this.canvas );

    this.context = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener('resize', this.onresize.bind(this), false);
    this.onresize();

    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    document.body.appendChild( this.stats.domElement );

    this.map = require('json!../maps/map.json');
    console.log(this.map);

    requestAnimationFrame(this.render.bind(this));
};

Game.prototype.isRetina = function() {
    return window.devicePixelRatio !== 1;
};

Game.prototype.render = function() {
    this.stats.begin();

    var now = Date.now();

    var delta = now - this.then;
    var interval = 1000 / this.fps;

    if (delta > interval) {
        if (this.retina !== this.isRetina()) {
            this.retina = this.isRetina();

            this.updateCanvasScale();

            console.log('Updating scale');
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
    this.map.width = 100;
    this.map.height = 100;

    this.context.strokeStyle = 'rgba(0, 0, 0, 1)';

    for (var x = 0; x < this.map.width * 16; x += 16) {

        this.context.strokeStyle = 'rgba(0, 0, 0, 1)';

        if (x % 32 === 0) {
            this.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        }

        this.context.beginPath();
        this.context.moveTo(x - 0.5 - this.camera.x, 0);
        this.context.lineTo(x - 0.5 - this.camera.x, this.map.height * 100);
        this.context.stroke();
    }

    for (var y = 0; y < this.map.height * 16; y += 16) {
        this.context.strokeStyle = 'rgba(0, 0, 0, 1)';

        if (y % 32 === 0) {
            this.context.strokeStyle = 'rgba(0, 0, 0, 1)';
        }

        this.context.beginPath();
        this.context.moveTo(0, y - 0.5 - this.camera.y);
        this.context.lineTo(this.map.width * 100, y - 0.5 - this.camera.y);
        this.context.stroke();
    }
};

Game.prototype.ready = function(done) {
    if (this.loaded === 0) {
        done.call(this);
    } else {
        setTimeout(arguments.callee.bind(this, done), 10);
    }
};

module.exports = Game;