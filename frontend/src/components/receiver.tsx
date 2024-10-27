import { useEffect, useRef } from "react"

export const Receiver = ()=>{
       const videoRef = useRef<HTMLVideoElement>(null);
       useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8000/ws")
        socket.onopen = ()=>{
           socket.send(JSON.stringify({wstype:'receiver'}))
            console.log("ws connecttion done")
        }
        startReceiving(socket)

       },[])

       function startReceiving(socket: WebSocket){
          if (!socket) {
            alert("Socket not found");
            return;
        }        

        const pc = new RTCPeerConnection();
        const video = document.createElement('video');
        document.body.appendChild(video);
        video.autoplay = true;
        video.muted = true;

        pc.ontrack = (event) => {
            console.log("Received track from sender");
            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([event.track]); // Attach the received stream to the video ref
            }
        }
        pc.oniceconnectionstatechange = () => {
            console.log("Receiver ICE Connection State:", pc.iceConnectionState);
        };

        socket.onmessage = async(event)=>{
            const message = JSON.parse(event.data);
            if (message.wstype == "createoffer"){
                console.log("Received SDP offer from sender");
                await pc.setRemoteDescription(message.sdp);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({"wstype": "createanswer", sdp: answer}));
            }else if (message.wstype === 'iceCandidate') {
                console.log("Adding ICE candidate (Receiver)");
                pc.addIceCandidate(message.candidate);
               
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate (Receiver)");
                socket.send(JSON.stringify({
                    wstype: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        }

       }
       return <div>
        <video ref={videoRef} autoPlay muted width="640" height="480"></video>
       </div>
}