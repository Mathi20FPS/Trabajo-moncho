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
    this.platforms.create(200, 400, "platform").setScale(0.5).refreshBody();
    this.platforms.create(600, 300, "platform").setScale(0.5).refreshBody();

    this.player = this.physics.add.sprite(400, 500, "Ninja").setScale(0.1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.items = this.physics.add.group();

    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Puntos: 0", {
      fontSize: "24px",
      fill: "#000",
    });

    // Contadores de figuras
    this.collected = {
      square: 0,
      triangle: 0,
      diamond: 0,
    };

    this.timer = 30;
    this.timerText = this.add.text(600, 16, "Tiempo: 30", {
      fontSize: "24px",
      fill: "#000",
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.gameOver) {
          this.timer--;
          this.timerText.setText("Tiempo: " + this.timer);
          if (this.timer <= 0) {
            this.loseGame("¡Tiempo agotado!");
          }
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.spawnLoop = this.time.addEvent({
      delay: 500,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    this.gameOver = false;
    this.restartKey = this.input.keyboard.addKey("R");
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
      case "square": scoreValue = 10; break;
      case "triangle": scoreValue = 15; break;
      case "diamond": scoreValue = 20; break;
    }
    item.setData("score", scoreValue);
    item.setData("type", itemType); // importante para contar

    this.physics.add.collider(this.player, item, this.collectItem, null, this);
    this.physics.add.collider(item, this.platforms, this.itemBounce, null, this);
  }

  collectItem(player, item) {
    const scoreValue = item.getData("score") || 0;
    const type = item.getData("type");

    this.score += scoreValue;
    this.scoreText.setText("Puntos: " + this.score);
    item.disableBody(true, true);

    // Aumentar contador de tipo
    if (type && this.collected[type] !== undefined) {
      this.collected[type]++;
    }

    // Verificar si se ganan 100 puntos o se juntaron 2 de cada tipo
    if (
      this.score >= 100 ||
      (this.collected.square >= 2 &&
        this.collected.triangle >= 2 &&
        this.collected.diamond >= 2)
    ) {
      this.winGame();
    }
  }

  itemBounce(item, platform) {
    let currentScore = item.getData("score") || 0;
    currentScore -= 5;

    if (currentScore <= 0) {
      item.disableBody(true, true);
    } else {
      item.setData("score", currentScore);
    }
  }

  winGame() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    this.spawnLoop.remove();

    this.endBox = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.7).setOrigin(0.5);
    this.endText = this.add.text(400, 300, "¡GANASTE!", {
      fontSize: "48px",
      fill: "#00FF00",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5);
  }

  loseGame(message) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    this.spawnLoop.remove();

    this.endBox = this.add.rectangle(400, 300, 400, 200, 0x000000, 0.7).setOrigin(0.5);
    this.endText = this.add.text(400, 300, message, {
      fontSize: "36px",
      fill: "#FF0000",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-350);
    }

    if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
    }
  }
}







