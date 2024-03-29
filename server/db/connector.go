package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/AllenWang314/akq-game/config"
	"github.com/AllenWang314/akq-game/models"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

var (
	database *sql.DB
)

// Initial method that creates connection with database
func Init(reset bool, isProduction bool) {
	config := config.GetConfig()
	var psqlInfo string
	if isProduction {
		psqlInfo = fmt.Sprintf(
			"host=%s "+
				"port=%d "+
				"dbname=%s "+
				"password=%s"+
				"sslmode=%s ",
			config.Get("db.host"),
			config.GetInt("db.port"),
			config.Get("db.dbname"),
			config.Get("db.password"),
			config.Get("db.sslmode"),
		)
		// psqlInfo = config.GetString("db.uri")
	} else {
		psqlInfo = fmt.Sprintf(
			"host=%s "+
				"port=%d "+
				"dbname=%s "+
				"sslmode=%s ",
			config.Get("db.host"),
			config.GetInt("db.port"),
			config.Get("db.dbname"),
			config.Get("db.sslmode"),
		)
	}
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	database = db
	err = database.Ping()
	if err != nil {
		panic(err)
	}

	// if no error ping is successful
	log.Println("Ping to database successful, connection is up!")

	// drop and reset the database if prompted
	if reset {
		_, err := database.Exec(`DROP TABLE IF EXISTS rooms`)
		if err != nil {
			panic(err)
		}
		InitializeTable()
	}
}

// Initializes table in the database
func InitializeTable() {
	res, err := database.Exec("CREATE TABLE IF NOT EXISTS rooms (" +
		"id serial PRIMARY KEY, " +
		"slug text," +
		"num_clients integer)")
	if err != nil {
		log.Println("Error in InitializeTable of connector.go")
		panic(err)
	}
	log.Println(res)
}

// POST request for database
func InsertRoom(r *models.Room) (roomData *models.Room) {
	slug, _ := uuid.NewUUID()

	room := new(models.Room).Init()
	query := fmt.Sprintf(`INSERT INTO rooms (slug, num_clients) VALUES('%s', '%d') RETURNING *`,
		slug, r.NumClients)
	err := database.QueryRow(query).Scan(&room.Id, &room.Slug, &room.NumClients)

	if err != nil {
		log.Println("Error in InsertRoom of connector.go")
		panic(err)
	}

	return room
}

// DELETE request for database
func DeleteRoom(slug string) (roomData *models.Room) {
	room := new(models.Room).Init()
	query := fmt.Sprintf(`DELETE FROM rooms WHERE slug = '%s' RETURNING *`,
		slug)
	err := database.QueryRow(query).Scan(&room.Id, &room.Slug, &room.NumClients)

	if err != nil {
		log.Println("Error in DeleteRoom of connector.go")
		panic(err)
	}

	return room
}

// PUT request for database
func UpdateRoom(r *models.Room) (roomData *models.Room) {
	room := new(models.Room).Init()
	query := fmt.Sprintf(`UPDATE rooms SET num_clients = %d WHERE slug = '%s' RETURNING *`,
		r.NumClients, r.Slug)
	err := database.QueryRow(query).Scan(&room.Id, &room.Slug, &room.NumClients)

	if err != nil {
		log.Println("Error in UpdateRoom of connector.go")
		panic(err)
	}

	return room
}

// GET request for database
func GetRoom(slug string) (roomData *models.Room) {
	room := new(models.Room).Init()
	query := fmt.Sprintf(`SELECT * from rooms WHERE slug = '%s'`,
		slug)
	err := database.QueryRow(query).Scan(&room.Id, &room.Slug, &room.NumClients)

	if err != nil {
		log.Println("Error in GetRoom of connector.go")
		panic(err)
	}

	return room
}

// PUT request for incrementing numclients
func IncrementClients(slug string) (roomData *models.Room) {
	room := new(models.Room).Init()
	query := fmt.Sprintf(`UPDATE rooms SET num_clients = num_clients + 1 WHERE slug = '%s' RETURNING *`,
		slug)
	err := database.QueryRow(query).Scan(&room.Id, &room.Slug, &room.NumClients)

	if err != nil {
		log.Println("Error in IncrementClients of connector.go")
		panic(err)
	}

	return room
}
