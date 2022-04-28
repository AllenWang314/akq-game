package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/AllenWang314/akq-game/config"
	"github.com/AllenWang314/akq-game/db"
	"github.com/AllenWang314/akq-game/server"
)

func main() {
	environment := flag.String("e", "dev", "")
	config.Init(*environment)

	port := flag.Int("p", config.GetConfig().GetInt("server.addr"), "")
	reset := flag.Bool("reset", false, "Resets the database")

	flag.Usage = func() {
		fmt.Println("Usage: server -e {mode} -p {port}")
		os.Exit(1)
	}

	flag.Parse()

	isProduction := strings.HasPrefix(*environment, "prod")
	db.Init(*reset, isProduction)
	server.Init(*port, isProduction)
}
