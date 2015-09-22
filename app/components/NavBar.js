/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
var Link = require('react-router').Link;


class NavBar extends React.Component {
	render() {
		var linkRendered = this.props.linkArray.map(function(data, index){
			return (
				<li key={index}>
					<Link to={data.path} key={index}>
						{data.linkName}
					</Link>
				</li>
			)
		});
		return (	
			<header>
				 <div className="container">
					  <div className="navbar navbar-default">
						   <div className="navbar-header">
						   		<Link to="/" className="navbar-brand">
									<strong>			
										Base App
									</strong>
								</Link>
							</div>
							<div >
								<ul className={"nav pull-right navbar-nav"}>
									{linkRendered}
						  		</ul>
							</div>
					  </div>
				 </div>
			</header>
		);
  }
}

NavBar.defaultProps = {
 	linkArray: [
 		{path: "/", linkName: "Home"},
 		{path: "/about", linkName: "About Us"}
 	]
};


export default NavBar;

