import React, { Component } from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature, Marker, ScaleControl } from "react-mapbox-gl";
// import from "react-mapbox-gl/css";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoia2V2aW5jYWk3OSIsImEiOiJjajk2YXBqMHUwMjd6MnpvbHU3a3FiODE4In0.Akrpxhy1oIxzIQ34EB1adg"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {coordinates: [-117.1611, 32.7157]}

  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({coordinates: [position.coords.longitude, position.coords.latitude]});
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
});
  }

  render() {
    return (
      <div className="App">
        <h1>Smart Park</h1>
        <Map
          center={this.state.coordinates}
          style="mapbox://styles/mapbox/streets-v9"
          zoom={[15]}
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
        >
            <Marker
              coordinates={this.state.coordinates}
            >
              <img src="http://maplacejs.com/website/images/red-dot.png" style={{height: "25px", width: "25px"}}/>
            </Marker>
      </Map>
      </div>
    );
  }
}

export default App;
