package packet

import (
	"encoding/json"
)

// Sent by clients after receiving the init packet. Identifies them to the
// server, and in turn other clients
type JoinPacket struct {
	BasePacket

	// Player number: either 1 or 2
	PlayerNumber int `json:"player_number"`

	// room slug
	Slug string `json:"slug"`
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