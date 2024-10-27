import { useEffect, useState, useRef } from "react"

export const Sender = ()=>{
       const [socket, setSocket] = useState<WebSocket | null>(null);;
        const videoRef = useRef<HTMLVideoElement>(null);

       useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8000/ws")
        socket.onopen = ()=>{
           socket.send(JSON.stringify({wstype:'sender'}))
           console.log("WebSocket connection established (Sender)");
        }
        setSocket(socket)
       },[])

       async function sendVideo(){
        if (!socket) {
            alert("Socket not found");
            return;
        }

        const pc = new RTCPeerConnection();
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.wstype === 'createanswer') {
                console.log("Received SDP answer from Receiver");
                await pc.setRemoteDescription(message.sdp);
            } else if (message.wstype === 'iceCandidate') {
                console.log("Adding ICE candidate (Sender)");
                pc.addIceCandidate(message.candidate);
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Sending ICE candidate (Sender)");
                socket.send(JSON.stringify({
                    wstype: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        }

        pc.oniceconnectionstatechange = () => {
            console.log("Sender ICE Connection State:", pc.iceConnectionState);
        };
        

        pc.onnegotiationneeded = async ()=>{
              console.log("Creating offer and setting local description");
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              socket?.send(JSON.stringify({
                     wstype:"createoffer",
                     sdp:offer
              }))
        }

    
       getCameraStreamAndSend(pc);
      }
       const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
        console.log("inside getCameraStreamAndSend")
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream; // Attach the received stream to the video ref
            }
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
        });
       }

       return <div>
               <video ref={videoRef} autoPlay muted width="640" height="480"></video>
              <button onClick={sendVideo}>send</button>
       </div>
}