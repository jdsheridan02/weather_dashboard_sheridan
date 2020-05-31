// global variables
var previousSearch = JSON.parse(localStorage.getItem("cities")) || [];

renderButtons();

// function to determine current weather forecast
function weatherToday () {

    //clears fields for results
    $("#cityName").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#uvIndex").empty();


    // user input for city weather forecast
    var citySearch = $("#citySearch")
    .val()
    .trim();
    console.log(citySearch);

    // URL that will be used to communicate with the API and get the response with weather forecasts
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=730b2e8381524e94f9bee842f29a7974";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          console.log(response);
          
        // creating variable to store and display desired information on the html page
          var cityName = response.name;
          console.log(cityName);

          var currentDate = response.dt;
          var dateInfo = moment.unix(currentDate).format("L");
          console.log(dateInfo);
          
        //in order to pull an icon image for the city, will need to reference another application within openweather API
          var iconUrl = "https://openweathermap.org/img/wn/";
          var iconPng = "@2x.png";
          var iconWeather = response.weather[0].icon;
          var icon = iconUrl + iconWeather + iconPng;
          var weatherImg = $("<img>");
          weatherImg.attr("src", icon);

        //temperature needs to be converted from Kelvin to Farenheit
          var ktemp = response.main.temp;
          var ftemp = ((ktemp - 273.15) * 1.8 + 32).toFixed(0);
          console.log(ftemp);

          var humidity = response.main.humidity;
          console.log(humidity);

        //default measurement is metric, need to convert to imperial
          var metricWind = response.wind.speed;
          var imperialWind = (metricWind * 2.2369).toFixed(2);
          console.log(imperialWind);

        //variables will be used to calculate UV Index in another function
          var longitude = response.coord.lon;
          var latitude = response.coord.lat;
        
        //dynamically placing variable results to HTML file
          $("#cityName").append(cityName + " ");
          $("#cityName").append(dateInfo + " ");
          $("#cityName").append(weatherImg);
          $("#temperature").append("Temperature: " + ftemp + "°F");
          $("#humidity").append("Humidity: " + humidity);
          $("#windSpeed").append("Wind Speed: " + imperialWind)

        // new function to calculate UVIndex
          uvIndex(longitude, latitude);
    });
};

function uvIndex(longitude, latitude) {
	// calling on UV Index API to calculate UV index
	var indexURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=730b2e8381524e94f9bee842f29a7974&lat=" + latitude + "&lon=" + longitude;
	console.log(indexURL);

	$.ajax({
		url: indexURL,
		method: "GET"
	}).then(function(response) {
		var uvFinal = response.value;


		$("#uvIndex").append("UV Index: ");
		var uvBtn = $("<button>").text(uvFinal);
		$("#uvIndex").append(uvBtn);

		if (uvFinal < 3) {
			uvBtn.attr("style", "background-color: green;");
		} else if (uvFinal < 6) {
			uvBtn.attr("style", "background-color: yellow;");
		} else if (uvFinal < 8) {
			uvBtn.attr("style", "background-color: orange;");
		} else if (uvFinal < 11) {
			uvBtn.attr("style", "background-color: red;");
		} else {
		    uvBtn.attr("style", "background-color: purple");
		}
    });
};    

