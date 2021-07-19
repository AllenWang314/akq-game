package server

import (
	"fmt"
	"net/http"
	"strconv"
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
		fmt.Println("hi")
		fs := http.FileServer(http.Dir("build"))

		mux := http.NewServeMux()
		mux.Handle("/api/", r)

		// Websocket connection endpoint
		mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
			socket.ServeWs(hub, w, r)
		})
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			// If the requested file exists then return if; otherwise return index.html (fileserver default page)
			if r.URL.Path != "/" {
				fullPath := "./build/" + strings.TrimPrefix(path.Clean(r.URL.Path), "/")
				fmt.Println(fullPath)
				_, err := os.Stat(fullPath)
				if err != nil {
					if !os.IsNotExist(err) {
						panic(err)
					}
					// Requested file does not exist so we return the default (resolves to index.html)
					r.URL.Path = "/"
				}
				fmt.Println("bleh")
				fmt.Println(r.URL.Path)
			}
			fs.ServeHTTP(w, r)
		})

		// start server
		addr := ":" + strconv.Itoa(port)
		fmt.Println("Serving at", addr)
		err := http.ListenAndServe(addr, mux)

		if err != nil {
			fmt.Println("error in http listen and serve")
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
		addr := ":" + strconv.Itoa(port)
		fmt.Println("Serving at", addr)
		err := http.ListenAndServe(addr, nil)

		if err != nil {
			fmt.Println("error in http listen and serve")
			panic(err)
		}
	}
}
