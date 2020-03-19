import React, {Component} from 'react';
import { getApiKey } from '../../GoogleApiKey';

import {Card, CardBody, CardHeader, Container, Button} from 'reactstrap';
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
        lat: 40.559167,
        lng: -105.078056
      },
      zoom: 11
    };

    this.idleCallback = this.idleCallback.bind(this);
    this.zoomChangedCallback = this.zoomChangedCallback.bind(this);
    this.updateCenter = this.updateCenter.bind(this);
    this.updateBounds = this.updateBounds.bind(this);
    this.addAction = this.addAction.bind(this);
    this.logActions = this.logActions.bind(this);
    this.handleApiLoaded = this.handleApiLoaded.bind(this);
  }

  handleApiLoaded = (map, maps) => {
    this.setState({map: map});
    map.addListener('idle', this.idleCallback);
    map.addListener('zoom_changed', this.zoomChangedCallback);
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
    else if (currentLat > this.state.center.lat) {
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


    if (this.state.oldBounds.ne_corner === null || this.state.oldBounds.sw_corner === null) {
      let tempBounds = this.state.map.getBounds();
      let tempSouthWestCorner = tempBounds.getSouthWest();
      let tempNorthEastCorner = tempBounds.getNorthEast();

      // Update oldBounds
      this.updateBounds(tempNorthEastCorner, tempSouthWestCorner);
    }
  }

  zoomChangedCallback() {
    let tempBounds = this.state.map.getBounds();
    let new_sw_corner = tempBounds.getSouthWest();
    let new_ne_corner = tempBounds.getNorthEast();

    if (this.state.oldBounds.ne_corner.lat < new_ne_corner.lat()) {
      if (DEBUG) {
        console.log("ZOOM_OUT");
      }
      this.addAction( { action: "ZOOM_OUT", interval: 0.0 });
    }
    else {
      if (DEBUG) {
        console.log("ZOOM_IN");
      }
      this.addAction( { action: "ZOOM_IN", interval: 0.0 });
    }

    // Update oldBounds
    this.updateBounds(new_ne_corner, new_sw_corner);
  }


  addAction(action) {
    let actions = this.state.userActions;
    actions.push(action);
    this.setState({'userActions': actions});
  }

  updateCenter(lat, lng) {
    let oldCenter = this.state.center;
    oldCenter.lat = lat;
    oldCenter.lng = lng;
    this.setState({center: oldCenter})
  }

  updateBounds(ne_corner, sw_corner) {
    let oldBoundsCopy = this.state.oldBounds;

    oldBoundsCopy.ne_corner = {lat: ne_corner.lat(), lng: ne_corner.lng()};
    oldBoundsCopy.sw_corner = {lat: sw_corner.lat(), lng: sw_corner.lng()};

    this.setState({'oldBounds': oldBoundsCopy});
  }

  getActionsAsString() {
    if (this.state.userActions) {
      let actions = this.state.userActions;
      let collectedActions = "";
      for (let i = 0; i < actions.length; i++) {
        let actionStr = actions[i].action;
        collectedActions += actionStr;
        if (i !== (actions.length - 1)) {
          collectedActions += ",";
        }
      }

      return collectedActions;
    }
  }


  render() {
    return (
        <div className="application-width">
          <Card>
            <CardBody>
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
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Control Panel
            </CardHeader>
            <CardBody>
              <Button className='btn-csu' size="lg" onClick={this.logActions}>See Results</Button>
            </CardBody>
          </Card>
        </div>
    );
  }
}
