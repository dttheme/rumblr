


# Rumblr
## Earthquake tracking and information sharing

![alt text](http://i66.tinypic.com/2ur8myw.png "Rumblr Landing Page")

![alt text](http://i65.tinypic.com/sqkspj.png "Rumblr Main Page")

### Introduction

An application that allows users to input an amount of time and a minimum magnitude. It then returns the number of earthquakes in the specified time and magnitude range, along with all of their details, on the left side of the page. This information is populated on the 3D-rendered globe, with markers at the specific coordinates and popups with additional details. News stories from the time period specified are featured on the right side.


### Case Use

Rumblr is intended to keep its users well-informed of recent seismic activity. While giving this data back to the user is informative, seeing earthquakes rendered on a globe provides a sense of scale not normally gained from listed information. As the user explores the globe, they are also provided with relavent news. In combination, the data, globe and news provided to the user give a -- experience that cannot be gathered from any one individual piece of the application.

### Technical

+ This application was built using a combination of HTML, CSS, JavaScript, JQuery
+ The earthquake data for the application was provided by the USGS Earthquake API, the globe was rendered using WebGL Earth API, and the news is returned from the News API.
+ Rumblr is fully-responsive, adapting for mobile, tablet and desktop viewports.

### Future Development
+ Twitter feed display to display recent tweets regarding specific earthquake, on earthquake click
