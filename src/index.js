//app logic

const apiKey = process.env.weather_api_key;
const baseUrl = process.env.weather_base_url;


async function getWeatherByLocation(location){
    let response = await fetch(`${baseUrl}/${location}?key=${apiKey}`)
    response = await response.json();
    return makeWeatherObject(response);
    
}

function makeWeatherObject(apiResponse){
   /*  let weatherObject = {};
    apiResponse.then( function (res) {
        weatherObject = res.days.slice(0, 8)
    } ); */
    let weatherObject =  apiResponse.days.slice(0, 8);
    return weatherObject ;
     
}


//API response is temperature in Fahrenheit, this function will convert it in Celsius
function convertToCelcius (temp){
    //let temperature =  Math.trunc(( temp -  32) * 5 / 9);
    let temperature =  Math.round(( temp -  32) * 5 / 9);
    return temperature;
}

function convertToFahrenheit (temp){
    //let temperature = Math.trunc((temp * 9 / 5) + 32);
    let temperature = Math.round((temp * 9 / 5) + 32);
    return temperature;
}

export{
       getWeatherByLocation,
       makeWeatherObject,
       convertToCelcius,
       convertToFahrenheit
};