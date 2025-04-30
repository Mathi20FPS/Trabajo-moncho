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
  
    // Contadores de ítems recolectados
    this.collectedSquares = 0;
    this.collectedTriangles = 0;
    this.collectedDiamonds = 0;
  
    // Temporizador para hacer caer ítems
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });
  }
  
    
  
  spawnItem() {
    // Generar figura aleatoria
    const items = ["square", "triangle", "diamond"];
    const itemType = Phaser.Math.RND.pick(items);

    // Establecer posición aleatoria en el eje X (entre 50 y 750)
    const xPos = Phaser.Math.RND.between(50, 750);
    const item = this.items.create(xPos, 0, itemType); // Generar item

    // Aplicar física para que el ítem caiga
    item.setBounce(1);
    item.setCollideWorldBounds(true);
    item.setVelocity(Phaser.Math.Between(-100, 100), 200); // Velocidad de caída

    
    // Hacer que el ítem sea más pequeño
   item.setScale(0.4); // Ajusta el valor para cambiar el tamaño

    // Asignar valor de puntaje
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

    // Hacer que el jugador recoja el ítem
    this.physics.add.collider(this.player, item, this.collectItem, null, this);
    this.physics.add.collider(item, this.platforms, this.itemBounce, null, this);
  }

  collectItem(player, item) {
    // Contar el tipo recolectado
    if (item.texture.key === 'square') {
      this.collectedSquares++;
    } else if (item.texture.key === 'triangle') {
      this.collectedTriangles++;
    } else if (item.texture.key === 'diamond') {
      this.collectedDiamonds++;
    }
  
    item.disableBody(true, true);
  
    // Condición de victoria: 2 iguales
    if (
      this.collectedSquares >= 2 ||
      this.collectedTriangles >= 2 ||
      this.collectedDiamonds >= 2
    ) {
      this.winGame();
    }
  }
  
  

  itemBounce(item, platform) {
    // Cuando el ítem toca el suelo, desaparece
    item.disableBody(true, true); // Esto hace que el ítem se desactive completamente (lo hace desaparecer)
  }
  
  

  winGame() {
    this.physics.pause();
  
    this.add.rectangle(400, 300, 400, 200, 0x000000, 0.7).setOrigin(0.5);
  
    this.add.text(400, 300, "¡GANASTE!", {
      fontSize: "48px",
      fill: "#00FF00",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5);
  }
  

  calculateScore() {
    // Calcular la puntuación total
    let totalScore = 0;
    totalScore += this.collectedItems.square * 10;
    totalScore += this.collectedItems.triangle * 15;
    totalScore += this.collectedItems.diamond * 20;
    return totalScore;
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

    
  }
}
