function LevelEditor(game) {
    this.game = game;

    this.mousex = 0;
    this.mousey = 0;
}

LevelEditor.prototype.handleMouseMove = function(evt) {
    this.mousex = evt.offsetX;
    this.mousey = evt.offsetY;
};

LevelEditor.prototype.handleMouseClick = function(evt) {
    this.mousex = evt.offsetX;
    this.mousey = evt.offsetY;

    var pos = this.screenToMap(this.mousex, this.mousey);

    this.game.mapBuffer.getContext('2d').fillRect(pos.level.x * 16, pos.level.y * 16, 16, 16);
};

LevelEditor.prototype.screenToMap = function(x, y) {
    var screen = {
        x: Math.floor(x / this.game.map.tileset.tile.width),
        y: Math.floor(y / this.game.map.tileset.tile.height)
    };

    return {
        screen: screen,
        level: {
            x: screen.x + Math.floor(this.game.camera.x / this.game.map.tileset.tile.width),
            y: screen.y + Math.floor(this.game.camera.y / this.game.map.tileset.tile.height),
        },
        canvas: {
            x: (screen.x * this.game.map.tileset.tile.width) - (this.game.camera.x % this.game.map.tileset.tile.width),
            y: (screen.y * this.game.map.tileset.tile.height) - (this.game.camera.y % this.game.map.tileset.tile.height),
        }
    };
};

LevelEditor.prototype.mapToScreen = function(x, y) {
    return {
        x: (x * this.game.map.tileset.tile.width) - this.game.camera.x,
        y: (y * this.game.map.tileset.tile.height) - this.game.camera.y
    }
};

LevelEditor.prototype.render = function() {
};

LevelEditor.prototype.tick = function(ticks) {
    if (ticks === 1) {
        this.game.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.game.canvas.addEventListener('click', this.handleMouseClick.bind(this));
    }
};

LevelEditor.prototype.afterRender = function() {
    var pos = this.screenToMap(this.mousex, this.mousey);

    this.game.context.save();

    this.game.context.strokeRect(pos.canvas.x, pos.canvas.y, 16, 16);
    this.game.context.textAlign = 'center';

    this.game.context.strokeText(pos.level.x + 'x' + pos.level.y, pos.canvas.x + 8, pos.canvas.y + 32);

    this.game.context.restore();
};

module.exports = LevelEditor;
