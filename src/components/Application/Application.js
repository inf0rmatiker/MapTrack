import React, {Component} from 'react';
import { getApiKey } from '../../GoogleApiKey';

import {Card, CardBody, CardHeader, Container} from 'reactstrap';
import GoogleMapReact from 'google-map-react';

const DEBUG = true;

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
      map: null,
      oldBounds: {
        ne_corner: null,
        sw_corner: null
      },
      userActions: [],
      center: {
        lat: 40.0,
        lng: -105.0
      },
      zoom: 11
    };

    this.idleCallback = this.idleCallback.bind(this);
    this.updateCenter = this.updateCenter.bind(this);
    this.addAction = this.addAction.bind(this);
    this.handleApiLoaded = this.handleApiLoaded.bind(this);
  }

  handleApiLoaded = (map, maps) => {
    this.setState({map: map});
    map.addListener('idle', this.idleCallback);
    //map.addListener('zoom_changed', zoomChangedCallback);
  };

  idleCallback() {
    let currentCenter = this.state.map.getCenter();
    let currentLat = currentCenter.lat();
    let currentLng = currentCenter.lng();


    if (currentLng < this.state.center.lng) {
      if (DEBUG) {
        console.log("PAN_LEFT");
      }
      this.addAction({ action: "PAN_LEFT", interval: 0.0 } );
    }
    else if (currentLng > this.state.center.lng) {
      if (DEBUG) {
        console.log("PAN_RIGHT");
      }
      this.addAction( { action: "PAN_RIGHT", interval: 0.0 } );
    }

    if (currentLat > this.state.center.lat) {
      if (DEBUG) {
        console.log("PAN_UP");
      }
      this.addAction( { action: "PAN_UP", interval: 0.0 } );
    }
    else if (currentLat < this.state.center.lat) {
      if (DEBUG) {
        console.log("PAN_DOWN");
      }
      this.addAction( { action: "PAN_DOWN", interval: 0.0 } );
    }

    // Update old latitude and longitude
    this.updateCenter(currentLat, currentLng);

    /*
    if (oldBounds.lat == null || oldBounds.lng == null) {
      let tempBounds = map.getBounds();
      let tempSouthWestCorner = tempBounds.getSouthWest();
      let tempNorthEastCorner = tempBounds.getNorthEast();

      // Update oldBounds
      oldBounds.ne_corner = {
        lat: tempNorthEastCorner.lat(),
        lng: tempNorthEastCorner.lng()
      };

      oldBounds.sw_corner = {
        lat: tempSouthWestCorner.lat(),
        lng: tempSouthWestCorner.lng()
      };
    }
    */


  }

  addAction(action) {
    let actions = this.state.userActions;
    actions.push(action);
    this.setState({userActions: actions});
  }

  updateCenter(lat, lng) {
    let oldCenter = this.state.center;
    oldCenter.lat = lat;
    oldCenter.lng = lng;
    this.setState({center: oldCenter})
  }


  render() {
    return (
        <div className="application-width">
          <div style={{ height: '80vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: getApiKey() }}
                defaultCenter={this.state.center}
                defaultZoom={this.state.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
            >
            </GoogleMapReact>
          </div>

        </div>
    );
  }
}
