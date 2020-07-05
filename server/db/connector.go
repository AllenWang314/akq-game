package db

import (
	"database/sql"
	"fmt"

	"github.com/AllenWang314/akq-game/config"
	"github.com/AllenWang314/akq-game/models"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

var (
	database *sql.DB
)

// Initial method taht creates connection with database
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
	// if no error ping is successful
	fmt.Println("Ping to database successful, connection is up!")

	// drop and reset the database if prompted
	if reset {
		_, err := database.Exec(`DROP TABLE rooms`)
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
		panic(err)
	}
	fmt.Println(res)
}

// POST request for database
func InsertRoom(r *models.Room) (roomData *models.Room) {
	slug, _ := uuid.NewUUID()

	room := new(models.Room).Init()
	query := fmt.Sprintf(`INSERT INTO rooms (slug, num_clients) VALUES('%s', '%d') RETURNING *`, 
		slug, r.NumClients)
	err := database.QueryRow(query).Scan(&room.Id, &room.Slug, &room.NumClients)

	if err != nil {
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
		panic(err)
	}

	return room
}

func ListenForUpdates(callback func(msg []byte)) {

	for {
		// something happens as database listens for updates from server?
	}
}