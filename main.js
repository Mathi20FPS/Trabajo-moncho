import MenuScene from "./scenes/MenuScene.js";
import HelloWorldScene from "./scenes/HelloWorldScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  scene: [MenuScene, HelloWorldScene], // Primero el menú, luego el juego
};

window.game = new Phaser.Game(config);

