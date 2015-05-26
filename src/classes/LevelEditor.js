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
    var tile = this.game.map.tileset.tile,
        camera = this.game.camera;

    var screen = {
        x: Math.floor(x / tile.width),
        y: Math.floor(y / tile.height)
    };

    return {
        screen: screen,
        level: {
            x: screen.x + Math.floor(camera.x / tile.width),
            y: screen.y + Math.floor(camera.y / tile.height),
        },
        canvas: {
            x: (screen.x * tile.width) - (camera.x % tile.width),
            y: (screen.y * tile.height) - (camera.y % tile.height),
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

LevelEditor.prototype.load = function() {
    this.game.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.game.canvas.addEventListener('click', this.handleMouseClick.bind(this));
};

LevelEditor.prototype.tick = function(ticks) {
    this.render();
};

LevelEditor.prototype.afterRender = function() {
    var pos = this.screenToMap(this.mousex, this.mousey)
        ctx = this.game.context;

    ctx.save();

    ctx.strokeRect(pos.canvas.x, pos.canvas.y, 16, 16);
    ctx.textAlign = 'center';

    ctx.strokeText(pos.level.x + 'x' + pos.level.y, pos.canvas.x + 8, pos.canvas.y + 32);

    ctx.restore();
};

module.exports = LevelEditor;
