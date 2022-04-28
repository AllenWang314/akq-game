import React, { Component } from 'react';
import { Button, Modal, Header, Dimmer, Loader } from 'semantic-ui-react';
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './App.css';
import { Icon } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import { Rules } from "./Rules";

const cards = ["A", "K", "Q"]
const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:8080/api"
const WEBSOCKET = process.env.REACT_APP_WEBSOCKET ?? "ws://localhost:8080/ws"

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
            playerNumber: 0,
            myScore: 100,
            opponentScore: 100,
            myCard: -1,
            opponentCard: "",
            roundNumber: 0,
            modal: true,
            myAction: "",
            opponentAction: "",
            winner: 0,
            pot: 0,
            rules: false,
            finish: 0,
            waiting: false,
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
        this.conn = new WebSocket(WEBSOCKET);
        this.conn.onmessage = (message) => {
            const messageArray = message.data.split("\n");
            for (const messageData of messageArray) {
                console.log(messageData)
                this.handleMessage(JSON.parse(messageData));
            }
        };
    }

    handleMessage(message) {
        // filter messages only relevant to current room
        if (message.slug === this.state.slug) {
            if (message.type === "join") this.handleJoin(message.player_number);
            else if (message.type === "turn") this.handleTurn(message.player_number, message.action);
            else if (message.type === "round" && message.valid) this.handleCards(message);
            else if (message.type === "finish") this.handleFinish(message);
        }
    }

    handleFinish(message) {
        if (this.state.finish + message.player_number === 3) {
            this.nextRound();
        } else{
            this.setState({
                opponentScore: (this.state.winner !== this.state.playerNumber)? this.state.opponentScore + this.state.pot : this.state.opponentScore,
                myScore: (this.state.winner === this.state.playerNumber)? this.state.myScore + this.state.pot : this.state.myScore,
                finish: message.player_number,
            });   
        }
    }

    handleCards(message) {
        if (this.state.roundNumber === 0) {
            if (this.state.playerNumber === 1) {
                this.setState({
                    roundNumber: 1,
                    myCard: message.player_1_card,
                    opponentCard: message.player_2_card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                    finish:0,
                    waiting: false,
                    winner:0,
                })
            } else {
                this.setState({
                    roundNumber: 1,
                    myCard: message.player_2_card,
                    opponentCard: message.player_1_card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                    finish:0,
                    waiting: false,
                    winner:0,
                })
            }
        } else {
            if (this.state.playerNumber === 1) {
                this.setState({
                    roundNumber: this.state.roundNumber + 1,
                    playerNumber: this.state.playerNumber % 2 + 1,
                    myCard: message.player_2_card,
                    opponentCard: message.player_1_card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                    finish:0,
                    waiting: false,
                    winner:0,
                })
            } else {
                this.setState({
                    roundNumber: this.state.roundNumber + 1,
                    playerNumber: this.state.playerNumber % 2 + 1,
                    myCard: message.player_1_card,
                    opponentCard: message.player_2_card,
                    gameState: 1,
                    myAction: "",
                    opponentAction: "",
                    myScore: this.state.myScore - 1,
                    opponentScore: this.state.opponentScore -1,
                    pot: 2,
                    finish:0,
                    waiting: false,
                    winner:0,
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
                    pot: (action === "raise")? this.state.pot + 1 : this.state.pot,
                    myScore: (action === "raise")? this.state.myScore - 1 : this.state.myScore,
                })
            } else if (playerNumber === 2) {
                this.setState({
                    gameState: 3,
                    opponentAction: action,
                    opponentScore: (action === "match" && this.state.pot === 3)? this.state.opponentScore - 1 : this.state.opponentScore,
                    pot: (action === "match" && this.state.pot === 3)? this.state.pot + 1 : this.state.pot,
                    winner: (this.state.myCard < this.state.opponentCard || action === "give up") ? 1 : 2
                })
            }
        } else if (this.state.playerNumber === 2) {
            if (playerNumber === 1) {
                this.setState({
                    gameState: 2,
                    opponentAction: action,
                    opponentScore: (action === "raise")? this.state.opponentScore - 1 : this.state.opponentScore,
                    pot: (action === "raise")? this.state.pot + 1 : this.state.pot,
                })
            } else if (playerNumber === 2) {
                this.setState({
                    gameState: 3,
                    myAction: action,
                    myScore: (action === "match" && this.state.pot === 3)? this.state.myScore - 1 : this.state.myScore,
                    pot: (action === "match" && this.state.pot === 3)? this.state.pot + 1 : this.state.pot,
                    winner: (this.state.myCard > this.state.opponentCard || action === "give up") ? 1 : 2
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
        let finishPacket = {
            type: 'finish',
            player_number: this.state.playerNumber,
            slug: this.state.slug
        };

        // Connected to remote
        this.conn.send(JSON.stringify(finishPacket));
        this.setState({
            waiting: true
        })
    }

    join() {
        axios.put(API_URL + "/rooms/join/" + this.state.slug,
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

    message() {
        if (this.state.myCard === -1 || this.state.waiting) {
            return (
                <div />
            )
        } else {
            return (
                <div className="round">
                    Round {this.state.roundNumber}: You have been dealt {cards[this.state.myCard]}
                </div>
            )
        }
    }

    result() {
        if (this.state.playerNumber === 1 || this.state.playerNumber === 2) {
            return (
                <div className="result">
                    <div className="result-header">Results:</div>
                    <div className="result-bit">Your card: {cards[this.state.myCard]}, Opponent's card: {cards[this.state.opponentCard]}</div>
                    <div className="result-bit">Your action: {this.state.myAction}, Opponent's action: {this.state.opponentAction}</div>
                    <div className="result-bit">You win {(this.state.winner === this.state.playerNumber)? this.state.pot : 0}</div>
                    <div className="finish-button"><Button size="large" onClick={this.finishRound}>Next Round</Button></div>
                </div>
            )
        } else {
            return (
                <div />
            )
        }
        
    }

    buttonPanel() {
        if (this.state.waiting) {
            return (
                <div className="message">
                    Waiting for opponent...
                </div>
            )
        }
        if (this.state.gameState === 3) {
            return this.result()
        }
        if (this.state.playerNumber === 1) {
            if (this.state.gameState === 1) {
                return (
                    <div>
                        <div className="message"> It's your turn! </div>
                        <div className="button-panel">
                            <div className="column"><Button size="large" onClick={() => { this.move('pass') }}>Pass</Button></div>
                            <div className="column"><Button size="large" color="yellow" onClick={() => { this.move('raise') }}>Raise</Button></div>
                        </div>
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
                        <div className="message"> Opponent chose to {this.state.opponentAction}, now it's your turn! </div>
                        <div className="button-panel">
                            <div className="column"><Button size="large" color="red" onClick={() => { this.move('give up') }}>Give up</Button></div>
                            <div className="column"><Button size="large" color="green" onClick={() => { this.move('match') }}>Match</Button></div>
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
                <div className="scoreboard">
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
                    <div className="nav-menu">
                        <div id="home-nav">
                            <NavLink to="/" style = {{color: "white"}}> <Icon name='home'/> </NavLink>
                        </div>
                        <div id = "rule-nav">
                            <Rules />
                        </div>
                    </div>
                    </div>
                    {this.message()}
                    {this.buttonPanel()}
                    {this.score()}
                    <div className="game-code-panel">
                    <div className="game-code">
                        Game code is: {this.state.slug}
                        <CopyToClipboard text={this.state.slug}
                        >
                        <span id="clipboard-icon"><Icon name='clipboard'/></span>
                        </CopyToClipboard>
                    </div>
                    </div>
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
                                Welcome to the AKQ game! Below are some tips to guide you:
                            </p>

                            <ul>
                                <li>On the top of the page, there will be a help button
                                containing the rules should you need it. </li>
                                <li> Your game code is {this.state.slug} </li>
                                <li> Only share the game code with one other person. </li>
                                <li>Never refresh or press back; all progress will be lost. </li>
                                <li> There may be lag at times so please be patient. </li>
                                <li> If the site breaks down or is taking too long, both players should exit and create a new game. </li>
                                <li> Since it costs 1 chip to play, 1 chip is deducted from both player's scores at the start of each round. </li>
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