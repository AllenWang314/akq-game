package db

import (
	"database/sql"
	"fmt"

	"github.com/AllenWang314/akq-game/config"

	_ "github.com/lib/pq"

)

var (
	database *sql.DB;
)

func Init(reset bool) {
	config := config.GetConfig()

	db, err := sql.Open("postgres", config.GetString("db.uri"))
	if err != nil {
		panic(err)
	}

	database = db

	err = database.Ping()

	if err != nil {
		panic(err)
	}

	// if no error. Ping is successful
	fmt.Println("Ping to database successful, connection is still alive")

	database.Exec(`
	CREATE TABLE IF NOT EXISTS rooms (
		id serial PRIMARY KEY
	)`)

	if reset {
		// find someway to kill all tables in database
	}
}

func GetDatabase() *sql.DB {
	return database
}

func ListenForUpdates(callback func(msg []byte)) {

	for {
		// something happens as database listens for updates from server?
	}
}