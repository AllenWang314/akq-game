package packet

import (
	"encoding/json"
	"math/rand"
    "time"
)

// Sent by clients to signal beginning of new round
type RoundPacket struct {
	BasePacket

	// Client attributes
	PlayerNumber int `json:"player_number,omitempty"`
	Slug string `json:"slug,omitempty"`

	Valid bool
	Player1Card string
	Player2Card string

}

func (p *RoundPacket) GenerateCard() {
	arr := []string{"A", "K", "Q"}
	if p.PlayerNumber != 2 {
		p.Valid = false;
	} else {
		p.Valid = true;
		rand.Seed(time.Now().UnixNano())
		p1 := rand.Intn(3)
		p2 := (p1 + 1 + rand.Intn(1)) % 3
		p.Player1Card = arr[p1]
		p.Player2Card = arr[p2]
	}
}

func NewRoundPacket() *RoundPacket {
	p := new(RoundPacket)
	p.BasePacket = BasePacket{Type: "round"}
	return p
}

func (p RoundPacket) MarshalBinary() ([]byte, error) {
	return json.Marshal(p)
}

func (p *RoundPacket) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, p)
}