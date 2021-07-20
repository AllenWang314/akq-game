package packet

import (
	"encoding/json"
)

// Sent by clients after receiving the init packet. Identifies them to the
// server, and in turn other clients
type FinishPacket struct {
	BasePacket

	// Client attributes
	PlayerNumber int `json:"player_number,omitempty"`
	Slug string `json:"slug,omitempty"`
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