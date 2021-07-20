package packet

import (
	"encoding/json"
)

// Sent by clients to indicate their turn action
type TurnPacket struct {
	BasePacket

	// Player number: either 1 or 2
	PlayerNumber int `json:"player_number"`

	// room slug
	Slug string `json:"slug"`

	// action taken by player 
	Action string `json:"action"`
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