## DTMF Tone Generator and Receiver

Library for sending and receive DTMF codes.

### Usage

Receiver

```js
var receiver = new DTMF.Receiver({ duration: 100, step: 10 });

// for capture an audio you need to use localhost or HTTPS
navigator.getUserMedia({
  audio: true
}, function(stream) {
  receiver.start(stream, function(char) {
    console.log(char);
  });
}, function(e) {
  alert('Cannot access audio stream.');
  console.log(e);
});

// for stop listening
// receiver.stop();
```

Sender

```js
var sender = new DTMF.Sender({ duration: 100, pause: 40 });
sender.play('1234567890ABCD#*');

// for destroy sender instance
// sender.destroy();
```

See this video: https://youtu.be/OS6yIiq_Cp8
