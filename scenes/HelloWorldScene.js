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
    this.load.image("X", "./public/assets/X.png");
  }

  create() {
    this.add.image(400, 300, "Cielo").setDisplaySize(800, 600);

    // Creación de plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 580, "platform").setScale(2).refreshBody();
    this.platforms.create(200, 400, "platform").setScale(0.5).refreshBody();
    this.platforms.create(600, 300, "platform").setScale(0.5).refreshBody();

    // Jugador (Ninja)
    this.player = this.physics.add.sprite(400, 500, "Ninja").setScale(0.1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.items = this.physics.add.group();

    // Puntuación
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Puntos: 0", {
      fontSize: "24px",
      fill: "#000",
    });

    // Objetos recolectados
    this.collected = {
      square: 0,
      triangle: 0,
      diamond: 0,
    };

    // Temporizador
    this.timer = 30;
    this.timerText = this.add.text(600, 16, "Tiempo: 30", {
      fontSize: "24px",
      fill: "#000",
    });

    // Evento para el temporizador
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

    // Evento para generar objetos
    this.spawnLoop = this.time.addEvent({
      delay: 500,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    // Estado del juego
    this.gameOver = false;
    this.restartKey = this.input.keyboard.addKey("R");
  }

  spawnItem() {
    if (this.gameOver) return;

    const items = ["square", "triangle", "diamond", "X"];
    const itemType = Phaser.Math.RND.pick(items);
    const xPos = Phaser.Math.RND.between(50, 750);
    const item = this.items.create(xPos, 0, itemType);

    item.setBounce(1);
    item.setCollideWorldBounds(true);
    item.setVelocity(Phaser.Math.Between(-100, 100), 200);

    // Usamos tamaño fijo para todos los ítems
    item.setDisplaySize(30, 30); // Ajusta esto al tamaño que prefieras

    let scoreValue = 0;
    switch (itemType) {
      case "square": scoreValue = 10; break;
      case "triangle": scoreValue = 15; break;
      case "diamond": scoreValue = 20; break;
      case "X": scoreValue = -10; break; // Resta puntos
    }

    item.setData("score", scoreValue);
    item.setData("type", itemType);

    this.physics.add.overlap(this.player, item, this.collectItem, null, this);
    this.physics.add.collider(item, this.platforms, this.itemBounce, null, this);
  }

  collectItem(player, item) {
    const scoreValue = item.getData("score") || 0;
    const type = item.getData("type");

    this.score += scoreValue;
    this.scoreText.setText("Puntos: " + this.score);
    item.disableBody(true, true);

    if (type && this.collected[type] !== undefined) {
      this.collected[type]++;
    }

    if (
      this.score >= 100 ||
      (this.collected.square >= 2 &&
        this.collected.triangle >= 2 &&
        this.collected.diamond >= 2)
    ) {
      this.winGame();
    }

    // Pierde si el puntaje es menor a cero
    if (this.score < 0) {
      this.loseGame("¡Perdiste puntos!");
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
    let reason = this.score >= 100
    ? "Alcanzaste 100 puntos"
    : "Recolectaste 2 figuras de cada tipo";
  
  this.scene.start("FondoFin", {
    result: "¡GANASTE!",
    score: this.score,
    reason: reason
  });
  }
  loseGame(message) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    this.spawnLoop.remove();

    // Llamar a la escena de fin de juego y pasar los datos
    this.scene.start("FondoFin", {
      result: message,
      score: this.score,
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

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-350);
    }
  }
}
