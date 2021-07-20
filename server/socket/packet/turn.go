package packet

import (
	"encoding/json"
)

// Sent by clients after receiving the init packet. Identifies them to the
// server, and in turn other clients
type TurnPacket struct {
	BasePacket

	// Client attributes
	PlayerNumber int `json:"player_number,omitempty"`
	Slug string `json:"slug,omitempty"`

	Action string `json:"action,omitempty"`
}

func NewTurnPacket() *JoinPacket {
	p := new(JoinPacket)
	p.BasePacket = BasePacket{Type: "turn"}
	return p
}

func (p TurnPacket) MarshalBinary() ([]byte, error) {
	return json.Marshal(p)
}

func (p *TurnPacket) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, p)
}