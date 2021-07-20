package socket

import (
	"github.com/google/uuid"

	"github.com/gorilla/websocket"
)

// Client is a type that reads and writes on sockets.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	// ID uniquely identifying this client
	id string

	// slug room that client belongs in
	slug string
}

func NewClient(hub *Hub, conn *websocket.Conn) *Client {
	c := new(Client)
	c.hub = hub
	c.conn = conn
	c.send = make(chan []byte, 256)
	c.id = uuid.New().String()
	c.slug = ""
	return c
}