import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
const ShowSteram = () => {
  const liveVideo = useRef();
  const [stream, setStream] = useState();
  const init = async () => {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" });
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
    peer.ontrack = handleTrackEvent;
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
      //"http://ec2-3-111-47-180.ap-south-1.compute.amazonaws.com:5000/consumer",
      "http://localhost:5000/consumer",
      payload
    );
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  };

  const handleTrackEvent = (e) => {
    setStream(e.streams[0]);
    console.log("STREAMS", e.streams[0]);
  };

  useEffect(() => {
    if (stream) {
      console.log("USEEFFECT", stream);

      liveVideo.current.srcObject = stream;
      liveVideo.current.play();
    }
  }, [stream]);
  return (
    <div id="champ">
      <video ref={liveVideo} autoPlay width={200} height={200}></video>
      <button onClick={() => init()}>Show Live</button>
    </div>
  );
};

export default ShowSteram;
