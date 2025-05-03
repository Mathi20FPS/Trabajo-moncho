export default class FondoFinScene extends Phaser.Scene {
  constructor() {
    super("FondoFin");
  }

  preload() {
    this.load.image("FondoFin", "./public/assets/FondoFin.png");
  }

  create(data) {
    this.add.image(400, 300, "FondoFin").setDisplaySize(800, 600);

    const resultMessage = data?.result || "Fin del juego";
    const scoreMessage = `Puntaje: ${data?.score ?? 0}`;
    const reasonMessage = data?.reason ? `${data.reason}` : "";

    this.add.text(400, 180, resultMessage, {
      fontSize: "48px",
      fill: "#fff",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(400, 260, scoreMessage, {
      fontSize: "36px",
      fill: "#fff",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5);

    if (reasonMessage) {
      this.add.text(400, 320, reasonMessage, {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 3,
      }).setOrigin(0.5);
    }

    this.add.text(400, 400, "Presiona R para reiniciar", {
      fontSize: "28px",
      fill: "#ffff00",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.restartKey = this.input.keyboard.addKey("R");
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.start("TP-Ninja-Moncho");
    }
  }
}
