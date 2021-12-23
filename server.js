const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const webrtc = require("wrtc");

let senderStream;

//app.use(express.static("public"));
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("frontend/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
//   });
// }

app.use(express.json());
app.use(cors({ origin: "*" }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("frontend/build"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

app.post("/consumer", async ({ body }, res) => {
  console.log("SENDER STREAM", senderStream);
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        // urls: "stun:stun.stunprotocol.org",
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  });
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  if (senderStream) {
    senderStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, senderStream));
  }

  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };

  res.json(payload);
});

app.post("/broadcast", async ({ body }, res) => {
  console.log("CALLED", body);
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  });
  peer.ontrack = (e) => handleTrackEvent(e, peer);
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };

  res.json(payload);
});

function handleTrackEvent(e, peer) {
  senderStream = e.streams[0];
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server started"));
