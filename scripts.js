
//Global Variables--------------------------------
var options = {
	atmosphere: true, 
	sky: true,
	zoom: 2.53,
	zooming:false
};
var earth = new WE.map('earth_div', options);
let markers = [];
let marker;
let currentIndex = null;
let stop = false;
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
	newsDataFromAPI();
	$('.left-section').prop('hidden', false);
	$('.right-section').prop('hidden', false);
});

//when new search button is clicked, show slider input
$('.searchAgainButton').on('click', function() {
	clearResults();
	newSearch();
	// removeMarker();
	//when the new search button is clicked, remove the new search button and clear the markers from earth
	//display scaling inputs where data was previously shown
	//take current value of input and display it on screen
	//when the submit button is clicked, take input value and pass them to API functions
})

function newSearch() {
	$('.left-section').addClass('hidden');
	$('.right-section').addClass('hidden');
	$('.landing-page').removeClass('hidden');
}
//clear all dynamically generated data
function clearResults() {
	$('.totalEarthquakes').empty();
	$('.earthquakeData').empty();
	$('.right-top').empty();
}

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
		if(stop) {
			return
		}
		requestAnimationFrame(animate);
	});
}

$('#earth_div').click(function() {
	stop = true;
	setTimeout(function() {
		stop = false;
		 animation(0.1);
	}, 2);
});

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
	minMag = $('#magnitudeRange').val();
	const query = {
		starttime: submitDateToAPI(),
		minmagnitude: minMag
	};
	$.getJSON(USGS_EARTHQUAKE_URL, query, function(data){
		let earthquakeJSON = JSON.stringify(data, null, 2);
						//Pretty print JSON					
						// console.log(earthquakeJSON);
						for (i=0; i < data.features.length; i++) {
							let feature = (data.features[i]);
							let currentFeature = feature;
							renderMarker(feature);	
							renderEarthquake(feature, i);
							let coords = feature.geometry.coordinates;
							coordArray.push(coords);
						}

						renderTotalEarthquakes(data);
					});
}

//renders markers on map using coordinates
function renderMarker(feature) {
	epochDate = feature.properties.time;
	humanDate = new Date(epochDate);
	var marker = WE.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 'pin.png', 32, 32).addTo(earth);
	markers.push(marker);
	marker.bindPopup(`
		<div class='popupDiv'>
		<p>
		<b>Location:</b> ${feature.properties.place} <br>
		<b>Date:</b> ${humanDate} <br>
		<b>Magnitude:</b> ${feature.properties.mag} <br>
		<b>Depth:</b> ${feature.geometry.coordinates[2]} miles<br>
		<b>Coordinates:</b> ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}<br>
		<a href =${feature.properties.url} target='_blank'>Visit the USGS Page</a>
		</p>
		</div>`)
}

function setView(lat, long) {
	earth.setView([lat, long])
}

//give a count of the total earthquakes on the sidebar
function renderTotalEarthquakes(data) {
	let dayNumber = $('#myRange').val()
	$('.totalEarthquakes').append(
		`<p style='font-size:15px; font-weight: 900;'>There have been ${data.metadata.count} earthquakes in the last ${dayNumber} day(s) that match your search.</p>`
		)
}

$('.earthquakeData').on('click', '.travelButton', function(event) {
	//this is the coordinates from the marker
	let coordIDString = $(this).data('coordinate-id');
	let coordIDCutString = coordIDString.slice(2);
	let coordArrayIndex = parseInt(coordIDCutString);
	let currentCoords = coordArray[coordArrayIndex];
	console.log('targetCenter is ' + (currentCoords[1]).toFixed(2), (currentCoords[0]).toFixed(2));

	//when go button is clicked, setView to coordinates
	setView(currentCoords[1], currentCoords[0]);

	//turn into its own function, call where needed
	if (currentIndex !== null) {
		markers[currentIndex].closePopup();
	} 
	markers[coordArrayIndex].openPopup();
	currentIndex = coordArrayIndex;
	
});

// $('we-pp-wrapper')

//creates a side bar featuring details
function renderEarthquake(feature, i) {
	let buttonIdentifier = 'tb' + i;
	earthquakeDataHTML = 
	`<div class='dataDiv'>
	<span class='locationSpan'>${feature.properties.title}</span>&nbsp&nbsp<button class='travelButton' data-coordinate-id=${buttonIdentifier} title='Travel to earthquake location'><i class="fa fa-bullseye"></i></button>
	</div>
	`;
	if (feature != undefined) {
		$('.earthquakeData').append(earthquakeDataHTML)
	}
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

//News API -----------------------------------

//grab JSON from NewsAPI
const NEWS_URL = 'https://newsapi.org/v2/everything?q=earthquake'
function newsDataFromAPI() {
	const query = {
		from: submitDateToAPI(),
		language: 'en',
		sources: 'associated-press, bbc-news, cbc-news, cnn, the-new-york-times, msnbc, nbc-news, news-com-au, newsweek, usa-today, the-washington-post, national-geographic',
		sortBy: 'relevency',
		apiKey: '84025f0f2bdb42febe0bacbdc6c3391b'
	}
	$.getJSON(NEWS_URL, query, function(data) {
		let newsJSON = JSON.stringify(data, null, 2);
		//pretty print JSON
		// console.log(newsJSON);
		for (i=0; i < data.articles.length; i++) {
					let article = (data.articles[i]);
					renderNews(article);
						}
	
	});
}

function renderNews(article) {
	newsDivData = `
	<div class='newsDiv'>
	<a href=${article.url} target='_blank'><p style='font-size:15px; font-weight:700;'>${article.title}</p></a>
	<p>${article.description}</p>
	</div>
	`
	$('.right-top').append(newsDivData);
}
//--------------------------------------------


displayMinimumMagnitude();
displayNumberOfDays();

//pull data from USGS; coordinates, name, time/date, magnitude

//pull tweets from Twitter using coordinates and #earthquake

	//Twitter API Key: 	S1heh865MzpqXkBaCF6lrbo7p

	
