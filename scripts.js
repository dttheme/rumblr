


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
      //use .addTo(map), .setView([x,y],z), WE.marker, marker.bindPopup(html)

      // function addSomeMarkers() {
      //   document.getElementById('addmarkers').disabled = true;

      //   map.setView([51.505, 0], 5);
      //   var marker = WE.marker([51.5, -0.09]).addTo(map);
      //   marker.bindPopup("<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>", {maxWidth: 150, closeButton: true}).openPopup();

      //   var marker2 = WE.marker([30.058056, 31.228889]).addTo(map);
      //   marker2.bindPopup("<b>Cairo</b><br>Yay, you found me!<br />Here, enjoy another polygon..", {maxWidth: 120, closeButton: false});

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