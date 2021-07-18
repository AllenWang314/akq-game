import React, { useState } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'

export const Rules = () => {

  const [isVisible, setIsVisible] = useState(false);

  return (
    <Modal open={isVisible}
      closeOnDimmerClick={false}
      trigger={<i className="help link icon" onClick={() => setIsVisible(true)}></i>}
      size='small'>
      <Header icon='help' content='Rules of AKQ game' />
      <Modal.Content>
        <div className="modal-content">

          <ul>
            <li> To play, each player starts by paying 1 chip. This is done the beginning of each round.</li>
            <li> Players alternate going first and second.</li>
            <li> The first player has the option of passing (paying 0 chips) or raising (paying 1 chip).</li>
            <div className="button-panel">
              <div className="column"><Button>Pass</Button></div>
              <div className="column"><Button color="yellow">Raise</Button></div>
            </div>
            <li> The second player has the option of giving up (losing 1 chip paid at the beginning) or matching what player 1 did (paying 0 chips if
               player 1 passed or 1 chip if player 1 raised).</li>
            <div className="button-panel">
              <div className="column"><Button color="red">Give up</Button></div>
              <div className="column"><Button color="green">Match</Button></div>
            </div>
            <li> If the second player gives up, the first player wins automatically. </li>
            <li> If the second player matches the amount player 1 put in, then the player with the highest card is the winner.
              </li>
            <li> The winner of each round takes all chips paid in the round, including the chips paid by each player at the start of the round.
              </li>
            <li> A is higher than K, K is higher than Q, and transitively, A is higher than Q.
              </li>
          </ul>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color='purple' onClick={() => setIsVisible(false)}>
          Exit
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

