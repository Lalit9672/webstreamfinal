import React, { useRef } from "react";
import axios from "axios";
const LiveStream = () => {
  const myVideo = useRef();
  const init = () => {
    console.log("CALLED");

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        console.log("STREAM", stream);
        //     document.getElementById("myvideo").srcObject = stream;
        myVideo.current.srcObject = stream;
        const peer = createPeer();

        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      })
      .catch((err) => console.log("NOT ABLE TO ON CAMERA", err));
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection({
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
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
  };

  const handleNegotiationNeededEvent = async (peer) => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
      sdp: peer.localDescription,
    };

    const { data } = await axios.post(
      //"http://ec2-3-111-47-180.ap-south-1.compute.amazonaws.com:5000/broadcast",
      "http://localhost:5000/broadcast",
      payload
    );
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  };

  return (
    <div>
      <video ref={myVideo} autoPlay></video>
      <button onClick={() => init()}>Start Live</button>
    </div>
  );
};

export default LiveStream;
