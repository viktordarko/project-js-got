// In this file we have some data that the other source files will use.

// The GAME_WIDTH and GAME_HEIGHT constants denote the size
// of the game area in pixels and is used in engine-utilities.js.
const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;

// These constants represent the width and height of an enemy in pixels
// as well as the maximum number of enemies on screen at any given time.
const ENEMY_WIDTH = 75;
const ENEMY_HEIGHT = 156;
//Max enemies at these dimensions can be 8
let max_enemies = 1;

// These constants represent the player width and height.
const PLAYER_WIDTH = 75;
const PLAYER_HEIGHT = 54;

//This variable is the multiplayer that will increase every time the difficulty increases.
let multiplayer = 1;

// Variable for how many lives we have
let lives = 3;

// Audio variables to play when page opens and when game ends
const bgAudio = document.getElementById("bgAudio");
bgAudio.volume = 0.1;


const deadAudio = document.getElementById("deadAudio");
deadAudio.loop = false;
deadAudio.volume = 0.1;
