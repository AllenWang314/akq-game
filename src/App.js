import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import axios from "axios";

import Room from "./Room";

import './App.css';

const api = "https://akq-game.herokuapp.com/api"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: null,
      modal: false,
    }
    this.createGame = this.createGame.bind(this)
  }

  createGame() {
    axios.post(api + "/rooms",
      { "num_clients": 0 },
      { headers: { "Access-Control-Allow-Origin": "*" }
    }).then((res) => {
      this.setState({
        redirect: "/room/" + res.data.slug
      });
    })
  }

  render() {
    return (
      <BrowserRouter>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
        <main className="content-container">
          <Switch>
            <Route path="/room/:id" component={Room} />
            <Route path="/fail" render={() => {}} />
            <Route path="/" render={() => {return (
              <div className="App">
                <header className="App-header">
                  <Button size="large" onClick = {this.createGame}>Create Game</Button> 
                </header>
              </div>
            );}} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
