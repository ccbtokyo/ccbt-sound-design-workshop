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

  new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);

      mic = new Tone.UserMedia();
      mic.open();
      recorder = new Tone.Recorder();
      mic.connect(recorder);
      
      for (let i = 0; i < 6; i++) {
        audios.push(new AudioBank(p, 20 + i * 100, 100, i));
      }
    };

    p.draw = () => {
      p.background(255);
      audios.forEach((audio) => {
        audio.display();
      });
    };

    p.touchStarted = () => {
      audios.forEach((audio) => {
        audio.contains(p.mouseX, p.mouseY, recorder);
      });
    };
  }, sketch);
});
