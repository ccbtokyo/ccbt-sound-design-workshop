import "./style.css";
import p5 from "p5";
import * as Tone from "tone";
import AudioBank from "./AudioBank.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="sketch">
  </div>
`;

document.querySelector("button")?.addEventListener("click", async () => {
  await Tone.start();
  const sketch: HTMLDivElement =
    document.querySelector<HTMLDivElement>("#sketch")!;
  let audios: Array<AudioBank> = [];
  let mic: Tone.UserMedia;
  let recorder: Tone.Recorder;
  let analyser: Tone.Analyser;

  new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);

      mic = new Tone.UserMedia();
      mic.open();
      recorder = new Tone.Recorder();
      mic.connect(recorder);
      analyser = new Tone.Analyser("waveform", 512);
      Tone.Destination.connect(analyser);

      for (let i = 0; i < 6; i++) {
        audios.push(new AudioBank(p, 20 + i * 100, 100, i));
      }
    };

    p.draw = () => {
      if (!analyser) return;

      p.background(255);
      audios.forEach((audio) => {
        audio.display();
      });

      const values = analyser.getValue();
      p.noFill();
      p.beginShape();
      for (let i = 0; i < values.length; i++) {
        const amplitude: number | Float32Array = values[i];
        const x: number = p.map(i, 0, values.length - 1, 0, 600);
        const y: number = 400 / 2 + (amplitude as number) * 400 + 300;
        p.vertex(x, y);
      }
      p.endShape();
    };

    p.touchStarted = () => {
      audios.forEach((audio) => {
        audio.contains(p.mouseX, p.mouseY, recorder);
      });
    };
  }, sketch);
});
