package packet

import (
	"encoding/json"
)

// Sent by clients after receiving the init packet. Identifies them to the
// server, and in turn other clients
type JoinPacket struct {
	BasePacket

	// Client attributes
	PlayerNumber int `json:"player_number,omitempty"`
	Slug string `json:"slug,omitempty"`
}

func NewJoinPacket() *JoinPacket {
	p := new(JoinPacket)
	p.BasePacket = BasePacket{Type: "join"}
	return p
}

func (p JoinPacket) MarshalBinary() ([]byte, error) {
	return json.Marshal(p)
}

func (p *JoinPacket) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, p)
}