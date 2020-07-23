import React, { Component } from 'react';
import { Button, Modal, Header, Dimmer, Loader } from 'semantic-ui-react';
import axios from "axios";

import Rules from "./Rules";

import './App.css';

const api = "http://localhost:8080/api/"

class Room extends Component {
    constructor(props) {
        super(props);
        const slug = this.props.match.params.id;
        this.state = {
            slug: slug,
            // gameState information
            // 0 means waiting for player to join
            // 1 means player 1's turn
            // 2 means player 2's turn
            // 3 means final result displayed + update score + next round button appears
            // 4 is waiting page for both players to hit next round
            gameState: 0,
            turn: false,
            playerNumber: 0,
            myScore: 100,
            opponentScore: 100,
            myCard: "",
            opponentCard: "",
            roundNumber: 0,
            modal: true,
            myAction: "",
            opponentAction: "",
            winner: 0,
            pot: 0,
            rules: false,
        }
        this.message = this.message.bind(this)
        this.buttonPanel = this.buttonPanel.bind(this)
        this.score = this.score.bind(this)
        this.join = this.join.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
        this.handleJoin = this.handleJoin.bind(this)
        this.handleTurn = this.handleTurn.bind(this)
        this.handleCards = this.handleCards.bind(this)
        this.nextRound = this.nextRound.bind(this)
        this.move = this.move.bind(this)
        this.finishRound = this.finishRound.bind(this)
    }

    componentDidMount() {
        this.conn = new WebSocket('ws://localhost:8080/ws');
        this.conn.onmessage = (message) => {
            this.handleMessage(JSON.parse(message.data));
        };
    }

    handleMessage(message) {
        // filter messages only relevant to current room
        if (message.slug === this.state.slug) {
            if (message.type === "join") this.handleJoin(message.player_number);
            else if (message.type === "turn") this.handleTurn(message.player_number, message.action);
            else if (message.type === "round" && message.player_number === 2) this.handleCards(message);
            else console.log("invalid message")
        }
    }

    handleCards(message) {
        if (this.state.roundNumber === 0) {
            if (this.state.playerNumber === 1) {
                this.setState({
                    roundNumber: 1,
                    myCard: message.Player1Card,
                    opponentCard: message.Player2Card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                })
            } else {
                this.setState({
                    roundNumber: 1,
                    myCard: message.Player2Card,
                    opponentCard: message.Player1Card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                })
            }
        } else {
            if (this.state.playerNumber === 1) {
                this.setState({
                    roundNumber: this.state.roundNumber,
                    playerNumber: this.state.playerNumber % 2 + 1,
                    myCard: message.Player2Card,
                    opponentCard: message.Player1Card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                })
            } else {
                this.setState({
                    roundNumber: this.state.roundNumber,
                    playerNumber: this.state.playerNumber % 2 + 1,
                    myCard: message.Player1Card,
                    opponentCard: message.Player2Card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                })
            }
        }
    }

    handleJoin(playerNumber) {
        if (playerNumber === 2) {
            this.nextRound()
        }
    }

    handleTurn(playerNumber, action) {
        if (this.state.playerNumber === 1) {
            if (playerNumber === 1) {
                this.setState({
                    gameState: 2,
                    myAction: action,
                })
            } else if (playerNumber === 2) {
                this.setState({
                    gameState: 3,
                    opponentAction: action,
                })
            }
        } else if (this.state.playerNumber === 2) {
            if (playerNumber === 1) {
                this.setState({
                    gameState: 2,
                    opponentAction: action,
                })
            } else if (playerNumber === 2) {
                this.setState({
                    gameState: 3,
                    myAction: action,
                })
            }
        }
    }

    nextRound() {
        let roundPacket = {
            type: 'round',
            player_number: this.state.playerNumber,
            slug: this.state.slug
        };

        // Connected to remote
        this.conn.send(JSON.stringify(roundPacket));
    }

    finishRound() {

    }

    join() {
        axios.put(api + "rooms/join/" + this.state.slug,
            {},
            {
                headers: { "Access-Control-Allow-Origin": "*" }
            }).then((res) => {
                let joinPacket = {
                    type: 'join',
                    player_number: res.data.num_clients,
                    slug: this.state.slug
                };

                // Connected to remote
                this.conn.send(JSON.stringify(joinPacket));

                this.setState({
                    playerNumber: res.data.num_clients,
                    modal: false
                })
            })
    }

