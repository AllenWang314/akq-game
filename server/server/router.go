package server

import (
	"github.com/AllenWang314/akq-game/controllers"
	"github.com/AllenWang314/akq-game/socket"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func newRouter(hub *socket.Hub) *echo.Echo {
	e := echo.New()

	// Define middlewares
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Room controller
	room := new(controllers.RoomController)
	e.POST("/api/rooms", room.CreateRoom)
	e.GET("/api/rooms/:id", room.GetRoom)

	return e
}
