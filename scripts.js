
let numberOfDaysSelected;

//when the user submits, the landing page will disappear and the earth will be rendered
function takeUserInputRevealEarth() {
	$('.js-submit-button').click(function(event) {
		$('.landing-page').addClass('hidden');
		$('.left-section').removeClass('hidden');
		$('.right-section').removeClass('hidden');
		numberOfDaysSelected = $('#myRange').val();
		console.log(numberOfDaysSelected);
		initialize();
	})
}
takeUserInputRevealEarth();

//pull data from WebGL JS API (http://www.webglearth.org/api)
function initialize() {
	var options = {
		atmosphere: true, 
		sky: true,
		center: [0, 0], 
		zoom: 0,
	};
        //rotate Earth
        var before = null;
        requestAnimationFrame(function animate(now) {
        	var c = earth.getPosition();
        	var elapsed = before? now - before: 0;
        	before = now;
        	earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
        	requestAnimationFrame(animate);
        });
        //make Earth
        var earth = new WE.map('earth_div', options);
        WE.tileLayer('http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
        	minZoom: 0,
        	maxZoom: 5,
        	attribution: 'NASA'
        }).addTo(earth);
    }

//takes in coordinate object and puts them on the map
function populateMarkers() {
	//coordinates from USGS data
    //use .addTo(map), .setView([x,y],z), WE.marker, marker.bindPopup(html)
    //reference API demo: http://examples.webglearth.com/#apidemo
}

//when the marker is clicked, or when the user clicks a location in the list, the earth will pan to that marker
function panToMarker() {};

//listens to the user input, updates the DOM
function displayNumberOfDays() {
	$(document).on('input', '#myRange', function() {
    $('#numberOfDays').html( $(this).val() );
});
}
displayNumberOfDays();

//pull data from USGS; coordinates, name, time/date, magnitude


let date = new Date();
let days = numberOfDaysSelected;

function findDateInPast(date, days) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate() - days,
		date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
		);
}
console.log(findDateInPast(date, days));



//create div with coords, name, t/d, mag written inside
const USGS_EARTHQUAKE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?';
let todaysDateString = date
function earthquakeDataFromApi() {
		const query = {
			format: 'geojson',
			// starttime: ,
			minmagnitude: 1,
		}
		$('.js-submit-button').click(function(event) {
			$.getJSON(USGS_EARTHQUAKE_URL, query, function(data){
			console.log(data);
		})
	})
}
earthquakeDataFromApi();



//pull tweets from Twitter using coordinates and #earthquake

	//Twitter API Key: 	S1heh865MzpqXkBaCF6lrbo7p
