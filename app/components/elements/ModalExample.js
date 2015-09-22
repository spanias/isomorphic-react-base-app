/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import {ButtonToolbar, Modal, Button, ModalTrigger} from 'react-bootstrap';


class ModalExample extends React.Component {
	
	constructor(props,context) {
		super();
		this.state = {
			show: false
		}
		this._showModal = this._showModal.bind(this);
		this._hideModal = this._hideModal.bind(this);
	}
	
	_showModal() {
		this.setState({
			show: true
		})
	}
	
	_hideModal() {
		this.setState({
			show: false
		})
	}
	
  	render() {

		return (
			<div>

				<Button bsStyle="primary" onClick={this._showModal}>
					An Example Modal
				</Button>

				<Modal
					{...this.props}
					show={this.state.show}
					onHide={this._hideModal}
					dialogClassName="custom-modal"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>I am some text in a Modal from react-bootstrap: <a href="https://react-bootstrap.github.io/components.html">react-bootstrap</a>.</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this._hideModal}>Close</Button>
					</Modal.Footer>
				</Modal>

			</div>
		);
  	}
}

ModalExample.propTypes = {
};



export default ModalExample;
