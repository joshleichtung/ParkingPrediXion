import React, { Component } from 'react'
import './App.css'
import ReactMapboxGl, { Marker, Popup } from "react-mapbox-gl"
import { getParkingLocations, getMapCoordinates, MAPBOX_API_TOKEN } from './api'

const ParkingIconUrl = "https://cdn4.iconfinder.com/data/icons/map-pins-2/256/16-512.png"

const Map = ReactMapboxGl({
  accessToken: MAPBOX_API_TOKEN
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coordinates: [-117.157122, 32.712854],
      textInput: '',
      parking: [],
      suggestions: [],
      showSuggestions: false
    }
    this.updateTextInput = this.updateTextInput.bind(this)
    this.submitTextInput = this.submitTextInput.bind(this)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => 
      this.setState({
        coordinates: [position.coords.longitude, position.coords.latitude]
      }))

    getParkingLocations(...this.state.coordinates, new Date())
      .then(({ data: {zones, suggestions}}) => {
        console.log("zones: ", zones, "suggestions: ", suggestions)
        this.setState({
          parking: zones,
          suggestions: suggestions
        });
      })
      .catch(error => console.log("Ali Server error: ", error))
  }

  updateTextInput(e) {
    this.setState({ textInput: e.target.value })
  }

  submitTextInput(e) {
    if(e.key === 'Enter') {
      getMapCoordinates(this.state.textInput)
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
        <h1><span className="big-p">P</span>arking <span className="big-p">P</span>redi<span className="big-p">X</span>ion</h1>
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
            <img src="pin.png" style={{height: "45px", width: "45px"}} alt="current location pin" />
          </Marker>
          {this.state.suggestions.map(({msg, long, lat}, idx) => (
            <div key={idx} >
            <Popup
              coordinates={[long, lat]}
              offset={ [100, -50 ] }
              anchor={{bottom: 0, left: 0}}
            >
              {msg}
            </Popup>
            <Marker
              coordinates={[long, lat]}
            >
              <img src={ParkingIconUrl} style={{height: "35px", width: "35px"}} alt="parking location pin" />
            </Marker>
          </div>
          ))}
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
        <div
          className="recommendation"
          style={{
            borderRadius: "5px",
            position: "absolute",
            top: "80px",
            left: "20px",
            backgroundColor: "rgba(255, 255, 255, .7)",
            textAlign: "left"

          }}
        >
          <h2>
            <a 
              href="#"
              onClick={() => this.setState({
                showSuggestions: !this.state.showSuggestions
              })}
            >
              Parking Suggestions
            </a>
          </h2>
          <ul style={{padding: "0"}} className={this.state.showSuggestions ? "" : "hidden"}>
          {this.state.suggestions.map(({msg, long, lat}, idx) => (
            <li style={{listStyleType: "none"}} key={idx}>
              <a
                href="#"
                onClick={() => this.setState({ coordinates: [long, lat] })}
              >
                {msg.trim()}
              </a>
        </li>
          ))}
        </ul>
        </div>
      </div>
    )
  }
}

export default App
