
 $('.js-submit-button').click(function(event) {	
	function createDateForUrl(date) {
		let dateInISO = (date.toISOString());
		let dateForURL = dateInISO.slice(0,10);
		return dateForURL;
			}


	function submitDateToApi() {
		let today = new Date();
		let numberOfDaysSelected = $('#myRange').val();
		let dateInPast = (findDateInPast(today, numberOfDaysSelected));
		// let endTimeUrlString = createDateForUrl(today);
		// console.log('endTimeUrlString: ' + endTimeUrlString);
		let startTimeUrlString = createDateForUrl(dateInPast);
		console.log('startTimeUrlString: ' + startTimeUrlString);
		return	startTimeUrlString;
	}

	//when the user submits, the landing page will disappear and the earth will be rendered
	function revealEarth() {
			$('.landing-page').addClass('hidden');
			$('.left-section').removeClass('hidden');
			$('.right-section').removeClass('hidden');
			initialize();
	}


	//pull data from WebGL JS API (http://www.webglearth.org/api)
	function initialize() {
		var options = {
			atmosphere: true, 
			sky: true,
			center: [0, 0], 
			zoom: 2,
			zooming: false

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
	        WE.tileLayer('https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
	        	minZoom: 0,
	        	maxZoom: 5,
	        	attribution: 'NASA'
	        }).addTo(earth);
	    }

	//take user day input, count backwards to find past day, transform date for url
	function findDateInPast(date, days) {
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() - days
			)
	}
	//create div with coords, name, t/d, mag written inside
	const USGS_EARTHQUAKE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
	function earthquakeDataFromApi() {
		console.log('submitDateToApi output: ' + submitDateToApi());
		const query = {
				starttime: submitDateToApi(),
				minmagnitude: 3,
			};
		$.getJSON(USGS_EARTHQUAKE_URL, query, function(data){
			let JSONdata = JSON.stringify(data, null, 2);
			// console.log(JSONdata);
			for (i=0; i < data.features.length; i++) {
			let coords = (data.features[i].geometry.coordinates);
			console.log(coords);
			return coords;
			}
					
		});
	}
	

//takes in coordinate object and puts them on the map
function renderMarkers() {
	//coordinates from USGS data
	// console.log(${}
    //use .addTo(map), .setView([x,y],z), WE.marker, marker.bindPopup(html)
    //reference API demo: http://examples.webglearth.com/#apidemo
//     for (i=0; i<= numberOfDaysSelected; i++) {
//     	var marker = WE.marker([-41,21]).addTo(earth);
//     	marker.bindPopup('<p>Hey there!</p>')
//     }
}

//when the marker is clicked, or when the user clicks a location in the list, the earth will pan to that marker
function panToMarker() {};

//pull data from USGS; coordinates, name, time/date, magnitude

//pull tweets from Twitter using coordinates and #earthquake

	//Twitter API Key: 	S1heh865MzpqXkBaCF6lrbo7p


earthquakeDataFromApi();
revealEarth();
});
 //end submit button actions


//listens to the user input, updates the DOM
function displayNumberOfDays() {
	$(document).on('input', '#myRange', function() {
		$('#numberOfDays').html( $(this).val() );
	});
}
displayNumberOfDays();