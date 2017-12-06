
$('.js-submit-button').click(function(event) {	

	function createDateForURL(date) {
		let dateInISO = (date.toISOString());
		let dateForURL = dateInISO.slice(0,10);
		return dateForURL;
	}

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
		initialize();
	}

//pull data from WebGL JS API (http://www.webglearth.org/api)
	function initialize() {
		var options = {
			atmosphere: true, 
			sky: true,
			center: [0, 0], 
			zoom: 0,
			zooming: true

		};

//rotate Earth
	        var before = null;
	        requestAnimationFrame(function animate(now) {
	        	var c = earth.getPosition();
	        	var elapsed = before? now - before: 0;
	        	before = now;
	        	earth.setCenter([c[0], c[1] + 0.1*(elapsed/500)]);
	        	requestAnimationFrame(animate);
	        });

//make Earth
	        var earth = new WE.map('earth_div', options);
	        WE.tileLayer('https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
	        	minZoom: 0,
	        	maxZoom: 5,
	        	attribution: 'NASA'
	        }).addTo(earth);

//create div with coords, name, t/d, mag written inside
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
						console.log(JSONdata);
					for (i=0; i < data.features.length; i++) {
						let features = (data.features[i]);
						renderMarkers(features);	
						renderList(features);
					}
					let coords = data.features.geometry.coordinates;
					console.log(coords);
					// onClickPanTo(coords);

					renderTotalEarthquakes(data);
				});
	        }

//renders markers on map using coordinates
			function renderMarkers(features) {
				epochDate = features.properties.time;
				humanDate = new Date(epochDate);
				var marker = WE.marker([features.geometry.coordinates[1], features.geometry.coordinates[0]], 'pin.png', 32, 32).addTo(earth);
				marker.bindPopup(`<p>
					<b>Location:</b> ${features.properties.place} <br>
					<b>Date:</b> ${humanDate} <br>
					<b>Magnitude:</b> ${features.properties.mag} <br>
					<!--Coordinates: ${features.geometry.coordinates[1], features.geometry.coordinates[0]}-->
					</p>`)
			}
			

//creates a side bar featuring details
			  function renderList(features) {
			    	earthquakeDataDiv = 
			    	`<div class='dataDiv'>
			    		<p>
							<b>Location:</b> ${features.properties.place} <br>
							<b>Date:</b> ${humanDate} <br>
							<b>Magnitude:</b> ${features.properties.mag} <br>
						</p>
						<button class='travelButton' onclick='panTo();'>Go!</button>
						</div>
			    		`;
			    	$('.left-section').append(earthquakeDataDiv)
		//make bar slide into the margins
			    }

//button pans map to earthquake coords
				function onClickPanTo(coords) {
					earth.panTo([coords]);
				}

//give a count of the total earthquakes on the sidebar
			    function renderTotalEarthquakes(data) {
			    	$('.totalEarthquakes').html(
			    	`<p style='font-size=40px;'><b>Total Earthquakes: ${data.metadata.count}</b></p>`
			    	)
			    }
			    earthquakeDataFromAPI();

}
//end initialize()

//take user day input, count backwards to find past day, transform date for url
			function findDateInPast(date, days) {
				return new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate() - days
					)
			}
	


	revealEarth();
});
 //end submit button actions

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