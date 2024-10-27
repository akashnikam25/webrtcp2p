
# WebRTC Video Streaming Application

This project is a simple WebRTC application that allows for video streaming between a sender and a receiver using WebSocket for signaling.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Accessing the Application](#accessing-the-application)

## Technologies Used

- Go (Golang) for the backend signaling server
- React for the frontend
- WebRTC for peer-to-peer communication
- WebSocket for signaling


## Backend Setup

1. Ensure you have [Go](https://golang.org/doc/install) installed.
2. Navigate to the backend directory containing `main.go`.
3. Run the server with the following command:

   ```bash
   cd back-end
   go run main.go
   ```

## Frontend Setup

1. Make sure you have [Node.js](https://nodejs.org/) and npm installed.
2. Navigate to the frontend directory.
3. Install the dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

## Running the Application

1. Start the Go backend server.
2. Start the React frontend server.

## Accessing the Application

- To **send video**, go to [http://localhost:5173/sender](http://localhost:5173/sender) and click the "Send" button.
- To **receive video**, go to [http://localhost:5173/receiver](http://localhost:5173/receiver).

Make sure that both the sender and receiver are opened in different browser windows or tabs.

## Note

- Ensure that your browser allows access to the camera.
