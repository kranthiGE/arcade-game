/*
Developed by: Kranthi Kiran
Date: 13-Sep-2015
Description: App JS file, has classes for player, playersprite and enemy
*/
// Global Variables
var gameScreen = 0;
var enemyQty = 5;
var spriteChoosen = 0;
var eRowStarts = [61, 145, 228, 310];     // Pixel y coord enemy starting points for each row of water
var eOffStart = [-101, -202, -303, -404]; // Off screen coords for enemy starting positions
var speed = 200;
var isCollided = false;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // A helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Get random number
    var rnd = Math.floor((Math.random() * 3)) + 1;

    // Get a random off screen position so they appear in diff. places
    this.x = eOffStart[Math.floor((Math.random() * eOffStart.length))];
    // Get a random row for the enemy to start on
    this.y = eRowStarts[Math.floor((Math.random() * 4))];
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= ctx.canvas.width) {
        // Change the position based on the speed of the enemies
        this.x = this.x + (speed * dt);
    } else {
        // Set x back off screen to the left and randomise the row it appears on
        this.x = eOffStart[Math.floor((Math.random() * eOffStart.length))];
        this.y = eRowStarts[Math.floor((Math.random() * 4))];
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player Sprite Class
var PlayerSprite = function(){
    this.x = 1;
    this.y = 401;
    this.sprite = 'images/Selector.png';
};

// Render function for player
PlayerSprite.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.restore();
};

// logic to provide actions for the inputkeys pressed by user when game is running
PlayerSprite.prototype.handleInput = function(inputKey){
    switch(inputKey) {
    case 'left':
        if (this.x >= 101) {
            this.x = this.x - 100;
            spriteChoosen -= 1;
        }
    break;
    case 'right':
        if (this.x <= 301) {
            this.x = this.x + 100;
            spriteChoosen += 1;
        }
    break;
    case 'one':
        gameScreen = 1;
    break;

    }
};


// Player class
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method
var Player = function(){
    this.x = 200;
    this.y = 410;
    this.lives = 3;//maximum number of player lives for a game

    playercharacters = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'];

    this.sprite = playercharacters[spriteChoosen];//playercharacters[0];
};

// Update function for player
Player.prototype.update = function(){
    this.sprite = playercharacters[spriteChoosen];
};

// Render function for player
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.textAlign = 'right';
    ctx.fillText('Player lives:' + this.lives, 500, 580);

    //TODO: check for collisions after rendering the player
    checkCollisions(player);
};

// Reset the position of player
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 410;
};

// Logic to be executed to start the game such as providing user to select the player...
Player.prototype.handleInput = function(inputKey){
    // constant speed
    this.horizY = 85;
    this.horizX = 101;

    // initialization
    this.targetX = this.x;
    this.targetY = this.y;

    switch(inputKey) {
        case 'left':
            this.targetX = this.x - this.horizX;
            break;
        case 'right':
            this.targetX = this.x + this.horizX;
            break;
        case 'up':
            this.targetY = this.y - this.horizY;
            break;
        case 'down':
            this.targetY = this.y + this.horizY;
            break;
        case 'zero':
            gameScreen = 0;
            this.lives = 3;
            this.reset();
            break;
    }
    if(this.targetY <= -10){
        this.targetY = 0;
    }

    // constraints on movement
    if (!(this.targetX > 500 || this.targetX < -2 || this.targetY < 0 || this.targetY > 450)) {
        this.x = this.targetX;
        this.y = this.targetY < 0 ? 0 : this.targetY;
    }

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player, playersprite = null;

initGame();

// This function initializes player, playersprite & enemy and allEnemies array
// with all enemy objects based on maxiumum number of enemies defined
function initGame(){
    allEnemies = [];
    player = new Player();
    playersprite = new PlayerSprite();
    for (var i = 0; i < enemyQty; i++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    };
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        48: 'zero',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        49: 'one',
        116: 'refresh'
    };
    if (gameScreen === 0)
        playersprite.handleInput(allowedKeys[e.keyCode]);
    else
        player.handleInput(allowedKeys[e.keyCode]);
});

// Checks for any collisions between player and random moving enemies
function checkCollisions(player){
    // Get x & y co-ordinates of player & enemy
    var pX = player.x, pY = player.y, eX = [], eY = [], i =0, eObj = [], diffDist = 0;

    // Now get the co-ords for all the enemies
    for (i=0; i <= allEnemies.length-1; i = i + 1) {
        eX.push(allEnemies[i].x);
        eY.push(allEnemies[i].y);
    }

    // Calculate distance between points using pythagorus theorem
    for (i=0; i <= allEnemies.length-1; i = i + 1) {
        diffDist = Math.sqrt(Math.pow(eX[i] - pX, 2) + Math.pow(eY[i] - pY, 2));
        // Check if the distance difference is low as half-of enemy width, then throw an error and reduce lives
        if(diffDist < 50){
            isCollided = true;
            // For every collision, reduce the number of lives by 1 and reset the game2 screen
            player.lives -= 1;
            player.reset();
        }
    }

    // If lives == 0, then reset the game with gameover alert and show 1st screen
    if(player.lives <= 0){
        player.reset();
        player.lives = 3;
        gameScreen = 2;
    }
}