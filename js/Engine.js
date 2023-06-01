// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
    // Adding a score
    this.score = new Text(this.root, 230, 30);
    this.score.update("0000");

    // Adding a lives system
    this.lives = new Text(this.root, 480, 20);
    this.lives.update(`Lives: ${lives}`);
    this.lives.domElement.style.border = "2px solid white";
    this.lives.domElement.style.background = "grey";
    this.lives.domElement.style.font = "bold 2rem MedievalSharp";
  }

  // Creating function to update score with a multiplayer of 1 to start, if the number is higher than
  //9999 it will stop slicing it and will show the full score.
  updatingScore = () => {
    let scoreValue = parseInt(this.score.domElement.innerText) + multiplayer;
    if (scoreValue > 9999) {
      let fullScore = scoreValue;
      this.score.update(fullScore);
    } else {
      let fullScore = ("000" + scoreValue).slice(-4);
      this.score.update(fullScore);
    }
  };

  //Function to increase difficulty
  increaseDifficulty = () => {
    this.difficultyId = setInterval(() => {
      if (max_enemies < 8) {
        max_enemies += 1;
        multiplayer += 3;
      }
    }, 5000);
  };

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    //function starts to update the score
    this.updatingScore();

    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.

    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < max_enemies) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)

    const gameIsOver = () => {
      //creating and displaying gameover banner
      this.banner = new Text(this.root, 185, 340);
      this.banner.domElement.classList.add("banner");
      this.banner.domElement.setAttribute("id", "gameOverBanner");
      this.banner.update("Gameover");
      this.banner.domElement.style.font = "bold 3rem MedievalSharp";
      //difficulty stops increasing
      clearInterval(this.difficultyId);
      //visual changes to remove the enemies, player dies and changes image, bg audio stops, queues deadaudio
      this.player.domElement.src = "images/dead.png";
      this.player.domElement.classList.add('dead');
      const targettingEnemies = document.querySelectorAll("img.enemy");
      targettingEnemies.forEach((enemy) => {
        enemy.remove();
      });
      bgAudio.pause();
      deadAudio.play();
      // Restart button shows up, i tried making it on a way that it would trigger again the gameLoop, however
      // many errors come up referring to all js, will have to reload the page instead.
      startButton.style.display = "block";
      startButton.style.top = "415";
      startButton.style.left = "188";
      startButton.innerText = "RESTART";
      startButton.addEventListener("click", () => {
        window.location.reload()})
      return;
    };

    if (this.isPlayerDead()) {
      gameIsOver();
      return;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // Function that checks for collisions,
  // If a collision is detected it minuses 1 life, if lives are less than 1, collision true, game ends.
  isPlayerDead = () => {
    let collision = false;
    this.enemies.forEach((enemy) => {
      if (
        this.player.x < enemy.x + ENEMY_WIDTH &&
        this.player.x + PLAYER_WIDTH > enemy.x &&
        GAME_HEIGHT - PLAYER_HEIGHT - 10 < enemy.y + ENEMY_HEIGHT &&
        PLAYER_HEIGHT + (GAME_HEIGHT - PLAYER_HEIGHT - 10) > enemy.y
      ) {
        if (lives <= 1) {
          this.lives.update(`Lives: 0`);
          collision = true;
        } else {
          lives -= 1;
          enemy.y = 2000;
          this.lives.update(`Lives: ${lives}`);
        }
      }
    });
    return collision;
  };
}
