// scenes/MenuScene.js

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  preload() {
    this.load.image("FondoMenu", "./public/assets/FondoMenu.jpg");
  }

  create() {
    // Fondo del menú
    this.add.image(400, 300, "FondoMenu").setDisplaySize(800, 600);

    // Título del juego
    this.add.text(400, 180, "NINJA GEOMÉTRICO", {
      fontSize: "48px",
      fill: "#ffffff",
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Botón de empezar
    const playText = this.add.text(400, 350, "EMPEZAR", {
      fontSize: "40px",
      fill: "#ffffff",
      fontFamily: "Arial",
      padding: { x: 30, y: 15 },
      borderRadius: 10,
    }).setOrigin(0.5).setInteractive();

    playText.on("pointerover", () => {
      playText.setStyle({ fill: "#ffff00"});
    });

    playText.on("pointerout", () => {
      playText.setStyle({ fill: "#ffffff"});
    });

    playText.on("pointerdown", () => {
      this.scene.start("TP-Ninja-Moncho");
    });
  }
}

  