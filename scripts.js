
//Global Variables--------------------------------
var options = {
	atmosphere: true, 
	sky: true,
	zoom: 0,
	zooming: true
};
var earth = new WE.map('earth_div', options);
markers =[];
let centered = false;
let coordArray = [];
//------------------------------------------------
//when the document is ready, create the globe
$(document).ready(function() {
	initialize();
})

//when the submit button is clicked, remove the prompt and send the input to the API
$('.js-submit-button').click(function(event) {	
	revealEarth();
	earthquakeDataFromAPI();
});

//counts backwards to find past day
function findDateInPast(date, days) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate() - days
		)
}

//takes past date and makes an ISO string from it for the URL
function createDateForURL(date) {
	let dateInISO = (date.toISOString());
	let dateForURL = dateInISO.slice(0,10);
	return dateForURL;
}

//collects the user input and creates the URL String
function submitDateToAPI() {
	let today = new Date();
	let numberOfDaysSelected = $('#myRange').val();
	let dateInPast = (findDateInPast(today, numberOfDaysSelected));
	let startTimeURLString = createDateForURL(dateInPast);
	console.log('startTimeURLString: ' + startTimeURLString);
	return	startTimeURLString;
}

//when the user submits, the landing page will disappear and the earth will be rendered
function revealEarth() {
	$('.landing-page').addClass('hidden');
	$('.left-section').removeClass('hidden');
	$('.right-section').removeClass('hidden');

}

//animates Earth
function animateEarth(vel) {
	var before = null;
	requestAnimationFrame(function animate(now) {
		var c = earth.getPosition();
		var elapsed = before? now - before: 0;
		before = now;
		earth.setCenter([c[0], c[1] + vel *(elapsed/500)]);
		requestAnimationFrame(animate);
	});
}

//tiles the globe
function initialize() {
	WE.tileLayer('https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
		minZoom: 0,
		maxZoom: 5,
		attribution: 'NASA'
	}).addTo(earth);
	animateEarth(0.1);
}

//pulls data from the USGS API using input parameters
const USGS_EARTHQUAKE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
function earthquakeDataFromAPI() {
	console.log('submitDateToApi output: ' + submitDateToAPI());
	console.log($('#magnitudeRange').val());
	minMag = $('#magnitudeRange').val();
	const query = {
		starttime: submitDateToAPI(),
		minmagnitude: minMag
	};
	$.getJSON(USGS_EARTHQUAKE_URL, query, function(data){
		let JSONdata = JSON.stringify(data, null, 2);
						//Pretty print JSON					
						// console.log(JSONdata);
						for (i=0; i < data.features.length; i++) {
							let feature = (data.features[i]);
							renderMarkers(feature);	
							renderEarthquake(feature, i);
							let coords = feature.geometry.coordinates;
							coordArray.push(coords);
						}

						renderTotalEarthquakes(data);
					});
}

//renders markers on map using coordinates
function renderMarkers(feature) {
	epochDate = feature.properties.time;
	humanDate = new Date(epochDate);
	var marker = WE.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 'pin.png', 32, 32).addTo(earth);
	markers.push(marker);
	marker.bindPopup(`<p>
		<b>Location:</b> ${feature.properties.place} <br>
		<b>Date:</b> ${humanDate} <br>
		<b>Magnitude:</b> ${feature.properties.mag} <br>
		<!--Coordinates: ${feature.geometry.coordinates[1], feature.geometry.coordinates[0]}-->
		</p>`)
	// if (centered = true) {
	// 	marker.openPopup();
	// }
}

function findCurrentCenterOpenPopup() {
	center = earth.getCenter();
	centerLat = (center[0]).toFixed(2);
	centerLong = (center[1]).toFixed(2);
	console.log(centerLat, centerLong)
	
}
findCurrentCenterOpenPopup();


// //button pans map to earthquake coords
// function parseCoordArray(coords) {
	
// 	console.log((currentCoords[1]).toFixed(2));
// 	console.log((currentCoords[0]).toFixed(2));
	
// }

function setView(lat, long) {
	earth.setView([lat, long])
}

//give a count of the total earthquakes on the sidebar
function renderTotalEarthquakes(data) {
	$('.totalEarthquakes').html(
		`<p style='font-size=40px;'><b>Total Earthquakes: ${data.metadata.count}</b></p>`
		)
}

$('.earthquakeData').on('click', '.travelButton', function(event) {
	let coordIDString = $(this).data('coordinate-id');
	let coordIDCutString = coordIDString.slice(2);
	let coordArrayIndex = parseInt(coordIDCutString);
	let currentCoords = coordArray[coordArrayIndex];
	let targetCenter = ((currentCoords[1]).toFixed(2), (currentCoords[0]).toFixed(2));
	console.log('targetCenter is ' + (currentCoords[1]).toFixed(2), (currentCoords[0]).toFixed(2))
	//when go button is clicked, setView to coordinates
	setView(currentCoords[1], currentCoords[0]);

	let center = earth.getCenter();
	let centerLat = (center[0]).toFixed(2);
	let centerLong = (center[1]).toFixed(2);
	setViewCenter = (centerLat, centerLong);
	console.log((centerLat));

	//if the setView matches the marker coordinates, tell renderMarkers
	if ((centerLat == (currentCoords[1]).toFixed(2)) && centerLong == (currentCoords[0]).toFixed(2)) {
		let centered = true;
	}
});


//creates a side bar featuring details
function renderEarthquake(feature, i) {
	let buttonIdentifier = 'tb' + i;
	earthquakeDataDiv = 
	`<div class='dataDiv'>
	<p>
	<b>Location:</b> ${feature.properties.place} <br>
	<b>Date:</b> ${humanDate} <br>
	<b>Magnitude:</b> ${feature.properties.mag} <br>
	</p>
	<button class='travelButton' data-coordinate-id=${buttonIdentifier}>Go!</button>
	</div>
	`;
	$('.earthquakeData').append(earthquakeDataDiv)
	//make bar slide into the margins
}

//listens to the user input, updates the DOM
function displayNumberOfDays() {
	$(document).on('input', '#myRange', function() {
		$('#numberOfDays').html( $(this).val() );
	});
}
function displayMinimumMagnitude() {
	$(document).on('input', '#magnitudeRange', function() {
		$('#minimumMagnitude').html( $(this).val() );
	});
}

displayMinimumMagnitude();
displayNumberOfDays();

//pull data from USGS; coordinates, name, time/date, magnitude

//pull tweets from Twitter using coordinates and #earthquake

	//Twitter API Key: 	S1heh865MzpqXkBaCF6lrbo7p