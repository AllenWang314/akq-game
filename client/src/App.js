import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import axios from "axios";
import Room from "./Room";
import './App.css';

const API_URL = process.env.API_URL ?? "http://localhost:8080/api"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: null,
      modal: false,
    }
    this.createGame = this.createGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
  }

  createGame() {
    axios.post(API_URL + "/rooms",
      { "num_clients": 0 },
      { headers: { "Access-Control-Allow-Origin": "*" }
    }).then((res) => {
      this.setState({
        redirect: "/room/" + res.data.slug
      });
    })
  }

  joinGame() {
    let slug = prompt("Enter room code:")
    if (slug !== null) {
      this.setState({
        redirect: "/room/" + slug
      });
    } else {
      this.setState({
        redirect: "/"
      });
    }
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
                  <Button size="large" onClick = {this.joinGame}>Join Game</Button>
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
