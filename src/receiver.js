import { dtmfFreqs, dtmfChars } from "./helpers";

export default class Receiver {
  constructor(options = {}) {
    this.options = options;
  }
  start(stream, cb) {
    if (this._timer || !cb) return;

    this.audioContext = new(window.AudioContext || window.webkitAudioContext);

    var src = this.audioContext.createMediaStreamSource(stream);
    var analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0;
    src.connect(analyser);

    var freqs = new Uint8Array(analyser.frequencyBinCount);
    var binWidthInHz = this.audioContext.sampleRate / freqs.length / 2;

    function findDtmfIndex(data, dtmfFreqs, binWidthInHz) {
      var max = 0;
      var index = -1;
      for (var i = 0; i < dtmfFreqs.length; i++) {
        var bin = Math.round(dtmfFreqs[i] / binWidthInHz);
        if (data[bin] > max) {
          max = data[bin];
          index = i;
        }
      }
      return index;
    }

    var last;
    var counter = 0;
    var duration = this.options.duration || 100;
    var step = this.options.step || 10;

    this._timer = setInterval(function () {
      analyser.getByteFrequencyData(freqs);
      var max = 0;
      for (var i = 0; i < freqs.length; i++) {
        if (freqs[i] > max) max = freqs[i];
      }
      var x = findDtmfIndex(freqs, dtmfFreqs[0], binWidthInHz);
      var y = findDtmfIndex(freqs, dtmfFreqs[1], binWidthInHz);
      if (x >= 0 && y >= 0) {
        var c = dtmfChars[x][y];
        if (last == c) {
          counter++;
          if (counter > step * 0.75) {
            cb(c);
            counter = 0;
          }
        } else {
          counter = 0;
        }
        last = c;
      }
    }, duration / step);
  }
  stop() {
    clearInterval(this._timer);
    this._timer = null;
    if (this.audioContext) {
      if (typeof this.audioContext.close === "function") {
        this.audioContext.close();
      }
      this.audioContext = null;
    }
  }
}
