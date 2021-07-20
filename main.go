package main

import( 
    "fmt"
    "flag"
    "os"
    "strings"

    "github.com/AllenWang314/akq-game/config"
    "github.com/AllenWang314/akq-game/server"
    "github.com/AllenWang314/akq-game/db"
)

func main() {
    environment := flag.String("e", "prod", "")
    port :=  flag.Int("p", 8080, "")
    reset := flag.Bool("reset", false, "Resets the database")

    flag.Usage = func() {
		fmt.Println("Usage: server -e {mode} -p {port}")
		os.Exit(1)
	}

    flag.Parse()
  
    isProduction := strings.HasPrefix(*environment, "prod")
    config.Init(*environment)
    db.Init(*reset, isProduction)
    server.Init(*port, isProduction)
}
