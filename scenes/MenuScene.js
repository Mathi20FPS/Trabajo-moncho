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
  
      // Botón de texto
      const playText = this.add.text(400, 450, "EMPEZAR", {
        fontSize: "40px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive();
  
      // Al hacer clic, inicia el juego
      playText.on("pointerdown", () => {
        this.scene.start("TP-Ninja-Moncho");
      });
    }
  }
  