    move(action) {
        let turnPacket = {
            type: 'turn',
            player_number: this.state.playerNumber,
            slug: this.state.slug,
            action: action
        };

        // Connected to remote
        this.conn.send(JSON.stringify(turnPacket));
        this.setState({
            gameState: this.state.gameState + 1
        })
    }

    // a lot of changing
    message() {
        if (this.state.myCard === "") {
            return (
                <div />
            )
        } else {
            return (
                <div className="message">
                    Round {this.state.roundNumber}: You have been dealt {this.state.myCard}
                </div>
            )
        }
    }

    result() {
        if (this.state.playerNumber === 1 || this.state.playerNumber === 2) {
            return (
                <div className="button-panel">
                    Results:
                    Your card: {this.state.myCard}
                    Opponent's card: {this.state.opponentCard}
                    Your action: {this.state.myAction}
                    Opponent's action: {this.state.opponentAction}
                    You win {(this.state.winner === this.state.playerNumber)? this.state.pot : 0}
                    <div className="column"><Button onClick={() => { this.finishRound }}>Next Round</Button></div>
                </div>
            )
        } else {
            return (
                <div />
            )
        }
        
    }

    buttonPanel() {
        if (this.state.gameState === 3) {
            return this.result()
        }
        if (this.state.playerNumber === 1) {
            if (this.state.gameState === 1) {
                return (
                    <div className="button-panel">
                        <div className="column"><Button onClick={() => { this.move('pass') }}>Pass</Button></div>
                        <div className="column"><Button color="yellow" onClick={() => { this.move('raise') }}>Raise</Button></div>
                    </div>
                )
            } else if (this.state.gameState === 2) {
                return (
                    <div className="message">
                        Action taken: {this.state.myAction}. Waiting for opponent...
                    </div>
                )
            } else {
                return (
                    <div className="message">
                        Waiting for opponent...
                    </div>
                )
            }
        } else if (this.state.playerNumber === 2) {
            if (this.state.gameState === 2) {
                return (
                    <div>
                        <div className="message"> Opponent chose to {this.state.opponentAction} </div>
                        <div className="button-panel">
                            <div className="column"><Button color="red" onClick={() => { this.move('give up') }}>Give up</Button></div>
                            <div className="column"><Button color="green" onClick={() => { this.move('match') }}>Match</Button></div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="message">
                        Waiting for opponent...
                    </div>
                )
            }
        } else {
            return (
                <div />
            )
        }
    }

    score() {
        if (this.state.playerNumber === 1 || this.state.playerNumber === 2) {
            return (
                <div className="message">
                    <div className="score">
                        Your score: {this.state.myScore}
                    </div>
                    <div className="score">
                        Opponent's score: {this.state.opponentScore}
                    </div>
                </div>
            )
        } else if (this.state.playerNumber === 0) {
            return (
                <div style={{ display: this.state.modal ? "none" : "block" }}>
                    <Dimmer active>
                        <Loader />
                    </Dimmer>
                Loading ...
                </div>
            )
        } else {
            return (
                <div>
                    Room at capacity. Please create another game.
                </div>
            )
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="menu" id="navbar">
                        <Rules />
                    </div>
                    {this.message()}
                    {this.buttonPanel()}
                    {this.score()}
                </header>
                <Modal
                    size='small'
                    closeOnDimmerClick={false}
                    open={this.state.modal}
                >
                    <Header icon='gamepad' content='Join Game' />
                    <Modal.Content>
                        <div className="modal-content">
                            <p>
                                Welcome to the AKQ game! There may be some bugs here or there,
                                so below are some tips to help guide you:
                            </p>

                            <ul>
                                <li>On the top of the page, there will be a guide
                                containing the rules should you need it. </li>
                                <li> Only share the link with one other person. </li>
                                <li>Never refresh or press back; all progress will be lost. </li>
                                <li> There may be lag at time so please be patient. </li>
                                <li> Since it costs 1 to play, 1 is deducted from both player's scores at the start of each round. </li>
                                <li>The player going first sees the following buttons: </li>
                                <div className="button-panel">
                                    <div className="column"><Button>Pass</Button></div>
                                    <div className="column"><Button color="yellow">Raise</Button></div>
                                </div>
                                <li>The player going second sees the following buttons:</li>
                                <div className="button-panel">
                                    <div className="column"><Button color="red">Give up</Button></div>
                                    <div className="column"><Button color="green">Match</Button></div>
                                </div>
                            </ul>
                        </div>

                    </Modal.Content>
                    <Modal.Actions>

                        <Button color='purple' onClick={this.join}>
                            Join
                </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default Room;
