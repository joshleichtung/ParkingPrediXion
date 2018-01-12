import axios from 'axios'

const API_URL = 'https://fiery-doves-server.run.aws-usw02-pr.ice.predix.io'

export const getParkingLocations = (dateTime, coordinates) =>
    axios.get(`${API_URL}?timestamp=${Number(dateTime)}`)
