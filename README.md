# akq-game
A multiplayer implementation of Caro's AKQ game in Golang and React; WebSocket, gorilla/socket, REST api. Try it out [here!](https://akq.allenwang314.com/)

## Background

This game was implemented as a tool during a talk at MathILy 2020. The talk was analyzing the strategies behind this game, and it provides a high-level overview of 
the mathematics behind poker and its variants. The game was originally introduced to me by Brian in MIT Poker club's new member education program. Some of the analysis can be found [here](https://web.mit.edu/willma/www/2013lec3.pdf). 

## Design and Features

The frontend of the game was written in React with most of the styling done with semantic ui. The game includes the following features:
- Create game and join game button on splash
- Help button on top right of page containing rules
- Live score keeping / chip counts
- Intuitive UI + Buttons

## Implementation
This app implements Mike Caro's AKQ game. The app is deployed at [https://akq.allenwang314.com/](https://akq.allenwang314.com/). There, you can create a game room and share the room's code with an opponent anywhere in the world to play against. Everything is done in real time with the help of WebSockets and gorilla/websocket. The backend has a rest api that helps it keep track of rooms and clients. It has a single database to keep track of the updates received via the api. On the frontend, I use axios to make the api calls and WebSocket to establish a connection.

## Serving static files through Go server
Originally, the app was designed to be sployed in two separate applications. However, later I started serving the frontend pages through the go server. This behavior 
can be found on the ```go-serve``` branch.

## Development
The important configs that must be changed for development is in config/base.json. There you should set the database settings. (Don't worry the old settings are expired)

## Deployment
To deploy to Heroku use the branch ```heroku-deploy```. The steps are as follows:

1. Make a Heroku app
2. Reset localhost:8000 to the deployment link in src/App.js and src/Room.js.
3. Configure the database credentials in config/base.json.
3. Run ```go build .``` and ```./akq-game -reset``` to initialize and reset the database
4. Run ```npm install``` followed by ```npm run-script build``` to create the build folder
5. Push to heroku to deploy!
