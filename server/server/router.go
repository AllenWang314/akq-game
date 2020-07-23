package server

import (
	"github.com/AllenWang314/akq-game/controllers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func newRouter() *echo.Echo {
	e := echo.New()

	// Define middlewares
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Room controller
	room := new(controllers.RoomController)
	e.POST("/api/rooms", room.CreateRoom)
	e.GET("/api/rooms/:slug", room.GetRoom)
	e.DELETE("/api/rooms/:slug", room.DeleteRoom)
	e.PUT("/api/rooms/:slug", room.UpdateRoom)
	e.PUT("/api/rooms/join/:slug", room.IncrementClients)

	return e
}
