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

    this.entities();

    window.addEventListener('load', this.onload.bind(this), false);
}

Game.prototype.entities = function() {
    this._entities = {
        player: 'Player',
        monster: 'Monster',
        actor: 'Actor',
        npc: 'Npc'
    };
};

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
    var Klass = require('../classes/' + this._entities[type]);

    var klass = new Klass(this);
    klass.x = opts.x;
    klass.y = opts.y;
    klass.char = opts.char;
    klass.name = name;

    this.actors.push(klass);
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

    var mapJSON = require('json!../maps/map.json');

    this.map.width = mapJSON.width;
    this.map.height = mapJSON.height;

    var overMap = mapJSON.layers[2];

    this.blockMap = mapJSON.layers[1];

    mapJSON.layers.splice(2);

    this.mapBuffer = this.renderMap(mapJSON);

    mapJSON.layers = [overMap];

    this.overMapBuffer = this.renderMap(mapJSON);

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
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ticks ++;
        this.then = now - (delta % interval);

        this.drawMap(this.mapBuffer);

        this.actors.forEach(function(item) {
            item.tick(this.ticks);
        }.bind(this));

        this.drawMap(this.overMapBuffer);
    }

    this.stats.end();

    requestAnimationFrame(this.render.bind(this));
};

Game.prototype.renderMap = function(mapJSON) {
    var tileset = {
        image: {
            src: this.images[mapJSON.tilesets[0].name],
            width: mapJSON.tilesets[0].imagewidth,
            height: mapJSON.tilesets[0].imageheight
        },
        width: mapJSON.tilesets[0].imagewidth / mapJSON.tilesets[0].tilewidth,
        height: mapJSON.tilesets[0].imageheight / mapJSON.tilesets[0].tileheight,
        tile: {
            width: mapJSON.tilesets[0].tilewidth,
            height: mapJSON.tilesets[0].tileheight
        }
    };

    var map = document.createElement('canvas');
    map.width = mapJSON.width * tileset.tile.width;
    map.height = mapJSON.height * tileset.tile.height;

    var mapCtx = map.getContext('2d');
    var l = 0;

    for (var l = 0; l < mapJSON.layers.length; l++) {
        for (var i = 0; i < mapJSON.width * mapJSON.height; i ++) {
            var x = i % mapJSON.width;
            var y = Math.floor(i / mapJSON.width);

            var t = mapJSON.layers[l].data[i] - 1;

            if (t < 0) {
                continue;
            }

            var tx = t % tileset.width;
            var ty = Math.floor(t / tileset.width);

            var tw = tileset.tile.width, th = tileset.tile.height

            mapCtx.drawImage(
                tileset.image.src,
                tx * tw, ty * th,
                tw, th,
                x * tw, y * th,
                tw, th
            );
        }
    }

    return map;
};

Game.prototype.drawMap = function(map) {
    this.context.drawImage(map, 
        this.camera.x, 
        this.camera.y, 
        this.canvas.width, 
        this.canvas.height,
        0, 0,
        this.canvas.width, 
        this.canvas.height
    );
};

Game.prototype.ready = function(done) {
    if (this.loaded === 0) {
        done.call(this);
    } else {
        setTimeout(arguments.callee.bind(this, done), 10);
    }
};

module.exports = Game;
