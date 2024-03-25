import p5 from "p5";
import * as Tone from "tone";

class AudioBank {
  p: p5;
  x: number;
  y: number;
  fileLabel: p5.Element;
  fileInput: p5.Element;
  loop: boolean;
  recording: boolean;
  player: Tone.Player;
  id: number;

  constructor(p: p5, x: number, y: number, id: number) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.fileLabel = p.createElement("label", "File");
    this.fileLabel.position(this.x, this.y);
    this.fileLabel.class("label");
    this.fileLabel.attribute("for", `file-${id}`);
    this.fileInput = p.createFileInput(this.load.bind(this));
    this.fileInput?.position(this.x, this.y);
    this.fileInput?.attribute("id", `file-${id}`);
    this.fileInput?.class("file");
    this.loop = false;
    this.recording = false;
    this.player = new Tone.Player().toDestination();
    this.id = id;
  }

  load(file: p5.File) {
    if (file.type === "audio") {
      this.player.load(file.data);
    }
  }

  play() {
    if (this.player.loaded) {
      this.player.start();
    }
  }

  async record(recorder: Tone.Recorder) {
    if (this.recording) {
      this.recording = false;
      const recorded = await recorder.stop();
      const url = URL.createObjectURL(recorded);
      this.player.load(url);
    } else {
      this.recording = true;
      recorder.start();
    }
  }

  stop() {}

  async contains(x: number, y: number, recorder: Tone.Recorder) {
    if (x > this.x && x < this.x + 50 && y > this.y + 60 && y < this.y + 110) {
      this.record(recorder);
    } else if (
      x > this.x &&
      x < this.x + 50 &&
      y > this.y + 120 &&
      y < this.y + 170
    ) {
      this.play();
    } else if (
      x > this.x &&
      x < this.x + 50 &&
      y > this.y + 180 &&
      y < this.y + 230
    ) {
      this.player.loop = !this.player.loop;
    }
  }

  display() {
    this.p.fill(255);
    if (this.recording) {
      this.p.fill(255, 0, 0);
    } else {
      this.p.fill(255);
    }
    this.p.ellipse(this.x + 25, this.y + 25 + 60, 50, 50);
    this.p.fill(0);
    if (this.recording) {
      this.p.text("Stop", this.x + 10, this.y + 80);
    } else {
      this.p.text("Rec", this.x + 10, this.y + 80);
    }

    if (this.player.loaded) {
      this.p.fill(255);
    } else {
      this.p.fill(200);
    }

    this.p.triangle(
      this.x,
      this.y + 120,
      this.x + 50,
      this.y + 120 + 25,
      this.x,
      this.y + 120 + 50
    );
    if (this.player.loaded) {
      this.p.fill(0);
    } else {
      this.p.fill(0, 100);
    }
    this.p.text("Play", this.x + 10, this.y + 140);

    if (this.player.loop) {
      this.p.fill(255, 255, 0);
    } else {
      this.p.fill(255);
    }
    this.p.rect(this.x, this.y + 180, 50, 50);
    this.p.fill(0);
    this.p.text("Loop", this.x + 10, this.y + 200);
  }
}

export default AudioBank;
