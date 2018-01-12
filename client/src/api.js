import axios from 'axios'

const API_URL = 'https://fiery-doves-server-v2.run.aws-usw02-pr.ice.predix.io'
const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places'
export const MAPBOX_API_TOKEN = 'pk.eyJ1Ijoia2V2aW5jYWk3OSIsImEiOiJjajk2YXBqMHUwMjd6MnpvbHU3a3FiODE4In0.Akrpxhy1oIxzIQ34EB1adg' 

export const getParkingLocations = (long, lat, dateTime) => {
    const integerDate = Math.floor(Number(dateTime) / 1000)
    return axios.get(`${API_URL}?ts=${integerDate}&long=${long}&lat=${lat}`)
}

export const getMapCoordinates = (locationString) =>
  axios.get(`${MAPBOX_API_URL}/${locationString}.json?access_token=${MAPBOX_API_TOKEN}`)

