/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import Select from 'react-select';


class ModalExample extends React.Component {
	
	constructor(props,context) {
		super();
		this.state = {
			disabled: false,
			value: []
		}
		this._handleSelectChange = this._handleSelectChange.bind(this);
	}
	
	_handleSelectChange(value, values) {
		this.setState({ 
			value: value 
		});
	}
	
  	render() {
		
		var ops = [
			{ label: 'Chocolate', value: 'chocolate' },
			{ label: 'Vanilla', value: 'vanilla' },
			{ label: 'Strawberry', value: 'strawberry' },
			{ label: 'Caramel', value: 'caramel' },
			{ label: 'Cookies and Cream', value: 'cookiescream' },
			{ label: 'Peppermint', value: 'peppermint' }
		];
		
		return (
			<div>
				<div className="section">
					<Select multi={true} value={this.state.value} placeholder="Select your favourite(s)" options={ops} onChange={this._handleSelectChange} />
				</div>
			</div>
		);
  	}
}

ModalExample.propTypes = {
};



export default ModalExample;
