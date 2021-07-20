package controllers

import (
	"net/http"

	"github.com/AllenWang314/akq-game/models"
	"github.com/AllenWang314/akq-game/db"

	"github.com/labstack/echo/v4"
)

type RoomController struct {}

// POST /rooms - creates a new room
func (r RoomController) CreateRoom(c echo.Context) error {
	// Create new room model, parse JSON body
	var room = new(models.Room)
	if err := c.Bind(room); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid json")
	}

	roomData := db.InsertRoom(room)

	return c.JSON(http.StatusOK, roomData)
}

// PUT /rooms/<room_id> - updates a room
func (r RoomController) UpdateRoom(c echo.Context) error {
	// Create new room model, parse JSON body
	var room = new(models.Room)
	if err := c.Bind(room); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid json")
	}	
	room.Slug = c.Param("slug")

	roomData := db.UpdateRoom(room)

	return c.JSON(http.StatusOK, roomData)
}

// PUT /rooms/<room_id> - increments number of clients in a room
func (r RoomController) IncrementClients(c echo.Context) error {
	// Create new room model, parse JSON body	
	slug := c.Param("slug")

	roomData := db.IncrementClients(slug)

	return c.JSON(http.StatusOK, roomData)
}

// GET /rooms/<room_id> - get an individual room
func (r RoomController) GetRoom(c echo.Context) error {
	// Get roomData from database
	roomData := db.GetRoom(c.Param("slug"))

	return c.JSON(http.StatusOK, roomData)
}

// DELETE /rooms/<room_id> - deletes an individual room
func (r RoomController) DeleteRoom(c echo.Context) error {
	// Get and delete roomData from database
	roomData := db.DeleteRoom(c.Param("slug"))

	return c.JSON(http.StatusOK, roomData)
}