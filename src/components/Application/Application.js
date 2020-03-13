import React, {Component} from 'react';
import { getApiKey } from '../../GoogleApiKey';

import {Card, CardBody, CardHeader, Container} from 'reactstrap';
import GoogleMapReact from 'google-map-react';

/* 
  Maintains the body of the application. Header and footer should
  not be included here.

  --- NOTE ---
  For confidentiality, the google maps API key has not been
  included in the public repository.

  To use this with Google, please provide your own Google API
  key in a file: src/GoogleApiKey.js, which contains only:

    export function getApiKey() { return <YOUR_KEY>; }
*/
export default class Application extends Component {

  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 40.0,
        lng: -105.0
      },
      zoom: 11
    };
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: getApiKey() }} 
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
        </GoogleMapReact>
      </div>
    );
  }
}
