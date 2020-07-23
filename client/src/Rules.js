import React, { Component } from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'

class Rules extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.close = this.close.bind(this)
  }

  close() {
    console.log("close clicked")
    this.setState({showModal: false})
  }

  render() {
    return (
      <Modal open={this.state.showModal} 
        closeOnDimmerClick={false} 
        trigger={<i className="help link icon" onClick={() => this.setState({ showModal: true })}></i>} 
        size='small'>
        <Header icon='help' content='Rules of AKQ game' />
        <Modal.Content>
          <p>
            Here are the rules
        </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='purple' onClick={this.close}>
            Exit
        </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default Rules