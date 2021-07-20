package server

import (
	"log"
	"net/http"
	// "strconv"
	"strings"
	"os"
	"path"

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
        // frontend build
		fs := http.FileServer(http.Dir("./build"))

		mux := http.NewServeMux()
		mux.Handle("/", http.FileServer(http.Dir("build")))
		mux.Handle("/api/", r)

		// Websocket connection endpoint
		mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
			socket.ServeWs(hub, w, r)
		})
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			// If the requested file exists then return if; otherwise return index.html (fileserver default page)
			log.Println(r.URL.Path)
			if r.URL.Path != "/" {
				fullPath := "./build/" + strings.TrimPrefix(path.Clean(r.URL.Path), "/")
				_, err := os.Stat(fullPath)
				if err != nil {
					if !os.IsNotExist(err) {
						panic(err)
					}
					// Requested file does not exist so we return the default (resolves to index.html)
					r.URL.Path = "/"
				}
			}
			log.Println(r.URL.Path)
			fs.ServeHTTP(w, r)
		})

		// start server
		addr := ":" + os.Getenv("PORT")
		log.Println("Serving at", addr)
		err := http.ListenAndServe(addr, mux)

		if err != nil {
			log.Println("error in http listen and serve")
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
