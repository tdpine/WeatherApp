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
const searchContainer = document.getElementById("searchContainer");

const rightContainer = document.querySelector(".rightContainer");
const daysContainer = document.querySelector(".daysContainer");

//choices is the container for today's or week's weather
const choices = document.querySelector(".choices");
//unitChoices is the list for celsius or fahrenheit selection
const unitChoices = document.querySelector(".temperatureUnits");

let weather;



choices.addEventListener("click", (e) => {
    //to prevent the event from firing when clicking on the container itself
    if (e.target === choices) return;

    const previousSelected = document.querySelector(".choiceClicked");
    if (previousSelected) {
        previousSelected.classList.remove("choiceClicked");
    }
    e.target.classList.add("choiceClicked");
    
    if (weather === undefined) {
        return;
    }
    else {
        clearWeekWeather();
        if (e.target.id === "today") {
            //clear right container and show today's weather
            console.log("today's weather");
        } else if (e.target.id === "week") {
            //clear right container and show week's weather
            //rightContainer.innerHTML = "";
            createWeatherCards();
            console.log("week's weather");
        }
    }

});
function createWeatherCards(){
    for(let i=0; i<weather.length; i++){
        createWeatherCard(weather[i],i).then((dayWeatherDiv)=>{
            daysContainer.appendChild(dayWeatherDiv);
        });
    }

}

async function createWeatherCard(dayWeather,i) {
    //create elements for each day's weather and append to rightContainer
                const dayWeatherDiv = document.createElement("div");
                dayWeatherDiv.classList.add("dayCard");

                const date = new Date(dayWeather.datetime);
                const dayIndex = date.getDay();
                const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const dayName = daysOfWeek[dayIndex];

                const dayNameP = document.createElement("p");
                dayNameP.textContent = dayName;
                const module = await import(`../weather_icons/${dayWeather.icon}.png`);
                const img = document.createElement("img");
                img.src = module.default;
                dayWeatherDiv.appendChild(img);
                dayWeatherDiv.appendChild(dayNameP);

                const tempP = document.createElement("p");
                tempP.textContent = `${convertToCelcius(+dayWeather.temp)}°C`;
                dayWeatherDiv.appendChild(tempP);

                return dayWeatherDiv; 
}
unitChoices.addEventListener("click", (e) => {
    //to prevent the event from firing when clicking on the container itself
    if (e.target === unitChoices) return;
    const previousSelected = document.querySelector(".temperatureUnitClicked");
    if (previousSelected) {
        previousSelected.classList.remove("temperatureUnitClicked");
    }
    e.target.classList.add("temperatureUnitClicked");
});




confirmBtn.addEventListener("click", () => {
    let weatherData = getWeatherByLocation(location.value);
    weatherData.then(function (res) { 
        weather = res;
        console.log(weather);
        clearLeftBar();
        clearWeekWeather()
        constructLeftBar(weather);
        
    })    
});
//clears the left container, except for the search bar.
function clearLeftBar() {
    leftContainer.innerHTML = "";
    leftContainer.appendChild(searchContainer);
}
function clearWeekWeather() {
    daysContainer.innerHTML = "";
}
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




