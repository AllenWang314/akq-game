(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{201:function(e,t,a){},229:function(e,t,a){e.exports=a(406)},234:function(e,t,a){},406:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),i=a(41),r=a.n(i),o=(a(234),a(49)),l=a(50),c=a(17),m=a(54),h=a(53),u=a(415),p=a(217),d=a(15),y=a(87),g=a.n(y),b=a(416),v=a(412),E=a(413),f=a(417),N=function(e){Object(m.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={showModal:!1},n.close=n.close.bind(Object(c.a)(n)),n}return Object(l.a)(a,[{key:"close",value:function(){console.log("close clicked"),this.setState({showModal:!1})}},{key:"render",value:function(){var e=this;return s.a.createElement(E.a,{open:this.state.showModal,closeOnDimmerClick:!1,trigger:s.a.createElement("i",{className:"help link icon",onClick:function(){return e.setState({showModal:!0})}}),size:"small"},s.a.createElement(f.a,{icon:"help",content:"Rules of AKQ game"}),s.a.createElement(E.a.Content,null,s.a.createElement("div",{className:"modal-content"},s.a.createElement("ul",null,s.a.createElement("li",null," To play, each player starts by paying 1 chip. This is done the beginning of each round."),s.a.createElement("li",null," Players alternate going first and second."),s.a.createElement("li",null," The first player has the option of passing (paying 0 chips) or raising (paying 1 chip)."),s.a.createElement("div",{className:"button-panel"},s.a.createElement("div",{className:"column"},s.a.createElement(u.a,null,"Pass")),s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{color:"yellow"},"Raise"))),s.a.createElement("li",null," The second player has the option of giving up (losing 1 chip paid at the beginning) or matching what player 1 did (paying 0 chips if player 1 passed or 1 chip if player 1 raised)."),s.a.createElement("div",{className:"button-panel"},s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{color:"red"},"Give up")),s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{color:"green"},"Match"))),s.a.createElement("li",null," If the second player gives up, the first player wins automatically. "),s.a.createElement("li",null," If the second player matches the amount player 1 put in, then the player with the highest card is the winner."),s.a.createElement("li",null," The winner of each round takes all chips paid in the round, including the chips paid by each player at the start of the round."),s.a.createElement("li",null," A is higher than K, K is higher than Q, and transitively, A is higher than Q.")))),s.a.createElement(E.a.Actions,null,s.a.createElement(u.a,{color:"purple",onClick:this.close},"Exit")))}}]),a}(n.Component),S=(a(201),["A","K","Q"]),w=function(e){Object(m.a)(a,e);var t=Object(h.a)(a);function a(e){var n;Object(o.a)(this,a);var s=(n=t.call(this,e)).props.match.params.id;return n.state={slug:s,gameState:0,playerNumber:0,myScore:100,opponentScore:100,myCard:-1,opponentCard:"",roundNumber:0,modal:!0,myAction:"",opponentAction:"",winner:0,pot:0,rules:!1,finish:0,waiting:!1},n.message=n.message.bind(Object(c.a)(n)),n.buttonPanel=n.buttonPanel.bind(Object(c.a)(n)),n.score=n.score.bind(Object(c.a)(n)),n.join=n.join.bind(Object(c.a)(n)),n.handleMessage=n.handleMessage.bind(Object(c.a)(n)),n.handleJoin=n.handleJoin.bind(Object(c.a)(n)),n.handleTurn=n.handleTurn.bind(Object(c.a)(n)),n.handleCards=n.handleCards.bind(Object(c.a)(n)),n.nextRound=n.nextRound.bind(Object(c.a)(n)),n.move=n.move.bind(Object(c.a)(n)),n.finishRound=n.finishRound.bind(Object(c.a)(n)),n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.conn=new WebSocket("ws://localhost:8080/ws"),this.conn.onmessage=function(t){e.handleMessage(JSON.parse(t.data))}}},{key:"handleMessage",value:function(e){e.slug===this.state.slug&&("join"===e.type?this.handleJoin(e.player_number):"turn"===e.type?this.handleTurn(e.player_number,e.action):"round"===e.type&&e.Valid?this.handleCards(e):"finish"===e.type&&this.handleFinish(e))}},{key:"handleFinish",value:function(e){this.state.finish+e.player_number===3?this.nextRound():this.setState({opponentScore:this.state.winner!==this.state.playerNumber?this.state.opponentScore+this.state.pot:this.state.opponentScore,myScore:this.state.winner===this.state.playerNumber?this.state.myScore+this.state.pot:this.state.myScore,finish:e.player_number})}},{key:"handleCards",value:function(e){0===this.state.roundNumber?1===this.state.playerNumber?this.setState({roundNumber:1,myCard:e.Player1Card,opponentCard:e.Player2Card,gameState:1,myAction:"",opponentAction:"",myScore:this.state.myScore-1,opponentScore:this.state.opponentScore-1,pot:2,finish:0,waiting:!1,winner:0}):this.setState({roundNumber:1,myCard:e.Player2Card,opponentCard:e.Player1Card,gameState:1,myAction:"",opponentAction:"",myScore:this.state.myScore-1,opponentScore:this.state.opponentScore-1,pot:2,finish:0,waiting:!1,winner:0}):1===this.state.playerNumber?this.setState({roundNumber:this.state.roundNumber+1,playerNumber:this.state.playerNumber%2+1,myCard:e.Player2Card,opponentCard:e.Player1Card,gameState:1,myAction:"",opponentAction:"",myScore:this.state.myScore-1,opponentScore:this.state.opponentScore-1,pot:2,finish:0,waiting:!1,winner:0}):this.setState({roundNumber:this.state.roundNumber+1,playerNumber:this.state.playerNumber%2+1,myCard:e.Player1Card,opponentCard:e.Player2Card,gameState:1,myAction:"",opponentAction:"",myScore:this.state.myScore-1,opponentScore:this.state.opponentScore-1,pot:2,finish:0,waiting:!1,winner:0})}},{key:"handleJoin",value:function(e){2===e&&this.nextRound()}},{key:"handleTurn",value:function(e,t){1===this.state.playerNumber?1===e?this.setState({gameState:2,myAction:t,pot:"raise"===t?this.state.pot+1:this.state.pot,myScore:"raise"===t?this.state.myScore-1:this.state.myScore}):2===e&&this.setState({gameState:3,opponentAction:t,opponentScore:"match"===t&&3===this.state.pot?this.state.opponentScore-1:this.state.opponentScore,pot:"match"===t&&3===this.state.pot?this.state.pot+1:this.state.pot,winner:this.state.myCard<this.state.opponentCard||"give up"===t?1:2}):2===this.state.playerNumber&&(1===e?this.setState({gameState:2,opponentAction:t,opponentScore:"raise"===t?this.state.opponentScore-1:this.state.opponentScore,pot:"raise"===t?this.state.pot+1:this.state.pot}):2===e&&this.setState({gameState:3,myAction:t,myScore:"match"===t&&3===this.state.pot?this.state.myScore-1:this.state.myScore,pot:"match"===t&&3===this.state.pot?this.state.pot+1:this.state.pot,winner:this.state.myCard>this.state.opponentCard||"give up"===t?1:2}))}},{key:"nextRound",value:function(){var e={type:"round",player_number:this.state.playerNumber,slug:this.state.slug};this.conn.send(JSON.stringify(e))}},{key:"finishRound",value:function(){var e={type:"finish",player_number:this.state.playerNumber,slug:this.state.slug};this.conn.send(JSON.stringify(e)),this.setState({waiting:!0})}},{key:"join",value:function(){var e=this;g.a.put("http://localhost:8080/api/rooms/join/"+this.state.slug,{},{headers:{"Access-Control-Allow-Origin":"*"}}).then((function(t){var a={type:"join",player_number:t.data.num_clients,slug:e.state.slug};e.conn.send(JSON.stringify(a)),e.setState({playerNumber:t.data.num_clients,modal:!1})}))}},{key:"move",value:function(e){var t={type:"turn",player_number:this.state.playerNumber,slug:this.state.slug,action:e};this.conn.send(JSON.stringify(t)),this.setState({gameState:this.state.gameState+1})}},{key:"message",value:function(){return-1===this.state.myCard||this.state.waiting?s.a.createElement("div",null):s.a.createElement("div",{className:"round"},"Round ",this.state.roundNumber,": You have been dealt ",S[this.state.myCard])}},{key:"result",value:function(){return 1===this.state.playerNumber||2===this.state.playerNumber?s.a.createElement("div",{className:"result"},s.a.createElement("div",{className:"result-header"},"Results:"),s.a.createElement("div",{className:"result-bit"},"Your card: ",S[this.state.myCard],", Opponent's card: ",S[this.state.opponentCard]),s.a.createElement("div",{className:"result-bit"},"Your action: ",this.state.myAction,", Opponent's action: ",this.state.opponentAction),s.a.createElement("div",{className:"result-bit"},"You win ",this.state.winner===this.state.playerNumber?this.state.pot:0),s.a.createElement("div",{className:"finish-button"},s.a.createElement(u.a,{size:"large",onClick:this.finishRound},"Next Round"))):s.a.createElement("div",null)}},{key:"buttonPanel",value:function(){var e=this;return this.state.waiting?s.a.createElement("div",{className:"message"},"Waiting for opponent..."):3===this.state.gameState?this.result():1===this.state.playerNumber?1===this.state.gameState?s.a.createElement("div",null,s.a.createElement("div",{className:"message"}," It's your turn! "),s.a.createElement("div",{className:"button-panel"},s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{size:"large",onClick:function(){e.move("pass")}},"Pass")),s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{size:"large",color:"yellow",onClick:function(){e.move("raise")}},"Raise")))):2===this.state.gameState?s.a.createElement("div",{className:"message"},"Action taken: ",this.state.myAction,". Waiting for opponent..."):s.a.createElement("div",{className:"message"},"Waiting for opponent..."):2===this.state.playerNumber?2===this.state.gameState?s.a.createElement("div",null,s.a.createElement("div",{className:"message"}," Opponent chose to ",this.state.opponentAction,", now it's your turn! "),s.a.createElement("div",{className:"button-panel"},s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{size:"large",color:"red",onClick:function(){e.move("give up")}},"Give up")),s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{size:"large",color:"green",onClick:function(){e.move("match")}},"Match")))):s.a.createElement("div",{className:"message"},"Waiting for opponent..."):s.a.createElement("div",null)}},{key:"score",value:function(){return 1===this.state.playerNumber||2===this.state.playerNumber?s.a.createElement("div",{className:"scoreboard"},s.a.createElement("div",{className:"score"},"Your score: ",this.state.myScore),s.a.createElement("div",{className:"score"},"Opponent's score: ",this.state.opponentScore)):0===this.state.playerNumber?s.a.createElement("div",{style:{display:this.state.modal?"none":"block"}},s.a.createElement(b.a,{active:!0},s.a.createElement(v.a,null)),"Loading ..."):s.a.createElement("div",null,"Room at capacity. Please create another game.")}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement("div",{className:"menu",id:"navbar"},s.a.createElement(N,null)),this.message(),this.buttonPanel(),this.score()),s.a.createElement(E.a,{size:"small",closeOnDimmerClick:!1,open:this.state.modal},s.a.createElement(f.a,{icon:"gamepad",content:"Join Game"}),s.a.createElement(E.a.Content,null,s.a.createElement("div",{className:"modal-content"},s.a.createElement("p",null,"Welcome to the AKQ game! Below are some tips to guide you:"),s.a.createElement("ul",null,s.a.createElement("li",null,"On the top of the page, there will be a help button containing the rules should you need it. "),s.a.createElement("li",null," Only share the link with one other person. "),s.a.createElement("li",null,"Never refresh or press back; all progress will be lost. "),s.a.createElement("li",null," There may be lag at times so please be patient. "),s.a.createElement("li",null," If the site breaks down or is taking too long, both players should exit and create a new game. "),s.a.createElement("li",null," Since it costs 1 chip to play, 1 chip is deducted from both player's scores at the start of each round. "),s.a.createElement("li",null,"The player going first sees the following buttons: "),s.a.createElement("div",{className:"button-panel"},s.a.createElement("div",{className:"column"},s.a.createElement(u.a,null,"Pass")),s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{color:"yellow"},"Raise"))),s.a.createElement("li",null,"The player going second sees the following buttons:"),s.a.createElement("div",{className:"button-panel"},s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{color:"red"},"Give up")),s.a.createElement("div",{className:"column"},s.a.createElement(u.a,{color:"green"},"Match")))))),s.a.createElement(E.a.Actions,null,s.a.createElement(u.a,{color:"purple",onClick:this.join},"Join"))))}}]),a}(n.Component),C=function(e){Object(m.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).state={redirect:null,modal:!1},n.createGame=n.createGame.bind(Object(c.a)(n)),n}return Object(l.a)(a,[{key:"createGame",value:function(){var e=this;g.a.post("http://localhost:8080/api/rooms",{num_clients:0},{headers:{"Access-Control-Allow-Origin":"*"}}).then((function(t){e.setState({redirect:"/room/"+t.data.slug})}))}},{key:"render",value:function(){var e=this;return s.a.createElement(p.a,null,this.state.redirect&&s.a.createElement(d.a,{to:this.state.redirect}),s.a.createElement("main",{className:"content-container"},s.a.createElement(d.d,null,s.a.createElement(d.b,{path:"/room/:id",component:w}),s.a.createElement(d.b,{path:"/fail",render:function(){}}),s.a.createElement(d.b,{path:"/",render:function(){return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement(u.a,{size:"large",onClick:e.createGame},"Create Game")))}}))))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[229,1,2]]]);
//# sourceMappingURL=main.b3bea814.chunk.js.map