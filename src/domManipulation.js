import {
    getWeatherByLocation,
    makeWeatherObject,
    convertToCelcius,
    convertToFahrenheit
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


//handles the switch between week's weather highlights, or the current day's weather
choices.addEventListener("click", (e) => {
    //to prevent the event from firing when clicking on the container itself
    if (e.target === choices) return;

    const previousSelected = document.querySelector(".choiceClicked");
    if (previousSelected) {
        previousSelected.classList.remove("choiceClicked");
    }
    e.target.classList.add("choiceClicked");
    
    if (weather === undefined) {
        //no API call has been made
        return;
    }
    else {
        clearWeekWeather();
        if (e.target.id === "today") {
            //shows only today's weather card
            createWeatherCard(weather[0], 0).then((dayWeatherDiv) =>{
                daysContainer.appendChild(dayWeatherDiv);
            });
        } else if (e.target.id === "week") {
            createWeatherCards();
        }
    }

});
//create cards for the week's weather summary
function createWeatherCards(){
    for(let i=0; i<weather.length; i++){
        createWeatherCard(weather[i],i).then((dayWeatherDiv)=>{
            daysContainer.appendChild(dayWeatherDiv);
        });
    }

}
//create cards for the week's weather summary
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
                dayWeatherDiv.appendChild(dayNameP);
                dayWeatherDiv.appendChild(img);
                

                const tempP = document.createElement("p");
                tempP.classList.add("cardTemperature");
                tempP.textContent = `${convertToCelcius(+dayWeather.temp)}°C`;
                dayWeatherDiv.appendChild(tempP);

                return dayWeatherDiv; 
}
//handles changes of unit of measure
unitChoices.addEventListener("click", (e) => {
    //to prevent the event from firing when clicking on the container itself
    if (e.target === unitChoices) return;
    const previousSelected = document.querySelector(".temperatureUnitClicked");
    if (previousSelected) {
        previousSelected.classList.remove("temperatureUnitClicked");
        changeTempUnit(e.target.id, previousSelected.id);
    }
    else{
        changeTempUnit(e.target.id, null);
    }
    e.target.classList.add("temperatureUnitClicked");

});

//fires when the target location gets confirmed 
confirmBtn.addEventListener("click", () => {
    let weatherData = getWeatherByLocation(location.value);
    weatherData.then(function (res) { 
        weather = res;
        console.log(weather);
        clearLeftBar();
        clearWeekWeather()
        constructLeftBar(weather);
        createTodayHighlights(weather[0]);
        
    })    
});
//clears the left container, except for the search bar.
function clearLeftBar() {
    leftContainer.innerHTML = "";
    leftContainer.appendChild(searchContainer);
}
//clears the container of week's weather highlights
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

//dynamic import of icons, on need, so they dont have to be imported during the loading of the page
async function createWeatherIcon(weatherStatus) {
    const module = await import(`../weather_icons/${weatherStatus}.png`);
    const img = document.createElement("img");
    img.id = "leftWeatherIcon";
    img.src = module.default;
    return img;
}
//creates the temperature indicator on the left side bar
function createTemperatureElement(temp) {
    const p = document.createElement("p");
    p.id = "leftTemperature";

    const previousSelected = document.querySelector(".temperatureUnitClicked");
    if(previousSelected && previousSelected.id == "fahrenheit") {
        p.textContent = `${Math.round(+temp)}°F`;    
    }
    else {
        //default temp unit
        p.textContent = `${convertToCelcius(+temp)}°C`;
    }
    
    return p;
}
//creates day and time indicator on the left side bar
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
//handles conversion between celsius and fahrenheit, and viceversa, of the temperatures in the affected DOM objects
function changeTempUnit (newUnit, oldUnit) {
    
    const leftTemp = document.getElementById("leftTemperature");
    const numClicks = document.querySelectorAll(".temperatureUnitClicked").length;
    let temp;
    //if there is no temperature in the leftSide, no API call has been done, so there is no data
    if (leftTemp) {
        //gets only the temperature value without the unit of measure
        temp = `${leftTemp.textContent.slice(0, leftTemp.textContent.length - 2)}`;
        console.log(temp);
    }
    else {
        return;
    }

    const dayCardsTemps = document.querySelectorAll(".dayCard > .cardTemperature");
   
    // new temp in left section
    let newTemp;
    //no change of unit of measure 
    if(newUnit == oldUnit && numClicks == 0){
        return;
    }
    else if (newUnit == "celsius"){
        newTemp = `${convertToCelcius(+temp)}°C`;
        //update temp in the week container
         if (dayCardsTemps) {
            dayCardsTemps.forEach((dayCardTemp) => {
                //gets only the temperature value without the unit of measure
                let oldTemp = dayCardTemp.textContent.slice(0, dayCardTemp.textContent.length - 2);
                dayCardTemp.textContent = `${convertToCelcius(+oldTemp)}°C`;
            });
        };

    }
    else{
        newTemp = `${convertToFahrenheit(+temp)}°F`;
        //update temp in the week container
          if (dayCardsTemps) {
            dayCardsTemps.forEach((dayCardTemp) => {
            //gets only the temperature value without the unit of measure
            let oldTemp = dayCardTemp.textContent.slice(0, dayCardTemp.textContent.length - 2);
            dayCardTemp.textContent = `${convertToFahrenheit(+oldTemp)}°F`;
            });
        };
      
    }
    //update leftTemp
        leftTemp.textContent = newTemp;
}

//creates the cards for today's weather highlights
function createTodayHighlights(todayWeather)
{
    const container = document.querySelector(".todayHighlights");
    const cardsContainer = document.querySelector(".todayCards");

    const todayTitle = document.createElement("h3");
    todayTitle.textContent = "Today's highlights";
    container.insertBefore(todayTitle, container.children[0]);
    

    //create card for UV index
    const uvIndex = document.createElement("div");
    const uvTitle = document.createElement("h5");
    uvTitle.textContent = "UV index";
    const uvValue = document.createElement("p");
    uvValue.textContent = `${todayWeather.uvindex}`;
    uvIndex.appendChild(uvTitle);
    uvIndex.appendChild(uvValue);
    cardsContainer.appendChild(uvIndex);
    
}



