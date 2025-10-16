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
async function constructLeftBar(weather) {
    //this is needed to display the icon first and then the temperature 
    //because inside createWeatherIcon there is a dynamic import which is asynchronous
    const [iconElement, temperatureElement, dayTime] = await Promise.all([
        createWeatherIcon(weather[0].icon),
        createTemperatureElement(weather[0].temp),
        createDayTime(weather[0].datetime)
    ]);

    
    leftContainer.appendChild(iconElement);
    leftContainer.appendChild(temperatureElement);
    leftContainer.appendChild(dayTime);
}

async function createWeatherIcon(weatherStatus) {
    const module = await import(`../weather_icons/${weatherStatus}.png`);
    const img = document.createElement("img");
    img.id = "leftWeatherIcon";
    img.src = module.default;
    return img;
}

function createTemperatureElement(temp) {
    const p = document.createElement("p");
    p.id = "leftTemperature";
    p.textContent = `${convertToCelcius(+temp)}°C`;
    return p;
}

function createDayTime(dateString) {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[dayIndex];

    const dayTimeContainer = document.createElement("div");
    dayTimeContainer.id = "dayTimeContainer";

    const dayElement = document.createElement("p");
    dayElement.id = "dayElement";

    dayElement.textContent = `${dayName},`;
    dayTimeContainer.appendChild(dayElement);

    const today = new Date();
    //pads single digit hours/minutes with a leading zero
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const time= `${hours}:${minutes}`;
    const timeElement = document.createElement("p");
    timeElement.id = "timeElement";
    timeElement.textContent = time;
    dayTimeContainer.appendChild(timeElement);

    return dayTimeContainer;
}


