import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import axios from "axios";
import Room from "./Room";
import './App.css';
import akq_image from './akq_image.png';
import { Icon } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import { Rules } from "./Rules";

const API_URL = process.env.API_URL ?? "http://localhost:8080/api"

export const App = () => {

  const [redirect, setRedirect] = useState(null)
  // const [modal, setModal] = useState(false)

  const createGame = () => {
    axios.post(API_URL + "/rooms",
      { "num_clients": 0 },
      {
        headers: { "Access-Control-Allow-Origin": "*" }
      }).then(res => {
        setRedirect("/room/" + res.data.slug)
      })
  }

  const joinGame = () => {
    let slug = prompt("Enter room code:")
    if (slug !== null) {
      setRedirect("/room/" + slug)
    } else {
      setRedirect("/")
    }
  }

  return (
    <BrowserRouter>
      {redirect && <Redirect to={redirect} />}
      <main className="content-container">
        <Switch>
          <Route path="/room/:id" component={Room} />
          <Route path="/fail" render={() => { }} />
          <Route path="/" render={() => {
            return (
              <div className="App">
                <header className="App-header">
                  <div className="menu" id="navbar">
                  <div className="nav-menu">
                        <div id="home-nav">
                            <NavLink to="/" style = {{color: "white"}}> <Icon name='home'/> </NavLink>
                        </div>
                        <div id = "rule-nav">
                            <Rules />
                        </div>
                    </div>
                  </div>
                  <div>
                    <h1>AKQ</h1>
                    <h2>A 2-player, 3-card, betting game</h2>
                  </div>
                    <img className="akq-image" src={akq_image} alt=""/>
                  <div className="directions">
                    The AKQ game is a game that involves a deck containing exactly three cards the ace (A), the king (K), and the queen (Q). To learn the rules, click the question mark icon. To return to this page, click the home icon. To begin game play, create a game below and share the game code or link with another player. To join a game, click the join game button.
                  </div>
                  <div className="home-buttons">
                    <div className = "flex-button">
                      <Button size="large" onClick={createGame}>Create Game</Button>
                    </div>
                    <div className = "flex-button">
                      <Button size="large" onClick={joinGame}>Join Game</Button>
                    </div>
                  </div>
                </header>
              </div>
            );
          }} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
