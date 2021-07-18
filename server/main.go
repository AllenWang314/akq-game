package main

import( 
    "fmt"
    "flag"
    "os"

    "github.com/AllenWang314/akq-game/config"
    "github.com/AllenWang314/akq-game/server"
    "github.com/AllenWang314/akq-game/db"
)

func main() {
    environment := flag.String("e", "dev", "")
    port :=  flag.Int("p", 8080, "")
    reset := flag.Bool("reset", false, "Resets the database")

    flag.Usage = func() {
		fmt.Println("Usage: server -e {mode} -p {port}")
		os.Exit(1)
	}

    flag.Parse()
  
    config.Init(*environment)
    db.Init(*reset)
    server.Init(*port, *environment)
}
