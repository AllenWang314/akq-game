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
	
	// Websocket connection endpoint
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		socket.ServeWs(hub, w, r)
	})

	// // REST endpoints
	r := newRouter()
	// http.Handle("/api", r)

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("build")))
	mux.Handle("/room/*", http.FileServer(http.Dir("build")))
	mux.Handle("/api/", r)

	addr := ":" + os.Getenv("PORT")


	// Start the server
	fmt.Println("Serving at", addr)
	err := http.ListenAndServe(addr, mux)

	if err != nil {
		fmt.Println("yeet")
		panic(err)
	}
}
