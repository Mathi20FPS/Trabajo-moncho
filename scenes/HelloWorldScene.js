// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("TP-Ninja-Moncho");
  }

  preload() {
    // Fondos e imágenes necesarias
    this.load.image("Cielo", "./public/assets/Cielo.webp");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("Ninja", "./public/assets/Ninja.png");

    // Próximos ítems (cargamos estos por ahora)
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("diamond", "./public/assets/diamond.png");
  }

  create() {
    // Fondo escalado
    this.add.image(400, 300, "Cielo").setDisplaySize(800, 600);

    // Grupo de plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 580, "platform").setScale(2).refreshBody();

    // Jugador
    this.player = this.physics.add.sprite(400, 500, "Ninja");
    this.player.setScale(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Grupo de ítems
    this.items = this.physics.add.group();

    // Puntaje
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Puntos: 0', {
      fontSize: '24px',
      fill: '#000',
    });

    // Temporizador
    this.timer = 30; // Segundos
    this.timerText = this.add.text(600, 16, 'Tiempo: 30', {
      fontSize: '24px',
      fill: '#000',
    });

    // Evento para el temporizador
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.gameOver) {
          this.timer--;
          this.timerText.setText('Tiempo: ' + this.timer);
          if (this.timer <= 0) {
            this.loseGame("¡Tiempo agotado!");
          }
        }
      },
      callbackScope: this,
      loop: true,
    });

    // Evento para el spawn de ítems
    this.spawnLoop = this.time.addEvent({
      delay: 500, // 0.5 segundos
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    // Game Over flag
    this.gameOver = false;

    // Tecla para reiniciar el juego
    this.restartKey = this.input.keyboard.addKey('R');
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

    // Asignar puntaje basado en el tipo de ítem
    let scoreValue = 0;
    switch (itemType) {
      case "square": scoreValue = 10; break;
      case "triangle": scoreValue = 15; break;
      case "diamond": scoreValue = 20; break;
    }
    item.setData("score", scoreValue); // Guardar puntaje en el ítem

    this.physics.add.collider(this.player, item, this.collectItem, null, this);
    this.physics.add.collider(item, this.platforms, this.itemBounce, null, this);
  }

  collectItem(player, item) {
    const scoreValue = item.getData("score") || 0;
    this.score += scoreValue;
    this.scoreText.setText('Puntos: ' + this.score);

    item.disableBody(true, true);

    if (this.score >= 100) {
      this.winGame();
    }
  }

  itemBounce(item, platform) {
    // Obtener el puntaje actual del ítem
    let currentScore = item.getData("score") || 0;

    // Descontar 5 puntos por rebote
    currentScore -= 5;

    if (currentScore <= 0) {
      // Si el puntaje llega a 0 o menos, eliminar el ítem
      item.disableBody(true, true);
    } else {
      // Si aún tiene puntaje, actualizarlo
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
    // Movimiento del jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Reiniciar el juego si el jugador presiona 'R' después de perder o ganar
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart();
    }
  }
}






