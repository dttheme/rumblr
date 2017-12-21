
//Global Variables--------------------------------
var options = {
	atmosphere: true, 
	sky: true,
	zoom: 2,
	zooming:false
};
var earth = new WE.map('earth_div', options);
let markers = [];
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
	event.preventDefault();
	$('.searchAgainDiv').removeClass('hidden');
	revealEarth();
	earthquakeDataFromAPI();
	newsDataFromAPI();
	$('.left-section').prop('hidden', false);
	$('.right-section').prop('hidden', false);
});

// //when new search button is clicked, show slider input
// $('.searchAgainButton').on('click', function() {

// 	// clearResults();
// 	// newSearchForm();
// 	// markers = [];
// 	// $('#myRange').val(0);
// 	// earthquakeDataFromAPI();
// 	//when the new search button is clicked, remove the new search button and clear the markers from earth
// })

//when the new search form is submitted, display new results
$('.submitNewSearch').on('click', function(event) {
	earthquakeDataFromAPI();
	newsDataFromAPI();
	$('.earthquakeData').empty();
	$('.searchAgainDiv').removeClass('hidden');
})

//append a new search form to the left element
function newSearchForm() {
	$('.earthquakeData').append($('#dateAndMagForm'));
	$('#dateAndMagForm').css({'padding':'20px', 'font-size': '17px', 'font-weight': '900'})
	$('.js-submit-button').addClass('hidden');
	$('.submitNewSearch').removeClass('hidden');
}

//clear all dynamically generated data
function clearResults() {
	$('.totalEarthquakes').empty();
	$('.earthquakeData').empty();
	$('.right-top').empty();
	$('.searchAgainDiv').addClass('hidden');
}

//counts backwards to find past day
function findDateInPast(date, days) {
	console.log(date);
	console.log(days);
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
	console.log(startTimeURLString);
	return	startTimeURLString;
}

//when the user submits, the landing page will disappear and the sidebars will be rendered
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
	today = new Date();
	let todayDate = createDateForURL(today);
	const query = {
		starttime: submitDateToAPI(),
		endtime: todayDate,
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
	$('.totalEarthquakes').html(
		`<p style='font-weight: 900;'>There have been ${data.metadata.count} earthquakes in the last ${dayNumber} day(s) that match your search.</p>`
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
	<span class='locationSpan'>${feature.properties.title}</span>&nbsp&nbsp<button class='travelButton' data-coordinate-id=${buttonIdentifier} title='Travel to earthquake location'><i class="fa fa-bullseye bullseye"></i></button>
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
	<a href=${article.url} target='_blank'><p style='font-weight:700;'>${article.title}</p></a>
	<p>${article.description}</p>
	</div>
	`
	$('.right-top').append(newsDivData);
}
//--------------------------------------------


displayMinimumMagnitude();
displayNumberOfDays();

//JS to do 
//remove markers when new search
//provide new inputs
//when user submits, return api data
//
//

	
