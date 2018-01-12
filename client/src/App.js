import React, { Component } from 'react'
import './App.css'
import ReactMapboxGl, { Layer, Feature, Marker, ScaleControl } from "react-mapbox-gl"
import { getParkingLocations } from './api'

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoia2V2aW5jYWk3OSIsImEiOiJjajk2YXBqMHUwMjd6MnpvbHU3a3FiODE4In0.Akrpxhy1oIxzIQ34EB1adg"
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coordinates: [-117.157122, 32.712854],
      textInput: '',
      parking: []
    }
    this.updateTextInput = this.updateTextInput.bind(this)
    this.submitTextInput = this.submitTextInput.bind(this)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => 
      this.setState({
        coordinates: [position.coords.longitude, position.coords.latitude]
      }))

    getParkingLocations(new Date)
      .then(res => {
        console.log(res)
        this.setState({parking: res.data})
      })
  }

  updateTextInput(e) {
    this.setState({ textInput: e.target.value })
  }

  submitTextInput(e) {
    if(e.key === 'Enter') {
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(this.state.textInput)}.json?access_token=pk.eyJ1Ijoia2V2aW5jYWk3OSIsImEiOiJjajk2YXBqMHUwMjd6MnpvbHU3a3FiODE4In0.Akrpxhy1oIxzIQ34EB1adg`
      axios.get(url)
        .then(({data}) => this.setState({
          coordinates: data.features[0].center
        }))
        .catch(error => console.log("MapBox Place API FAIL: ", error))
    }
  }

  _onStyleLoad(map, event) {
    this.state.parking.forEach(spot => {
      map.addLayer(spot)
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Parking PrediXion</h1>
        <Map
          center={this.state.coordinates}
          style="mapbox://styles/mapbox/streets-v9"
	        onStyleLoad={this._onStyleLoad.bind(this)}
	        zoom={[16.5]}
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
        >
          <Marker
            coordinates={this.state.coordinates}
          >
            <img src="pin.png" style={{height: "45px", width: "45px"}}/>
          </Marker>
        </Map>
        <input type="text"
          onChange={this.updateTextInput}
          onKeyUp={this.submitTextInput}
          value={this.state.textInput}
          placeholder="Enter a location"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "9%",
            width: "80%",
            fontSize: "1.4em"
          }}
        />
      </div>
    )
  }
}

export default App
