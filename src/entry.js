var Game = require('./game/Game');

var game = new Game();

game.preload('actors', './images/sprites-characters.png');
game.preload('actors@2x', './images/sprites-characters-2x.png');

game.preload('tileset-advance', './images/tileset-advance.png');
game.preload('tileset2', './images/tileset.png');
game.preload('caves', './images/caves.png');
game.preload('interior', './images/interior.png');
game.preload('pokemon', './images/pokemon-sprites.png');
game.preload('pokemon@2x', './images/pokemon-sprites-2x.png');

var monsters = [0, 4, 7, 26];
var npcs = [];
var pos = 0;

pos = 0;

for (var i = 0; i < 100; i++) {
    npcs.push(i);
}

npcs.forEach(function(i) {
    pos++;
    game.add('npc', 'npc' + i, {
        x: 64 + (pos % 5) * 32 * 10,
        y: 64 + Math.floor(pos / 5) * 32 * 10,
        char: i % 80
    });
});

game.add('levelEditor', 'LevelEditor');

game.add('player', 'Robin', {
    x: 64,
    y: 28 * 16,
    char: 50
});

game.ready(function() {
    game.start();
});
