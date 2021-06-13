const NodeGeocoder = require('node-geocoder');
const options={
    provider : "mapquest",
    //process.env.GEOCODER_PROVIDER,
    httpAdapter : 'https',
    apiKey : "AAGxcUJl0mgliEV83PaUijvYHd1Jwpeu",
   //  process.env.GEOCODER_API_KEY,
    formatter : null,

}
const geocoder = NodeGeocoder(options);
module.exports = geocoder;