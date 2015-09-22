/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import ExampleStore from '../../stores/exampleStore';
import {connectToStores} from 'fluxible-addons-react';
import SaveState from '../elements/SaveState';
import ModalExample from '../elements/ModalExample';
import ReactSelectExample from '../elements/ReactSelectExample';

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
				
				<h3>react-bootstrap Modal example<a href="https://react-bootstrap.github.io/components.html">(website)</a></h3> 
				<ModalExample/>
				
				<h3>react-select widget example <a href="https://github.com/JedWatson/react-select">(github)</a></h3> 
				<ReactSelectExample/>

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
