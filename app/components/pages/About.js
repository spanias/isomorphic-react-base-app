/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';


class About extends React.Component {
	render() {
		return (
    		<div className="container">
			  <h1>{this.props.aboutMsg}</h1>
			</div>
		);
  	}
}

About.propTypes = {
 aboutMsg: React.PropTypes.string,
};

About.defaultProps = {
	aboutMsg: "Hello and welcome to the about page."
};

export default About;
