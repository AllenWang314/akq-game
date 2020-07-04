package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/AllenWang314/akq-game/socket"
	"github.com/AllenWang314/akq-game/db"
)

func Init(port int) {
	hub := new(socket.Hub).Init()

	// Wait for socket messages
	go hub.Run()

	// Listen for events from clients
	go db.ListenForUpdates(hub.ProcessRedisMessage)

	// Websocket connection endpoint
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		socket.ServeWs(hub, w, r)
	})

	// REST endpoints
	r := newRouter(hub)
	http.Handle("/api", r)

	addr := ":" + strconv.Itoa(port)

	// Start the server
	fmt.Println("Serving at", addr)
	err := http.ListenAndServe(addr, nil)

	if err != nil {
		panic(err)
	}
}
