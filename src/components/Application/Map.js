import React, {Component} from "react";
import {Card, CardBody} from "reactstrap";
import GoogleMapReact from "google-map-react";
import {getApiKey} from "../../GoogleApiKey";

/*
  Holds the Google Maps instance, and provides event listeners
  for the Google Maps API to track user actions.
 */
export default class Map extends Component {

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
    this.addAction = this.addAction.bind(this);
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
    let interval = 0;


    // If we have not initialized the bounds, do it now
    let tempBounds = this.state.map.getBounds();
    let tempSouthWestCorner = tempBounds.getSouthWest();
    let tempNorthEastCorner = tempBounds.getNorthEast();
    if (this.state.bounds.ne_corner === null || this.state.bounds.sw_corner === null) {
      // Update bounds
      this.updateBounds(tempNorthEastCorner, tempSouthWestCorner);
    }

    if (this.props.isWithinSession) {
      let actionType = "NO_ACTION"; // Default action
      if (currentLng < this.state.center.lng) {
        actionType = "PAN_LEFT";
      }
      else if (currentLng > this.state.center.lng) {
        actionType = "PAN_RIGHT";
      }
      else if (currentLat > this.state.center.lat) {
        actionType = "PAN_UP";
      }
      else if (currentLat < this.state.center.lat) {
        actionType = "PAN_DOWN";
      }

      // Update timestamp (actionTime), and record interval between now and last timestamp
      let lastTimeStamp = this.props.actionTime;
      let currentTimeStamp = new Date();

      if (lastTimeStamp) {
        let resolution = Math.abs(currentTimeStamp - lastTimeStamp) / 1000;
        interval = resolution % 60;
      }

      this.props.updateActionTime(currentTimeStamp);



      if (actionType !== "NO_ACTION") {
        this.addAction({ action: actionType,
          center: {lat: currentLat, lng: currentLng},
          zoom: this.state.zoom,
          bounds: { ne_corner: tempNorthEastCorner,
            sw_corner: tempSouthWestCorner },
          interval: interval } );
      }

    }

    // Update old latitude and longitude
    this.updateCenter(currentLat, currentLng);
  }

  // Callback function for Google Maps "bounds_changed" event listener.
  zoomChangedCallback() {
    let tempBounds = this.state.map.getBounds();
    let new_sw_corner = tempBounds.getSouthWest();
    let new_ne_corner = tempBounds.getNorthEast();

    console.log(this.state.bounds);
    if (this.props.isWithinSession) {
      if (this.state.bounds.ne_corner.lat < new_ne_corner.lat()) {
        this.addAction({action: "ZOOM_OUT", center: {lat: 0, lng: 0}, interval: 0.0}); // TODO: Update interval/center for zoom actions
      } else {
        this.addAction({action: "ZOOM_IN", center: {lat: 0, lng: 0}, interval: 0.0}); // TODO: Update interval/center for zoom actions
      }
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

  addAction(action) {
    let actions = this.props.userActions;
    actions.push(action);
    this.props.updateUserActions(actions);
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