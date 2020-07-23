package server

import (
	"fmt"
	"net/http"
	"strconv"

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

	// REST endpoints
	r := newRouter()
	http.Handle("/", r)

	addr := ":" + strconv.Itoa(port)

	// Start the server
	fmt.Println("Serving at", addr)
	err := http.ListenAndServe(addr, nil)

	if err != nil {
		fmt.Println("yeet")
		panic(err)
	}
}
