package models

import (
	"encoding/json"
)

type Room struct {
	Id int `json:"id"`
	Slug string `json:"slug"`
	NumClients int `json:"num_clients"`
}

func (r *Room) Init() *Room {
	return r
}

func (r Room) MarshalBinary() ([]byte, error) {
	return json.Marshal(r)
}

func (r Room) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, r)
}