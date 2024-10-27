package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v4"
)

type wsData struct {
	Wstype    string                     `json:"wstype"`
	SDP       *webrtc.SessionDescription `json:"sdp,omitempty"`
	Candidate *webrtc.ICECandidateInit   `json:"candidate,omitempty"`
}

// Store connected clients (Sender and Receiver)
var clients = make(map[string]*websocket.Conn)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var (
	senderSocket   *websocket.Conn = nil
	receiverSocket *websocket.Conn = nil
)

func httphandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	fmt.Println("new client is conncted with remote addr:	", conn.RemoteAddr())

	for {
		var msg wsData
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}
		var clientType string
		switch msg.Wstype {
		case "sender":
			clients["sender"] = conn
			clientType = "sender"
		case "receiver":
			clients["receiver"] = conn
			clientType = "receiver"
		case "createoffer", "iceCandidate":
			clientType = "receiver"
			forwardMessage(clientType, msg)
		case "createanswer":
			clientType = "sender"
			forwardMessage(clientType, msg)
		}
	}

}

func forwardMessage(clientType string, msg wsData) {
	fmt.Println("wsdata type", msg.Wstype, "target ", clientType)
	if conn, ok := clients[clientType]; ok {
		err := conn.WriteJSON(msg)
		if err != nil {
			fmt.Printf("Error forwarding to %s: %v\n", clientType, err)
		}
	}
}

func main() {
	http.HandleFunc("/ws", httphandler)
	str := ":8000"
	err := http.ListenAndServe(str, nil)
	if err != nil {
		fmt.Println(err)
	}
}
