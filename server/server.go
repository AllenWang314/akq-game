package server

import (
	"fmt"
	"net/http"
	"os"

	"github.com/AllenWang314/akq-game/socket"
)

func Init(port int) {
	hub := new(socket.Hub).Init()

	// Wait for socket messages
	go hub.Run()

	// // REST endpoints
	r := newRouter()
	// http.Handle("/api", r)

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("build")))
	mux.Handle("/api/", r)

	// Websocket connection endpoint
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		socket.ServeWs(hub, w, r)
	})

	addr := ":" + os.Getenv("PORT")


	// Start the server
	fmt.Println("Serving at", addr)
	err := http.ListenAndServe(addr, mux)

	if err != nil {
		fmt.Println("yeet")
		panic(err)
	}
}
