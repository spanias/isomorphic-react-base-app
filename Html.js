/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';


class HtmlComponent extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
					<meta name="apple-mobile-web-app-capable" content="yes"/>
					<meta name="viewport" content="width=device-width, initial-scale=1"/>
					
					{ this.props.css.map((href, k) =>
						<link key={k} rel="stylesheet" type="text/css" href={href} />)
					  }

                </head>
                <body>
                    <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
               		 <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                    { this.props.script.map((src, k) => <script key={k} src={src} />) }
                </body>

            </html>
        )
    }
}

export default HtmlComponent;
