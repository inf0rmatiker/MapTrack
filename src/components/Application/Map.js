import React, {Component} from "react";
import {Card, CardBody} from "reactstrap";
import GoogleMapReact from "google-map-react";
import {getApiKey} from "../../GoogleApiKey";

/*
  Holds the Google Maps instance, and provides event listeners
  for the Google Maps API to track user actions.
 */
export default class Application extends Component {

  constructor(props) {
    super(props);

    this.state = {
      map: null,
      bounds: {
        ne_corner: null,
        sw_corner: null
      },
      center: {
        lat: 40.559167,
        lng: -105.078056
      },
      zoom: 11
    };

    // Method binds
    this.handleApiLoaded = this.handleApiLoaded.bind(this);
    this.idleCallback = this.idleCallback.bind(this);
    this.zoomChangedCallback = this.zoomChangedCallback.bind(this);
    this.updateCenter = this.updateCenter.bind(this);
    this.updateBounds = this.updateBounds.bind(this);
  }

  handleApiLoaded(map, maps) {
    this.setState({'map': map});
    map.addListener('idle', this.idleCallback);
    map.addListener('zoom_changed', this.zoomChangedCallback);
  };

  // Callback function for Google Maps "idle" event listener.
  idleCallback() {
    let currentCenter = this.state.map.getCenter();
    let currentLat = currentCenter.lat();
    let currentLng = currentCenter.lng();

    if (currentLng < this.state.center.lng) {
      this.props.addAction({ action: "PAN_LEFT", interval: 0.0 } );
    }
    else if (currentLng > this.state.center.lng) {
      this.props.addAction( { action: "PAN_RIGHT", interval: 0.0 } );
    }
    else if (currentLat > this.state.center.lat) {
      this.props.addAction( { action: "PAN_UP", interval: 0.0 } );
    }
    else if (currentLat < this.state.center.lat) {
      this.props.addAction( { action: "PAN_DOWN", interval: 0.0 } );
    }

    // Update old latitude and longitude
    this.updateCenter(currentLat, currentLng);

    // If we have not initialized the bounds, do it now
    if (this.state.bounds.ne_corner === null || this.state.bounds.sw_corner === null) {
      let tempBounds = this.state.map.getBounds();
      let tempSouthWestCorner = tempBounds.getSouthWest();
      let tempNorthEastCorner = tempBounds.getNorthEast();

      // Update bounds
      this.updateBounds(tempNorthEastCorner, tempSouthWestCorner);
    }
  }

  // Callback function for Google Maps "bounds_changed" event listener.
  zoomChangedCallback() {
    let tempBounds = this.state.map.getBounds();
    let new_sw_corner = tempBounds.getSouthWest();
    let new_ne_corner = tempBounds.getNorthEast();

    if (this.state.bounds.ne_corner.lat < new_ne_corner.lat()) {
      this.props.addAction( { action: "ZOOM_OUT", interval: 0.0 });
    }
    else {
      this.props.addAction( { action: "ZOOM_IN", interval: 0.0 });
    }

    // Update bounds
    this.updateBounds(new_ne_corner, new_sw_corner);
  }

  updateCenter(lat, lng) {
    let oldCenter = this.state.center;
    oldCenter.lat = lat;
    oldCenter.lng = lng;
    this.setState({center: oldCenter})
  }

  updateBounds(ne_corner, sw_corner) {
    let oldBoundsCopy = this.state.bounds;

    oldBoundsCopy.ne_corner = {lat: ne_corner.lat(), lng: ne_corner.lng()};
    oldBoundsCopy.sw_corner = {lat: sw_corner.lat(), lng: sw_corner.lng()};

    this.setState({'bounds': oldBoundsCopy});
  }

  render() {
    return (
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
    );
  }
}