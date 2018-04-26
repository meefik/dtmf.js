import { dtmfFreqs, dtmfChars } from "./helpers";

export default class Sender {
  constructor(options = {}) {
    var audioContext = new(window.AudioContext || window.webkitAudioContext);
    var grid = [];
    for (var i = 0; i < dtmfFreqs[0].length; i++) {
      var row = [];
      var freq1 = dtmfFreqs[0][i];
      for (var j = 0; j < dtmfFreqs[1].length; j++) {
        var freq2 = dtmfFreqs[1][j];
        var button = {};
        button.gain1 = audioContext.createGain();
        button.gain1.gain.value = 0.0;
        button.gain1.connect(audioContext.destination);

        button.osc1 = audioContext.createOscillator();
        button.osc1.type = "sine";
        button.osc1.frequency.value = freq1;
        button.osc1.connect(button.gain1);

        button.osc2 = audioContext.createOscillator();
        button.osc2.type = "sine";
        button.osc2.frequency.value = freq2;
        button.osc2.connect(button.gain1);

        button.osc1.start(0);
        button.osc2.start(0);

        row.push(button);
      }
      grid.push(row);
    }
    this.options = options;
    this.audioContext = audioContext;
    this.grid = grid;
  }
  play(str, cb) {
    if (!cb) cb = function () {};
    if (!str) return cb();
    var seq = str.split("");
    var grid = this.grid;
    var duration = this.options.duration || 100;
    var pause = this.options.pause || 40;
    var doPlay = function () {
      var char = seq.shift();
      if (!char) return cb();
      var i, j;
      loop1:
      for (i = 0; i < dtmfChars.length; i++) {
        for (j = 0; j < dtmfChars[i].length; j++) {
          if (dtmfChars[i][j] == char) break loop1;
        }
      }
      var button = grid[i][j];
      if (button) {
        button.gain1.gain.value = 1.0;
        setTimeout(function () {
          button.gain1.gain.value = 0.0;
          setTimeout(doPlay, pause);
        }, duration);
      } else {
        return cb();
      }
    };
    doPlay();
  }
  destory() {
    if (this.audioContext) {
      if (typeof this.audioContext.close === "function") {
        this.audioContext.close();
      }
      this.audioContext = null;
    }
  }
}
