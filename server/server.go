package server

import (
	"log"
	"net/http"
	// "strconv"
	// "strings"
	"os"
	// "path"

	"github.com/AllenWang314/akq-game/socket"
)

func Init(port int, isProduction bool) {
	hub := new(socket.Hub).Init()

	// Wait for socket messages
	go hub.Run()

	// REST endpoints
	r := newRouter()

	// check if dev or production
	if isProduction {
		mux := http.NewServeMux()
		mux.Handle("/", http.FileServer(http.Dir("build")))
		mux.Handle("/api/", r)
	
		// Websocket connection endpoint
		mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
			socket.ServeWs(hub, w, r)
		})
	
		addr := ":" + os.Getenv("PORT")
	
	
		// Start the server
		// fmt.Println("Serving at", addr)
		err := http.ListenAndServe(addr, mux)
	
		if err != nil {
			// fmt.Println("yeet")
			panic(err)
		}
    } else {
		// Websocket connection endpoint
		http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
			socket.ServeWs(hub, w, r)
		})

		// REST endpoints
		r := newRouter()
		http.Handle("/", r)

		// start server
		addr := ":" + os.Getenv("PORT")
		log.Println("Serving at", addr)
		err := http.ListenAndServe(addr, nil)

		if err != nil {
			log.Println("error in http listen and serve")
			panic(err)
		}
	}
}
