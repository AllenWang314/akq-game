
package controllers

import (
	"net/http"

	"github.com/AllenWang314/akq-game/models"
	// "github.com/AllenWang314/akq-game/db"

	"github.com/labstack/echo/v4"
)

type RoomController struct {}

// POST /rooms - creates a new room
func (r RoomController) CreateRoom(c echo.Context) error {
	// Create new room model, parse JSON body
	room := new(models.Room).Init()

	// write to database

	if err := c.Bind(room); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid json")
	}

	return c.JSON(http.StatusOK, room)
}

// GET /rooms/<room_id> - get an individual room
func (r RoomController) GetRoom(c echo.Context) error {
	// Fetch this room from Redis
	var room models.Room

	// read from database

	return c.JSON(http.StatusOK, room)
}