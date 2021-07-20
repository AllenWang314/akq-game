package packet

import (
	"encoding/json"
)

// Sent by clients after confirming finishing the round
type FinishPacket struct {
	BasePacket

	// Player number: either 1 or 2
	PlayerNumber int `json:"player_number"`

	// room slug
	Slug string `json:"slug"`
}

func NewFinishPacket() *FinishPacket {
	p := new(FinishPacket)
	p.BasePacket = BasePacket{Type: "finish"}
	return p
}

func (p FinishPacket) MarshalBinary() ([]byte, error) {
	return json.Marshal(p)
}

func (p *FinishPacket) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, p)
}