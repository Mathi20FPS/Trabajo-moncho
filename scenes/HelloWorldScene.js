// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("TP-Ninja-Moncho");
  }

  preload() {
    this.load.image("Cielo", "./public/assets/Cielo.webp");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("Ninja", "./public/assets/Ninja.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("diamond", "./public/assets/diamond.png");
  }

  create() {
    this.add.image(400, 300, "Cielo").setDisplaySize(800, 600);
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 580, "platform").setScale(2).refreshBody();

    this.player = this.physics.add.sprite(400, 500, "Ninja");
    this.player.setScale(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.items = this.physics.add.group();

    this.collectedSquares = 0;
    this.collectedTriangles = 0;
    this.collectedDiamonds = 0;

    this.score = 0;
    this.scoreText = this.add.text(10, 10, "Puntuación: 0", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "Arial"
    });

    this.remainingTime = 30;
    this.timerText = this.add.text(790, 10, "Tiempo: 120s", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "Arial"
    }).setOrigin(1, 0);

    this.gameOver = false;
    this.gameOverText = null; // Variable para el texto de fin de juego

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.gameOver) {
          this.remainingTime--;
          if (this.remainingTime <= 10) {
            this.timerText.setColor("#ff0000");
          }
          this.timerText.setText("Tiempo: " + this.remainingTime + "s");

          if (this.remainingTime <= 0) {
            this.loseGame();
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  spawnItem() {
    if (this.gameOver) return;

    const items = ["square", "triangle", "diamond"];
    const itemType = Phaser.Math.RND.pick(items);
    const xPos = Phaser.Math.RND.between(50, 750);
    const item = this.items.create(xPos, 0, itemType);
    item.setBounce(1);
    item.setCollideWorldBounds(true);
    item.setVelocity(Phaser.Math.Between(-100, 100), 200);
    item.setScale(0.4);

    let scoreValue = 0;
    switch (itemType) {
      case "square":
        scoreValue = 10;
        break;
      case "triangle":
        scoreValue = 15;
        break;
      case "diamond":
        scoreValue = 20;
        break;
    }
    item.setData("score", scoreValue);

    this.physics.add.collider(this.player, item, this.collectItem, null, this);
    this.physics.add.collider(item, this.platforms, this.itemBounce, null, this);
  }

  collectItem(player, item) {
    if (item.texture.key === 'square') {
      this.collectedSquares++;
    } else if (item.texture.key === 'triangle') {
      this.collectedTriangles++;
    } else if (item.texture.key === 'diamond') {
      this.collectedDiamonds++;
    }

    this.score += item.getData("score");
    this.scoreText.setText("Puntuación: " + this.score);

    item.disableBody(true, true);

    if (
      this.collectedSquares >= 2 &&
      this.collectedTriangles >= 2 &&
      this.collectedDiamonds >= 2
    ) {
      this.winGame();
    }
  }

  itemBounce(item, platform) {
    item.disableBody(true, true);
  }

  winGame() {
    this.physics.pause();
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    this.gameOver = true;

    // Borrar cualquier texto de fin de juego anterior
    if (this.gameOverText) {
      this.gameOverText.destroy();
    }
    
    this.endBackground = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.7).setOrigin(0.5);
    this.gameOverText = this.add.text(400, 300, "¡GANASTE!", {
      fontSize: "48px",
      fill: "#00FF00",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5);
  }

  loseGame() {
    this.physics.pause();
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    this.gameOver = true;

    // Borrar cualquier texto de fin de juego anterior
    if (this.gameOverText) {
      this.gameOverText.destroy();
    }
    this.endBackground = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.7).setOrigin(0.5);
    this.gameOverText = this.add.text(400, 300, "¡TIEMPO AGOTADO!", {
      fontSize: "40px",
      fill: "#FF0000",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5);
  }

  restartGame() {
    this.gameOver = false;
    this.remainingTime = 30;
    this.score = 0;
    this.collectedSquares = 0;
    this.collectedTriangles = 0;
    this.collectedDiamonds = 0;
  
    if (this.gameOverText) {
      this.gameOverText.destroy();
      this.gameOverText = null;
    }
  
    if (this.endBackground) {
      this.endBackground.destroy();
      this.endBackground = null;
    }
  
    this.scoreText.setText("Puntuación: 0");
    this.timerText.setText("Tiempo: 120s").setColor("#fff");
  
    this.items.clear(true, true);
    this.player.setPosition(400, 500);
    this.player.setVelocity(0);
  
    this.physics.resume();
  
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });
  
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.gameOver) {
          this.remainingTime--;
          if (this.remainingTime <= 10) {
            this.timerText.setColor("#ff0000");
          }
          this.timerText.setText("Tiempo: " + this.remainingTime + "s");
  
          if (this.remainingTime <= 0) {
            this.loseGame();
          }
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Reiniciar el juego al presionar 'R' solo si está en estado de "gameOver"
    if (this.gameOver && this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R), 500)) {
      this.restartGame();
    }
  }
}




