import {
    getWeatherByLocation,
    makeWeatherObject,
    convertToCelcius
} from "./index.js";
import "./styles.css"

///TO DO: attach event handler when enter gets pressed to search a location
const confirmBtn = document.getElementById("confirmLocation");
const location = document.getElementById("targetLocation");
const leftContainer = document.querySelector(".leftContainer");

let weather;
confirmBtn.addEventListener("click", () => {
    let weatherData = getWeatherByLocation(location.value);
    weatherData.then(function (res) { 
        weather = res;
        console.log(weather);
        constructLeftBar(weather);
        


    })    
});
//weather[0] is the weather data today
function constructLeftBar(weather){
    /* let res1 = displayWeatherIcon(weather[0].icon)
    let res2 = displayTemperature(weather[0].temp)
    leftContainer.appendChild(res1);
    leftContainer.appendChild(res2); */
    displayWeatherIcon(weather[0].icon)
     displayTemperature(weather[0].temp)
}

function displayWeatherIcon(weatherStatus){
    import(`../weather_icons/${weatherStatus}.png`).then((module) => {
        let testImage = document.createElement("img");
        testImage.id="leftWeatherIcon";
        testImage.src=module.default;
         leftContainer.appendChild(testImage)
      
        
    });
}

function displayTemperature(temp){
    let temperature = document.createElement("p");
    temperature.textContent = convertToCelcius(+ temp);
    leftContainer.appendChild(temperature);
   
}

