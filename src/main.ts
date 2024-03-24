import "./style.css";
import p5 from "p5";
import * as Tone from "tone";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="sketch">
  </div>
`;

const sketch: HTMLDivElement =
  document.querySelector<HTMLDivElement>("#sketch")!;

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);

    let startButton: p5.Element = p.createButton("Start");
    startButton.position(20, 20);
    startButton.mousePressed(() => {
      if (mic === undefined) {
        mic = new Tone.UserMedia();
        mic.open();
        recorder = new Tone.Recorder();
        mic.connect(recorder);
        createButtons();
      }
    });

    let mic: Tone.UserMedia;
    let recorder: Tone.Recorder;
    let isRecordings: Array<boolean> = [
      false,
      false,
      false,
      false,
      false,
      false,
    ];
    let audios: Array<Tone.Player> = [];
    let isLoops: Array<boolean> = [false, false, false, false, false, false];

    const createButtons = () => {
      for (let i = 0; i < 6; i++) {
        let recButton: p5.Element = p.createButton("Rec");
        recButton.position(20 + i * 100, 60);
        recButton.mousePressed(async () => {
          if (isRecordings[i]) {
            isRecordings[i] = false;
            const recording = await recorder.stop();
            const url = URL.createObjectURL(recording);
            audios[i] = new Tone.Player(url).toDestination();
            recButton.elt.textContent = "Rec";
          } else {
            isRecordings[i] = true;
            recorder.start();
            recButton.elt.textContent = "Stop";
          }
        });

        let playButton: p5.Element = p.createButton("Play");
        playButton.position(20 + i * 100, 100);
        playButton.mousePressed(() => {
          if (audios[i] !== undefined) {
            audios[i].start();
          }
        });

        let loopButton: p5.Element = p.createButton("Noloop");
        loopButton.position(20 + i * 100, 140);
        loopButton.mousePressed(() => {
          isLoops[i] = !isLoops[i];
          audios[i].loop = isLoops[i];
          if (isLoops[i]) {
            loopButton.elt.textContent = "Loop";
          } else {
            loopButton.elt.textContent = "Noloop";
          }
        });
      }
    };
  };
  p.draw = () => {
    p.background(255);
  };
}, sketch);
