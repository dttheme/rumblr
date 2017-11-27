


//pull data from WebGL JS API (http://www.webglearth.org/api)
function initialize() {
        var options = {
        	atmosphere: true, 
        	center: [0, 0], 
        	zoom: 3,
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

      //create markers with USGS coords

      //pan to coords

//pull data from USGS; coordinates, name, time/date, magnitude

	//create div with coords, name, t/d, mag written inside
	const USGS_EARTHQUAKE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
function pullMostRecentEarthquakeData() {
	var date = Date();
	console.log(date);
}



//pull tweets from Twitter using coordinates and #earthquake

	//Twitter API Key: 	S1heh865MzpqXkBaCF6lrbo7p





//stretch: show Places using coordinates