// 5 day forecast API
function futureFore(){

    //ensures cards are empty before information is pulled from API
	$(".card-text").empty();
	$(".card-title").empty();

    //needed to call on the variable again, as the function is unable to locate it inside previous function or as a global variable
    var citySearch = $("#citySearch")
    .val()
    .trim();
    
    // new API URL to be called upon to retrieve 5 day forecast info 
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=730b2e8381524e94f9bee842f29a7974"
    console.log(forecastURL)

    $.ajax({
		url: forecastURL,
		method: "GET"
	}).then(function(response) {
        console.log("FIVE DAY FORECAST");
        console.log(response);
        // grouping all necessary variables for the cards together: temp, humidity, dates, and icons

        var kelvinOne = response.list[2].main.temp;
        var farenOne = ((kelvinOne-273.15)*1.8+32).toFixed(0);
        console.log(farenOne);
        var kelvinTwo = response.list[10].main.temp;
        var farenTwo = ((kelvinTwo-273.15)*1.8+32).toFixed(0);
        console.log(farenTwo);
        var kelvinThree = response.list[18].main.temp;
        var farenThree = ((kelvinThree-273.15)*1.8+32).toFixed(0);
        console.log(farenThree);
        var kelvinFour = response.list[26].main.temp;
        var farenFour = ((kelvinFour-273.15)*1.8+32).toFixed(0);
        console.log(farenFour);
        var kelvinFive = response.list[34].main.temp;
        var farenFive = ((kelvinFive-273.15)*1.8+32).toFixed(0);
        console.log(farenFive);

        var humidOne = response.list[2].main.humidity;
        var humidTwo = response.list[10].main.humidity;
        var humidThree = response.list[18].main.humidity;
        var humidFour = response.list[26].main.humidity;
        var humidFive = response.list[34].main.humidity;

        var dayOne = moment
			.unix(response.list[2].dt)
			.utc()
            .format("L");
        var dayTwo= moment
			.unix(response.list[10].dt)
			.utc()
            .format("L");
        var dayThree = moment
			.unix(response.list[18].dt)
			.utc()
            .format("L");
        var dayFour = moment
			.unix(response.list[26].dt)
			.utc()
            .format("L");
        var dayFive = moment
			.unix(response.list[34].dt)
			.utc()
            .format("L");
        
        var iconOne = $("<img>");
        var iconOneSrc = "https://openweathermap.org/img/wn/" +
        response.list[2].weather[0].icon +
        "@2x.png";
        iconOne.attr("src", iconOneSrc);
        var iconTwo = $("<img>");
        var iconTwoSrc = "https://openweathermap.org/img/wn/" +
        response.list[10].weather[0].icon +
        "@2x.png";
        iconTwo.attr("src", iconTwoSrc);
        var iconThree = $("<img>");
        var iconThreeSrc = "https://openweathermap.org/img/wn/" +
        response.list[18].weather[0].icon +
        "@2x.png";
        iconThree.attr("src", iconThreeSrc);
        var iconFour = $("<img>");
        var iconFourSrc = "https://openweathermap.org/img/wn/" +
        response.list[26].weather[0].icon +
        "@2x.png";
        iconFour.attr("src", iconFourSrc);
        var iconFive = $("<img>");
        var iconFiveSrc = "https://openweathermap.org/img/wn/" +
        response.list[34].weather[0].icon +
        "@2x.png";
        iconFive.attr("src", iconFiveSrc);

        //dynamically adding dates and icons to HTML file
        $(".dayOne").append(dayOne);
        $(".dayTwo").append(dayTwo);
        $(".dayThree").append(dayThree);
        $(".dayFour").append(dayFour);
        $(".dayFive").append(dayFive);
        
        $(".iconOne").append(iconOne);
        $(".iconTwo").append(iconTwo);
        $(".iconThree").append(iconThree);
        $(".iconFour").append(iconFour);
        $(".iconFive").append(iconFive);

        $(".tempOne").append("Temp: " + farenOne);
        $(".tempTwo").append("Temp: " + farenTwo);
        $(".tempThree").append("Temp: " + farenThree);
        $(".tempFour").append("Temp: " + farenFour);
        $(".tempFive").append("Temp: " + farenFive);

        $(".humidityOne").append("Humidity: " + humidOne);
        $(".humidityTwo").append("Humidity: " + humidTwo);
        $(".humidityThree").append("Humidity: " + humidThree);
        $(".humidityFour").append("Humidity: " + humidFour);
        $(".humidityFive").append("Humidity: " + humidFive);
    });
}

// function to store previously searched cities in local storage and create buttons to refer back to info
function renderButtons() {
	// Deleting the buttons prior to adding new movies
	$(".oldSearch").empty();

	//creating a loop to add each city to previous cities column
	for (var i = 0; i < previousSearch.length; i++) {
		//creating an element for previous searches
		var a = $("<li>");
		// Adding a class
        a.addClass("prevName");
        a.addClass("list_group");
		
		// Adding a data-attribute
		a.attr("data-name", previousSearch[i]);
		// Providing the initial button text
		a.text(previousSearch[i]);
		// Adding the button to the buttons-view div
		$(".oldSearch").append(a);
	}

	$(".prevName").on("click", function(event) {
		event.preventDefault();

		var city = $(this).data("name");
		console.log("prev searched city" + city);

		
		futureFore();
		weatherToday();
	});
}
$("#forecast").on("click", function(event){
    event.preventDefault();

    var citySearch = $("#citySearch")
    .val()
    .trim();

    //push new city into the Array
	var containsCity = false;

	if (previousSearch != null) {
		$(previousSearch).each(function(x) {
			if (previousSearch[x] === citySearch) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
		previousSearch.push(citySearch);
	}

	// add to local storage
	localStorage.setItem("cities", JSON.stringify(previousSearch));
    
    weatherToday();
    futureFore();
    renderButtons();
});
