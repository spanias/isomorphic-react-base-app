/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import ExampleStore from '../../stores/exampleStore';
import {connectToStores} from 'fluxible-addons-react';
import SaveState from '../elements/SaveState';
import ModalExample from '../elements/ModalExample';


class Home extends React.Component {

	render() {
		return (
			<div className="container">
				<h1>{this.props.homeMsg}</h1>
				<h4>{this.props.exampleState}</h4>
				<SaveState />

				<div className="myCustomCss">
					This is an example div styled with "myCustomCss" from style.less, which extends twitter bootstrap.
				</div>

				<ModalExample/>

			</div>
		);
  	}
}

Home.propTypes = {
 homeMsg: React.PropTypes.string,
};

Home.defaultProps = {
	homeMsg: "Hi there, this is the home page."
};

Home = connectToStores(Home, [ExampleStore], function (context, props) {
    return context.getStore(ExampleStore).getState()
});

export default Home;
