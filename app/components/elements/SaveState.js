/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import saveState from '../../actions/saveState';


class SaveState extends React.Component {

	constructor(props, context) {
		super();
		this._saveState = this._saveState.bind(this);
		this._loadState = this._loadState.bind(this);
	}
	
	_saveState(event) {
		event.preventDefault();
		console.log("Save State");
		context.executeAction(saveState, ["Save", JSON.stringify({exampleState: this.refs.myTextInput.getDOMNode().value}) ]);
	}
	
	_loadState(event) {
		event.preventDefault();
		console.log("Loading State...");
		context.executeAction(saveState, ["Load"]);
	}
	
	render() {
		return (
			<div>
				This is an example of saving and loading data through the fetchr API. You can save and load data from the text input. Watch the console to see http activity.<br/>

				<input ref="myTextInput" className="span2" type="text"/><br/>

				<button className="btn btn-primary" style={{margin: "0 5 0 0"}} onClick={this._loadState}>
					Load State
				</button>
				
				<button className="btn btn-primary" onClick={this._saveState}>
					Save State
				</button>
			</div>
		);
	}
}

SaveState.propTypes = {

};

SaveState.defaultProps = {

};

export default SaveState;
