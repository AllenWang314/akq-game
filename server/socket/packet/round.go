package packet

import (
	"encoding/json"
	"math/rand"
    "time"
)

// Sent by clients to signal beginning of new round
type RoundPacket struct {
	BasePacket

	// Player number: either 1 or 2
	PlayerNumber int `json:"player_number"`

	// room slug
	Slug string `json:"slug"`

	// whether generated card values are Valid
	Valid bool `json:"valid"`

	// Player 1's card: 0, 1, or 2
	Player1Card int `json:"player_1_card"`

	// Player 2's card: 0, 1, or 2
	Player2Card int `json:"player_2_card"`
}

func (p *RoundPacket) GenerateCard() {
	if p.PlayerNumber != 2 {
		p.Valid = false;
	} else {
		p.Valid = true;
		rand.Seed(time.Now().UnixNano())
		p1 := rand.Intn(3)
		p2 := (p1 + 1 + rand.Intn(2)) % 3
		p.Player1Card = p1
		p.Player2Card = p2
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