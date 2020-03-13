import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Container} from 'reactstrap';
import GoogleMapReact from 'google-map-react';


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
          bootstrapURLKeys={{ key: 'AIzaSyBscS7Up4h09zW84i8jfmpuzPIgjjUEsrM' }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
        </GoogleMapReact>
      </div>
    );
  }
}
